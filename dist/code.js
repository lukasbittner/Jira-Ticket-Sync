/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/code.ts":
/*!*********************!*\
  !*** ./src/code.ts ***!
  \*********************/
/***/ (function() {

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const DOCUMENT_NODE = figma.currentPage.parent;
// Set the relaunch button for the whole document
DOCUMENT_NODE.setRelaunchData({ update_page: '', update_all: '' });
const WINDOW_WIDTH = 250;
const WINDOW_HEIGHT_BIG = 650;
const WINDOW_HEIGHT_SMALL = 308;
const COMPANY_NAME_KEY = "COMPANY_NAME";
const PROJECT_ID_KEY = "PROJECT_ID";
const USERNAME_KEY = "USERNAME";
const PASSWORD_KEY = "PASSWORD";
const ISSUE_ID_KEY = "ISSUE_ID";
const CREATE_LINK_KEY = "CREATE_LINK";
const LIBRARY_COMPONENT_KEY = "LIBRARY_COMPONENT";
var company_name; // Saved publicly with setPluginData
var project_id; // Saved publicly with setPluginData
var username;
var password;
var issueId;
var createLink;
const FONT_REG = { family: "Work Sans", style: "Regular" };
const FONT_MED = { family: "Work Sans", style: "Medium" };
const FONT_BOLD = { family: "Work Sans", style: "Bold" };
function getStatus(data) { return data.fields.status.name; }
function getTitle(data) { return data.fields.summary; }
function getIssueId(data) { return data.key; }
function getChangeDate(data) { return data.fields.statuscategorychangedate; }
function getAssignee(data) { return data.fields.assignee.displayName; }
function getDescription(data) { return data.fields.description; }
var nextTicketOffset = 0;
// ticketdata.fields.assignee.avatarUrls
// ticketdata.fields.status.name
// ticketdata.fields.status.statusCategory.name
const ISSUE_ID_NAME = "Ticket ID";
const ISSUE_TITLE_NAME = "Ticket Title";
const ISSUE_CHANGE_DATE_NAME = "Date of Status Change";
const ASSIGNEE_NAME = "Assignee";
const DESCRIPTION_NAME = "Description";
const COMPONENT_SET_NAME = "Jira Ticket Header";
const COMPONENT_SET_PROPERTY_NAME = "Status=";
const VARIANT_NAME_1 = "To Do";
const VARIANT_COLOR_1 = hexToRgb('EEEEEE');
const VARIANT_NAME_2 = "In Progress";
const VARIANT_COLOR_2 = hexToRgb('FFEDC0');
const VARIANT_NAME_3 = "In Review";
const VARIANT_COLOR_3 = hexToRgb('D7E0FF');
const VARIANT_NAME_DONE = "Done";
const VARIANT_COLOR_DONE = hexToRgb('C0E9BF ');
const VARIANT_NAME_DEFAULT = "Default";
const VARIANT_COLOR_DEFAULT = hexToRgb('B9B9B9');
const VARIANT_NAME_ERROR = "Error";
const VARIANT_COLOR_ERROR = hexToRgb('FFD9D9');
var ticketComponent;
// Don't show UI if relaunch buttons are run
if (figma.command === 'update_selection') {
    updateWithoutUI("selection");
}
else if (figma.command === 'update_all') {
    updateWithoutUI("all");
}
else if (figma.command === 'update_page') {
    updateWithoutUI("page");
}
else if (figma.command === 'set_library_component') {
    let selection = figma.currentPage.selection[0];
    saveLibraryComponent(selection);
}
else {
    // Otherwise show UI
    figma.showUI(__html__, { width: WINDOW_WIDTH, height: WINDOW_HEIGHT_SMALL });
    sendData();
}
// Make sure the main component is referenced
referenceTicketComponentSet();
// Start plugin without visible UI and update tickets
function updateWithoutUI(type) {
    return __awaiter(this, void 0, void 0, function* () {
        figma.showUI(__html__, { visible: false });
        yield sendData();
        var hasFailed = requestUpdateForTickets(type);
        if (hasFailed && (type === "all" || type === "page" || type === "selection")) {
            figma.closePlugin();
        }
    });
}
// Send the stored authorization data to the UI
function sendData() {
    return __awaiter(this, void 0, void 0, function* () {
        company_name = yield getAuthorizationInfo(COMPANY_NAME_KEY, true);
        project_id = yield getAuthorizationInfo(PROJECT_ID_KEY, true);
        username = yield getAuthorizationInfo(USERNAME_KEY, false);
        password = yield getAuthorizationInfo(PASSWORD_KEY, false);
        issueId = yield getAuthorizationInfo(ISSUE_ID_KEY, false);
        createLink = yield getAuthorizationInfo(CREATE_LINK_KEY, false);
        if (createLink === "")
            createLink = true;
        figma.ui.postMessage({ company_name: company_name, project_id: project_id, username: username, password: password, issueId: issueId, createLink: createLink, type: 'setAuthorizationVariables' });
    });
}
// All the functions that can be started from the UI
figma.ui.onmessage = (msg) => __awaiter(this, void 0, void 0, function* () {
    // Called to create a new main component and save its ID
    if (msg.type === 'create-component') {
        ticketComponent = yield createTicketComponentSet();
        DOCUMENT_NODE.setPluginData('ticketComponentID', ticketComponent.id);
    }
    // Called to create a new instance of a component (based on the issueId entered in the UI)
    if (msg.type === 'create-new-ticket' && checkFetchSuccess(msg.data)) {
        let ticketInstance = yield createTicketInstance(msg);
        if (msg.createLink && msg.data[0].key && project_id != "") {
            let projectName = encodeURIComponent(figma.root.name);
            let nodeId = encodeURIComponent(ticketInstance.id);
            let link = `https://www.figma.com/file/${project_id}/${projectName}?node-id=${nodeId}`;
            figma.ui.postMessage({ issueId: msg.issueIds[0], link: link, type: 'post-link-to-jira-issue' });
        }
    }
    // Called to get all Jira Ticker Header instances and update them one by one. 
    if (msg.type === 'update-all') {
        requestUpdateForTickets("all");
    }
    // Called to get Jira Ticker Header instances on this page and update them one by one. 
    if (msg.type === 'update-page') {
        requestUpdateForTickets("page");
    }
    // Called to get selected Jira Ticker Header instances and update them one by one. 
    if (msg.type === 'update-selected') {
        requestUpdateForTickets("selection");
    }
    // Save new authorization info
    if (msg.type === 'authorization-detail-changed') {
        setAuthorizationInfo(msg.key, msg.data, msg.save_public);
    }
    // Resize the UI
    if (msg.type === 'resize-ui') {
        msg.big_size ? figma.ui.resize(WINDOW_WIDTH, WINDOW_HEIGHT_BIG) : figma.ui.resize(WINDOW_WIDTH, WINDOW_HEIGHT_SMALL);
    }
    // Allows the UI to create notifications
    if (msg.type === 'create-visual-bell') {
        figma.notify(msg.message);
    }
    // Updates instances based on the received ticket data.
    if (msg.type === 'ticketDataSent' && checkFetchSuccess(msg.data)) {
        // console.log("Ticket data:", msg.data)
        var nodeIds = msg.nodeIds;
        var nodes = nodeIds.map(id => figma.getNodeById(id));
        yield updateTickets(nodes, msg);
    }
});
// Saves authorization details in client storage
function setAuthorizationInfo(key, value, savePublic = false) {
    return __awaiter(this, void 0, void 0, function* () {
        if (savePublic) {
            DOCUMENT_NODE.setPluginData(key, value);
        }
        else {
            yield figma.clientStorage.setAsync(key, value);
        }
        // Make sure that variable gets updated
        if (key === COMPANY_NAME_KEY)
            company_name = value;
        else if (key === PROJECT_ID_KEY)
            project_id = value;
        else if (key === USERNAME_KEY)
            username = value;
        else if (key === PASSWORD_KEY)
            password = value;
        else if (key === ISSUE_ID_KEY)
            issueId = value;
        else if (key === CREATE_LINK_KEY)
            createLink = value;
    });
}
// Get authorization details from client storage
function getAuthorizationInfo(key, savedPublic = false) {
    return __awaiter(this, void 0, void 0, function* () {
        var valueSaved;
        if (savedPublic) {
            valueSaved = DOCUMENT_NODE.getPluginData(key);
        }
        else {
            valueSaved = yield figma.clientStorage.getAsync(key);
        }
        if (!valueSaved && valueSaved != false)
            valueSaved = "";
        return valueSaved;
    });
}
function saveLibraryComponent(node) {
    return __awaiter(this, void 0, void 0, function* () {
        let componentKey;
        if (node.type === 'COMPONENT_SET') {
            componentKey = node.key;
            yield figma.clientStorage.setAsync(LIBRARY_COMPONENT_KEY, componentKey);
            figma.closePlugin("Component successfully saved as global JTS component.");
        }
        else {
            figma.closePlugin("Element is not a component set. Could not be saved as library component.");
        }
    });
}
/**
 * Get subset of tickets in document and start update process
 * @param subset A subset of ticket instances in the document
 * @returns Boolean if the subset could be updated
 */
function requestUpdateForTickets(subset) {
    let nodes;
    let isFailed = false;
    // All in document
    if (subset == "all") {
        nodes = DOCUMENT_NODE.findAllWithCriteria({
            types: ['INSTANCE']
        });
        nodes = nodes.filter(node => node.name === COMPONENT_SET_NAME);
        if (nodes.length == 0) {
            figma.notify(`No instances named '${COMPONENT_SET_NAME}' found in document.`);
            isFailed = true;
        }
        else {
            getDataForTickets(nodes);
        }
    }
    // All on page
    else if (subset == "page") {
        nodes = figma.currentPage.findAllWithCriteria({
            types: ['INSTANCE']
        });
        nodes = nodes.filter(node => node.name === COMPONENT_SET_NAME);
        if (nodes.length == 0) {
            figma.notify(`No instances named '${COMPONENT_SET_NAME}' found on page.`);
            isFailed = true;
        }
        else {
            getDataForTickets(nodes);
        }
    }
    // Selected elements
    else if (subset == "selection") {
        nodes = figma.currentPage.selection;
        if (nodes.length == 0) {
            figma.notify(`Nothing selected.`);
            isFailed = true;
        }
        else {
            getDataForTickets(nodes);
        }
    }
    return isFailed;
}
/**
 * Sends a request to the UI to fetch data for an array of tickets
 * @param instances
 */
function getDataForTickets(instances) {
    return __awaiter(this, void 0, void 0, function* () {
        var nodeIds = [];
        var issueIds = [];
        for (let i = 0; i < instances.length; i++) {
            const node = instances[i];
            if (node.type !== "INSTANCE") {
                figma.notify("The element needs to be an instance of " + COMPONENT_SET_NAME);
                if (figma.command)
                    figma.closePlugin();
            }
            else {
                let issueIdNode = node.findOne(n => n.type === "TEXT" && n.name === ISSUE_ID_NAME);
                if (!issueIdNode) {
                    figma.notify(`At least one instance is missing the text element '${ISSUE_ID_NAME}'. Could not update.`);
                    if (figma.command)
                        figma.closePlugin();
                }
                else {
                    issueIds.push(issueIdNode.characters);
                    nodeIds.push(node.id);
                    figma.ui.postMessage({ nodeIds: nodeIds, issueIds: issueIds, type: 'getTicketData' });
                }
            }
        }
    });
}
/**
 * Updates a set of tickets based on their status.
 * Is called after the data is fetched.
 * @param ticketInstances A set of ticket instances
 * @param msg A message sent from the UI
 * @param isCreateNew Wether the function call is coming from an actual ticket update or from creating a new ticket
 * @returns Updated ticket instances
 */
function updateTickets(ticketInstances, msg, isCreateNew = false) {
    return __awaiter(this, void 0, void 0, function* () {
        var ticketDataArray = msg.data;
        var issueIds = msg.issueIds;
        var numberOfNodes = ticketInstances.length;
        var invalidIds = [];
        var numberOfMissingTitles = 0;
        var numberOfMissingDates = 0;
        var numberOfMissingAssignees = 0;
        var missingVariants = [];
        // Go through all nodes and update their content
        for (let i = 0; i < numberOfNodes; i++) {
            let ticketInstance = ticketInstances[i];
            let ticketData = checkTicketDataReponse(ticketDataArray[i], issueIds[i]);
            let ticketStatus = getStatus(ticketData);
            if (ticketStatus === 'Error')
                invalidIds.push(issueIds[i]);
            // Get the variant based on the ticket status and swap it with the current
            let newVariant = ticketComponent.findChild(n => n.name === COMPONENT_SET_PROPERTY_NAME + ticketStatus);
            if (!newVariant) { // If the status doesn't match any of the variants, use default
                newVariant = ticketComponent.defaultVariant;
                missingVariants.push(ticketStatus);
            }
            // Update title
            let titleTxt = ticketInstance.findOne(n => n.type === "TEXT" && n.name === ISSUE_TITLE_NAME);
            if (titleTxt) {
                yield figma.loadFontAsync(titleTxt.fontName);
                titleTxt.characters = getTitle(ticketData);
                titleTxt.hyperlink = { type: "URL", value: `https://${company_name}.atlassian.net/browse/${ticketData.key}` };
            }
            else {
                numberOfMissingTitles += 1;
            }
            // Update date
            let changeDateTxt = ticketInstance.findOne(n => n.type === "TEXT" && n.name === ISSUE_CHANGE_DATE_NAME);
            if (changeDateTxt) {
                yield figma.loadFontAsync(changeDateTxt.fontName);
                // Filters out the data to a simplet format (Mmm DD YYYY)
                var date = new Date(getChangeDate(ticketData).replace(/[T]+.*/, ""));
                changeDateTxt.characters = date.toDateString();
                // changeDateTxt.characters = date.toDateString().replace(/^([A-Za-z]*)./,"");
            }
            else {
                numberOfMissingDates += 1;
            }
            // Update assignee
            let assigneeTxt = ticketInstance.findOne(n => n.type === "TEXT" && n.name === ASSIGNEE_NAME);
            if (assigneeTxt) {
                yield figma.loadFontAsync(assigneeTxt.fontName);
                if (ticketData.fields.assignee) {
                    let assignee = getAssignee(ticketData);
                    assigneeTxt.characters = assignee;
                }
                else {
                    assigneeTxt.characters = "Not assigned";
                }
            }
            else {
                numberOfMissingAssignees += 1;
            }
            // Update description
            let descriptionNode = ticketInstance.findOne(n => n.type === "TEXT" && n.name === DESCRIPTION_NAME);
            let descriptionText = getDescription(ticketData);
            if (descriptionNode && descriptionText) {
                let fontFamily = "Helvetica";
                let regFont = { family: fontFamily, style: "Regular" };
                yield figma.loadFontAsync(regFont);
                descriptionNode.fontName = regFont;
                // Bullet points
                while (descriptionText.match(/\n(\*)+[^\w]/)) {
                    let count = descriptionText.match(/\n(\*)+[^\w]/)[0].length;
                    count = (count - 2) * 2;
                    var spaces = new Array(count).join(" ");
                    descriptionText = descriptionText.replace(/\n(\*)+[^\w]/, `\n${spaces}• `);
                }
                descriptionNode.characters = descriptionText;
                // Panel
                let regexPanel = /\{panel.*?}(.+?)\{panel\}/s;
                let fontPanel = { family: fontFamily, style: "Regular" };
                yield changeFontsByRegex(descriptionNode, regexPanel, fontPanel, 1, "-------", "-------");
                // Code
                let regexCode = /\{noformat\}(.*?)\{noformat\}/s;
                let fontCode = { family: "Courier", style: "Regular" };
                yield changeFontsByRegex(descriptionNode, regexCode, fontCode, 1, "-------\n", "-------");
                // Bold
                let regexBold = /\*(.+?)\*/;
                let fontBold = { family: fontFamily, style: "Bold" };
                yield changeFontsByRegex(descriptionNode, regexBold, fontBold, 1);
                // Italic
                let regexItalic = /_([^_].*?)_/;
                let fontItalic = { family: fontFamily, style: "Oblique" };
                yield changeFontsByRegex(descriptionNode, regexItalic, fontItalic, 1);
                // Title
                let regexTitle = /h([1-9])\.\s(.*)/;
                let fontTitle = { family: fontFamily, style: "Bold" };
                yield changeFontsByRegex(descriptionNode, regexTitle, fontTitle, 2);
            }
            // Add the relaunch button
            ticketInstance.swapComponent(newVariant);
            ticketInstance.setRelaunchData({ update_selection: '' });
        }
        // Notify about errors (missing text fields)
        if (missingVariants.length > 0) {
            missingVariants = [...new Set(missingVariants)];
            let variantString = missingVariants.join("', '");
            figma.notify(`Status '${variantString}' not existing. You can add it as a new variant to the main component.`, { timeout: 6000 });
        }
        if (numberOfMissingTitles > 0)
            figma.notify(`${numberOfMissingTitles} tickets are missing text element '${ISSUE_TITLE_NAME}'.`);
        if (numberOfMissingDates > 0)
            figma.notify(`${numberOfMissingDates} tickets are missing text element '${ISSUE_CHANGE_DATE_NAME}'.`);
        if (numberOfMissingAssignees > 0)
            figma.notify(`${numberOfMissingAssignees} tickets are missing text element '${ASSIGNEE_NAME}'.`);
        // Success message
        var message;
        var numberOfInvalidIds = invalidIds.length;
        if (numberOfInvalidIds == numberOfNodes) {
            // All invalid
            message = (numberOfNodes == 1) ? "Invalid ID." : `${numberOfInvalidIds} of ${numberOfNodes} IDs are invalid or do not exist.`;
        }
        else if (numberOfInvalidIds == 0) {
            // All valid
            message = (numberOfNodes == 1) ? "Updated." : `${numberOfNodes} of ${numberOfNodes} header(s) updated!`;
            if (isCreateNew)
                message = "";
        }
        else {
            // Some valid
            let firstSentence = `${numberOfNodes - numberOfInvalidIds} of ${numberOfNodes} successfully updated. `;
            let secondSentence = (numberOfInvalidIds == 1) ? "1 ID is invalid or does not exist." : `${numberOfInvalidIds} IDs are invalid or do not exist.`;
            message = firstSentence + secondSentence;
        }
        // If called via the relaunch button, close plugin after updating the tickets
        if (figma.command === 'update_page' || figma.command === 'update_all' || figma.command === 'update_selection') {
            figma.closePlugin(message);
        }
        else {
            figma.notify(message, { timeout: 2000 });
        }
        return ticketInstances;
    });
}
/**
 * Changes the font in a Text node based on an indices array.
 * @param font Font Name
 * @param textNode Text Node
 * @param indices Indices array with index and length of range
 * @return Text Node
 */
function changeFontsByRegex(textNode, regex, font, contentGroup, preText = "", postText = "") {
    return __awaiter(this, void 0, void 0, function* () {
        yield figma.loadFontAsync(font);
        while (textNode.characters.match(regex)) {
            let match = textNode.characters.match(regex);
            let length = match[0].length;
            let index = match.index;
            let newText = match[contentGroup];
            let wholeText = preText + newText + postText;
            // console.log("Delete Match", match, length)
            if (length > 0) {
                textNode.deleteCharacters(index, index + length);
                textNode.insertCharacters(index, wholeText);
                textNode.setRangeFontName(index, index + wholeText.length, font);
            }
        }
        return textNode;
    });
}
/**
 * Create instances of the main ticket component and replaces the content with data of the actual Jira ticket
 * @param msg JSON with info sent from UI
 */
function createTicketInstance(msg) {
    return __awaiter(this, void 0, void 0, function* () {
        // Create an instance and update it to the correct status
        let ticketVariant = ticketComponent.defaultVariant;
        let ticketInstance = ticketVariant.createInstance();
        ticketInstance.x = (figma.viewport.center.x - ticketInstance.width / 2) + nextTicketOffset;
        ticketInstance.y = (figma.viewport.center.y - ticketInstance.height / 2) + nextTicketOffset;
        nextTicketOffset = (nextTicketOffset + 10) % 70;
        figma.currentPage.selection = [ticketInstance];
        let ticketData = checkTicketDataReponse(msg.data[0], msg.issueIds[0]);
        let ticketInstances = yield updateTickets([ticketInstance], msg, true);
        ticketInstance = ticketInstances[0];
        // Add ID
        let issueIDTxt = ticketInstance.findOne(n => n.type === "TEXT" && n.name === ISSUE_ID_NAME);
        if (issueIDTxt) {
            yield figma.loadFontAsync(issueIDTxt.fontName);
            issueIDTxt.characters = getIssueId(ticketData);
        }
        else {
            figma.notify("Could not find text element named '" + ISSUE_ID_NAME + "'.");
        }
        return ticketInstance;
    });
}
/**
 * Creates a new component that represents a ticket status
 * @param statusColor RGB value for status color
 * @param statusName Name of status
 * @returns A component that represent a ticket
 */
function createTicketVariant(statusColor, statusName) {
    return __awaiter(this, void 0, void 0, function* () {
        // Create the main frame
        var ticketVariant = figma.createComponent();
        let padding = 24;
        ticketVariant.name = statusName;
        ticketVariant.layoutMode = "VERTICAL";
        ticketVariant.resize(600, 200);
        ticketVariant.counterAxisSizingMode = "FIXED";
        ticketVariant.primaryAxisSizingMode = "AUTO";
        ticketVariant.paddingTop = padding;
        ticketVariant.paddingRight = padding;
        ticketVariant.paddingBottom = padding;
        ticketVariant.paddingLeft = padding;
        ticketVariant.itemSpacing = 16;
        ticketVariant.cornerRadius = 4;
        ticketVariant.fills = [{ type: 'SOLID', color: statusColor }];
        // Create the header frame
        var headerFrame = figma.createFrame();
        headerFrame.name = "Container";
        headerFrame.layoutMode = "HORIZONTAL";
        headerFrame.counterAxisSizingMode = "AUTO";
        headerFrame.layoutAlign = "STRETCH";
        headerFrame.itemSpacing = 40;
        headerFrame.fills = [];
        // Create the details frame
        var detailsFrame = figma.createFrame();
        detailsFrame.name = "Container";
        detailsFrame.layoutMode = "HORIZONTAL";
        detailsFrame.counterAxisSizingMode = "AUTO";
        detailsFrame.layoutAlign = "STRETCH";
        detailsFrame.itemSpacing = 32;
        detailsFrame.fills = [];
        // Create the description frame
        var descriptionFrame = figma.createFrame();
        descriptionFrame.name = "Container";
        descriptionFrame.layoutMode = "HORIZONTAL";
        descriptionFrame.counterAxisSizingMode = "AUTO";
        descriptionFrame.layoutAlign = "STRETCH";
        descriptionFrame.itemSpacing = 32;
        descriptionFrame.cornerRadius = 8;
        descriptionFrame.verticalPadding = 16;
        descriptionFrame.horizontalPadding = 16;
        descriptionFrame.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
        loadFonts().then(() => {
            // Add the ticket text fields
            const titleTxt = figma.createText();
            titleTxt.fontName = FONT_REG;
            titleTxt.fontSize = 32;
            titleTxt.textDecoration = "UNDERLINE";
            titleTxt.autoRename = false;
            titleTxt.characters = "Ticket title";
            titleTxt.name = ISSUE_TITLE_NAME;
            const issueIdTxt = figma.createText();
            issueIdTxt.fontName = FONT_MED;
            issueIdTxt.fontSize = 32;
            issueIdTxt.autoRename = false;
            issueIdTxt.characters = "ID-1";
            issueIdTxt.name = ISSUE_ID_NAME;
            const changeDateTxt = figma.createText();
            changeDateTxt.fontName = FONT_REG;
            changeDateTxt.fontSize = 24;
            changeDateTxt.autoRename = false;
            changeDateTxt.characters = "MM DD YYYY";
            changeDateTxt.name = ISSUE_CHANGE_DATE_NAME;
            const assigneeTxt = figma.createText();
            assigneeTxt.fontName = FONT_REG;
            assigneeTxt.fontSize = 24;
            assigneeTxt.autoRename = false;
            assigneeTxt.characters = "Name of assignee";
            assigneeTxt.name = ASSIGNEE_NAME;
            const descriptionTxt = figma.createText();
            descriptionTxt.fontName = FONT_REG;
            descriptionTxt.fontSize = 24;
            descriptionTxt.autoRename = false;
            descriptionTxt.characters = "Description";
            descriptionTxt.name = DESCRIPTION_NAME;
            descriptionTxt.layoutGrow = 1;
            ticketVariant.appendChild(headerFrame);
            ticketVariant.appendChild(detailsFrame);
            ticketVariant.appendChild(descriptionFrame);
            headerFrame.appendChild(issueIdTxt);
            headerFrame.appendChild(titleTxt);
            detailsFrame.appendChild(assigneeTxt);
            detailsFrame.appendChild(changeDateTxt);
            descriptionFrame.appendChild(descriptionTxt);
            titleTxt.layoutGrow = 1;
            assigneeTxt.layoutGrow = 1;
        }).catch(() => {
            figma.notify("Font '" + FONT_REG.family + "' could not be loaded. Please install the font.");
        });
        // Fixes a weird bug in which the 'stretch' doesnt work properly
        headerFrame.primaryAxisSizingMode = "FIXED";
        headerFrame.layoutAlign = "STRETCH";
        detailsFrame.primaryAxisSizingMode = "FIXED";
        detailsFrame.layoutAlign = "STRETCH";
        descriptionFrame.primaryAxisSizingMode = "FIXED";
        descriptionFrame.layoutAlign = "STRETCH";
        return ticketVariant;
    });
}
/**
 * Creates the main component for the tickets
 * @returns The main component
 */
function createTicketComponentSet() {
    return __awaiter(this, void 0, void 0, function* () {
        let ticketComponent;
        // Create variants (one for each status)
        let varDefault = yield createTicketVariant(VARIANT_COLOR_DEFAULT, COMPONENT_SET_PROPERTY_NAME + VARIANT_NAME_DEFAULT);
        let var1 = yield createTicketVariant(VARIANT_COLOR_1, COMPONENT_SET_PROPERTY_NAME + VARIANT_NAME_1);
        let var2 = yield createTicketVariant(VARIANT_COLOR_2, COMPONENT_SET_PROPERTY_NAME + VARIANT_NAME_2);
        let var3 = yield createTicketVariant(VARIANT_COLOR_3, COMPONENT_SET_PROPERTY_NAME + VARIANT_NAME_3);
        let var5 = yield createTicketVariant(VARIANT_COLOR_DONE, COMPONENT_SET_PROPERTY_NAME + VARIANT_NAME_DONE);
        let varError = yield createTicketVariant(VARIANT_COLOR_ERROR, COMPONENT_SET_PROPERTY_NAME + VARIANT_NAME_ERROR);
        const variants = [varDefault, var1, var2, var3, var5, varError];
        // Create a component out of all these variants
        ticketComponent = figma.combineAsVariants(variants, figma.currentPage);
        let padding = 16;
        ticketComponent.name = COMPONENT_SET_NAME;
        ticketComponent.layoutMode = "VERTICAL";
        ticketComponent.counterAxisSizingMode = "AUTO";
        ticketComponent.primaryAxisSizingMode = "AUTO";
        ticketComponent.paddingTop = padding;
        ticketComponent.paddingRight = padding;
        ticketComponent.paddingBottom = padding;
        ticketComponent.paddingLeft = padding;
        ticketComponent.itemSpacing = 24;
        ticketComponent.cornerRadius = 4;
        // Save component ID for later reference
        DOCUMENT_NODE.setPluginData('ticketComponentID', ticketComponent.id);
        ticketComponent.setRelaunchData({ set_library_component: 'Publish the component in a library and then click this button.' });
        // Make sure the component is visible where we're currently looking
        ticketComponent.x = figma.viewport.center.x - (ticketComponent.width / 2);
        ticketComponent.y = figma.viewport.center.y - (ticketComponent.height / 2);
        return ticketComponent;
    });
}
/**
 * Creates a new main ticket component or gets the reference to the existing one in the following order:
 * 1. Looks for library component based on public key
 * 2. Looks for library component based on private key
 * 3. Looks for local component based on public key
 * 4. Looks for local component based on component name
 * 5. Creates a new component
 */
function referenceTicketComponentSet() {
    return __awaiter(this, void 0, void 0, function* () {
        // Check if the ticket component is already saved in the variable
        if (!ticketComponent) {
            //Try to get library component...
            //...from component key saved in this project
            var publicTicketComponentKey = DOCUMENT_NODE.getPluginData(LIBRARY_COMPONENT_KEY);
            let libraryComponent;
            if (publicTicketComponentKey && (libraryComponent = yield importLibraryComponent(publicTicketComponentKey))) {
                console.log("PUBLIC", publicTicketComponentKey);
                ticketComponent = libraryComponent;
            }
            else {
                console.log("PUBLIC lib comp", libraryComponent);
                //...or from component key saved with the user
                var privateTicketComponentKey = yield figma.clientStorage.getAsync(LIBRARY_COMPONENT_KEY);
                if (privateTicketComponentKey && (libraryComponent = yield importLibraryComponent(privateTicketComponentKey))) {
                    console.log("PRIVATE", privateTicketComponentKey);
                    DOCUMENT_NODE.setPluginData(LIBRARY_COMPONENT_KEY, privateTicketComponentKey); // Safe key publicly
                    ticketComponent = libraryComponent;
                }
                else {
                    // If there is no library component, try the get the ticket component by its ID
                    var ticketComponentId = DOCUMENT_NODE.getPluginData('ticketComponentID');
                    let node;
                    if (ticketComponentId && (node = figma.getNodeById(ticketComponentId))) {
                        // If there is an ID saved, access the ticket component
                        console.log("LOCAL", ticketComponentId);
                        ticketComponent = node;
                    }
                    else {
                        // If there is a component somewhere with the right name
                        let componentSets = figma.root.findAllWithCriteria({
                            types: ['COMPONENT_SET']
                        });
                        componentSets = componentSets.filter(node => node.name === COMPONENT_SET_NAME);
                        if (componentSets[0]) {
                            ticketComponent = componentSets[0];
                            DOCUMENT_NODE.setPluginData('ticketComponentID', ticketComponent.id);
                        }
                        else {
                            // If there is no component, create a new component
                            ticketComponent = yield createTicketComponentSet();
                        }
                    }
                }
            }
        }
    });
}
function importLibraryComponent(key) {
    return __awaiter(this, void 0, void 0, function* () {
        var libraryComponent;
        yield figma.importComponentSetByKeyAsync(key)
            .then((result) => {
            libraryComponent = result;
        })
            .catch(() => {
            libraryComponent = false;
        });
        console.log("LIB FUNC", libraryComponent);
        return libraryComponent;
    });
}
// Checks if fetching data was successful at all 
function checkFetchSuccess(data) {
    var isSuccess = false;
    // Can this even happen?
    if (!data) {
        figma.notify("Something went wrong.");
        throw new Error("Something went wrong." + data);
    }
    // No connection to Firebase
    else if (data.type == "Error") {
        figma.notify("Could not get data. There seems to be no connection to the server.");
        throw new Error(data.message);
    }
    // Wrong e-mail
    else if (data[0].message == "Client must be authenticated to access this resource.") {
        figma.notify("You have entered an invalid e-mail. See 'Authorization' settings.");
        throw new Error(data.message);
    }
    // Wrong company name
    else if (data[0].errorMessage == "Site temporarily unavailable") {
        figma.notify("Company domain name does not exist. See 'Project Settings'.");
        throw new Error(data[0].errorMessage);
    }
    // Wrong password
    else if (data[0][0]) {
        figma.notify("Could not access data. Your Jira API Token seems to be invalid. See 'Authorization' settings.");
        throw new Error(data[0][0]);
    }
    // Else, it was probably successful
    else {
        isSuccess = true;
    }
    return isSuccess;
}
// Checks if per received ticket data if the fetching was successful
function checkTicketDataReponse(ticketData, issueId) {
    var checkedData;
    // If the JSON has a key field, the data is valid
    if (ticketData && ticketData.key) {
        checkedData = ticketData;
    }
    // ID does not exist
    else if (ticketData.errorMessages == "The issue no longer exists.") {
        checkedData = createErrorDataJSON(`Error: Ticket ID '${issueId}' does not exist.`, issueId);
        // figma.notify(`Ticket ID '${issueId}' does not exist.`)
    }
    // ID has invalid format
    else if (ticketData.errorMessages == "Issue key is in an invalid format.") {
        checkedData = createErrorDataJSON(`Error: Ticket ID '${issueId}' is in an invalid format.`, issueId);
        // figma.notify(`Ticket ID '${issueId}' is in an invalid format.`)
    }
    // Other
    else {
        checkedData = createErrorDataJSON("Error: An unexpected error occured.", issueId);
        figma.notify("Unexpected error.");
        console.error("Unexpected error.", ticketData);
        // throw new Error(ticketData.message)
    }
    return checkedData;
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
    };
    return errorData;
}
// Function for loading all the fonts for the main component
function loadFonts() {
    return __awaiter(this, void 0, void 0, function* () {
        yield figma.loadFontAsync(FONT_REG);
        yield figma.loadFontAsync(FONT_MED);
        yield figma.loadFontAsync(FONT_BOLD);
    });
}
function loadSingleFont(fontName) {
    return __awaiter(this, void 0, void 0, function* () {
        yield figma.loadFontAsync(fontName);
    });
}
// Formats a hex value to RGB
function hexToRgb(hex) {
    var bigint = parseInt(hex, 16);
    var r = (bigint >> 16) & 255;
    var g = (bigint >> 8) & 255;
    var b = bigint & 255;
    return { r: r / 255, g: g / 255, b: b / 255 };
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/code.ts"]();
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUNoRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQ0FBMEMseUZBQXlGO0FBQ25JO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1HQUFtRztBQUNuRztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5QkFBeUI7QUFDekI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrREFBK0QsUUFBUTtBQUN2RSxzQ0FBc0MsUUFBUTtBQUM5QztBQUNBO0FBQ0E7QUFDQSwrREFBK0QsUUFBUTtBQUN2RSxzQ0FBc0MsUUFBUTtBQUM5QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7Ozs7Ozs7O1VFcHlCQTtVQUNBO1VBQ0E7VUFDQTtVQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vd2VicGFjay1yZWFjdC8uL3NyYy9jb2RlLnRzIiwid2VicGFjazovL3dlYnBhY2stcmVhY3Qvd2VicGFjay9iZWZvcmUtc3RhcnR1cCIsIndlYnBhY2s6Ly93ZWJwYWNrLXJlYWN0L3dlYnBhY2svc3RhcnR1cCIsIndlYnBhY2s6Ly93ZWJwYWNrLXJlYWN0L3dlYnBhY2svYWZ0ZXItc3RhcnR1cCJdLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcbiAgICBmdW5jdGlvbiBhZG9wdCh2YWx1ZSkgeyByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBQID8gdmFsdWUgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHZhbHVlKTsgfSk7IH1cbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBhZG9wdChyZXN1bHQudmFsdWUpLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xuICAgIH0pO1xufTtcbmNvbnN0IERPQ1VNRU5UX05PREUgPSBmaWdtYS5jdXJyZW50UGFnZS5wYXJlbnQ7XG4vLyBTZXQgdGhlIHJlbGF1bmNoIGJ1dHRvbiBmb3IgdGhlIHdob2xlIGRvY3VtZW50XG5ET0NVTUVOVF9OT0RFLnNldFJlbGF1bmNoRGF0YSh7IHVwZGF0ZV9wYWdlOiAnJywgdXBkYXRlX2FsbDogJycgfSk7XG5jb25zdCBXSU5ET1dfV0lEVEggPSAyNTA7XG5jb25zdCBXSU5ET1dfSEVJR0hUX0JJRyA9IDY1MDtcbmNvbnN0IFdJTkRPV19IRUlHSFRfU01BTEwgPSAzMDg7XG5jb25zdCBDT01QQU5ZX05BTUVfS0VZID0gXCJDT01QQU5ZX05BTUVcIjtcbmNvbnN0IFBST0pFQ1RfSURfS0VZID0gXCJQUk9KRUNUX0lEXCI7XG5jb25zdCBVU0VSTkFNRV9LRVkgPSBcIlVTRVJOQU1FXCI7XG5jb25zdCBQQVNTV09SRF9LRVkgPSBcIlBBU1NXT1JEXCI7XG5jb25zdCBJU1NVRV9JRF9LRVkgPSBcIklTU1VFX0lEXCI7XG5jb25zdCBDUkVBVEVfTElOS19LRVkgPSBcIkNSRUFURV9MSU5LXCI7XG5jb25zdCBMSUJSQVJZX0NPTVBPTkVOVF9LRVkgPSBcIkxJQlJBUllfQ09NUE9ORU5UXCI7XG52YXIgY29tcGFueV9uYW1lOyAvLyBTYXZlZCBwdWJsaWNseSB3aXRoIHNldFBsdWdpbkRhdGFcbnZhciBwcm9qZWN0X2lkOyAvLyBTYXZlZCBwdWJsaWNseSB3aXRoIHNldFBsdWdpbkRhdGFcbnZhciB1c2VybmFtZTtcbnZhciBwYXNzd29yZDtcbnZhciBpc3N1ZUlkO1xudmFyIGNyZWF0ZUxpbms7XG5jb25zdCBGT05UX1JFRyA9IHsgZmFtaWx5OiBcIldvcmsgU2Fuc1wiLCBzdHlsZTogXCJSZWd1bGFyXCIgfTtcbmNvbnN0IEZPTlRfTUVEID0geyBmYW1pbHk6IFwiV29yayBTYW5zXCIsIHN0eWxlOiBcIk1lZGl1bVwiIH07XG5jb25zdCBGT05UX0JPTEQgPSB7IGZhbWlseTogXCJXb3JrIFNhbnNcIiwgc3R5bGU6IFwiQm9sZFwiIH07XG5mdW5jdGlvbiBnZXRTdGF0dXMoZGF0YSkgeyByZXR1cm4gZGF0YS5maWVsZHMuc3RhdHVzLm5hbWU7IH1cbmZ1bmN0aW9uIGdldFRpdGxlKGRhdGEpIHsgcmV0dXJuIGRhdGEuZmllbGRzLnN1bW1hcnk7IH1cbmZ1bmN0aW9uIGdldElzc3VlSWQoZGF0YSkgeyByZXR1cm4gZGF0YS5rZXk7IH1cbmZ1bmN0aW9uIGdldENoYW5nZURhdGUoZGF0YSkgeyByZXR1cm4gZGF0YS5maWVsZHMuc3RhdHVzY2F0ZWdvcnljaGFuZ2VkYXRlOyB9XG5mdW5jdGlvbiBnZXRBc3NpZ25lZShkYXRhKSB7IHJldHVybiBkYXRhLmZpZWxkcy5hc3NpZ25lZS5kaXNwbGF5TmFtZTsgfVxuZnVuY3Rpb24gZ2V0RGVzY3JpcHRpb24oZGF0YSkgeyByZXR1cm4gZGF0YS5maWVsZHMuZGVzY3JpcHRpb247IH1cbnZhciBuZXh0VGlja2V0T2Zmc2V0ID0gMDtcbi8vIHRpY2tldGRhdGEuZmllbGRzLmFzc2lnbmVlLmF2YXRhclVybHNcbi8vIHRpY2tldGRhdGEuZmllbGRzLnN0YXR1cy5uYW1lXG4vLyB0aWNrZXRkYXRhLmZpZWxkcy5zdGF0dXMuc3RhdHVzQ2F0ZWdvcnkubmFtZVxuY29uc3QgSVNTVUVfSURfTkFNRSA9IFwiVGlja2V0IElEXCI7XG5jb25zdCBJU1NVRV9USVRMRV9OQU1FID0gXCJUaWNrZXQgVGl0bGVcIjtcbmNvbnN0IElTU1VFX0NIQU5HRV9EQVRFX05BTUUgPSBcIkRhdGUgb2YgU3RhdHVzIENoYW5nZVwiO1xuY29uc3QgQVNTSUdORUVfTkFNRSA9IFwiQXNzaWduZWVcIjtcbmNvbnN0IERFU0NSSVBUSU9OX05BTUUgPSBcIkRlc2NyaXB0aW9uXCI7XG5jb25zdCBDT01QT05FTlRfU0VUX05BTUUgPSBcIkppcmEgVGlja2V0IEhlYWRlclwiO1xuY29uc3QgQ09NUE9ORU5UX1NFVF9QUk9QRVJUWV9OQU1FID0gXCJTdGF0dXM9XCI7XG5jb25zdCBWQVJJQU5UX05BTUVfMSA9IFwiVG8gRG9cIjtcbmNvbnN0IFZBUklBTlRfQ09MT1JfMSA9IGhleFRvUmdiKCdFRUVFRUUnKTtcbmNvbnN0IFZBUklBTlRfTkFNRV8yID0gXCJJbiBQcm9ncmVzc1wiO1xuY29uc3QgVkFSSUFOVF9DT0xPUl8yID0gaGV4VG9SZ2IoJ0ZGRURDMCcpO1xuY29uc3QgVkFSSUFOVF9OQU1FXzMgPSBcIkluIFJldmlld1wiO1xuY29uc3QgVkFSSUFOVF9DT0xPUl8zID0gaGV4VG9SZ2IoJ0Q3RTBGRicpO1xuY29uc3QgVkFSSUFOVF9OQU1FX0RPTkUgPSBcIkRvbmVcIjtcbmNvbnN0IFZBUklBTlRfQ09MT1JfRE9ORSA9IGhleFRvUmdiKCdDMEU5QkYgJyk7XG5jb25zdCBWQVJJQU5UX05BTUVfREVGQVVMVCA9IFwiRGVmYXVsdFwiO1xuY29uc3QgVkFSSUFOVF9DT0xPUl9ERUZBVUxUID0gaGV4VG9SZ2IoJ0I5QjlCOScpO1xuY29uc3QgVkFSSUFOVF9OQU1FX0VSUk9SID0gXCJFcnJvclwiO1xuY29uc3QgVkFSSUFOVF9DT0xPUl9FUlJPUiA9IGhleFRvUmdiKCdGRkQ5RDknKTtcbnZhciB0aWNrZXRDb21wb25lbnQ7XG4vLyBEb24ndCBzaG93IFVJIGlmIHJlbGF1bmNoIGJ1dHRvbnMgYXJlIHJ1blxuaWYgKGZpZ21hLmNvbW1hbmQgPT09ICd1cGRhdGVfc2VsZWN0aW9uJykge1xuICAgIHVwZGF0ZVdpdGhvdXRVSShcInNlbGVjdGlvblwiKTtcbn1cbmVsc2UgaWYgKGZpZ21hLmNvbW1hbmQgPT09ICd1cGRhdGVfYWxsJykge1xuICAgIHVwZGF0ZVdpdGhvdXRVSShcImFsbFwiKTtcbn1cbmVsc2UgaWYgKGZpZ21hLmNvbW1hbmQgPT09ICd1cGRhdGVfcGFnZScpIHtcbiAgICB1cGRhdGVXaXRob3V0VUkoXCJwYWdlXCIpO1xufVxuZWxzZSBpZiAoZmlnbWEuY29tbWFuZCA9PT0gJ3NldF9saWJyYXJ5X2NvbXBvbmVudCcpIHtcbiAgICBsZXQgc2VsZWN0aW9uID0gZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uWzBdO1xuICAgIHNhdmVMaWJyYXJ5Q29tcG9uZW50KHNlbGVjdGlvbik7XG59XG5lbHNlIHtcbiAgICAvLyBPdGhlcndpc2Ugc2hvdyBVSVxuICAgIGZpZ21hLnNob3dVSShfX2h0bWxfXywgeyB3aWR0aDogV0lORE9XX1dJRFRILCBoZWlnaHQ6IFdJTkRPV19IRUlHSFRfU01BTEwgfSk7XG4gICAgc2VuZERhdGEoKTtcbn1cbi8vIE1ha2Ugc3VyZSB0aGUgbWFpbiBjb21wb25lbnQgaXMgcmVmZXJlbmNlZFxucmVmZXJlbmNlVGlja2V0Q29tcG9uZW50U2V0KCk7XG4vLyBTdGFydCBwbHVnaW4gd2l0aG91dCB2aXNpYmxlIFVJIGFuZCB1cGRhdGUgdGlja2V0c1xuZnVuY3Rpb24gdXBkYXRlV2l0aG91dFVJKHR5cGUpIHtcbiAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICBmaWdtYS5zaG93VUkoX19odG1sX18sIHsgdmlzaWJsZTogZmFsc2UgfSk7XG4gICAgICAgIHlpZWxkIHNlbmREYXRhKCk7XG4gICAgICAgIHZhciBoYXNGYWlsZWQgPSByZXF1ZXN0VXBkYXRlRm9yVGlja2V0cyh0eXBlKTtcbiAgICAgICAgaWYgKGhhc0ZhaWxlZCAmJiAodHlwZSA9PT0gXCJhbGxcIiB8fCB0eXBlID09PSBcInBhZ2VcIiB8fCB0eXBlID09PSBcInNlbGVjdGlvblwiKSkge1xuICAgICAgICAgICAgZmlnbWEuY2xvc2VQbHVnaW4oKTtcbiAgICAgICAgfVxuICAgIH0pO1xufVxuLy8gU2VuZCB0aGUgc3RvcmVkIGF1dGhvcml6YXRpb24gZGF0YSB0byB0aGUgVUlcbmZ1bmN0aW9uIHNlbmREYXRhKCkge1xuICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgIGNvbXBhbnlfbmFtZSA9IHlpZWxkIGdldEF1dGhvcml6YXRpb25JbmZvKENPTVBBTllfTkFNRV9LRVksIHRydWUpO1xuICAgICAgICBwcm9qZWN0X2lkID0geWllbGQgZ2V0QXV0aG9yaXphdGlvbkluZm8oUFJPSkVDVF9JRF9LRVksIHRydWUpO1xuICAgICAgICB1c2VybmFtZSA9IHlpZWxkIGdldEF1dGhvcml6YXRpb25JbmZvKFVTRVJOQU1FX0tFWSwgZmFsc2UpO1xuICAgICAgICBwYXNzd29yZCA9IHlpZWxkIGdldEF1dGhvcml6YXRpb25JbmZvKFBBU1NXT1JEX0tFWSwgZmFsc2UpO1xuICAgICAgICBpc3N1ZUlkID0geWllbGQgZ2V0QXV0aG9yaXphdGlvbkluZm8oSVNTVUVfSURfS0VZLCBmYWxzZSk7XG4gICAgICAgIGNyZWF0ZUxpbmsgPSB5aWVsZCBnZXRBdXRob3JpemF0aW9uSW5mbyhDUkVBVEVfTElOS19LRVksIGZhbHNlKTtcbiAgICAgICAgaWYgKGNyZWF0ZUxpbmsgPT09IFwiXCIpXG4gICAgICAgICAgICBjcmVhdGVMaW5rID0gdHJ1ZTtcbiAgICAgICAgZmlnbWEudWkucG9zdE1lc3NhZ2UoeyBjb21wYW55X25hbWU6IGNvbXBhbnlfbmFtZSwgcHJvamVjdF9pZDogcHJvamVjdF9pZCwgdXNlcm5hbWU6IHVzZXJuYW1lLCBwYXNzd29yZDogcGFzc3dvcmQsIGlzc3VlSWQ6IGlzc3VlSWQsIGNyZWF0ZUxpbms6IGNyZWF0ZUxpbmssIHR5cGU6ICdzZXRBdXRob3JpemF0aW9uVmFyaWFibGVzJyB9KTtcbiAgICB9KTtcbn1cbi8vIEFsbCB0aGUgZnVuY3Rpb25zIHRoYXQgY2FuIGJlIHN0YXJ0ZWQgZnJvbSB0aGUgVUlcbmZpZ21hLnVpLm9ubWVzc2FnZSA9IChtc2cpID0+IF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAvLyBDYWxsZWQgdG8gY3JlYXRlIGEgbmV3IG1haW4gY29tcG9uZW50IGFuZCBzYXZlIGl0cyBJRFxuICAgIGlmIChtc2cudHlwZSA9PT0gJ2NyZWF0ZS1jb21wb25lbnQnKSB7XG4gICAgICAgIHRpY2tldENvbXBvbmVudCA9IHlpZWxkIGNyZWF0ZVRpY2tldENvbXBvbmVudFNldCgpO1xuICAgICAgICBET0NVTUVOVF9OT0RFLnNldFBsdWdpbkRhdGEoJ3RpY2tldENvbXBvbmVudElEJywgdGlja2V0Q29tcG9uZW50LmlkKTtcbiAgICB9XG4gICAgLy8gQ2FsbGVkIHRvIGNyZWF0ZSBhIG5ldyBpbnN0YW5jZSBvZiBhIGNvbXBvbmVudCAoYmFzZWQgb24gdGhlIGlzc3VlSWQgZW50ZXJlZCBpbiB0aGUgVUkpXG4gICAgaWYgKG1zZy50eXBlID09PSAnY3JlYXRlLW5ldy10aWNrZXQnICYmIGNoZWNrRmV0Y2hTdWNjZXNzKG1zZy5kYXRhKSkge1xuICAgICAgICBsZXQgdGlja2V0SW5zdGFuY2UgPSB5aWVsZCBjcmVhdGVUaWNrZXRJbnN0YW5jZShtc2cpO1xuICAgICAgICBpZiAobXNnLmNyZWF0ZUxpbmsgJiYgbXNnLmRhdGFbMF0ua2V5ICYmIHByb2plY3RfaWQgIT0gXCJcIikge1xuICAgICAgICAgICAgbGV0IHByb2plY3ROYW1lID0gZW5jb2RlVVJJQ29tcG9uZW50KGZpZ21hLnJvb3QubmFtZSk7XG4gICAgICAgICAgICBsZXQgbm9kZUlkID0gZW5jb2RlVVJJQ29tcG9uZW50KHRpY2tldEluc3RhbmNlLmlkKTtcbiAgICAgICAgICAgIGxldCBsaW5rID0gYGh0dHBzOi8vd3d3LmZpZ21hLmNvbS9maWxlLyR7cHJvamVjdF9pZH0vJHtwcm9qZWN0TmFtZX0/bm9kZS1pZD0ke25vZGVJZH1gO1xuICAgICAgICAgICAgZmlnbWEudWkucG9zdE1lc3NhZ2UoeyBpc3N1ZUlkOiBtc2cuaXNzdWVJZHNbMF0sIGxpbms6IGxpbmssIHR5cGU6ICdwb3N0LWxpbmstdG8tamlyYS1pc3N1ZScgfSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8gQ2FsbGVkIHRvIGdldCBhbGwgSmlyYSBUaWNrZXIgSGVhZGVyIGluc3RhbmNlcyBhbmQgdXBkYXRlIHRoZW0gb25lIGJ5IG9uZS4gXG4gICAgaWYgKG1zZy50eXBlID09PSAndXBkYXRlLWFsbCcpIHtcbiAgICAgICAgcmVxdWVzdFVwZGF0ZUZvclRpY2tldHMoXCJhbGxcIik7XG4gICAgfVxuICAgIC8vIENhbGxlZCB0byBnZXQgSmlyYSBUaWNrZXIgSGVhZGVyIGluc3RhbmNlcyBvbiB0aGlzIHBhZ2UgYW5kIHVwZGF0ZSB0aGVtIG9uZSBieSBvbmUuIFxuICAgIGlmIChtc2cudHlwZSA9PT0gJ3VwZGF0ZS1wYWdlJykge1xuICAgICAgICByZXF1ZXN0VXBkYXRlRm9yVGlja2V0cyhcInBhZ2VcIik7XG4gICAgfVxuICAgIC8vIENhbGxlZCB0byBnZXQgc2VsZWN0ZWQgSmlyYSBUaWNrZXIgSGVhZGVyIGluc3RhbmNlcyBhbmQgdXBkYXRlIHRoZW0gb25lIGJ5IG9uZS4gXG4gICAgaWYgKG1zZy50eXBlID09PSAndXBkYXRlLXNlbGVjdGVkJykge1xuICAgICAgICByZXF1ZXN0VXBkYXRlRm9yVGlja2V0cyhcInNlbGVjdGlvblwiKTtcbiAgICB9XG4gICAgLy8gU2F2ZSBuZXcgYXV0aG9yaXphdGlvbiBpbmZvXG4gICAgaWYgKG1zZy50eXBlID09PSAnYXV0aG9yaXphdGlvbi1kZXRhaWwtY2hhbmdlZCcpIHtcbiAgICAgICAgc2V0QXV0aG9yaXphdGlvbkluZm8obXNnLmtleSwgbXNnLmRhdGEsIG1zZy5zYXZlX3B1YmxpYyk7XG4gICAgfVxuICAgIC8vIFJlc2l6ZSB0aGUgVUlcbiAgICBpZiAobXNnLnR5cGUgPT09ICdyZXNpemUtdWknKSB7XG4gICAgICAgIG1zZy5iaWdfc2l6ZSA/IGZpZ21hLnVpLnJlc2l6ZShXSU5ET1dfV0lEVEgsIFdJTkRPV19IRUlHSFRfQklHKSA6IGZpZ21hLnVpLnJlc2l6ZShXSU5ET1dfV0lEVEgsIFdJTkRPV19IRUlHSFRfU01BTEwpO1xuICAgIH1cbiAgICAvLyBBbGxvd3MgdGhlIFVJIHRvIGNyZWF0ZSBub3RpZmljYXRpb25zXG4gICAgaWYgKG1zZy50eXBlID09PSAnY3JlYXRlLXZpc3VhbC1iZWxsJykge1xuICAgICAgICBmaWdtYS5ub3RpZnkobXNnLm1lc3NhZ2UpO1xuICAgIH1cbiAgICAvLyBVcGRhdGVzIGluc3RhbmNlcyBiYXNlZCBvbiB0aGUgcmVjZWl2ZWQgdGlja2V0IGRhdGEuXG4gICAgaWYgKG1zZy50eXBlID09PSAndGlja2V0RGF0YVNlbnQnICYmIGNoZWNrRmV0Y2hTdWNjZXNzKG1zZy5kYXRhKSkge1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhcIlRpY2tldCBkYXRhOlwiLCBtc2cuZGF0YSlcbiAgICAgICAgdmFyIG5vZGVJZHMgPSBtc2cubm9kZUlkcztcbiAgICAgICAgdmFyIG5vZGVzID0gbm9kZUlkcy5tYXAoaWQgPT4gZmlnbWEuZ2V0Tm9kZUJ5SWQoaWQpKTtcbiAgICAgICAgeWllbGQgdXBkYXRlVGlja2V0cyhub2RlcywgbXNnKTtcbiAgICB9XG59KTtcbi8vIFNhdmVzIGF1dGhvcml6YXRpb24gZGV0YWlscyBpbiBjbGllbnQgc3RvcmFnZVxuZnVuY3Rpb24gc2V0QXV0aG9yaXphdGlvbkluZm8oa2V5LCB2YWx1ZSwgc2F2ZVB1YmxpYyA9IGZhbHNlKSB7XG4gICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgaWYgKHNhdmVQdWJsaWMpIHtcbiAgICAgICAgICAgIERPQ1VNRU5UX05PREUuc2V0UGx1Z2luRGF0YShrZXksIHZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHlpZWxkIGZpZ21hLmNsaWVudFN0b3JhZ2Uuc2V0QXN5bmMoa2V5LCB2YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gTWFrZSBzdXJlIHRoYXQgdmFyaWFibGUgZ2V0cyB1cGRhdGVkXG4gICAgICAgIGlmIChrZXkgPT09IENPTVBBTllfTkFNRV9LRVkpXG4gICAgICAgICAgICBjb21wYW55X25hbWUgPSB2YWx1ZTtcbiAgICAgICAgZWxzZSBpZiAoa2V5ID09PSBQUk9KRUNUX0lEX0tFWSlcbiAgICAgICAgICAgIHByb2plY3RfaWQgPSB2YWx1ZTtcbiAgICAgICAgZWxzZSBpZiAoa2V5ID09PSBVU0VSTkFNRV9LRVkpXG4gICAgICAgICAgICB1c2VybmFtZSA9IHZhbHVlO1xuICAgICAgICBlbHNlIGlmIChrZXkgPT09IFBBU1NXT1JEX0tFWSlcbiAgICAgICAgICAgIHBhc3N3b3JkID0gdmFsdWU7XG4gICAgICAgIGVsc2UgaWYgKGtleSA9PT0gSVNTVUVfSURfS0VZKVxuICAgICAgICAgICAgaXNzdWVJZCA9IHZhbHVlO1xuICAgICAgICBlbHNlIGlmIChrZXkgPT09IENSRUFURV9MSU5LX0tFWSlcbiAgICAgICAgICAgIGNyZWF0ZUxpbmsgPSB2YWx1ZTtcbiAgICB9KTtcbn1cbi8vIEdldCBhdXRob3JpemF0aW9uIGRldGFpbHMgZnJvbSBjbGllbnQgc3RvcmFnZVxuZnVuY3Rpb24gZ2V0QXV0aG9yaXphdGlvbkluZm8oa2V5LCBzYXZlZFB1YmxpYyA9IGZhbHNlKSB7XG4gICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgdmFyIHZhbHVlU2F2ZWQ7XG4gICAgICAgIGlmIChzYXZlZFB1YmxpYykge1xuICAgICAgICAgICAgdmFsdWVTYXZlZCA9IERPQ1VNRU5UX05PREUuZ2V0UGx1Z2luRGF0YShrZXkpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdmFsdWVTYXZlZCA9IHlpZWxkIGZpZ21hLmNsaWVudFN0b3JhZ2UuZ2V0QXN5bmMoa2V5KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXZhbHVlU2F2ZWQgJiYgdmFsdWVTYXZlZCAhPSBmYWxzZSlcbiAgICAgICAgICAgIHZhbHVlU2F2ZWQgPSBcIlwiO1xuICAgICAgICByZXR1cm4gdmFsdWVTYXZlZDtcbiAgICB9KTtcbn1cbmZ1bmN0aW9uIHNhdmVMaWJyYXJ5Q29tcG9uZW50KG5vZGUpIHtcbiAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICBsZXQgY29tcG9uZW50S2V5O1xuICAgICAgICBpZiAobm9kZS50eXBlID09PSAnQ09NUE9ORU5UX1NFVCcpIHtcbiAgICAgICAgICAgIGNvbXBvbmVudEtleSA9IG5vZGUua2V5O1xuICAgICAgICAgICAgeWllbGQgZmlnbWEuY2xpZW50U3RvcmFnZS5zZXRBc3luYyhMSUJSQVJZX0NPTVBPTkVOVF9LRVksIGNvbXBvbmVudEtleSk7XG4gICAgICAgICAgICBmaWdtYS5jbG9zZVBsdWdpbihcIkNvbXBvbmVudCBzdWNjZXNzZnVsbHkgc2F2ZWQgYXMgZ2xvYmFsIEpUUyBjb21wb25lbnQuXCIpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgZmlnbWEuY2xvc2VQbHVnaW4oXCJFbGVtZW50IGlzIG5vdCBhIGNvbXBvbmVudCBzZXQuIENvdWxkIG5vdCBiZSBzYXZlZCBhcyBsaWJyYXJ5IGNvbXBvbmVudC5cIik7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cbi8qKlxuICogR2V0IHN1YnNldCBvZiB0aWNrZXRzIGluIGRvY3VtZW50IGFuZCBzdGFydCB1cGRhdGUgcHJvY2Vzc1xuICogQHBhcmFtIHN1YnNldCBBIHN1YnNldCBvZiB0aWNrZXQgaW5zdGFuY2VzIGluIHRoZSBkb2N1bWVudFxuICogQHJldHVybnMgQm9vbGVhbiBpZiB0aGUgc3Vic2V0IGNvdWxkIGJlIHVwZGF0ZWRcbiAqL1xuZnVuY3Rpb24gcmVxdWVzdFVwZGF0ZUZvclRpY2tldHMoc3Vic2V0KSB7XG4gICAgbGV0IG5vZGVzO1xuICAgIGxldCBpc0ZhaWxlZCA9IGZhbHNlO1xuICAgIC8vIEFsbCBpbiBkb2N1bWVudFxuICAgIGlmIChzdWJzZXQgPT0gXCJhbGxcIikge1xuICAgICAgICBub2RlcyA9IERPQ1VNRU5UX05PREUuZmluZEFsbFdpdGhDcml0ZXJpYSh7XG4gICAgICAgICAgICB0eXBlczogWydJTlNUQU5DRSddXG4gICAgICAgIH0pO1xuICAgICAgICBub2RlcyA9IG5vZGVzLmZpbHRlcihub2RlID0+IG5vZGUubmFtZSA9PT0gQ09NUE9ORU5UX1NFVF9OQU1FKTtcbiAgICAgICAgaWYgKG5vZGVzLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgICAgICBmaWdtYS5ub3RpZnkoYE5vIGluc3RhbmNlcyBuYW1lZCAnJHtDT01QT05FTlRfU0VUX05BTUV9JyBmb3VuZCBpbiBkb2N1bWVudC5gKTtcbiAgICAgICAgICAgIGlzRmFpbGVkID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGdldERhdGFGb3JUaWNrZXRzKG5vZGVzKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvLyBBbGwgb24gcGFnZVxuICAgIGVsc2UgaWYgKHN1YnNldCA9PSBcInBhZ2VcIikge1xuICAgICAgICBub2RlcyA9IGZpZ21hLmN1cnJlbnRQYWdlLmZpbmRBbGxXaXRoQ3JpdGVyaWEoe1xuICAgICAgICAgICAgdHlwZXM6IFsnSU5TVEFOQ0UnXVxuICAgICAgICB9KTtcbiAgICAgICAgbm9kZXMgPSBub2Rlcy5maWx0ZXIobm9kZSA9PiBub2RlLm5hbWUgPT09IENPTVBPTkVOVF9TRVRfTkFNRSk7XG4gICAgICAgIGlmIChub2Rlcy5sZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgZmlnbWEubm90aWZ5KGBObyBpbnN0YW5jZXMgbmFtZWQgJyR7Q09NUE9ORU5UX1NFVF9OQU1FfScgZm91bmQgb24gcGFnZS5gKTtcbiAgICAgICAgICAgIGlzRmFpbGVkID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGdldERhdGFGb3JUaWNrZXRzKG5vZGVzKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvLyBTZWxlY3RlZCBlbGVtZW50c1xuICAgIGVsc2UgaWYgKHN1YnNldCA9PSBcInNlbGVjdGlvblwiKSB7XG4gICAgICAgIG5vZGVzID0gZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uO1xuICAgICAgICBpZiAobm9kZXMubGVuZ3RoID09IDApIHtcbiAgICAgICAgICAgIGZpZ21hLm5vdGlmeShgTm90aGluZyBzZWxlY3RlZC5gKTtcbiAgICAgICAgICAgIGlzRmFpbGVkID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGdldERhdGFGb3JUaWNrZXRzKG5vZGVzKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gaXNGYWlsZWQ7XG59XG4vKipcbiAqIFNlbmRzIGEgcmVxdWVzdCB0byB0aGUgVUkgdG8gZmV0Y2ggZGF0YSBmb3IgYW4gYXJyYXkgb2YgdGlja2V0c1xuICogQHBhcmFtIGluc3RhbmNlc1xuICovXG5mdW5jdGlvbiBnZXREYXRhRm9yVGlja2V0cyhpbnN0YW5jZXMpIHtcbiAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICB2YXIgbm9kZUlkcyA9IFtdO1xuICAgICAgICB2YXIgaXNzdWVJZHMgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpbnN0YW5jZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IG5vZGUgPSBpbnN0YW5jZXNbaV07XG4gICAgICAgICAgICBpZiAobm9kZS50eXBlICE9PSBcIklOU1RBTkNFXCIpIHtcbiAgICAgICAgICAgICAgICBmaWdtYS5ub3RpZnkoXCJUaGUgZWxlbWVudCBuZWVkcyB0byBiZSBhbiBpbnN0YW5jZSBvZiBcIiArIENPTVBPTkVOVF9TRVRfTkFNRSk7XG4gICAgICAgICAgICAgICAgaWYgKGZpZ21hLmNvbW1hbmQpXG4gICAgICAgICAgICAgICAgICAgIGZpZ21hLmNsb3NlUGx1Z2luKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBsZXQgaXNzdWVJZE5vZGUgPSBub2RlLmZpbmRPbmUobiA9PiBuLnR5cGUgPT09IFwiVEVYVFwiICYmIG4ubmFtZSA9PT0gSVNTVUVfSURfTkFNRSk7XG4gICAgICAgICAgICAgICAgaWYgKCFpc3N1ZUlkTm9kZSkge1xuICAgICAgICAgICAgICAgICAgICBmaWdtYS5ub3RpZnkoYEF0IGxlYXN0IG9uZSBpbnN0YW5jZSBpcyBtaXNzaW5nIHRoZSB0ZXh0IGVsZW1lbnQgJyR7SVNTVUVfSURfTkFNRX0nLiBDb3VsZCBub3QgdXBkYXRlLmApO1xuICAgICAgICAgICAgICAgICAgICBpZiAoZmlnbWEuY29tbWFuZClcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpZ21hLmNsb3NlUGx1Z2luKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpc3N1ZUlkcy5wdXNoKGlzc3VlSWROb2RlLmNoYXJhY3RlcnMpO1xuICAgICAgICAgICAgICAgICAgICBub2RlSWRzLnB1c2gobm9kZS5pZCk7XG4gICAgICAgICAgICAgICAgICAgIGZpZ21hLnVpLnBvc3RNZXNzYWdlKHsgbm9kZUlkczogbm9kZUlkcywgaXNzdWVJZHM6IGlzc3VlSWRzLCB0eXBlOiAnZ2V0VGlja2V0RGF0YScgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG59XG4vKipcbiAqIFVwZGF0ZXMgYSBzZXQgb2YgdGlja2V0cyBiYXNlZCBvbiB0aGVpciBzdGF0dXMuXG4gKiBJcyBjYWxsZWQgYWZ0ZXIgdGhlIGRhdGEgaXMgZmV0Y2hlZC5cbiAqIEBwYXJhbSB0aWNrZXRJbnN0YW5jZXMgQSBzZXQgb2YgdGlja2V0IGluc3RhbmNlc1xuICogQHBhcmFtIG1zZyBBIG1lc3NhZ2Ugc2VudCBmcm9tIHRoZSBVSVxuICogQHBhcmFtIGlzQ3JlYXRlTmV3IFdldGhlciB0aGUgZnVuY3Rpb24gY2FsbCBpcyBjb21pbmcgZnJvbSBhbiBhY3R1YWwgdGlja2V0IHVwZGF0ZSBvciBmcm9tIGNyZWF0aW5nIGEgbmV3IHRpY2tldFxuICogQHJldHVybnMgVXBkYXRlZCB0aWNrZXQgaW5zdGFuY2VzXG4gKi9cbmZ1bmN0aW9uIHVwZGF0ZVRpY2tldHModGlja2V0SW5zdGFuY2VzLCBtc2csIGlzQ3JlYXRlTmV3ID0gZmFsc2UpIHtcbiAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICB2YXIgdGlja2V0RGF0YUFycmF5ID0gbXNnLmRhdGE7XG4gICAgICAgIHZhciBpc3N1ZUlkcyA9IG1zZy5pc3N1ZUlkcztcbiAgICAgICAgdmFyIG51bWJlck9mTm9kZXMgPSB0aWNrZXRJbnN0YW5jZXMubGVuZ3RoO1xuICAgICAgICB2YXIgaW52YWxpZElkcyA9IFtdO1xuICAgICAgICB2YXIgbnVtYmVyT2ZNaXNzaW5nVGl0bGVzID0gMDtcbiAgICAgICAgdmFyIG51bWJlck9mTWlzc2luZ0RhdGVzID0gMDtcbiAgICAgICAgdmFyIG51bWJlck9mTWlzc2luZ0Fzc2lnbmVlcyA9IDA7XG4gICAgICAgIHZhciBtaXNzaW5nVmFyaWFudHMgPSBbXTtcbiAgICAgICAgLy8gR28gdGhyb3VnaCBhbGwgbm9kZXMgYW5kIHVwZGF0ZSB0aGVpciBjb250ZW50XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbnVtYmVyT2ZOb2RlczsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgdGlja2V0SW5zdGFuY2UgPSB0aWNrZXRJbnN0YW5jZXNbaV07XG4gICAgICAgICAgICBsZXQgdGlja2V0RGF0YSA9IGNoZWNrVGlja2V0RGF0YVJlcG9uc2UodGlja2V0RGF0YUFycmF5W2ldLCBpc3N1ZUlkc1tpXSk7XG4gICAgICAgICAgICBsZXQgdGlja2V0U3RhdHVzID0gZ2V0U3RhdHVzKHRpY2tldERhdGEpO1xuICAgICAgICAgICAgaWYgKHRpY2tldFN0YXR1cyA9PT0gJ0Vycm9yJylcbiAgICAgICAgICAgICAgICBpbnZhbGlkSWRzLnB1c2goaXNzdWVJZHNbaV0pO1xuICAgICAgICAgICAgLy8gR2V0IHRoZSB2YXJpYW50IGJhc2VkIG9uIHRoZSB0aWNrZXQgc3RhdHVzIGFuZCBzd2FwIGl0IHdpdGggdGhlIGN1cnJlbnRcbiAgICAgICAgICAgIGxldCBuZXdWYXJpYW50ID0gdGlja2V0Q29tcG9uZW50LmZpbmRDaGlsZChuID0+IG4ubmFtZSA9PT0gQ09NUE9ORU5UX1NFVF9QUk9QRVJUWV9OQU1FICsgdGlja2V0U3RhdHVzKTtcbiAgICAgICAgICAgIGlmICghbmV3VmFyaWFudCkgeyAvLyBJZiB0aGUgc3RhdHVzIGRvZXNuJ3QgbWF0Y2ggYW55IG9mIHRoZSB2YXJpYW50cywgdXNlIGRlZmF1bHRcbiAgICAgICAgICAgICAgICBuZXdWYXJpYW50ID0gdGlja2V0Q29tcG9uZW50LmRlZmF1bHRWYXJpYW50O1xuICAgICAgICAgICAgICAgIG1pc3NpbmdWYXJpYW50cy5wdXNoKHRpY2tldFN0YXR1cyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBVcGRhdGUgdGl0bGVcbiAgICAgICAgICAgIGxldCB0aXRsZVR4dCA9IHRpY2tldEluc3RhbmNlLmZpbmRPbmUobiA9PiBuLnR5cGUgPT09IFwiVEVYVFwiICYmIG4ubmFtZSA9PT0gSVNTVUVfVElUTEVfTkFNRSk7XG4gICAgICAgICAgICBpZiAodGl0bGVUeHQpIHtcbiAgICAgICAgICAgICAgICB5aWVsZCBmaWdtYS5sb2FkRm9udEFzeW5jKHRpdGxlVHh0LmZvbnROYW1lKTtcbiAgICAgICAgICAgICAgICB0aXRsZVR4dC5jaGFyYWN0ZXJzID0gZ2V0VGl0bGUodGlja2V0RGF0YSk7XG4gICAgICAgICAgICAgICAgdGl0bGVUeHQuaHlwZXJsaW5rID0geyB0eXBlOiBcIlVSTFwiLCB2YWx1ZTogYGh0dHBzOi8vJHtjb21wYW55X25hbWV9LmF0bGFzc2lhbi5uZXQvYnJvd3NlLyR7dGlja2V0RGF0YS5rZXl9YCB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgbnVtYmVyT2ZNaXNzaW5nVGl0bGVzICs9IDE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBVcGRhdGUgZGF0ZVxuICAgICAgICAgICAgbGV0IGNoYW5nZURhdGVUeHQgPSB0aWNrZXRJbnN0YW5jZS5maW5kT25lKG4gPT4gbi50eXBlID09PSBcIlRFWFRcIiAmJiBuLm5hbWUgPT09IElTU1VFX0NIQU5HRV9EQVRFX05BTUUpO1xuICAgICAgICAgICAgaWYgKGNoYW5nZURhdGVUeHQpIHtcbiAgICAgICAgICAgICAgICB5aWVsZCBmaWdtYS5sb2FkRm9udEFzeW5jKGNoYW5nZURhdGVUeHQuZm9udE5hbWUpO1xuICAgICAgICAgICAgICAgIC8vIEZpbHRlcnMgb3V0IHRoZSBkYXRhIHRvIGEgc2ltcGxldCBmb3JtYXQgKE1tbSBERCBZWVlZKVxuICAgICAgICAgICAgICAgIHZhciBkYXRlID0gbmV3IERhdGUoZ2V0Q2hhbmdlRGF0ZSh0aWNrZXREYXRhKS5yZXBsYWNlKC9bVF0rLiovLCBcIlwiKSk7XG4gICAgICAgICAgICAgICAgY2hhbmdlRGF0ZVR4dC5jaGFyYWN0ZXJzID0gZGF0ZS50b0RhdGVTdHJpbmcoKTtcbiAgICAgICAgICAgICAgICAvLyBjaGFuZ2VEYXRlVHh0LmNoYXJhY3RlcnMgPSBkYXRlLnRvRGF0ZVN0cmluZygpLnJlcGxhY2UoL14oW0EtWmEtel0qKS4vLFwiXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgbnVtYmVyT2ZNaXNzaW5nRGF0ZXMgKz0gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIFVwZGF0ZSBhc3NpZ25lZVxuICAgICAgICAgICAgbGV0IGFzc2lnbmVlVHh0ID0gdGlja2V0SW5zdGFuY2UuZmluZE9uZShuID0+IG4udHlwZSA9PT0gXCJURVhUXCIgJiYgbi5uYW1lID09PSBBU1NJR05FRV9OQU1FKTtcbiAgICAgICAgICAgIGlmIChhc3NpZ25lZVR4dCkge1xuICAgICAgICAgICAgICAgIHlpZWxkIGZpZ21hLmxvYWRGb250QXN5bmMoYXNzaWduZWVUeHQuZm9udE5hbWUpO1xuICAgICAgICAgICAgICAgIGlmICh0aWNrZXREYXRhLmZpZWxkcy5hc3NpZ25lZSkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgYXNzaWduZWUgPSBnZXRBc3NpZ25lZSh0aWNrZXREYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgYXNzaWduZWVUeHQuY2hhcmFjdGVycyA9IGFzc2lnbmVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgYXNzaWduZWVUeHQuY2hhcmFjdGVycyA9IFwiTm90IGFzc2lnbmVkXCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgbnVtYmVyT2ZNaXNzaW5nQXNzaWduZWVzICs9IDE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBVcGRhdGUgZGVzY3JpcHRpb25cbiAgICAgICAgICAgIGxldCBkZXNjcmlwdGlvbk5vZGUgPSB0aWNrZXRJbnN0YW5jZS5maW5kT25lKG4gPT4gbi50eXBlID09PSBcIlRFWFRcIiAmJiBuLm5hbWUgPT09IERFU0NSSVBUSU9OX05BTUUpO1xuICAgICAgICAgICAgbGV0IGRlc2NyaXB0aW9uVGV4dCA9IGdldERlc2NyaXB0aW9uKHRpY2tldERhdGEpO1xuICAgICAgICAgICAgaWYgKGRlc2NyaXB0aW9uTm9kZSAmJiBkZXNjcmlwdGlvblRleHQpIHtcbiAgICAgICAgICAgICAgICBsZXQgZm9udEZhbWlseSA9IFwiSGVsdmV0aWNhXCI7XG4gICAgICAgICAgICAgICAgbGV0IHJlZ0ZvbnQgPSB7IGZhbWlseTogZm9udEZhbWlseSwgc3R5bGU6IFwiUmVndWxhclwiIH07XG4gICAgICAgICAgICAgICAgeWllbGQgZmlnbWEubG9hZEZvbnRBc3luYyhyZWdGb250KTtcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbk5vZGUuZm9udE5hbWUgPSByZWdGb250O1xuICAgICAgICAgICAgICAgIC8vIEJ1bGxldCBwb2ludHNcbiAgICAgICAgICAgICAgICB3aGlsZSAoZGVzY3JpcHRpb25UZXh0Lm1hdGNoKC9cXG4oXFwqKStbXlxcd10vKSkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgY291bnQgPSBkZXNjcmlwdGlvblRleHQubWF0Y2goL1xcbihcXCopK1teXFx3XS8pWzBdLmxlbmd0aDtcbiAgICAgICAgICAgICAgICAgICAgY291bnQgPSAoY291bnQgLSAyKSAqIDI7XG4gICAgICAgICAgICAgICAgICAgIHZhciBzcGFjZXMgPSBuZXcgQXJyYXkoY291bnQpLmpvaW4oXCIgXCIpO1xuICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvblRleHQgPSBkZXNjcmlwdGlvblRleHQucmVwbGFjZSgvXFxuKFxcKikrW15cXHddLywgYFxcbiR7c3BhY2VzfeKAoiBgKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb25Ob2RlLmNoYXJhY3RlcnMgPSBkZXNjcmlwdGlvblRleHQ7XG4gICAgICAgICAgICAgICAgLy8gUGFuZWxcbiAgICAgICAgICAgICAgICBsZXQgcmVnZXhQYW5lbCA9IC9cXHtwYW5lbC4qP30oLis/KVxce3BhbmVsXFx9L3M7XG4gICAgICAgICAgICAgICAgbGV0IGZvbnRQYW5lbCA9IHsgZmFtaWx5OiBmb250RmFtaWx5LCBzdHlsZTogXCJSZWd1bGFyXCIgfTtcbiAgICAgICAgICAgICAgICB5aWVsZCBjaGFuZ2VGb250c0J5UmVnZXgoZGVzY3JpcHRpb25Ob2RlLCByZWdleFBhbmVsLCBmb250UGFuZWwsIDEsIFwiLS0tLS0tLVwiLCBcIi0tLS0tLS1cIik7XG4gICAgICAgICAgICAgICAgLy8gQ29kZVxuICAgICAgICAgICAgICAgIGxldCByZWdleENvZGUgPSAvXFx7bm9mb3JtYXRcXH0oLio/KVxce25vZm9ybWF0XFx9L3M7XG4gICAgICAgICAgICAgICAgbGV0IGZvbnRDb2RlID0geyBmYW1pbHk6IFwiQ291cmllclwiLCBzdHlsZTogXCJSZWd1bGFyXCIgfTtcbiAgICAgICAgICAgICAgICB5aWVsZCBjaGFuZ2VGb250c0J5UmVnZXgoZGVzY3JpcHRpb25Ob2RlLCByZWdleENvZGUsIGZvbnRDb2RlLCAxLCBcIi0tLS0tLS1cXG5cIiwgXCItLS0tLS0tXCIpO1xuICAgICAgICAgICAgICAgIC8vIEJvbGRcbiAgICAgICAgICAgICAgICBsZXQgcmVnZXhCb2xkID0gL1xcKiguKz8pXFwqLztcbiAgICAgICAgICAgICAgICBsZXQgZm9udEJvbGQgPSB7IGZhbWlseTogZm9udEZhbWlseSwgc3R5bGU6IFwiQm9sZFwiIH07XG4gICAgICAgICAgICAgICAgeWllbGQgY2hhbmdlRm9udHNCeVJlZ2V4KGRlc2NyaXB0aW9uTm9kZSwgcmVnZXhCb2xkLCBmb250Qm9sZCwgMSk7XG4gICAgICAgICAgICAgICAgLy8gSXRhbGljXG4gICAgICAgICAgICAgICAgbGV0IHJlZ2V4SXRhbGljID0gL18oW15fXS4qPylfLztcbiAgICAgICAgICAgICAgICBsZXQgZm9udEl0YWxpYyA9IHsgZmFtaWx5OiBmb250RmFtaWx5LCBzdHlsZTogXCJPYmxpcXVlXCIgfTtcbiAgICAgICAgICAgICAgICB5aWVsZCBjaGFuZ2VGb250c0J5UmVnZXgoZGVzY3JpcHRpb25Ob2RlLCByZWdleEl0YWxpYywgZm9udEl0YWxpYywgMSk7XG4gICAgICAgICAgICAgICAgLy8gVGl0bGVcbiAgICAgICAgICAgICAgICBsZXQgcmVnZXhUaXRsZSA9IC9oKFsxLTldKVxcLlxccyguKikvO1xuICAgICAgICAgICAgICAgIGxldCBmb250VGl0bGUgPSB7IGZhbWlseTogZm9udEZhbWlseSwgc3R5bGU6IFwiQm9sZFwiIH07XG4gICAgICAgICAgICAgICAgeWllbGQgY2hhbmdlRm9udHNCeVJlZ2V4KGRlc2NyaXB0aW9uTm9kZSwgcmVnZXhUaXRsZSwgZm9udFRpdGxlLCAyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIEFkZCB0aGUgcmVsYXVuY2ggYnV0dG9uXG4gICAgICAgICAgICB0aWNrZXRJbnN0YW5jZS5zd2FwQ29tcG9uZW50KG5ld1ZhcmlhbnQpO1xuICAgICAgICAgICAgdGlja2V0SW5zdGFuY2Uuc2V0UmVsYXVuY2hEYXRhKHsgdXBkYXRlX3NlbGVjdGlvbjogJycgfSk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gTm90aWZ5IGFib3V0IGVycm9ycyAobWlzc2luZyB0ZXh0IGZpZWxkcylcbiAgICAgICAgaWYgKG1pc3NpbmdWYXJpYW50cy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBtaXNzaW5nVmFyaWFudHMgPSBbLi4ubmV3IFNldChtaXNzaW5nVmFyaWFudHMpXTtcbiAgICAgICAgICAgIGxldCB2YXJpYW50U3RyaW5nID0gbWlzc2luZ1ZhcmlhbnRzLmpvaW4oXCInLCAnXCIpO1xuICAgICAgICAgICAgZmlnbWEubm90aWZ5KGBTdGF0dXMgJyR7dmFyaWFudFN0cmluZ30nIG5vdCBleGlzdGluZy4gWW91IGNhbiBhZGQgaXQgYXMgYSBuZXcgdmFyaWFudCB0byB0aGUgbWFpbiBjb21wb25lbnQuYCwgeyB0aW1lb3V0OiA2MDAwIH0pO1xuICAgICAgICB9XG4gICAgICAgIGlmIChudW1iZXJPZk1pc3NpbmdUaXRsZXMgPiAwKVxuICAgICAgICAgICAgZmlnbWEubm90aWZ5KGAke251bWJlck9mTWlzc2luZ1RpdGxlc30gdGlja2V0cyBhcmUgbWlzc2luZyB0ZXh0IGVsZW1lbnQgJyR7SVNTVUVfVElUTEVfTkFNRX0nLmApO1xuICAgICAgICBpZiAobnVtYmVyT2ZNaXNzaW5nRGF0ZXMgPiAwKVxuICAgICAgICAgICAgZmlnbWEubm90aWZ5KGAke251bWJlck9mTWlzc2luZ0RhdGVzfSB0aWNrZXRzIGFyZSBtaXNzaW5nIHRleHQgZWxlbWVudCAnJHtJU1NVRV9DSEFOR0VfREFURV9OQU1FfScuYCk7XG4gICAgICAgIGlmIChudW1iZXJPZk1pc3NpbmdBc3NpZ25lZXMgPiAwKVxuICAgICAgICAgICAgZmlnbWEubm90aWZ5KGAke251bWJlck9mTWlzc2luZ0Fzc2lnbmVlc30gdGlja2V0cyBhcmUgbWlzc2luZyB0ZXh0IGVsZW1lbnQgJyR7QVNTSUdORUVfTkFNRX0nLmApO1xuICAgICAgICAvLyBTdWNjZXNzIG1lc3NhZ2VcbiAgICAgICAgdmFyIG1lc3NhZ2U7XG4gICAgICAgIHZhciBudW1iZXJPZkludmFsaWRJZHMgPSBpbnZhbGlkSWRzLmxlbmd0aDtcbiAgICAgICAgaWYgKG51bWJlck9mSW52YWxpZElkcyA9PSBudW1iZXJPZk5vZGVzKSB7XG4gICAgICAgICAgICAvLyBBbGwgaW52YWxpZFxuICAgICAgICAgICAgbWVzc2FnZSA9IChudW1iZXJPZk5vZGVzID09IDEpID8gXCJJbnZhbGlkIElELlwiIDogYCR7bnVtYmVyT2ZJbnZhbGlkSWRzfSBvZiAke251bWJlck9mTm9kZXN9IElEcyBhcmUgaW52YWxpZCBvciBkbyBub3QgZXhpc3QuYDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChudW1iZXJPZkludmFsaWRJZHMgPT0gMCkge1xuICAgICAgICAgICAgLy8gQWxsIHZhbGlkXG4gICAgICAgICAgICBtZXNzYWdlID0gKG51bWJlck9mTm9kZXMgPT0gMSkgPyBcIlVwZGF0ZWQuXCIgOiBgJHtudW1iZXJPZk5vZGVzfSBvZiAke251bWJlck9mTm9kZXN9IGhlYWRlcihzKSB1cGRhdGVkIWA7XG4gICAgICAgICAgICBpZiAoaXNDcmVhdGVOZXcpXG4gICAgICAgICAgICAgICAgbWVzc2FnZSA9IFwiXCI7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAvLyBTb21lIHZhbGlkXG4gICAgICAgICAgICBsZXQgZmlyc3RTZW50ZW5jZSA9IGAke251bWJlck9mTm9kZXMgLSBudW1iZXJPZkludmFsaWRJZHN9IG9mICR7bnVtYmVyT2ZOb2Rlc30gc3VjY2Vzc2Z1bGx5IHVwZGF0ZWQuIGA7XG4gICAgICAgICAgICBsZXQgc2Vjb25kU2VudGVuY2UgPSAobnVtYmVyT2ZJbnZhbGlkSWRzID09IDEpID8gXCIxIElEIGlzIGludmFsaWQgb3IgZG9lcyBub3QgZXhpc3QuXCIgOiBgJHtudW1iZXJPZkludmFsaWRJZHN9IElEcyBhcmUgaW52YWxpZCBvciBkbyBub3QgZXhpc3QuYDtcbiAgICAgICAgICAgIG1lc3NhZ2UgPSBmaXJzdFNlbnRlbmNlICsgc2Vjb25kU2VudGVuY2U7XG4gICAgICAgIH1cbiAgICAgICAgLy8gSWYgY2FsbGVkIHZpYSB0aGUgcmVsYXVuY2ggYnV0dG9uLCBjbG9zZSBwbHVnaW4gYWZ0ZXIgdXBkYXRpbmcgdGhlIHRpY2tldHNcbiAgICAgICAgaWYgKGZpZ21hLmNvbW1hbmQgPT09ICd1cGRhdGVfcGFnZScgfHwgZmlnbWEuY29tbWFuZCA9PT0gJ3VwZGF0ZV9hbGwnIHx8IGZpZ21hLmNvbW1hbmQgPT09ICd1cGRhdGVfc2VsZWN0aW9uJykge1xuICAgICAgICAgICAgZmlnbWEuY2xvc2VQbHVnaW4obWVzc2FnZSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBmaWdtYS5ub3RpZnkobWVzc2FnZSwgeyB0aW1lb3V0OiAyMDAwIH0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aWNrZXRJbnN0YW5jZXM7XG4gICAgfSk7XG59XG4vKipcbiAqIENoYW5nZXMgdGhlIGZvbnQgaW4gYSBUZXh0IG5vZGUgYmFzZWQgb24gYW4gaW5kaWNlcyBhcnJheS5cbiAqIEBwYXJhbSBmb250IEZvbnQgTmFtZVxuICogQHBhcmFtIHRleHROb2RlIFRleHQgTm9kZVxuICogQHBhcmFtIGluZGljZXMgSW5kaWNlcyBhcnJheSB3aXRoIGluZGV4IGFuZCBsZW5ndGggb2YgcmFuZ2VcbiAqIEByZXR1cm4gVGV4dCBOb2RlXG4gKi9cbmZ1bmN0aW9uIGNoYW5nZUZvbnRzQnlSZWdleCh0ZXh0Tm9kZSwgcmVnZXgsIGZvbnQsIGNvbnRlbnRHcm91cCwgcHJlVGV4dCA9IFwiXCIsIHBvc3RUZXh0ID0gXCJcIikge1xuICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgIHlpZWxkIGZpZ21hLmxvYWRGb250QXN5bmMoZm9udCk7XG4gICAgICAgIHdoaWxlICh0ZXh0Tm9kZS5jaGFyYWN0ZXJzLm1hdGNoKHJlZ2V4KSkge1xuICAgICAgICAgICAgbGV0IG1hdGNoID0gdGV4dE5vZGUuY2hhcmFjdGVycy5tYXRjaChyZWdleCk7XG4gICAgICAgICAgICBsZXQgbGVuZ3RoID0gbWF0Y2hbMF0ubGVuZ3RoO1xuICAgICAgICAgICAgbGV0IGluZGV4ID0gbWF0Y2guaW5kZXg7XG4gICAgICAgICAgICBsZXQgbmV3VGV4dCA9IG1hdGNoW2NvbnRlbnRHcm91cF07XG4gICAgICAgICAgICBsZXQgd2hvbGVUZXh0ID0gcHJlVGV4dCArIG5ld1RleHQgKyBwb3N0VGV4dDtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiRGVsZXRlIE1hdGNoXCIsIG1hdGNoLCBsZW5ndGgpXG4gICAgICAgICAgICBpZiAobGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIHRleHROb2RlLmRlbGV0ZUNoYXJhY3RlcnMoaW5kZXgsIGluZGV4ICsgbGVuZ3RoKTtcbiAgICAgICAgICAgICAgICB0ZXh0Tm9kZS5pbnNlcnRDaGFyYWN0ZXJzKGluZGV4LCB3aG9sZVRleHQpO1xuICAgICAgICAgICAgICAgIHRleHROb2RlLnNldFJhbmdlRm9udE5hbWUoaW5kZXgsIGluZGV4ICsgd2hvbGVUZXh0Lmxlbmd0aCwgZm9udCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRleHROb2RlO1xuICAgIH0pO1xufVxuLyoqXG4gKiBDcmVhdGUgaW5zdGFuY2VzIG9mIHRoZSBtYWluIHRpY2tldCBjb21wb25lbnQgYW5kIHJlcGxhY2VzIHRoZSBjb250ZW50IHdpdGggZGF0YSBvZiB0aGUgYWN0dWFsIEppcmEgdGlja2V0XG4gKiBAcGFyYW0gbXNnIEpTT04gd2l0aCBpbmZvIHNlbnQgZnJvbSBVSVxuICovXG5mdW5jdGlvbiBjcmVhdGVUaWNrZXRJbnN0YW5jZShtc2cpIHtcbiAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAvLyBDcmVhdGUgYW4gaW5zdGFuY2UgYW5kIHVwZGF0ZSBpdCB0byB0aGUgY29ycmVjdCBzdGF0dXNcbiAgICAgICAgbGV0IHRpY2tldFZhcmlhbnQgPSB0aWNrZXRDb21wb25lbnQuZGVmYXVsdFZhcmlhbnQ7XG4gICAgICAgIGxldCB0aWNrZXRJbnN0YW5jZSA9IHRpY2tldFZhcmlhbnQuY3JlYXRlSW5zdGFuY2UoKTtcbiAgICAgICAgdGlja2V0SW5zdGFuY2UueCA9IChmaWdtYS52aWV3cG9ydC5jZW50ZXIueCAtIHRpY2tldEluc3RhbmNlLndpZHRoIC8gMikgKyBuZXh0VGlja2V0T2Zmc2V0O1xuICAgICAgICB0aWNrZXRJbnN0YW5jZS55ID0gKGZpZ21hLnZpZXdwb3J0LmNlbnRlci55IC0gdGlja2V0SW5zdGFuY2UuaGVpZ2h0IC8gMikgKyBuZXh0VGlja2V0T2Zmc2V0O1xuICAgICAgICBuZXh0VGlja2V0T2Zmc2V0ID0gKG5leHRUaWNrZXRPZmZzZXQgKyAxMCkgJSA3MDtcbiAgICAgICAgZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uID0gW3RpY2tldEluc3RhbmNlXTtcbiAgICAgICAgbGV0IHRpY2tldERhdGEgPSBjaGVja1RpY2tldERhdGFSZXBvbnNlKG1zZy5kYXRhWzBdLCBtc2cuaXNzdWVJZHNbMF0pO1xuICAgICAgICBsZXQgdGlja2V0SW5zdGFuY2VzID0geWllbGQgdXBkYXRlVGlja2V0cyhbdGlja2V0SW5zdGFuY2VdLCBtc2csIHRydWUpO1xuICAgICAgICB0aWNrZXRJbnN0YW5jZSA9IHRpY2tldEluc3RhbmNlc1swXTtcbiAgICAgICAgLy8gQWRkIElEXG4gICAgICAgIGxldCBpc3N1ZUlEVHh0ID0gdGlja2V0SW5zdGFuY2UuZmluZE9uZShuID0+IG4udHlwZSA9PT0gXCJURVhUXCIgJiYgbi5uYW1lID09PSBJU1NVRV9JRF9OQU1FKTtcbiAgICAgICAgaWYgKGlzc3VlSURUeHQpIHtcbiAgICAgICAgICAgIHlpZWxkIGZpZ21hLmxvYWRGb250QXN5bmMoaXNzdWVJRFR4dC5mb250TmFtZSk7XG4gICAgICAgICAgICBpc3N1ZUlEVHh0LmNoYXJhY3RlcnMgPSBnZXRJc3N1ZUlkKHRpY2tldERhdGEpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgZmlnbWEubm90aWZ5KFwiQ291bGQgbm90IGZpbmQgdGV4dCBlbGVtZW50IG5hbWVkICdcIiArIElTU1VFX0lEX05BTUUgKyBcIicuXCIpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aWNrZXRJbnN0YW5jZTtcbiAgICB9KTtcbn1cbi8qKlxuICogQ3JlYXRlcyBhIG5ldyBjb21wb25lbnQgdGhhdCByZXByZXNlbnRzIGEgdGlja2V0IHN0YXR1c1xuICogQHBhcmFtIHN0YXR1c0NvbG9yIFJHQiB2YWx1ZSBmb3Igc3RhdHVzIGNvbG9yXG4gKiBAcGFyYW0gc3RhdHVzTmFtZSBOYW1lIG9mIHN0YXR1c1xuICogQHJldHVybnMgQSBjb21wb25lbnQgdGhhdCByZXByZXNlbnQgYSB0aWNrZXRcbiAqL1xuZnVuY3Rpb24gY3JlYXRlVGlja2V0VmFyaWFudChzdGF0dXNDb2xvciwgc3RhdHVzTmFtZSkge1xuICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgIC8vIENyZWF0ZSB0aGUgbWFpbiBmcmFtZVxuICAgICAgICB2YXIgdGlja2V0VmFyaWFudCA9IGZpZ21hLmNyZWF0ZUNvbXBvbmVudCgpO1xuICAgICAgICBsZXQgcGFkZGluZyA9IDI0O1xuICAgICAgICB0aWNrZXRWYXJpYW50Lm5hbWUgPSBzdGF0dXNOYW1lO1xuICAgICAgICB0aWNrZXRWYXJpYW50LmxheW91dE1vZGUgPSBcIlZFUlRJQ0FMXCI7XG4gICAgICAgIHRpY2tldFZhcmlhbnQucmVzaXplKDYwMCwgMjAwKTtcbiAgICAgICAgdGlja2V0VmFyaWFudC5jb3VudGVyQXhpc1NpemluZ01vZGUgPSBcIkZJWEVEXCI7XG4gICAgICAgIHRpY2tldFZhcmlhbnQucHJpbWFyeUF4aXNTaXppbmdNb2RlID0gXCJBVVRPXCI7XG4gICAgICAgIHRpY2tldFZhcmlhbnQucGFkZGluZ1RvcCA9IHBhZGRpbmc7XG4gICAgICAgIHRpY2tldFZhcmlhbnQucGFkZGluZ1JpZ2h0ID0gcGFkZGluZztcbiAgICAgICAgdGlja2V0VmFyaWFudC5wYWRkaW5nQm90dG9tID0gcGFkZGluZztcbiAgICAgICAgdGlja2V0VmFyaWFudC5wYWRkaW5nTGVmdCA9IHBhZGRpbmc7XG4gICAgICAgIHRpY2tldFZhcmlhbnQuaXRlbVNwYWNpbmcgPSAxNjtcbiAgICAgICAgdGlja2V0VmFyaWFudC5jb3JuZXJSYWRpdXMgPSA0O1xuICAgICAgICB0aWNrZXRWYXJpYW50LmZpbGxzID0gW3sgdHlwZTogJ1NPTElEJywgY29sb3I6IHN0YXR1c0NvbG9yIH1dO1xuICAgICAgICAvLyBDcmVhdGUgdGhlIGhlYWRlciBmcmFtZVxuICAgICAgICB2YXIgaGVhZGVyRnJhbWUgPSBmaWdtYS5jcmVhdGVGcmFtZSgpO1xuICAgICAgICBoZWFkZXJGcmFtZS5uYW1lID0gXCJDb250YWluZXJcIjtcbiAgICAgICAgaGVhZGVyRnJhbWUubGF5b3V0TW9kZSA9IFwiSE9SSVpPTlRBTFwiO1xuICAgICAgICBoZWFkZXJGcmFtZS5jb3VudGVyQXhpc1NpemluZ01vZGUgPSBcIkFVVE9cIjtcbiAgICAgICAgaGVhZGVyRnJhbWUubGF5b3V0QWxpZ24gPSBcIlNUUkVUQ0hcIjtcbiAgICAgICAgaGVhZGVyRnJhbWUuaXRlbVNwYWNpbmcgPSA0MDtcbiAgICAgICAgaGVhZGVyRnJhbWUuZmlsbHMgPSBbXTtcbiAgICAgICAgLy8gQ3JlYXRlIHRoZSBkZXRhaWxzIGZyYW1lXG4gICAgICAgIHZhciBkZXRhaWxzRnJhbWUgPSBmaWdtYS5jcmVhdGVGcmFtZSgpO1xuICAgICAgICBkZXRhaWxzRnJhbWUubmFtZSA9IFwiQ29udGFpbmVyXCI7XG4gICAgICAgIGRldGFpbHNGcmFtZS5sYXlvdXRNb2RlID0gXCJIT1JJWk9OVEFMXCI7XG4gICAgICAgIGRldGFpbHNGcmFtZS5jb3VudGVyQXhpc1NpemluZ01vZGUgPSBcIkFVVE9cIjtcbiAgICAgICAgZGV0YWlsc0ZyYW1lLmxheW91dEFsaWduID0gXCJTVFJFVENIXCI7XG4gICAgICAgIGRldGFpbHNGcmFtZS5pdGVtU3BhY2luZyA9IDMyO1xuICAgICAgICBkZXRhaWxzRnJhbWUuZmlsbHMgPSBbXTtcbiAgICAgICAgLy8gQ3JlYXRlIHRoZSBkZXNjcmlwdGlvbiBmcmFtZVxuICAgICAgICB2YXIgZGVzY3JpcHRpb25GcmFtZSA9IGZpZ21hLmNyZWF0ZUZyYW1lKCk7XG4gICAgICAgIGRlc2NyaXB0aW9uRnJhbWUubmFtZSA9IFwiQ29udGFpbmVyXCI7XG4gICAgICAgIGRlc2NyaXB0aW9uRnJhbWUubGF5b3V0TW9kZSA9IFwiSE9SSVpPTlRBTFwiO1xuICAgICAgICBkZXNjcmlwdGlvbkZyYW1lLmNvdW50ZXJBeGlzU2l6aW5nTW9kZSA9IFwiQVVUT1wiO1xuICAgICAgICBkZXNjcmlwdGlvbkZyYW1lLmxheW91dEFsaWduID0gXCJTVFJFVENIXCI7XG4gICAgICAgIGRlc2NyaXB0aW9uRnJhbWUuaXRlbVNwYWNpbmcgPSAzMjtcbiAgICAgICAgZGVzY3JpcHRpb25GcmFtZS5jb3JuZXJSYWRpdXMgPSA4O1xuICAgICAgICBkZXNjcmlwdGlvbkZyYW1lLnZlcnRpY2FsUGFkZGluZyA9IDE2O1xuICAgICAgICBkZXNjcmlwdGlvbkZyYW1lLmhvcml6b250YWxQYWRkaW5nID0gMTY7XG4gICAgICAgIGRlc2NyaXB0aW9uRnJhbWUuZmlsbHMgPSBbeyB0eXBlOiAnU09MSUQnLCBjb2xvcjogeyByOiAxLCBnOiAxLCBiOiAxIH0gfV07XG4gICAgICAgIGxvYWRGb250cygpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgLy8gQWRkIHRoZSB0aWNrZXQgdGV4dCBmaWVsZHNcbiAgICAgICAgICAgIGNvbnN0IHRpdGxlVHh0ID0gZmlnbWEuY3JlYXRlVGV4dCgpO1xuICAgICAgICAgICAgdGl0bGVUeHQuZm9udE5hbWUgPSBGT05UX1JFRztcbiAgICAgICAgICAgIHRpdGxlVHh0LmZvbnRTaXplID0gMzI7XG4gICAgICAgICAgICB0aXRsZVR4dC50ZXh0RGVjb3JhdGlvbiA9IFwiVU5ERVJMSU5FXCI7XG4gICAgICAgICAgICB0aXRsZVR4dC5hdXRvUmVuYW1lID0gZmFsc2U7XG4gICAgICAgICAgICB0aXRsZVR4dC5jaGFyYWN0ZXJzID0gXCJUaWNrZXQgdGl0bGVcIjtcbiAgICAgICAgICAgIHRpdGxlVHh0Lm5hbWUgPSBJU1NVRV9USVRMRV9OQU1FO1xuICAgICAgICAgICAgY29uc3QgaXNzdWVJZFR4dCA9IGZpZ21hLmNyZWF0ZVRleHQoKTtcbiAgICAgICAgICAgIGlzc3VlSWRUeHQuZm9udE5hbWUgPSBGT05UX01FRDtcbiAgICAgICAgICAgIGlzc3VlSWRUeHQuZm9udFNpemUgPSAzMjtcbiAgICAgICAgICAgIGlzc3VlSWRUeHQuYXV0b1JlbmFtZSA9IGZhbHNlO1xuICAgICAgICAgICAgaXNzdWVJZFR4dC5jaGFyYWN0ZXJzID0gXCJJRC0xXCI7XG4gICAgICAgICAgICBpc3N1ZUlkVHh0Lm5hbWUgPSBJU1NVRV9JRF9OQU1FO1xuICAgICAgICAgICAgY29uc3QgY2hhbmdlRGF0ZVR4dCA9IGZpZ21hLmNyZWF0ZVRleHQoKTtcbiAgICAgICAgICAgIGNoYW5nZURhdGVUeHQuZm9udE5hbWUgPSBGT05UX1JFRztcbiAgICAgICAgICAgIGNoYW5nZURhdGVUeHQuZm9udFNpemUgPSAyNDtcbiAgICAgICAgICAgIGNoYW5nZURhdGVUeHQuYXV0b1JlbmFtZSA9IGZhbHNlO1xuICAgICAgICAgICAgY2hhbmdlRGF0ZVR4dC5jaGFyYWN0ZXJzID0gXCJNTSBERCBZWVlZXCI7XG4gICAgICAgICAgICBjaGFuZ2VEYXRlVHh0Lm5hbWUgPSBJU1NVRV9DSEFOR0VfREFURV9OQU1FO1xuICAgICAgICAgICAgY29uc3QgYXNzaWduZWVUeHQgPSBmaWdtYS5jcmVhdGVUZXh0KCk7XG4gICAgICAgICAgICBhc3NpZ25lZVR4dC5mb250TmFtZSA9IEZPTlRfUkVHO1xuICAgICAgICAgICAgYXNzaWduZWVUeHQuZm9udFNpemUgPSAyNDtcbiAgICAgICAgICAgIGFzc2lnbmVlVHh0LmF1dG9SZW5hbWUgPSBmYWxzZTtcbiAgICAgICAgICAgIGFzc2lnbmVlVHh0LmNoYXJhY3RlcnMgPSBcIk5hbWUgb2YgYXNzaWduZWVcIjtcbiAgICAgICAgICAgIGFzc2lnbmVlVHh0Lm5hbWUgPSBBU1NJR05FRV9OQU1FO1xuICAgICAgICAgICAgY29uc3QgZGVzY3JpcHRpb25UeHQgPSBmaWdtYS5jcmVhdGVUZXh0KCk7XG4gICAgICAgICAgICBkZXNjcmlwdGlvblR4dC5mb250TmFtZSA9IEZPTlRfUkVHO1xuICAgICAgICAgICAgZGVzY3JpcHRpb25UeHQuZm9udFNpemUgPSAyNDtcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uVHh0LmF1dG9SZW5hbWUgPSBmYWxzZTtcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uVHh0LmNoYXJhY3RlcnMgPSBcIkRlc2NyaXB0aW9uXCI7XG4gICAgICAgICAgICBkZXNjcmlwdGlvblR4dC5uYW1lID0gREVTQ1JJUFRJT05fTkFNRTtcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uVHh0LmxheW91dEdyb3cgPSAxO1xuICAgICAgICAgICAgdGlja2V0VmFyaWFudC5hcHBlbmRDaGlsZChoZWFkZXJGcmFtZSk7XG4gICAgICAgICAgICB0aWNrZXRWYXJpYW50LmFwcGVuZENoaWxkKGRldGFpbHNGcmFtZSk7XG4gICAgICAgICAgICB0aWNrZXRWYXJpYW50LmFwcGVuZENoaWxkKGRlc2NyaXB0aW9uRnJhbWUpO1xuICAgICAgICAgICAgaGVhZGVyRnJhbWUuYXBwZW5kQ2hpbGQoaXNzdWVJZFR4dCk7XG4gICAgICAgICAgICBoZWFkZXJGcmFtZS5hcHBlbmRDaGlsZCh0aXRsZVR4dCk7XG4gICAgICAgICAgICBkZXRhaWxzRnJhbWUuYXBwZW5kQ2hpbGQoYXNzaWduZWVUeHQpO1xuICAgICAgICAgICAgZGV0YWlsc0ZyYW1lLmFwcGVuZENoaWxkKGNoYW5nZURhdGVUeHQpO1xuICAgICAgICAgICAgZGVzY3JpcHRpb25GcmFtZS5hcHBlbmRDaGlsZChkZXNjcmlwdGlvblR4dCk7XG4gICAgICAgICAgICB0aXRsZVR4dC5sYXlvdXRHcm93ID0gMTtcbiAgICAgICAgICAgIGFzc2lnbmVlVHh0LmxheW91dEdyb3cgPSAxO1xuICAgICAgICB9KS5jYXRjaCgoKSA9PiB7XG4gICAgICAgICAgICBmaWdtYS5ub3RpZnkoXCJGb250ICdcIiArIEZPTlRfUkVHLmZhbWlseSArIFwiJyBjb3VsZCBub3QgYmUgbG9hZGVkLiBQbGVhc2UgaW5zdGFsbCB0aGUgZm9udC5cIik7XG4gICAgICAgIH0pO1xuICAgICAgICAvLyBGaXhlcyBhIHdlaXJkIGJ1ZyBpbiB3aGljaCB0aGUgJ3N0cmV0Y2gnIGRvZXNudCB3b3JrIHByb3Blcmx5XG4gICAgICAgIGhlYWRlckZyYW1lLnByaW1hcnlBeGlzU2l6aW5nTW9kZSA9IFwiRklYRURcIjtcbiAgICAgICAgaGVhZGVyRnJhbWUubGF5b3V0QWxpZ24gPSBcIlNUUkVUQ0hcIjtcbiAgICAgICAgZGV0YWlsc0ZyYW1lLnByaW1hcnlBeGlzU2l6aW5nTW9kZSA9IFwiRklYRURcIjtcbiAgICAgICAgZGV0YWlsc0ZyYW1lLmxheW91dEFsaWduID0gXCJTVFJFVENIXCI7XG4gICAgICAgIGRlc2NyaXB0aW9uRnJhbWUucHJpbWFyeUF4aXNTaXppbmdNb2RlID0gXCJGSVhFRFwiO1xuICAgICAgICBkZXNjcmlwdGlvbkZyYW1lLmxheW91dEFsaWduID0gXCJTVFJFVENIXCI7XG4gICAgICAgIHJldHVybiB0aWNrZXRWYXJpYW50O1xuICAgIH0pO1xufVxuLyoqXG4gKiBDcmVhdGVzIHRoZSBtYWluIGNvbXBvbmVudCBmb3IgdGhlIHRpY2tldHNcbiAqIEByZXR1cm5zIFRoZSBtYWluIGNvbXBvbmVudFxuICovXG5mdW5jdGlvbiBjcmVhdGVUaWNrZXRDb21wb25lbnRTZXQoKSB7XG4gICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgbGV0IHRpY2tldENvbXBvbmVudDtcbiAgICAgICAgLy8gQ3JlYXRlIHZhcmlhbnRzIChvbmUgZm9yIGVhY2ggc3RhdHVzKVxuICAgICAgICBsZXQgdmFyRGVmYXVsdCA9IHlpZWxkIGNyZWF0ZVRpY2tldFZhcmlhbnQoVkFSSUFOVF9DT0xPUl9ERUZBVUxULCBDT01QT05FTlRfU0VUX1BST1BFUlRZX05BTUUgKyBWQVJJQU5UX05BTUVfREVGQVVMVCk7XG4gICAgICAgIGxldCB2YXIxID0geWllbGQgY3JlYXRlVGlja2V0VmFyaWFudChWQVJJQU5UX0NPTE9SXzEsIENPTVBPTkVOVF9TRVRfUFJPUEVSVFlfTkFNRSArIFZBUklBTlRfTkFNRV8xKTtcbiAgICAgICAgbGV0IHZhcjIgPSB5aWVsZCBjcmVhdGVUaWNrZXRWYXJpYW50KFZBUklBTlRfQ09MT1JfMiwgQ09NUE9ORU5UX1NFVF9QUk9QRVJUWV9OQU1FICsgVkFSSUFOVF9OQU1FXzIpO1xuICAgICAgICBsZXQgdmFyMyA9IHlpZWxkIGNyZWF0ZVRpY2tldFZhcmlhbnQoVkFSSUFOVF9DT0xPUl8zLCBDT01QT05FTlRfU0VUX1BST1BFUlRZX05BTUUgKyBWQVJJQU5UX05BTUVfMyk7XG4gICAgICAgIGxldCB2YXI1ID0geWllbGQgY3JlYXRlVGlja2V0VmFyaWFudChWQVJJQU5UX0NPTE9SX0RPTkUsIENPTVBPTkVOVF9TRVRfUFJPUEVSVFlfTkFNRSArIFZBUklBTlRfTkFNRV9ET05FKTtcbiAgICAgICAgbGV0IHZhckVycm9yID0geWllbGQgY3JlYXRlVGlja2V0VmFyaWFudChWQVJJQU5UX0NPTE9SX0VSUk9SLCBDT01QT05FTlRfU0VUX1BST1BFUlRZX05BTUUgKyBWQVJJQU5UX05BTUVfRVJST1IpO1xuICAgICAgICBjb25zdCB2YXJpYW50cyA9IFt2YXJEZWZhdWx0LCB2YXIxLCB2YXIyLCB2YXIzLCB2YXI1LCB2YXJFcnJvcl07XG4gICAgICAgIC8vIENyZWF0ZSBhIGNvbXBvbmVudCBvdXQgb2YgYWxsIHRoZXNlIHZhcmlhbnRzXG4gICAgICAgIHRpY2tldENvbXBvbmVudCA9IGZpZ21hLmNvbWJpbmVBc1ZhcmlhbnRzKHZhcmlhbnRzLCBmaWdtYS5jdXJyZW50UGFnZSk7XG4gICAgICAgIGxldCBwYWRkaW5nID0gMTY7XG4gICAgICAgIHRpY2tldENvbXBvbmVudC5uYW1lID0gQ09NUE9ORU5UX1NFVF9OQU1FO1xuICAgICAgICB0aWNrZXRDb21wb25lbnQubGF5b3V0TW9kZSA9IFwiVkVSVElDQUxcIjtcbiAgICAgICAgdGlja2V0Q29tcG9uZW50LmNvdW50ZXJBeGlzU2l6aW5nTW9kZSA9IFwiQVVUT1wiO1xuICAgICAgICB0aWNrZXRDb21wb25lbnQucHJpbWFyeUF4aXNTaXppbmdNb2RlID0gXCJBVVRPXCI7XG4gICAgICAgIHRpY2tldENvbXBvbmVudC5wYWRkaW5nVG9wID0gcGFkZGluZztcbiAgICAgICAgdGlja2V0Q29tcG9uZW50LnBhZGRpbmdSaWdodCA9IHBhZGRpbmc7XG4gICAgICAgIHRpY2tldENvbXBvbmVudC5wYWRkaW5nQm90dG9tID0gcGFkZGluZztcbiAgICAgICAgdGlja2V0Q29tcG9uZW50LnBhZGRpbmdMZWZ0ID0gcGFkZGluZztcbiAgICAgICAgdGlja2V0Q29tcG9uZW50Lml0ZW1TcGFjaW5nID0gMjQ7XG4gICAgICAgIHRpY2tldENvbXBvbmVudC5jb3JuZXJSYWRpdXMgPSA0O1xuICAgICAgICAvLyBTYXZlIGNvbXBvbmVudCBJRCBmb3IgbGF0ZXIgcmVmZXJlbmNlXG4gICAgICAgIERPQ1VNRU5UX05PREUuc2V0UGx1Z2luRGF0YSgndGlja2V0Q29tcG9uZW50SUQnLCB0aWNrZXRDb21wb25lbnQuaWQpO1xuICAgICAgICB0aWNrZXRDb21wb25lbnQuc2V0UmVsYXVuY2hEYXRhKHsgc2V0X2xpYnJhcnlfY29tcG9uZW50OiAnUHVibGlzaCB0aGUgY29tcG9uZW50IGluIGEgbGlicmFyeSBhbmQgdGhlbiBjbGljayB0aGlzIGJ1dHRvbi4nIH0pO1xuICAgICAgICAvLyBNYWtlIHN1cmUgdGhlIGNvbXBvbmVudCBpcyB2aXNpYmxlIHdoZXJlIHdlJ3JlIGN1cnJlbnRseSBsb29raW5nXG4gICAgICAgIHRpY2tldENvbXBvbmVudC54ID0gZmlnbWEudmlld3BvcnQuY2VudGVyLnggLSAodGlja2V0Q29tcG9uZW50LndpZHRoIC8gMik7XG4gICAgICAgIHRpY2tldENvbXBvbmVudC55ID0gZmlnbWEudmlld3BvcnQuY2VudGVyLnkgLSAodGlja2V0Q29tcG9uZW50LmhlaWdodCAvIDIpO1xuICAgICAgICByZXR1cm4gdGlja2V0Q29tcG9uZW50O1xuICAgIH0pO1xufVxuLyoqXG4gKiBDcmVhdGVzIGEgbmV3IG1haW4gdGlja2V0IGNvbXBvbmVudCBvciBnZXRzIHRoZSByZWZlcmVuY2UgdG8gdGhlIGV4aXN0aW5nIG9uZSBpbiB0aGUgZm9sbG93aW5nIG9yZGVyOlxuICogMS4gTG9va3MgZm9yIGxpYnJhcnkgY29tcG9uZW50IGJhc2VkIG9uIHB1YmxpYyBrZXlcbiAqIDIuIExvb2tzIGZvciBsaWJyYXJ5IGNvbXBvbmVudCBiYXNlZCBvbiBwcml2YXRlIGtleVxuICogMy4gTG9va3MgZm9yIGxvY2FsIGNvbXBvbmVudCBiYXNlZCBvbiBwdWJsaWMga2V5XG4gKiA0LiBMb29rcyBmb3IgbG9jYWwgY29tcG9uZW50IGJhc2VkIG9uIGNvbXBvbmVudCBuYW1lXG4gKiA1LiBDcmVhdGVzIGEgbmV3IGNvbXBvbmVudFxuICovXG5mdW5jdGlvbiByZWZlcmVuY2VUaWNrZXRDb21wb25lbnRTZXQoKSB7XG4gICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgLy8gQ2hlY2sgaWYgdGhlIHRpY2tldCBjb21wb25lbnQgaXMgYWxyZWFkeSBzYXZlZCBpbiB0aGUgdmFyaWFibGVcbiAgICAgICAgaWYgKCF0aWNrZXRDb21wb25lbnQpIHtcbiAgICAgICAgICAgIC8vVHJ5IHRvIGdldCBsaWJyYXJ5IGNvbXBvbmVudC4uLlxuICAgICAgICAgICAgLy8uLi5mcm9tIGNvbXBvbmVudCBrZXkgc2F2ZWQgaW4gdGhpcyBwcm9qZWN0XG4gICAgICAgICAgICB2YXIgcHVibGljVGlja2V0Q29tcG9uZW50S2V5ID0gRE9DVU1FTlRfTk9ERS5nZXRQbHVnaW5EYXRhKExJQlJBUllfQ09NUE9ORU5UX0tFWSk7XG4gICAgICAgICAgICBsZXQgbGlicmFyeUNvbXBvbmVudDtcbiAgICAgICAgICAgIGlmIChwdWJsaWNUaWNrZXRDb21wb25lbnRLZXkgJiYgKGxpYnJhcnlDb21wb25lbnQgPSB5aWVsZCBpbXBvcnRMaWJyYXJ5Q29tcG9uZW50KHB1YmxpY1RpY2tldENvbXBvbmVudEtleSkpKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJQVUJMSUNcIiwgcHVibGljVGlja2V0Q29tcG9uZW50S2V5KTtcbiAgICAgICAgICAgICAgICB0aWNrZXRDb21wb25lbnQgPSBsaWJyYXJ5Q29tcG9uZW50O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJQVUJMSUMgbGliIGNvbXBcIiwgbGlicmFyeUNvbXBvbmVudCk7XG4gICAgICAgICAgICAgICAgLy8uLi5vciBmcm9tIGNvbXBvbmVudCBrZXkgc2F2ZWQgd2l0aCB0aGUgdXNlclxuICAgICAgICAgICAgICAgIHZhciBwcml2YXRlVGlja2V0Q29tcG9uZW50S2V5ID0geWllbGQgZmlnbWEuY2xpZW50U3RvcmFnZS5nZXRBc3luYyhMSUJSQVJZX0NPTVBPTkVOVF9LRVkpO1xuICAgICAgICAgICAgICAgIGlmIChwcml2YXRlVGlja2V0Q29tcG9uZW50S2V5ICYmIChsaWJyYXJ5Q29tcG9uZW50ID0geWllbGQgaW1wb3J0TGlicmFyeUNvbXBvbmVudChwcml2YXRlVGlja2V0Q29tcG9uZW50S2V5KSkpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJQUklWQVRFXCIsIHByaXZhdGVUaWNrZXRDb21wb25lbnRLZXkpO1xuICAgICAgICAgICAgICAgICAgICBET0NVTUVOVF9OT0RFLnNldFBsdWdpbkRhdGEoTElCUkFSWV9DT01QT05FTlRfS0VZLCBwcml2YXRlVGlja2V0Q29tcG9uZW50S2V5KTsgLy8gU2FmZSBrZXkgcHVibGljbHlcbiAgICAgICAgICAgICAgICAgICAgdGlja2V0Q29tcG9uZW50ID0gbGlicmFyeUNvbXBvbmVudDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIElmIHRoZXJlIGlzIG5vIGxpYnJhcnkgY29tcG9uZW50LCB0cnkgdGhlIGdldCB0aGUgdGlja2V0IGNvbXBvbmVudCBieSBpdHMgSURcbiAgICAgICAgICAgICAgICAgICAgdmFyIHRpY2tldENvbXBvbmVudElkID0gRE9DVU1FTlRfTk9ERS5nZXRQbHVnaW5EYXRhKCd0aWNrZXRDb21wb25lbnRJRCcpO1xuICAgICAgICAgICAgICAgICAgICBsZXQgbm9kZTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRpY2tldENvbXBvbmVudElkICYmIChub2RlID0gZmlnbWEuZ2V0Tm9kZUJ5SWQodGlja2V0Q29tcG9uZW50SWQpKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gSWYgdGhlcmUgaXMgYW4gSUQgc2F2ZWQsIGFjY2VzcyB0aGUgdGlja2V0IGNvbXBvbmVudFxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJMT0NBTFwiLCB0aWNrZXRDb21wb25lbnRJZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aWNrZXRDb21wb25lbnQgPSBub2RlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gSWYgdGhlcmUgaXMgYSBjb21wb25lbnQgc29tZXdoZXJlIHdpdGggdGhlIHJpZ2h0IG5hbWVcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBjb21wb25lbnRTZXRzID0gZmlnbWEucm9vdC5maW5kQWxsV2l0aENyaXRlcmlhKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlczogWydDT01QT05FTlRfU0VUJ11cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50U2V0cyA9IGNvbXBvbmVudFNldHMuZmlsdGVyKG5vZGUgPT4gbm9kZS5uYW1lID09PSBDT01QT05FTlRfU0VUX05BTUUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNvbXBvbmVudFNldHNbMF0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aWNrZXRDb21wb25lbnQgPSBjb21wb25lbnRTZXRzWzBdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIERPQ1VNRU5UX05PREUuc2V0UGx1Z2luRGF0YSgndGlja2V0Q29tcG9uZW50SUQnLCB0aWNrZXRDb21wb25lbnQuaWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gSWYgdGhlcmUgaXMgbm8gY29tcG9uZW50LCBjcmVhdGUgYSBuZXcgY29tcG9uZW50XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGlja2V0Q29tcG9uZW50ID0geWllbGQgY3JlYXRlVGlja2V0Q29tcG9uZW50U2V0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcbn1cbmZ1bmN0aW9uIGltcG9ydExpYnJhcnlDb21wb25lbnQoa2V5KSB7XG4gICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgdmFyIGxpYnJhcnlDb21wb25lbnQ7XG4gICAgICAgIHlpZWxkIGZpZ21hLmltcG9ydENvbXBvbmVudFNldEJ5S2V5QXN5bmMoa2V5KVxuICAgICAgICAgICAgLnRoZW4oKHJlc3VsdCkgPT4ge1xuICAgICAgICAgICAgbGlicmFyeUNvbXBvbmVudCA9IHJlc3VsdDtcbiAgICAgICAgfSlcbiAgICAgICAgICAgIC5jYXRjaCgoKSA9PiB7XG4gICAgICAgICAgICBsaWJyYXJ5Q29tcG9uZW50ID0gZmFsc2U7XG4gICAgICAgIH0pO1xuICAgICAgICBjb25zb2xlLmxvZyhcIkxJQiBGVU5DXCIsIGxpYnJhcnlDb21wb25lbnQpO1xuICAgICAgICByZXR1cm4gbGlicmFyeUNvbXBvbmVudDtcbiAgICB9KTtcbn1cbi8vIENoZWNrcyBpZiBmZXRjaGluZyBkYXRhIHdhcyBzdWNjZXNzZnVsIGF0IGFsbCBcbmZ1bmN0aW9uIGNoZWNrRmV0Y2hTdWNjZXNzKGRhdGEpIHtcbiAgICB2YXIgaXNTdWNjZXNzID0gZmFsc2U7XG4gICAgLy8gQ2FuIHRoaXMgZXZlbiBoYXBwZW4/XG4gICAgaWYgKCFkYXRhKSB7XG4gICAgICAgIGZpZ21hLm5vdGlmeShcIlNvbWV0aGluZyB3ZW50IHdyb25nLlwiKTtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiU29tZXRoaW5nIHdlbnQgd3JvbmcuXCIgKyBkYXRhKTtcbiAgICB9XG4gICAgLy8gTm8gY29ubmVjdGlvbiB0byBGaXJlYmFzZVxuICAgIGVsc2UgaWYgKGRhdGEudHlwZSA9PSBcIkVycm9yXCIpIHtcbiAgICAgICAgZmlnbWEubm90aWZ5KFwiQ291bGQgbm90IGdldCBkYXRhLiBUaGVyZSBzZWVtcyB0byBiZSBubyBjb25uZWN0aW9uIHRvIHRoZSBzZXJ2ZXIuXCIpO1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoZGF0YS5tZXNzYWdlKTtcbiAgICB9XG4gICAgLy8gV3JvbmcgZS1tYWlsXG4gICAgZWxzZSBpZiAoZGF0YVswXS5tZXNzYWdlID09IFwiQ2xpZW50IG11c3QgYmUgYXV0aGVudGljYXRlZCB0byBhY2Nlc3MgdGhpcyByZXNvdXJjZS5cIikge1xuICAgICAgICBmaWdtYS5ub3RpZnkoXCJZb3UgaGF2ZSBlbnRlcmVkIGFuIGludmFsaWQgZS1tYWlsLiBTZWUgJ0F1dGhvcml6YXRpb24nIHNldHRpbmdzLlwiKTtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGRhdGEubWVzc2FnZSk7XG4gICAgfVxuICAgIC8vIFdyb25nIGNvbXBhbnkgbmFtZVxuICAgIGVsc2UgaWYgKGRhdGFbMF0uZXJyb3JNZXNzYWdlID09IFwiU2l0ZSB0ZW1wb3JhcmlseSB1bmF2YWlsYWJsZVwiKSB7XG4gICAgICAgIGZpZ21hLm5vdGlmeShcIkNvbXBhbnkgZG9tYWluIG5hbWUgZG9lcyBub3QgZXhpc3QuIFNlZSAnUHJvamVjdCBTZXR0aW5ncycuXCIpO1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoZGF0YVswXS5lcnJvck1lc3NhZ2UpO1xuICAgIH1cbiAgICAvLyBXcm9uZyBwYXNzd29yZFxuICAgIGVsc2UgaWYgKGRhdGFbMF1bMF0pIHtcbiAgICAgICAgZmlnbWEubm90aWZ5KFwiQ291bGQgbm90IGFjY2VzcyBkYXRhLiBZb3VyIEppcmEgQVBJIFRva2VuIHNlZW1zIHRvIGJlIGludmFsaWQuIFNlZSAnQXV0aG9yaXphdGlvbicgc2V0dGluZ3MuXCIpO1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoZGF0YVswXVswXSk7XG4gICAgfVxuICAgIC8vIEVsc2UsIGl0IHdhcyBwcm9iYWJseSBzdWNjZXNzZnVsXG4gICAgZWxzZSB7XG4gICAgICAgIGlzU3VjY2VzcyA9IHRydWU7XG4gICAgfVxuICAgIHJldHVybiBpc1N1Y2Nlc3M7XG59XG4vLyBDaGVja3MgaWYgcGVyIHJlY2VpdmVkIHRpY2tldCBkYXRhIGlmIHRoZSBmZXRjaGluZyB3YXMgc3VjY2Vzc2Z1bFxuZnVuY3Rpb24gY2hlY2tUaWNrZXREYXRhUmVwb25zZSh0aWNrZXREYXRhLCBpc3N1ZUlkKSB7XG4gICAgdmFyIGNoZWNrZWREYXRhO1xuICAgIC8vIElmIHRoZSBKU09OIGhhcyBhIGtleSBmaWVsZCwgdGhlIGRhdGEgaXMgdmFsaWRcbiAgICBpZiAodGlja2V0RGF0YSAmJiB0aWNrZXREYXRhLmtleSkge1xuICAgICAgICBjaGVja2VkRGF0YSA9IHRpY2tldERhdGE7XG4gICAgfVxuICAgIC8vIElEIGRvZXMgbm90IGV4aXN0XG4gICAgZWxzZSBpZiAodGlja2V0RGF0YS5lcnJvck1lc3NhZ2VzID09IFwiVGhlIGlzc3VlIG5vIGxvbmdlciBleGlzdHMuXCIpIHtcbiAgICAgICAgY2hlY2tlZERhdGEgPSBjcmVhdGVFcnJvckRhdGFKU09OKGBFcnJvcjogVGlja2V0IElEICcke2lzc3VlSWR9JyBkb2VzIG5vdCBleGlzdC5gLCBpc3N1ZUlkKTtcbiAgICAgICAgLy8gZmlnbWEubm90aWZ5KGBUaWNrZXQgSUQgJyR7aXNzdWVJZH0nIGRvZXMgbm90IGV4aXN0LmApXG4gICAgfVxuICAgIC8vIElEIGhhcyBpbnZhbGlkIGZvcm1hdFxuICAgIGVsc2UgaWYgKHRpY2tldERhdGEuZXJyb3JNZXNzYWdlcyA9PSBcIklzc3VlIGtleSBpcyBpbiBhbiBpbnZhbGlkIGZvcm1hdC5cIikge1xuICAgICAgICBjaGVja2VkRGF0YSA9IGNyZWF0ZUVycm9yRGF0YUpTT04oYEVycm9yOiBUaWNrZXQgSUQgJyR7aXNzdWVJZH0nIGlzIGluIGFuIGludmFsaWQgZm9ybWF0LmAsIGlzc3VlSWQpO1xuICAgICAgICAvLyBmaWdtYS5ub3RpZnkoYFRpY2tldCBJRCAnJHtpc3N1ZUlkfScgaXMgaW4gYW4gaW52YWxpZCBmb3JtYXQuYClcbiAgICB9XG4gICAgLy8gT3RoZXJcbiAgICBlbHNlIHtcbiAgICAgICAgY2hlY2tlZERhdGEgPSBjcmVhdGVFcnJvckRhdGFKU09OKFwiRXJyb3I6IEFuIHVuZXhwZWN0ZWQgZXJyb3Igb2NjdXJlZC5cIiwgaXNzdWVJZCk7XG4gICAgICAgIGZpZ21hLm5vdGlmeShcIlVuZXhwZWN0ZWQgZXJyb3IuXCIpO1xuICAgICAgICBjb25zb2xlLmVycm9yKFwiVW5leHBlY3RlZCBlcnJvci5cIiwgdGlja2V0RGF0YSk7XG4gICAgICAgIC8vIHRocm93IG5ldyBFcnJvcih0aWNrZXREYXRhLm1lc3NhZ2UpXG4gICAgfVxuICAgIHJldHVybiBjaGVja2VkRGF0YTtcbn1cbi8vIENyZWF0ZSBhIGVycm9yIHZhcmlhYmxlIHRoYXQgaGFzIHRoZSBzYW1lIG1haW4gZmllbGRzIGFzIHRoZSBKaXJhIFRpY2tldCB2YXJpYWJsZS4gXG4vLyBUaGlzIHdpbGwgYmUgdXNlZCB0aGUgZmlsbCB0aGUgdGlja2V0IGRhdGEgd2l0aCB0aGUgZXJyb3IgbWVzc2FnZS5cbmZ1bmN0aW9uIGNyZWF0ZUVycm9yRGF0YUpTT04obWVzc2FnZSwgaXNzdWVJZCkge1xuICAgIHZhciB0b2RheSA9IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKTtcbiAgICB2YXIgZXJyb3JEYXRhID0ge1xuICAgICAgICBcImtleVwiOiBpc3N1ZUlkLFxuICAgICAgICBcImZpZWxkc1wiOiB7XG4gICAgICAgICAgICBcInN1bW1hcnlcIjogbWVzc2FnZSxcbiAgICAgICAgICAgIFwic3RhdHVzXCI6IHtcbiAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJFcnJvclwiXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJzdGF0dXNjYXRlZ29yeWNoYW5nZWRhdGVcIjogdG9kYXlcbiAgICAgICAgfVxuICAgIH07XG4gICAgcmV0dXJuIGVycm9yRGF0YTtcbn1cbi8vIEZ1bmN0aW9uIGZvciBsb2FkaW5nIGFsbCB0aGUgZm9udHMgZm9yIHRoZSBtYWluIGNvbXBvbmVudFxuZnVuY3Rpb24gbG9hZEZvbnRzKCkge1xuICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgIHlpZWxkIGZpZ21hLmxvYWRGb250QXN5bmMoRk9OVF9SRUcpO1xuICAgICAgICB5aWVsZCBmaWdtYS5sb2FkRm9udEFzeW5jKEZPTlRfTUVEKTtcbiAgICAgICAgeWllbGQgZmlnbWEubG9hZEZvbnRBc3luYyhGT05UX0JPTEQpO1xuICAgIH0pO1xufVxuZnVuY3Rpb24gbG9hZFNpbmdsZUZvbnQoZm9udE5hbWUpIHtcbiAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICB5aWVsZCBmaWdtYS5sb2FkRm9udEFzeW5jKGZvbnROYW1lKTtcbiAgICB9KTtcbn1cbi8vIEZvcm1hdHMgYSBoZXggdmFsdWUgdG8gUkdCXG5mdW5jdGlvbiBoZXhUb1JnYihoZXgpIHtcbiAgICB2YXIgYmlnaW50ID0gcGFyc2VJbnQoaGV4LCAxNik7XG4gICAgdmFyIHIgPSAoYmlnaW50ID4+IDE2KSAmIDI1NTtcbiAgICB2YXIgZyA9IChiaWdpbnQgPj4gOCkgJiAyNTU7XG4gICAgdmFyIGIgPSBiaWdpbnQgJiAyNTU7XG4gICAgcmV0dXJuIHsgcjogciAvIDI1NSwgZzogZyAvIDI1NSwgYjogYiAvIDI1NSB9O1xufVxuIiwiIiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBpcyByZWZlcmVuY2VkIGJ5IG90aGVyIG1vZHVsZXMgc28gaXQgY2FuJ3QgYmUgaW5saW5lZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSB7fTtcbl9fd2VicGFja19tb2R1bGVzX19bXCIuL3NyYy9jb2RlLnRzXCJdKCk7XG4iLCIiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=