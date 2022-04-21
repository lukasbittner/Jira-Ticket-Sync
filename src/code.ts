
const DOCUMENT_NODE = figma.currentPage.parent

// Set the relaunch button for the whole document
DOCUMENT_NODE.setRelaunchData({ update_page: '', update_all: '' })

const WINDOW_WIDTH = 250
const WINDOW_HEIGHT_BIG = 650
const WINDOW_HEIGHT_SMALL = 308

const COMPANY_NAME_KEY: string = "COMPANY_NAME"
const PROJECT_ID_KEY: string = "PROJECT_ID"
const USERNAME_KEY: string = "USERNAME"
const PASSWORD_KEY: string = "PASSWORD"
const ISSUE_ID_KEY: string = "ISSUE_ID"
const CREATE_LINK_KEY: string = "CREATE_LINK"
const LIBRARY_COMPONENT_KEY: string = "LIBRARY_COMPONENT"


var company_name: string // Saved publicly with setPluginData
var project_id: string // Saved publicly with setPluginData
var username: string
var password: string
var issueId: string
var createLink

const FONT_REG = { family: "Work Sans", style: "Regular" }
const FONT_MED = { family: "Work Sans", style: "Medium" }
const FONT_BOLD = { family: "Work Sans", style: "Bold" }

function getStatus(data) { return data.fields.status.name }
function getTitle(data) { return data.fields.summary }
function getIssueId(data) { return data.key }
function getChangeDate(data) { return data.fields.statuscategorychangedate }
function getAssignee(data) { return data.fields.assignee.displayName }
function getDescription(data) { return data.fields.description }


var nextTicketOffset = 0

// ticketdata.fields.assignee.avatarUrls
// ticketdata.fields.status.name
// ticketdata.fields.status.statusCategory.name

const ISSUE_ID_NAME = "Ticket ID"
const ISSUE_TITLE_NAME = "Ticket Title"
const ISSUE_CHANGE_DATE_NAME = "Date of Status Change"
const ASSIGNEE_NAME = "Assignee"
const DESCRIPTION_NAME = "Description"

const COMPONENT_SET_NAME = "Jira Ticket Header"
const COMPONENT_SET_PROPERTY_NAME = "Status="
const VARIANT_NAME_1 = "To Do"
const VARIANT_COLOR_1 = hexToRgb('EEEEEE')
const VARIANT_NAME_2 = "In Progress"
const VARIANT_COLOR_2 = hexToRgb('FFEDC0')
const VARIANT_NAME_3 = "In Review"
const VARIANT_COLOR_3 = hexToRgb('D7E0FF')
const VARIANT_NAME_DONE = "Done"
const VARIANT_COLOR_DONE = hexToRgb('C0E9BF ')
const VARIANT_NAME_DEFAULT = "Default"
const VARIANT_COLOR_DEFAULT = hexToRgb('B9B9B9')
const VARIANT_NAME_ERROR = "Error"
const VARIANT_COLOR_ERROR = hexToRgb('FFD9D9')

var ticketComponent

// Don't show UI if relaunch buttons are run
if (figma.command === 'update_selection') {
  updateWithoutUI("selection")
} else if (figma.command === 'update_all') {
  updateWithoutUI("all")
} else if (figma.command === 'update_page') {
  updateWithoutUI("page")
} else if (figma.command === 'set_library_component') {
  let selection = figma.currentPage.selection[0]
  saveLibraryComponent(selection)
}
else {
  // Otherwise show UI
  figma.showUI(__html__, { width: WINDOW_WIDTH, height: WINDOW_HEIGHT_SMALL });
  sendData()
}

// Make sure the main component is referenced
referenceTicketComponentSet()

// Start plugin without visible UI and update tickets
async function updateWithoutUI(type) {
  figma.showUI(__html__, { visible: false })
  await sendData()
  var hasFailed = requestUpdateForTickets(type)
  if (hasFailed && (type === "all" || type === "page" || type === "selection")) {
    figma.closePlugin()
  }
}

// Send the stored authorization data to the UI
async function sendData() {
  company_name = await getAuthorizationInfo(COMPANY_NAME_KEY, true)
  project_id = await getAuthorizationInfo(PROJECT_ID_KEY, true)
  username = await getAuthorizationInfo(USERNAME_KEY, false)
  password = await getAuthorizationInfo(PASSWORD_KEY, false)
  issueId = await getAuthorizationInfo(ISSUE_ID_KEY, false)
  createLink = await getAuthorizationInfo(CREATE_LINK_KEY, false)
  if (createLink === "") createLink = true
  figma.ui.postMessage({ company_name: company_name, project_id: project_id, username: username, password: password, issueId: issueId, createLink: createLink, type: 'setAuthorizationVariables' })
}

// All the functions that can be started from the UI
figma.ui.onmessage = async (msg) => {
  // Called to create a new main component and save its ID
  if (msg.type === 'create-component') {
    ticketComponent = await createTicketComponentSet()
    DOCUMENT_NODE.setPluginData('ticketComponentID', ticketComponent.id)
  }

  // Called to create a new instance of a component (based on the issueId entered in the UI)
  if (msg.type === 'create-new-ticket' && checkFetchSuccess(msg.data)) {
    let ticketInstance = await createTicketInstance(msg)
    if (msg.createLink && msg.data[0].key && project_id != "") {
      let projectName = encodeURIComponent(figma.root.name)
      let nodeId = encodeURIComponent(ticketInstance.id)
      let link = `https://www.figma.com/file/${project_id}/${projectName}?node-id=${nodeId}`
      figma.ui.postMessage({ issueId: msg.issueIds[0], link: link, type: 'post-link-to-jira-issue' })
    }
  }

  // Called to get all Jira Ticker Header instances and update them one by one. 
  if (msg.type === 'update-all') {
    requestUpdateForTickets("all")
  }

  // Called to get Jira Ticker Header instances on this page and update them one by one. 
  if (msg.type === 'update-page') {
    requestUpdateForTickets("page")
  }

  // Called to get selected Jira Ticker Header instances and update them one by one. 
  if (msg.type === 'update-selected') {
    requestUpdateForTickets("selection")
  }

  // Save new authorization info
  if (msg.type === 'authorization-detail-changed') {
    setAuthorizationInfo(msg.key, msg.data, msg.save_public)
  }

  // Resize the UI
  if (msg.type === 'resize-ui') {
    msg.big_size ? figma.ui.resize(WINDOW_WIDTH, WINDOW_HEIGHT_BIG) : figma.ui.resize(WINDOW_WIDTH, WINDOW_HEIGHT_SMALL)
  }

  // Allows the UI to create notifications
  if (msg.type === 'create-visual-bell') {
    figma.notify(msg.message)
  }


  // Updates instances based on the received ticket data.
  if (msg.type === 'ticketDataSent' && checkFetchSuccess(msg.data)) {
    // console.log("Ticket data:", msg.data)
    var nodeIds = msg.nodeIds
    var nodes = nodeIds.map(id => figma.getNodeById(id) as InstanceNode)
    await updateTickets(nodes, msg)
  }
}

// Saves authorization details in client storage
async function setAuthorizationInfo(key: string, value: string, savePublic = false) {
  if (savePublic) {
    DOCUMENT_NODE.setPluginData(key, value)
  } else {
    await figma.clientStorage.setAsync(key, value)
  }

  // Make sure that variable gets updated
  if (key === COMPANY_NAME_KEY) company_name = value
  else if (key === PROJECT_ID_KEY) project_id = value
  else if (key === USERNAME_KEY) username = value
  else if (key === PASSWORD_KEY) password = value
  else if (key === ISSUE_ID_KEY) issueId = value
  else if (key === CREATE_LINK_KEY) createLink = value
}

// Get authorization details from client storage
async function getAuthorizationInfo(key: string, savedPublic = false) {
  var valueSaved
  if (savedPublic) {
    valueSaved = DOCUMENT_NODE.getPluginData(key)
  } else {
    valueSaved = await figma.clientStorage.getAsync(key)
  }

  if (!valueSaved && valueSaved != false) valueSaved = ""
  return valueSaved
}

async function saveLibraryComponent(node: SceneNode) {
  let componentKey
  if (node.type === 'COMPONENT_SET') {
    componentKey = node.key
    await figma.clientStorage.setAsync(LIBRARY_COMPONENT_KEY, componentKey)
    figma.closePlugin("Component successfully saved as global JTS component.")
  } else {
    figma.closePlugin("Element is not a component set. Could not be saved as library component.")
  }
}


/**
 * Get subset of tickets in document and start update process
 * @param subset A subset of ticket instances in the document
 * @returns Boolean if the subset could be updated
 */
function requestUpdateForTickets(subset) {
  let nodes
  let isFailed = false
  // All in document
  if (subset == "all") {
    nodes = DOCUMENT_NODE.findAllWithCriteria({
      types: ['INSTANCE']
    })
    nodes = nodes.filter(node => node.name === COMPONENT_SET_NAME);
    if (nodes.length == 0) {
      figma.notify(`No instances named '${COMPONENT_SET_NAME}' found in document.`)
      isFailed = true
    } else {
      getDataForTickets(nodes)
    }
  }
  // All on page
  else if (subset == "page") {
    nodes = figma.currentPage.findAllWithCriteria({
      types: ['INSTANCE']
    })
    nodes = nodes.filter(node => node.name === COMPONENT_SET_NAME);
    if (nodes.length == 0) {
      figma.notify(`No instances named '${COMPONENT_SET_NAME}' found on page.`)
      isFailed = true
    } else {
      getDataForTickets(nodes)
    }
  }
  // Selected elements
  else if (subset == "selection") {
    nodes = figma.currentPage.selection
    if (nodes.length == 0) {
      figma.notify(`Nothing selected.`)
      isFailed = true
    } else {
      getDataForTickets(nodes)
    }
  }
  return isFailed
}

/**
 * Sends a request to the UI to fetch data for an array of tickets
 * @param instances 
 */
async function getDataForTickets(instances) {
  var nodeIds = []
  var issueIds = []
  for (let i = 0; i < instances.length; i++) {
    const node = instances[i]
    if (node.type !== "INSTANCE") {
      figma.notify("The element needs to be an instance of " + COMPONENT_SET_NAME)
      if (figma.command) figma.closePlugin()
    } else {
      let issueIdNode = node.findOne(n => n.type === "TEXT" && n.name === ISSUE_ID_NAME) as TextNode
      if (!issueIdNode) {
        figma.notify(`At least one instance is missing the text element '${ISSUE_ID_NAME}'. Could not update.`)
        if (figma.command) figma.closePlugin()
      } else {
        issueIds.push(issueIdNode.characters)
        nodeIds.push(node.id)
        figma.ui.postMessage({ nodeIds: nodeIds, issueIds: issueIds, type: 'getTicketData' })
      }
    }
  }
}

/**
 * Updates a set of tickets based on their status.
 * Is called after the data is fetched.
 * @param ticketInstances A set of ticket instances
 * @param msg A message sent from the UI
 * @param isCreateNew Wether the function call is coming from an actual ticket update or from creating a new ticket
 * @returns Updated ticket instances
 */
async function updateTickets(ticketInstances: Array<InstanceNode>, msg, isCreateNew = false) {
  var ticketDataArray = msg.data
  var issueIds = msg.issueIds

  var numberOfNodes = ticketInstances.length
  var invalidIds = []
  var numberOfMissingTitles = 0
  var numberOfMissingDates = 0
  var numberOfMissingAssignees = 0
  var missingVariants = []

  // Go through all nodes and update their content
  for (let i = 0; i < numberOfNodes; i++) {
    let ticketInstance = ticketInstances[i]
    let ticketData = checkTicketDataReponse(ticketDataArray[i], issueIds[i])
    let ticketStatus = getStatus(ticketData)
    if (ticketStatus === 'Error') invalidIds.push(issueIds[i])

    // Get the variant based on the ticket status and swap it with the current
    let newVariant = ticketComponent.findChild(n => n.name === COMPONENT_SET_PROPERTY_NAME + ticketStatus)
    if (!newVariant) { // If the status doesn't match any of the variants, use default
      newVariant = ticketComponent.defaultVariant
      missingVariants.push(ticketStatus)
    }

    // Update title
    let titleTxt = ticketInstance.findOne(n => n.type === "TEXT" && n.name === ISSUE_TITLE_NAME) as TextNode
    if (titleTxt) {
      await figma.loadFontAsync(titleTxt.fontName as FontName)
      titleTxt.characters = getTitle(ticketData)
      titleTxt.hyperlink = { type: "URL", value: `https://${company_name}.atlassian.net/browse/${ticketData.key}` }
    } else {
      numberOfMissingTitles += 1
    }

    // Update date
    let changeDateTxt = ticketInstance.findOne(n => n.type === "TEXT" && n.name === ISSUE_CHANGE_DATE_NAME) as TextNode
    if (changeDateTxt) {
      await figma.loadFontAsync(changeDateTxt.fontName as FontName)
      // Filters out the data to a simplet format (Mmm DD YYYY)
      var date = new Date(getChangeDate(ticketData).replace(/[T]+.*/, ""))
      changeDateTxt.characters = date.toDateString();
      // changeDateTxt.characters = date.toDateString().replace(/^([A-Za-z]*)./,"");
    } else {
      numberOfMissingDates += 1
    }

    // Update assignee
    let assigneeTxt = ticketInstance.findOne(n => n.type === "TEXT" && n.name === ASSIGNEE_NAME) as TextNode
    if (assigneeTxt) {
      await figma.loadFontAsync(assigneeTxt.fontName as FontName)
      if (ticketData.fields.assignee) {
        let assignee = getAssignee(ticketData)
        assigneeTxt.characters = assignee
      } else {
        assigneeTxt.characters = "Not assigned"
      }
    } else {
      numberOfMissingAssignees += 1
    }

    // Update description
    let descriptionNode = ticketInstance.findOne(n => n.type === "TEXT" && n.name === DESCRIPTION_NAME) as TextNode
    let descriptionText = getDescription(ticketData)
    if (descriptionNode && descriptionText) {

      let fontFamily = "Helvetica"
      let regFont = { family: fontFamily, style: "Regular" }

      await figma.loadFontAsync(regFont as FontName)
      descriptionNode.fontName = regFont

      // Bullet points
      while (descriptionText.match(/\n(\*)+[^\w]/)) {
        let count = descriptionText.match(/\n(\*)+[^\w]/)[0].length
        count = (count - 2) * 2
        var spaces = new Array(count).join(" ")
        descriptionText = descriptionText.replace(/\n(\*)+[^\w]/, `\n${spaces}• `)
      }
      descriptionNode.characters = descriptionText

      // Panel
      let regexPanel = /\{panel.*?}(.+?)\{panel\}/s
      let fontPanel = { family: fontFamily, style: "Regular" }
      await changeFontsByRegex(descriptionNode, regexPanel, fontPanel, 1, "-------", "-------")

      // Code
      let regexCode = /\{noformat\}(.*?)\{noformat\}/s
      let fontCode = { family: "Courier", style: "Regular" }
      await changeFontsByRegex(descriptionNode, regexCode, fontCode, 1, "-------\n", "-------")

      // Bold
      let regexBold = /\*(.+?)\*/
      let fontBold = { family: fontFamily, style: "Bold" }
      await changeFontsByRegex(descriptionNode, regexBold, fontBold, 1)

      // Italic
      let regexItalic = /_([^_].*?)_/
      let fontItalic = { family: fontFamily, style: "Oblique" }
      await changeFontsByRegex(descriptionNode, regexItalic, fontItalic, 1)

      // Title
      let regexTitle = /h([1-9])\.\s(.*)/
      let fontTitle = { family: fontFamily, style: "Bold" }
      await changeFontsByRegex(descriptionNode, regexTitle, fontTitle, 2)

    }

    // Add the relaunch button
    ticketInstance.swapComponent(newVariant)
    ticketInstance.setRelaunchData({ update_selection: '' })
  }

  // Notify about errors (missing text fields)
  if (missingVariants.length > 0) {
    missingVariants = [...new Set(missingVariants)]
    let variantString = missingVariants.join("', '");
    figma.notify(`Status '${variantString}' not existing. You can add it as a new variant to the main component.`, { timeout: 6000 })
  }
  if (numberOfMissingTitles > 0) figma.notify(`${numberOfMissingTitles} tickets are missing text element '${ISSUE_TITLE_NAME}'.`)
  if (numberOfMissingDates > 0) figma.notify(`${numberOfMissingDates} tickets are missing text element '${ISSUE_CHANGE_DATE_NAME}'.`)
  if (numberOfMissingAssignees > 0) figma.notify(`${numberOfMissingAssignees} tickets are missing text element '${ASSIGNEE_NAME}'.`)

  // Success message
  var message: string
  var numberOfInvalidIds = invalidIds.length
  if (numberOfInvalidIds == numberOfNodes) {
    // All invalid
    message = (numberOfNodes == 1) ? "Invalid ID." : `${numberOfInvalidIds} of ${numberOfNodes} IDs are invalid or do not exist.`
  } else if (numberOfInvalidIds == 0) {
    // All valid
    message = (numberOfNodes == 1) ? "Updated." : `${numberOfNodes} of ${numberOfNodes} header(s) updated!`
    if (isCreateNew) message = ""
  } else {
    // Some valid
    let firstSentence = `${numberOfNodes - numberOfInvalidIds} of ${numberOfNodes} successfully updated. `
    let secondSentence = (numberOfInvalidIds == 1) ? "1 ID is invalid or does not exist." : `${numberOfInvalidIds} IDs are invalid or do not exist.`
    message = firstSentence + secondSentence
  }

  // If called via the relaunch button, close plugin after updating the tickets
  if (figma.command === 'update_page' || figma.command === 'update_all' || figma.command === 'update_selection') {
    figma.closePlugin(message)
  } else {
    figma.notify(message, { timeout: 2000 })
  }
  return ticketInstances
}

/**
 * Changes the font in a Text node based on an indices array.
 * @param font Font Name
 * @param textNode Text Node
 * @param indices Indices array with index and length of range
 * @return Text Node
 */
async function changeFontsByRegex(textNode: TextNode, regex: RegExp, font: FontName, contentGroup: number, preText = "", postText = "") {

  await figma.loadFontAsync(font)

  while (textNode.characters.match(regex)) {
    let match = textNode.characters.match(regex)
    let length = match[0].length
    let index = match.index
    let newText = match[contentGroup]
    let wholeText = preText + newText + postText

    // console.log("Delete Match", match, length)

    if (length > 0) {
      textNode.deleteCharacters(index, index + length)
      textNode.insertCharacters(index, wholeText)
      textNode.setRangeFontName(index, index + wholeText.length, font)
    }
  }

  return textNode
}





/**
 * Create instances of the main ticket component and replaces the content with data of the actual Jira ticket
 * @param msg JSON with info sent from UI
 */
async function createTicketInstance(msg) {
  // Create an instance and update it to the correct status
  let ticketVariant = ticketComponent.defaultVariant
  let ticketInstance = ticketVariant.createInstance()
  ticketInstance.x = (figma.viewport.center.x - ticketInstance.width / 2) + nextTicketOffset
  ticketInstance.y = (figma.viewport.center.y - ticketInstance.height / 2) + nextTicketOffset
  nextTicketOffset = (nextTicketOffset + 10) % 70
  figma.currentPage.selection = [ticketInstance]

  let ticketData = checkTicketDataReponse(msg.data[0], msg.issueIds[0])
  let ticketInstances = await updateTickets([ticketInstance], msg, true)
  ticketInstance = ticketInstances[0]

  // Add ID
  let issueIDTxt = ticketInstance.findOne(n => n.type === "TEXT" && n.name === ISSUE_ID_NAME) as TextNode
  if (issueIDTxt) {
    await figma.loadFontAsync(issueIDTxt.fontName as FontName)
    issueIDTxt.characters = getIssueId(ticketData)
  } else {
    figma.notify("Could not find text element named '" + ISSUE_ID_NAME + "'.")
  }

  return ticketInstance
}

/**
 * Creates a new component that represents a ticket status
 * @param statusColor RGB value for status color
 * @param statusName Name of status
 * @returns A component that represent a ticket
 */
async function createTicketVariant(statusColor: { r: any, g: any, b: any }, statusName: string) {
  // Create the main frame
  var ticketVariant = figma.createComponent()
  let padding = 24
  ticketVariant.name = statusName
  ticketVariant.layoutMode = "VERTICAL"
  ticketVariant.resize(600, 200)
  ticketVariant.counterAxisSizingMode = "FIXED"
  ticketVariant.primaryAxisSizingMode = "AUTO"
  ticketVariant.paddingTop = padding
  ticketVariant.paddingRight = padding
  ticketVariant.paddingBottom = padding
  ticketVariant.paddingLeft = padding
  ticketVariant.itemSpacing = 16
  ticketVariant.cornerRadius = 4
  ticketVariant.fills = [{ type: 'SOLID', color: statusColor }]

  // Create the header frame
  var headerFrame = figma.createFrame()
  headerFrame.name = "Container"
  headerFrame.layoutMode = "HORIZONTAL"
  headerFrame.counterAxisSizingMode = "AUTO"
  headerFrame.layoutAlign = "STRETCH"
  headerFrame.itemSpacing = 40
  headerFrame.fills = []

  // Create the details frame
  var detailsFrame = figma.createFrame()
  detailsFrame.name = "Container"
  detailsFrame.layoutMode = "HORIZONTAL"
  detailsFrame.counterAxisSizingMode = "AUTO"
  detailsFrame.layoutAlign = "STRETCH"
  detailsFrame.itemSpacing = 32
  detailsFrame.fills = []

  // Create the description frame
  var descriptionFrame = figma.createFrame()
  descriptionFrame.name = "Container"
  descriptionFrame.layoutMode = "HORIZONTAL"
  descriptionFrame.counterAxisSizingMode = "AUTO"
  descriptionFrame.layoutAlign = "STRETCH"
  descriptionFrame.itemSpacing = 32
  descriptionFrame.cornerRadius = 8
  descriptionFrame.verticalPadding = 16
  descriptionFrame.horizontalPadding = 16
  descriptionFrame.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }]


  loadFonts().then(() => {
    // Add the ticket text fields
    const titleTxt = figma.createText()
    titleTxt.fontName = FONT_REG
    titleTxt.fontSize = 32
    titleTxt.textDecoration = "UNDERLINE"
    titleTxt.autoRename = false
    titleTxt.characters = "Ticket title"
    titleTxt.name = ISSUE_TITLE_NAME

    const issueIdTxt = figma.createText()
    issueIdTxt.fontName = FONT_MED
    issueIdTxt.fontSize = 32
    issueIdTxt.autoRename = false
    issueIdTxt.characters = "ID-1"
    issueIdTxt.name = ISSUE_ID_NAME

    const changeDateTxt = figma.createText()
    changeDateTxt.fontName = FONT_REG
    changeDateTxt.fontSize = 24
    changeDateTxt.autoRename = false
    changeDateTxt.characters = "MM DD YYYY"
    changeDateTxt.name = ISSUE_CHANGE_DATE_NAME

    const assigneeTxt = figma.createText()
    assigneeTxt.fontName = FONT_REG
    assigneeTxt.fontSize = 24
    assigneeTxt.autoRename = false
    assigneeTxt.characters = "Name of assignee"
    assigneeTxt.name = ASSIGNEE_NAME

    const descriptionTxt = figma.createText()
    descriptionTxt.fontName = FONT_REG
    descriptionTxt.fontSize = 24
    descriptionTxt.autoRename = false
    descriptionTxt.characters = "Description"
    descriptionTxt.name = DESCRIPTION_NAME
    descriptionTxt.layoutGrow = 1

    ticketVariant.appendChild(headerFrame)
    ticketVariant.appendChild(detailsFrame)
    ticketVariant.appendChild(descriptionFrame)
    headerFrame.appendChild(issueIdTxt)
    headerFrame.appendChild(titleTxt)
    detailsFrame.appendChild(assigneeTxt)
    detailsFrame.appendChild(changeDateTxt)
    descriptionFrame.appendChild(descriptionTxt)

    titleTxt.layoutGrow = 1
    assigneeTxt.layoutGrow = 1
  }).catch(() => {
    figma.notify("Font '" + FONT_REG.family + "' could not be loaded. Please install the font.")
  })

  // Fixes a weird bug in which the 'stretch' doesnt work properly
  headerFrame.primaryAxisSizingMode = "FIXED"
  headerFrame.layoutAlign = "STRETCH"
  detailsFrame.primaryAxisSizingMode = "FIXED"
  detailsFrame.layoutAlign = "STRETCH"
  descriptionFrame.primaryAxisSizingMode = "FIXED"
  descriptionFrame.layoutAlign = "STRETCH"


  return ticketVariant
}
/**
 * Creates the main component for the tickets
 * @returns The main component
 */
async function createTicketComponentSet() {
  let ticketComponent
  // Create variants (one for each status)
  let varDefault = await createTicketVariant(VARIANT_COLOR_DEFAULT, COMPONENT_SET_PROPERTY_NAME + VARIANT_NAME_DEFAULT)
  let var1 = await createTicketVariant(VARIANT_COLOR_1, COMPONENT_SET_PROPERTY_NAME + VARIANT_NAME_1)
  let var2 = await createTicketVariant(VARIANT_COLOR_2, COMPONENT_SET_PROPERTY_NAME + VARIANT_NAME_2)
  let var3 = await createTicketVariant(VARIANT_COLOR_3, COMPONENT_SET_PROPERTY_NAME + VARIANT_NAME_3)
  let var5 = await createTicketVariant(VARIANT_COLOR_DONE, COMPONENT_SET_PROPERTY_NAME + VARIANT_NAME_DONE)
  let varError = await createTicketVariant(VARIANT_COLOR_ERROR, COMPONENT_SET_PROPERTY_NAME + VARIANT_NAME_ERROR)
  const variants = [varDefault, var1, var2, var3, var5, varError]

  // Create a component out of all these variants
  ticketComponent = figma.combineAsVariants(variants, figma.currentPage)
  let padding = 16
  ticketComponent.name = COMPONENT_SET_NAME
  ticketComponent.layoutMode = "VERTICAL"
  ticketComponent.counterAxisSizingMode = "AUTO"
  ticketComponent.primaryAxisSizingMode = "AUTO"
  ticketComponent.paddingTop = padding
  ticketComponent.paddingRight = padding
  ticketComponent.paddingBottom = padding
  ticketComponent.paddingLeft = padding
  ticketComponent.itemSpacing = 24
  ticketComponent.cornerRadius = 4

  // Save component ID for later reference
  DOCUMENT_NODE.setPluginData('ticketComponentID', ticketComponent.id)
  ticketComponent.setRelaunchData({ set_library_component: 'Publish the component in a library and then click this button.' })

  // Make sure the component is visible where we're currently looking
  ticketComponent.x = figma.viewport.center.x - (ticketComponent.width / 2)
  ticketComponent.y = figma.viewport.center.y - (ticketComponent.height / 2)

  return ticketComponent
}

/**
 * Creates a new main ticket component or gets the reference to the existing one in the following order:
 * 1. Looks for library component based on public key
 * 2. Looks for library component based on private key
 * 3. Looks for local component based on public key
 * 4. Looks for local component based on component name
 * 5. Creates a new component
 */
async function referenceTicketComponentSet() {
  // Check if the ticket component is already saved in the variable
  if (!ticketComponent) {
    //Try to get library component...
    //...from component key saved in this project
    var publicTicketComponentKey = DOCUMENT_NODE.getPluginData(LIBRARY_COMPONENT_KEY)
    let libraryComponent
    if (publicTicketComponentKey && (libraryComponent = await importLibraryComponent(publicTicketComponentKey))) {
      console.log("PUBLIC", publicTicketComponentKey)
      ticketComponent = libraryComponent
    } else {
      console.log("PUBLIC lib comp", libraryComponent)
      //...or from component key saved with the user
      var privateTicketComponentKey = await figma.clientStorage.getAsync(LIBRARY_COMPONENT_KEY)
      if (privateTicketComponentKey && (libraryComponent = await importLibraryComponent(privateTicketComponentKey))) {
        console.log("PRIVATE", privateTicketComponentKey)
        DOCUMENT_NODE.setPluginData(LIBRARY_COMPONENT_KEY, privateTicketComponentKey) // Safe key publicly
        ticketComponent = libraryComponent
      }
      else {
        // If there is no library component, try the get the ticket component by its ID
        var ticketComponentId = DOCUMENT_NODE.getPluginData('ticketComponentID')
        let node
        if (ticketComponentId && (node = figma.getNodeById(ticketComponentId))) {
          // If there is an ID saved, access the ticket component
          console.log("LOCAL", ticketComponentId)
          ticketComponent = node
        }
        else {
          // If there is a component somewhere with the right name
          let componentSets = figma.root.findAllWithCriteria({
            types: ['COMPONENT_SET']
          })
          componentSets = componentSets.filter(node => node.name === COMPONENT_SET_NAME);
          if (componentSets[0]) {
            ticketComponent = componentSets[0]
            DOCUMENT_NODE.setPluginData('ticketComponentID', ticketComponent.id)
          } else {
            // If there is no component, create a new component
            ticketComponent = await createTicketComponentSet();
          }
        }
      }
    }
  }
}

async function importLibraryComponent(key) {
  var libraryComponent
  await figma.importComponentSetByKeyAsync(key)
  .then((result) => {
    libraryComponent = result
  })
  .catch(() => {
    libraryComponent = false
  })
  console.log("LIB FUNC", libraryComponent)
  return libraryComponent
}


// Checks if fetching data was successful at all 
function checkFetchSuccess(data) {
  var isSuccess = false
  // Can this even happen?
  if (!data) {
    figma.notify("Something went wrong.")
    throw new Error("Something went wrong." + data)
  }
  // No connection to Firebase
  else if (data.type == "Error") {
    figma.notify("Could not get data. There seems to be no connection to the server.")
    throw new Error(data.message)
  }
  // Wrong e-mail
  else if (data[0].message == "Client must be authenticated to access this resource.") {
    figma.notify("You have entered an invalid e-mail. See 'Authorization' settings.")
    throw new Error(data.message)
  }
  // Wrong company name
  else if (data[0].errorMessage == "Site temporarily unavailable") {
    figma.notify("Company domain name does not exist. See 'Project Settings'.")
    throw new Error(data[0].errorMessage)
  }
  // Wrong password
  else if (data[0][0]) {
    figma.notify("Could not access data. Your Jira API Token seems to be invalid. See 'Authorization' settings.")
    throw new Error(data[0][0])
  }
  // Else, it was probably successful
  else {
    isSuccess = true
  }
  return isSuccess
}

// Checks if per received ticket data if the fetching was successful
function checkTicketDataReponse(ticketData, issueId) {

  var checkedData;
  // If the JSON has a key field, the data is valid
  if (ticketData && ticketData.key) {
    checkedData = ticketData
  }
  // ID does not exist
  else if (ticketData.errorMessages == "The issue no longer exists.") {
    checkedData = createErrorDataJSON(`Error: Ticket ID '${issueId}' does not exist.`, issueId)
    // figma.notify(`Ticket ID '${issueId}' does not exist.`)
  }
  // ID has invalid format
  else if (ticketData.errorMessages == "Issue key is in an invalid format.") {
    checkedData = createErrorDataJSON(`Error: Ticket ID '${issueId}' is in an invalid format.`, issueId)
    // figma.notify(`Ticket ID '${issueId}' is in an invalid format.`)
  }
  // Other
  else {
    checkedData = createErrorDataJSON("Error: An unexpected error occured.", issueId)
    figma.notify("Unexpected error.")
    console.error("Unexpected error.", ticketData)
    // throw new Error(ticketData.message)
  }
  return checkedData
}


// Create a error variable that has the same main fields as the Jira Ticket variable. 
// This will be used the fill the ticket data with the error message.
function createErrorDataJSON(message, issueId) {
  var today = new Date().toISOString();
  var errorData = {
    "key": issueId,
    "fields": {
      "summary": message,
      "status": {
        "name": "Error"
      },
      "statuscategorychangedate": today
    }
  }
  return errorData
}

// Function for loading all the fonts for the main component
async function loadFonts() {

  await figma.loadFontAsync(FONT_REG)
  await figma.loadFontAsync(FONT_MED)
  await figma.loadFontAsync(FONT_BOLD)

}

async function loadSingleFont(fontName: FontName) {
  await figma.loadFontAsync(fontName)
}

// Formats a hex value to RGB
function hexToRgb(hex) {

  var bigint = parseInt(hex, 16);
  var r = (bigint >> 16) & 255;
  var g = (bigint >> 8) & 255;
  var b = bigint & 255;

  return { r: r / 255, g: g / 255, b: b / 255 }
}




