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
var nextTicketOffset = 0;
// ticketdata.fields.assignee.avatarUrls
// ticketdata.fields.status.name
// ticketdata.fields.status.statusCategory.name
const ISSUE_ID_NAME = "Ticket ID";
const ISSUE_TITLE_NAME = "Ticket Title";
const ISSUE_CHANGE_DATE_NAME = "Date of Status Change";
const ASSIGNEE_NAME = "Assignee";
const COMPONENT_SET_NAME = "Jira Ticket Header";
const COMPONENT_SET_PROPERTY_NAME = "Status=";
const VARIANT_NAME_1 = "To Do";
const VARIANT_COLOR_1 = hexToRgb('EEEEEE');
const VARIANT_NAME_2 = "Concepting";
const VARIANT_COLOR_2 = hexToRgb('FFEDC0');
const VARIANT_NAME_3 = "Design";
const VARIANT_COLOR_3 = hexToRgb('D7E0FF');
const VARIANT_NAME_4 = "Testing";
const VARIANT_COLOR_4 = hexToRgb('D7E0FF');
const VARIANT_NAME_DONE = "Launch";
const VARIANT_COLOR_DONE = hexToRgb('D3FFD2');
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
        console.log(1);
        var hasFailed = requestUpdateForTickets(type);
        console.log(2);
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
            }
            else {
                let issueIdNode = node.findOne(n => n.type === "TEXT" && n.name === ISSUE_ID_NAME);
                if (!issueIdNode) {
                    figma.notify(`At least one instance is missing the text element '${ISSUE_ID_NAME}'. Could not update.`);
                }
                else {
                    issueIds.push(issueIdNode.characters);
                    nodeIds.push(node.id);
                }
            }
        }
        figma.ui.postMessage({ nodeIds: nodeIds, issueIds: issueIds, type: 'getTicketData' });
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
        // Create the header frame
        var detailsFrame = figma.createFrame();
        detailsFrame.name = "Container";
        detailsFrame.layoutMode = "HORIZONTAL";
        detailsFrame.counterAxisSizingMode = "AUTO";
        detailsFrame.layoutAlign = "STRETCH";
        detailsFrame.itemSpacing = 32;
        detailsFrame.fills = [];
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
            ticketVariant.appendChild(headerFrame);
            ticketVariant.appendChild(detailsFrame);
            headerFrame.appendChild(issueIdTxt);
            headerFrame.appendChild(titleTxt);
            detailsFrame.appendChild(assigneeTxt);
            detailsFrame.appendChild(changeDateTxt);
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
        let var4 = yield createTicketVariant(VARIANT_COLOR_4, COMPONENT_SET_PROPERTY_NAME + VARIANT_NAME_4);
        let var5 = yield createTicketVariant(VARIANT_COLOR_DONE, COMPONENT_SET_PROPERTY_NAME + VARIANT_NAME_DONE);
        let varError = yield createTicketVariant(VARIANT_COLOR_ERROR, COMPONENT_SET_PROPERTY_NAME + VARIANT_NAME_ERROR);
        const variants = [varDefault, var1, var2, var3, var4, var5, varError];
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
        // Make sure the component is visible where we're currently looking
        ticketComponent.x = figma.viewport.center.x - (ticketComponent.width / 2);
        ticketComponent.y = figma.viewport.center.y - (ticketComponent.height / 2);
        return ticketComponent;
    });
}
/**
 * Creates a new main ticket component or gets the reference to the existing one
 */
function referenceTicketComponentSet() {
    return __awaiter(this, void 0, void 0, function* () {
        // Check if the ticket component is already saved in the variable
        if (!ticketComponent) {
            // If no, try the get the ticket component by its ID
            var ticketComponentId = DOCUMENT_NODE.getPluginData('ticketComponentID');
            let node;
            if (ticketComponentId && (node = figma.getNodeById(ticketComponentId))) {
                // If there is an ID saved, access the ticket component
                ticketComponent = node;
            }
            else {
                // If there is no ID, create a new component
                ticketComponent = yield createTicketComponentSet();
            }
        }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQ0FBaUMsbUNBQW1DO0FBQ3BFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLCtEQUErRCxRQUFRO0FBQ3ZFLHNDQUFzQyxRQUFRO0FBQzlDO0FBQ0E7QUFDQTtBQUNBLCtEQUErRCxRQUFRO0FBQ3ZFLHNDQUFzQyxRQUFRO0FBQzlDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjs7Ozs7Ozs7VUVub0JBO1VBQ0E7VUFDQTtVQUNBO1VBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly93ZWJwYWNrLXJlYWN0Ly4vc3JjL2NvZGUudHMiLCJ3ZWJwYWNrOi8vd2VicGFjay1yZWFjdC93ZWJwYWNrL2JlZm9yZS1zdGFydHVwIiwid2VicGFjazovL3dlYnBhY2stcmVhY3Qvd2VicGFjay9zdGFydHVwIiwid2VicGFjazovL3dlYnBhY2stcmVhY3Qvd2VicGFjay9hZnRlci1zdGFydHVwIl0sInNvdXJjZXNDb250ZW50IjpbInZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xuICAgIGZ1bmN0aW9uIGFkb3B0KHZhbHVlKSB7IHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFAgPyB2YWx1ZSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUodmFsdWUpOyB9KTsgfVxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IGFkb3B0KHJlc3VsdC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XG4gICAgfSk7XG59O1xuY29uc3QgRE9DVU1FTlRfTk9ERSA9IGZpZ21hLmN1cnJlbnRQYWdlLnBhcmVudDtcbi8vIFNldCB0aGUgcmVsYXVuY2ggYnV0dG9uIGZvciB0aGUgd2hvbGUgZG9jdW1lbnRcbkRPQ1VNRU5UX05PREUuc2V0UmVsYXVuY2hEYXRhKHsgdXBkYXRlX3BhZ2U6ICcnLCB1cGRhdGVfYWxsOiAnJyB9KTtcbmNvbnN0IFdJTkRPV19XSURUSCA9IDI1MDtcbmNvbnN0IFdJTkRPV19IRUlHSFRfQklHID0gNjUwO1xuY29uc3QgV0lORE9XX0hFSUdIVF9TTUFMTCA9IDMwODtcbmNvbnN0IENPTVBBTllfTkFNRV9LRVkgPSBcIkNPTVBBTllfTkFNRVwiO1xuY29uc3QgUFJPSkVDVF9JRF9LRVkgPSBcIlBST0pFQ1RfSURcIjtcbmNvbnN0IFVTRVJOQU1FX0tFWSA9IFwiVVNFUk5BTUVcIjtcbmNvbnN0IFBBU1NXT1JEX0tFWSA9IFwiUEFTU1dPUkRcIjtcbmNvbnN0IElTU1VFX0lEX0tFWSA9IFwiSVNTVUVfSURcIjtcbmNvbnN0IENSRUFURV9MSU5LX0tFWSA9IFwiQ1JFQVRFX0xJTktcIjtcbnZhciBjb21wYW55X25hbWU7IC8vIFNhdmVkIHB1YmxpY2x5IHdpdGggc2V0UGx1Z2luRGF0YVxudmFyIHByb2plY3RfaWQ7IC8vIFNhdmVkIHB1YmxpY2x5IHdpdGggc2V0UGx1Z2luRGF0YVxudmFyIHVzZXJuYW1lO1xudmFyIHBhc3N3b3JkO1xudmFyIGlzc3VlSWQ7XG52YXIgY3JlYXRlTGluaztcbmNvbnN0IEZPTlRfUkVHID0geyBmYW1pbHk6IFwiV29yayBTYW5zXCIsIHN0eWxlOiBcIlJlZ3VsYXJcIiB9O1xuY29uc3QgRk9OVF9NRUQgPSB7IGZhbWlseTogXCJXb3JrIFNhbnNcIiwgc3R5bGU6IFwiTWVkaXVtXCIgfTtcbmNvbnN0IEZPTlRfQk9MRCA9IHsgZmFtaWx5OiBcIldvcmsgU2Fuc1wiLCBzdHlsZTogXCJCb2xkXCIgfTtcbmZ1bmN0aW9uIGdldFN0YXR1cyhkYXRhKSB7IHJldHVybiBkYXRhLmZpZWxkcy5zdGF0dXMubmFtZTsgfVxuZnVuY3Rpb24gZ2V0VGl0bGUoZGF0YSkgeyByZXR1cm4gZGF0YS5maWVsZHMuc3VtbWFyeTsgfVxuZnVuY3Rpb24gZ2V0SXNzdWVJZChkYXRhKSB7IHJldHVybiBkYXRhLmtleTsgfVxuZnVuY3Rpb24gZ2V0Q2hhbmdlRGF0ZShkYXRhKSB7IHJldHVybiBkYXRhLmZpZWxkcy5zdGF0dXNjYXRlZ29yeWNoYW5nZWRhdGU7IH1cbmZ1bmN0aW9uIGdldEFzc2lnbmVlKGRhdGEpIHsgcmV0dXJuIGRhdGEuZmllbGRzLmFzc2lnbmVlLmRpc3BsYXlOYW1lOyB9XG52YXIgbmV4dFRpY2tldE9mZnNldCA9IDA7XG4vLyB0aWNrZXRkYXRhLmZpZWxkcy5hc3NpZ25lZS5hdmF0YXJVcmxzXG4vLyB0aWNrZXRkYXRhLmZpZWxkcy5zdGF0dXMubmFtZVxuLy8gdGlja2V0ZGF0YS5maWVsZHMuc3RhdHVzLnN0YXR1c0NhdGVnb3J5Lm5hbWVcbmNvbnN0IElTU1VFX0lEX05BTUUgPSBcIlRpY2tldCBJRFwiO1xuY29uc3QgSVNTVUVfVElUTEVfTkFNRSA9IFwiVGlja2V0IFRpdGxlXCI7XG5jb25zdCBJU1NVRV9DSEFOR0VfREFURV9OQU1FID0gXCJEYXRlIG9mIFN0YXR1cyBDaGFuZ2VcIjtcbmNvbnN0IEFTU0lHTkVFX05BTUUgPSBcIkFzc2lnbmVlXCI7XG5jb25zdCBDT01QT05FTlRfU0VUX05BTUUgPSBcIkppcmEgVGlja2V0IEhlYWRlclwiO1xuY29uc3QgQ09NUE9ORU5UX1NFVF9QUk9QRVJUWV9OQU1FID0gXCJTdGF0dXM9XCI7XG5jb25zdCBWQVJJQU5UX05BTUVfMSA9IFwiVG8gRG9cIjtcbmNvbnN0IFZBUklBTlRfQ09MT1JfMSA9IGhleFRvUmdiKCdFRUVFRUUnKTtcbmNvbnN0IFZBUklBTlRfTkFNRV8yID0gXCJDb25jZXB0aW5nXCI7XG5jb25zdCBWQVJJQU5UX0NPTE9SXzIgPSBoZXhUb1JnYignRkZFREMwJyk7XG5jb25zdCBWQVJJQU5UX05BTUVfMyA9IFwiRGVzaWduXCI7XG5jb25zdCBWQVJJQU5UX0NPTE9SXzMgPSBoZXhUb1JnYignRDdFMEZGJyk7XG5jb25zdCBWQVJJQU5UX05BTUVfNCA9IFwiVGVzdGluZ1wiO1xuY29uc3QgVkFSSUFOVF9DT0xPUl80ID0gaGV4VG9SZ2IoJ0Q3RTBGRicpO1xuY29uc3QgVkFSSUFOVF9OQU1FX0RPTkUgPSBcIkxhdW5jaFwiO1xuY29uc3QgVkFSSUFOVF9DT0xPUl9ET05FID0gaGV4VG9SZ2IoJ0QzRkZEMicpO1xuY29uc3QgVkFSSUFOVF9OQU1FX0RFRkFVTFQgPSBcIkRlZmF1bHRcIjtcbmNvbnN0IFZBUklBTlRfQ09MT1JfREVGQVVMVCA9IGhleFRvUmdiKCdCOUI5QjknKTtcbmNvbnN0IFZBUklBTlRfTkFNRV9FUlJPUiA9IFwiRXJyb3JcIjtcbmNvbnN0IFZBUklBTlRfQ09MT1JfRVJST1IgPSBoZXhUb1JnYignRkZEOUQ5Jyk7XG52YXIgdGlja2V0Q29tcG9uZW50O1xuLy8gRG9uJ3Qgc2hvdyBVSSBpZiByZWxhdW5jaCBidXR0b25zIGFyZSBydW5cbmlmIChmaWdtYS5jb21tYW5kID09PSAndXBkYXRlX3NlbGVjdGlvbicpIHtcbiAgICB1cGRhdGVXaXRob3V0VUkoXCJzZWxlY3Rpb25cIik7XG59XG5lbHNlIGlmIChmaWdtYS5jb21tYW5kID09PSAndXBkYXRlX2FsbCcpIHtcbiAgICB1cGRhdGVXaXRob3V0VUkoXCJhbGxcIik7XG59XG5lbHNlIGlmIChmaWdtYS5jb21tYW5kID09PSAndXBkYXRlX3BhZ2UnKSB7XG4gICAgdXBkYXRlV2l0aG91dFVJKFwicGFnZVwiKTtcbn1cbmVsc2Uge1xuICAgIC8vIE90aGVyd2lzZSBzaG93IFVJXG4gICAgZmlnbWEuc2hvd1VJKF9faHRtbF9fLCB7IHdpZHRoOiBXSU5ET1dfV0lEVEgsIGhlaWdodDogV0lORE9XX0hFSUdIVF9TTUFMTCB9KTtcbiAgICBzZW5kRGF0YSgpO1xufVxuLy8gTWFrZSBzdXJlIHRoZSBtYWluIGNvbXBvbmVudCBpcyByZWZlcmVuY2VkXG5yZWZlcmVuY2VUaWNrZXRDb21wb25lbnRTZXQoKTtcbi8vIFN0YXJ0IHBsdWdpbiB3aXRob3V0IHZpc2libGUgVUkgYW5kIHVwZGF0ZSB0aWNrZXRzXG5mdW5jdGlvbiB1cGRhdGVXaXRob3V0VUkodHlwZSkge1xuICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgIGZpZ21hLnNob3dVSShfX2h0bWxfXywgeyB2aXNpYmxlOiBmYWxzZSB9KTtcbiAgICAgICAgeWllbGQgc2VuZERhdGEoKTtcbiAgICAgICAgY29uc29sZS5sb2coMSk7XG4gICAgICAgIHZhciBoYXNGYWlsZWQgPSByZXF1ZXN0VXBkYXRlRm9yVGlja2V0cyh0eXBlKTtcbiAgICAgICAgY29uc29sZS5sb2coMik7XG4gICAgICAgIGlmIChoYXNGYWlsZWQgJiYgKHR5cGUgPT09IFwiYWxsXCIgfHwgdHlwZSA9PT0gXCJwYWdlXCIgfHwgdHlwZSA9PT0gXCJzZWxlY3Rpb25cIikpIHtcbiAgICAgICAgICAgIGZpZ21hLmNsb3NlUGx1Z2luKCk7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cbi8vIFNlbmQgdGhlIHN0b3JlZCBhdXRob3JpemF0aW9uIGRhdGEgdG8gdGhlIFVJXG5mdW5jdGlvbiBzZW5kRGF0YSgpIHtcbiAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICBjb21wYW55X25hbWUgPSB5aWVsZCBnZXRBdXRob3JpemF0aW9uSW5mbyhDT01QQU5ZX05BTUVfS0VZLCB0cnVlKTtcbiAgICAgICAgcHJvamVjdF9pZCA9IHlpZWxkIGdldEF1dGhvcml6YXRpb25JbmZvKFBST0pFQ1RfSURfS0VZLCB0cnVlKTtcbiAgICAgICAgdXNlcm5hbWUgPSB5aWVsZCBnZXRBdXRob3JpemF0aW9uSW5mbyhVU0VSTkFNRV9LRVksIGZhbHNlKTtcbiAgICAgICAgcGFzc3dvcmQgPSB5aWVsZCBnZXRBdXRob3JpemF0aW9uSW5mbyhQQVNTV09SRF9LRVksIGZhbHNlKTtcbiAgICAgICAgaXNzdWVJZCA9IHlpZWxkIGdldEF1dGhvcml6YXRpb25JbmZvKElTU1VFX0lEX0tFWSwgZmFsc2UpO1xuICAgICAgICBjcmVhdGVMaW5rID0geWllbGQgZ2V0QXV0aG9yaXphdGlvbkluZm8oQ1JFQVRFX0xJTktfS0VZLCBmYWxzZSk7XG4gICAgICAgIGlmIChjcmVhdGVMaW5rID09PSBcIlwiKVxuICAgICAgICAgICAgY3JlYXRlTGluayA9IHRydWU7XG4gICAgICAgIGZpZ21hLnVpLnBvc3RNZXNzYWdlKHsgY29tcGFueV9uYW1lOiBjb21wYW55X25hbWUsIHByb2plY3RfaWQ6IHByb2plY3RfaWQsIHVzZXJuYW1lOiB1c2VybmFtZSwgcGFzc3dvcmQ6IHBhc3N3b3JkLCBpc3N1ZUlkOiBpc3N1ZUlkLCBjcmVhdGVMaW5rOiBjcmVhdGVMaW5rLCB0eXBlOiAnc2V0QXV0aG9yaXphdGlvblZhcmlhYmxlcycgfSk7XG4gICAgfSk7XG59XG4vLyBBbGwgdGhlIGZ1bmN0aW9ucyB0aGF0IGNhbiBiZSBzdGFydGVkIGZyb20gdGhlIFVJXG5maWdtYS51aS5vbm1lc3NhZ2UgPSAobXNnKSA9PiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgLy8gQ2FsbGVkIHRvIGNyZWF0ZSBhIG5ldyBtYWluIGNvbXBvbmVudCBhbmQgc2F2ZSBpdHMgSURcbiAgICBpZiAobXNnLnR5cGUgPT09ICdjcmVhdGUtY29tcG9uZW50Jykge1xuICAgICAgICB0aWNrZXRDb21wb25lbnQgPSB5aWVsZCBjcmVhdGVUaWNrZXRDb21wb25lbnRTZXQoKTtcbiAgICAgICAgRE9DVU1FTlRfTk9ERS5zZXRQbHVnaW5EYXRhKCd0aWNrZXRDb21wb25lbnRJRCcsIHRpY2tldENvbXBvbmVudC5pZCk7XG4gICAgfVxuICAgIC8vIENhbGxlZCB0byBjcmVhdGUgYSBuZXcgaW5zdGFuY2Ugb2YgYSBjb21wb25lbnQgKGJhc2VkIG9uIHRoZSBpc3N1ZUlkIGVudGVyZWQgaW4gdGhlIFVJKVxuICAgIGlmIChtc2cudHlwZSA9PT0gJ2NyZWF0ZS1uZXctdGlja2V0JyAmJiBjaGVja0ZldGNoU3VjY2Vzcyhtc2cuZGF0YSkpIHtcbiAgICAgICAgbGV0IHRpY2tldEluc3RhbmNlID0geWllbGQgY3JlYXRlVGlja2V0SW5zdGFuY2UobXNnKTtcbiAgICAgICAgaWYgKG1zZy5jcmVhdGVMaW5rICYmIG1zZy5kYXRhWzBdLmtleSAmJiBwcm9qZWN0X2lkICE9IFwiXCIpIHtcbiAgICAgICAgICAgIGxldCBwcm9qZWN0TmFtZSA9IGVuY29kZVVSSUNvbXBvbmVudChmaWdtYS5yb290Lm5hbWUpO1xuICAgICAgICAgICAgbGV0IG5vZGVJZCA9IGVuY29kZVVSSUNvbXBvbmVudCh0aWNrZXRJbnN0YW5jZS5pZCk7XG4gICAgICAgICAgICBsZXQgbGluayA9IGBodHRwczovL3d3dy5maWdtYS5jb20vZmlsZS8ke3Byb2plY3RfaWR9LyR7cHJvamVjdE5hbWV9P25vZGUtaWQ9JHtub2RlSWR9YDtcbiAgICAgICAgICAgIGZpZ21hLnVpLnBvc3RNZXNzYWdlKHsgaXNzdWVJZDogbXNnLmlzc3VlSWRzWzBdLCBsaW5rOiBsaW5rLCB0eXBlOiAncG9zdC1saW5rLXRvLWppcmEtaXNzdWUnIH0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8vIENhbGxlZCB0byBnZXQgYWxsIEppcmEgVGlja2VyIEhlYWRlciBpbnN0YW5jZXMgYW5kIHVwZGF0ZSB0aGVtIG9uZSBieSBvbmUuIFxuICAgIGlmIChtc2cudHlwZSA9PT0gJ3VwZGF0ZS1hbGwnKSB7XG4gICAgICAgIHJlcXVlc3RVcGRhdGVGb3JUaWNrZXRzKFwiYWxsXCIpO1xuICAgIH1cbiAgICAvLyBDYWxsZWQgdG8gZ2V0IEppcmEgVGlja2VyIEhlYWRlciBpbnN0YW5jZXMgb24gdGhpcyBwYWdlIGFuZCB1cGRhdGUgdGhlbSBvbmUgYnkgb25lLiBcbiAgICBpZiAobXNnLnR5cGUgPT09ICd1cGRhdGUtcGFnZScpIHtcbiAgICAgICAgcmVxdWVzdFVwZGF0ZUZvclRpY2tldHMoXCJwYWdlXCIpO1xuICAgIH1cbiAgICAvLyBDYWxsZWQgdG8gZ2V0IHNlbGVjdGVkIEppcmEgVGlja2VyIEhlYWRlciBpbnN0YW5jZXMgYW5kIHVwZGF0ZSB0aGVtIG9uZSBieSBvbmUuIFxuICAgIGlmIChtc2cudHlwZSA9PT0gJ3VwZGF0ZS1zZWxlY3RlZCcpIHtcbiAgICAgICAgcmVxdWVzdFVwZGF0ZUZvclRpY2tldHMoXCJzZWxlY3Rpb25cIik7XG4gICAgfVxuICAgIC8vIFNhdmUgbmV3IGF1dGhvcml6YXRpb24gaW5mb1xuICAgIGlmIChtc2cudHlwZSA9PT0gJ2F1dGhvcml6YXRpb24tZGV0YWlsLWNoYW5nZWQnKSB7XG4gICAgICAgIHNldEF1dGhvcml6YXRpb25JbmZvKG1zZy5rZXksIG1zZy5kYXRhLCBtc2cuc2F2ZV9wdWJsaWMpO1xuICAgIH1cbiAgICAvLyBSZXNpemUgdGhlIFVJXG4gICAgaWYgKG1zZy50eXBlID09PSAncmVzaXplLXVpJykge1xuICAgICAgICBtc2cuYmlnX3NpemUgPyBmaWdtYS51aS5yZXNpemUoV0lORE9XX1dJRFRILCBXSU5ET1dfSEVJR0hUX0JJRykgOiBmaWdtYS51aS5yZXNpemUoV0lORE9XX1dJRFRILCBXSU5ET1dfSEVJR0hUX1NNQUxMKTtcbiAgICB9XG4gICAgLy8gQWxsb3dzIHRoZSBVSSB0byBjcmVhdGUgbm90aWZpY2F0aW9uc1xuICAgIGlmIChtc2cudHlwZSA9PT0gJ2NyZWF0ZS12aXN1YWwtYmVsbCcpIHtcbiAgICAgICAgZmlnbWEubm90aWZ5KG1zZy5tZXNzYWdlKTtcbiAgICB9XG4gICAgLy8gVXBkYXRlcyBpbnN0YW5jZXMgYmFzZWQgb24gdGhlIHJlY2VpdmVkIHRpY2tldCBkYXRhLlxuICAgIGlmIChtc2cudHlwZSA9PT0gJ3RpY2tldERhdGFTZW50JyAmJiBjaGVja0ZldGNoU3VjY2Vzcyhtc2cuZGF0YSkpIHtcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJUaWNrZXQgZGF0YTpcIiwgbXNnLmRhdGEpXG4gICAgICAgIHZhciBub2RlSWRzID0gbXNnLm5vZGVJZHM7XG4gICAgICAgIHZhciBub2RlcyA9IG5vZGVJZHMubWFwKGlkID0+IGZpZ21hLmdldE5vZGVCeUlkKGlkKSk7XG4gICAgICAgIHlpZWxkIHVwZGF0ZVRpY2tldHMobm9kZXMsIG1zZyk7XG4gICAgfVxufSk7XG4vLyBTYXZlcyBhdXRob3JpemF0aW9uIGRldGFpbHMgaW4gY2xpZW50IHN0b3JhZ2VcbmZ1bmN0aW9uIHNldEF1dGhvcml6YXRpb25JbmZvKGtleSwgdmFsdWUsIHNhdmVQdWJsaWMgPSBmYWxzZSkge1xuICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgIGlmIChzYXZlUHVibGljKSB7XG4gICAgICAgICAgICBET0NVTUVOVF9OT0RFLnNldFBsdWdpbkRhdGEoa2V5LCB2YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB5aWVsZCBmaWdtYS5jbGllbnRTdG9yYWdlLnNldEFzeW5jKGtleSwgdmFsdWUpO1xuICAgICAgICB9XG4gICAgICAgIC8vIE1ha2Ugc3VyZSB0aGF0IHZhcmlhYmxlIGdldHMgdXBkYXRlZFxuICAgICAgICBpZiAoa2V5ID09PSBDT01QQU5ZX05BTUVfS0VZKVxuICAgICAgICAgICAgY29tcGFueV9uYW1lID0gdmFsdWU7XG4gICAgICAgIGVsc2UgaWYgKGtleSA9PT0gUFJPSkVDVF9JRF9LRVkpXG4gICAgICAgICAgICBwcm9qZWN0X2lkID0gdmFsdWU7XG4gICAgICAgIGVsc2UgaWYgKGtleSA9PT0gVVNFUk5BTUVfS0VZKVxuICAgICAgICAgICAgdXNlcm5hbWUgPSB2YWx1ZTtcbiAgICAgICAgZWxzZSBpZiAoa2V5ID09PSBQQVNTV09SRF9LRVkpXG4gICAgICAgICAgICBwYXNzd29yZCA9IHZhbHVlO1xuICAgICAgICBlbHNlIGlmIChrZXkgPT09IElTU1VFX0lEX0tFWSlcbiAgICAgICAgICAgIGlzc3VlSWQgPSB2YWx1ZTtcbiAgICAgICAgZWxzZSBpZiAoa2V5ID09PSBDUkVBVEVfTElOS19LRVkpXG4gICAgICAgICAgICBjcmVhdGVMaW5rID0gdmFsdWU7XG4gICAgfSk7XG59XG4vLyBHZXQgYXV0aG9yaXphdGlvbiBkZXRhaWxzIGZyb20gY2xpZW50IHN0b3JhZ2VcbmZ1bmN0aW9uIGdldEF1dGhvcml6YXRpb25JbmZvKGtleSwgc2F2ZWRQdWJsaWMgPSBmYWxzZSkge1xuICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgIHZhciB2YWx1ZVNhdmVkO1xuICAgICAgICBpZiAoc2F2ZWRQdWJsaWMpIHtcbiAgICAgICAgICAgIHZhbHVlU2F2ZWQgPSBET0NVTUVOVF9OT0RFLmdldFBsdWdpbkRhdGEoa2V5KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHZhbHVlU2F2ZWQgPSB5aWVsZCBmaWdtYS5jbGllbnRTdG9yYWdlLmdldEFzeW5jKGtleSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCF2YWx1ZVNhdmVkICYmIHZhbHVlU2F2ZWQgIT0gZmFsc2UpXG4gICAgICAgICAgICB2YWx1ZVNhdmVkID0gXCJcIjtcbiAgICAgICAgcmV0dXJuIHZhbHVlU2F2ZWQ7XG4gICAgfSk7XG59XG4vKipcbiAqIEdldCBzdWJzZXQgb2YgdGlja2V0cyBpbiBkb2N1bWVudCBhbmQgc3RhcnQgdXBkYXRlIHByb2Nlc3NcbiAqIEBwYXJhbSBzdWJzZXQgQSBzdWJzZXQgb2YgdGlja2V0IGluc3RhbmNlcyBpbiB0aGUgZG9jdW1lbnRcbiAqIEByZXR1cm5zIEJvb2xlYW4gaWYgdGhlIHN1YnNldCBjb3VsZCBiZSB1cGRhdGVkXG4gKi9cbmZ1bmN0aW9uIHJlcXVlc3RVcGRhdGVGb3JUaWNrZXRzKHN1YnNldCkge1xuICAgIGxldCBub2RlcztcbiAgICBsZXQgaXNGYWlsZWQgPSBmYWxzZTtcbiAgICAvLyBBbGwgaW4gZG9jdW1lbnRcbiAgICBpZiAoc3Vic2V0ID09IFwiYWxsXCIpIHtcbiAgICAgICAgbm9kZXMgPSBET0NVTUVOVF9OT0RFLmZpbmRBbGxXaXRoQ3JpdGVyaWEoe1xuICAgICAgICAgICAgdHlwZXM6IFsnSU5TVEFOQ0UnXVxuICAgICAgICB9KTtcbiAgICAgICAgbm9kZXMgPSBub2Rlcy5maWx0ZXIobm9kZSA9PiBub2RlLm5hbWUgPT09IENPTVBPTkVOVF9TRVRfTkFNRSk7XG4gICAgICAgIGlmIChub2Rlcy5sZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgZmlnbWEubm90aWZ5KGBObyBpbnN0YW5jZXMgbmFtZWQgJyR7Q09NUE9ORU5UX1NFVF9OQU1FfScgZm91bmQgaW4gZG9jdW1lbnQuYCk7XG4gICAgICAgICAgICBpc0ZhaWxlZCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBnZXREYXRhRm9yVGlja2V0cyhub2Rlcyk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8gQWxsIG9uIHBhZ2VcbiAgICBlbHNlIGlmIChzdWJzZXQgPT0gXCJwYWdlXCIpIHtcbiAgICAgICAgbm9kZXMgPSBmaWdtYS5jdXJyZW50UGFnZS5maW5kQWxsV2l0aENyaXRlcmlhKHtcbiAgICAgICAgICAgIHR5cGVzOiBbJ0lOU1RBTkNFJ11cbiAgICAgICAgfSk7XG4gICAgICAgIG5vZGVzID0gbm9kZXMuZmlsdGVyKG5vZGUgPT4gbm9kZS5uYW1lID09PSBDT01QT05FTlRfU0VUX05BTUUpO1xuICAgICAgICBpZiAobm9kZXMubGVuZ3RoID09IDApIHtcbiAgICAgICAgICAgIGZpZ21hLm5vdGlmeShgTm8gaW5zdGFuY2VzIG5hbWVkICcke0NPTVBPTkVOVF9TRVRfTkFNRX0nIGZvdW5kIG9uIHBhZ2UuYCk7XG4gICAgICAgICAgICBpc0ZhaWxlZCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBnZXREYXRhRm9yVGlja2V0cyhub2Rlcyk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8gU2VsZWN0ZWQgZWxlbWVudHNcbiAgICBlbHNlIGlmIChzdWJzZXQgPT0gXCJzZWxlY3Rpb25cIikge1xuICAgICAgICBub2RlcyA9IGZpZ21hLmN1cnJlbnRQYWdlLnNlbGVjdGlvbjtcbiAgICAgICAgaWYgKG5vZGVzLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgICAgICBmaWdtYS5ub3RpZnkoYE5vdGhpbmcgc2VsZWN0ZWQuYCk7XG4gICAgICAgICAgICBpc0ZhaWxlZCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBnZXREYXRhRm9yVGlja2V0cyhub2Rlcyk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGlzRmFpbGVkO1xufVxuLyoqXG4gKiBTZW5kcyBhIHJlcXVlc3QgdG8gdGhlIFVJIHRvIGZldGNoIGRhdGEgZm9yIGFuIGFycmF5IG9mIHRpY2tldHNcbiAqIEBwYXJhbSBpbnN0YW5jZXNcbiAqL1xuZnVuY3Rpb24gZ2V0RGF0YUZvclRpY2tldHMoaW5zdGFuY2VzKSB7XG4gICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgdmFyIG5vZGVJZHMgPSBbXTtcbiAgICAgICAgdmFyIGlzc3VlSWRzID0gW107XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaW5zdGFuY2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCBub2RlID0gaW5zdGFuY2VzW2ldO1xuICAgICAgICAgICAgaWYgKG5vZGUudHlwZSAhPT0gXCJJTlNUQU5DRVwiKSB7XG4gICAgICAgICAgICAgICAgZmlnbWEubm90aWZ5KFwiVGhlIGVsZW1lbnQgbmVlZHMgdG8gYmUgYW4gaW5zdGFuY2Ugb2YgXCIgKyBDT01QT05FTlRfU0VUX05BTUUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgbGV0IGlzc3VlSWROb2RlID0gbm9kZS5maW5kT25lKG4gPT4gbi50eXBlID09PSBcIlRFWFRcIiAmJiBuLm5hbWUgPT09IElTU1VFX0lEX05BTUUpO1xuICAgICAgICAgICAgICAgIGlmICghaXNzdWVJZE5vZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgZmlnbWEubm90aWZ5KGBBdCBsZWFzdCBvbmUgaW5zdGFuY2UgaXMgbWlzc2luZyB0aGUgdGV4dCBlbGVtZW50ICcke0lTU1VFX0lEX05BTUV9Jy4gQ291bGQgbm90IHVwZGF0ZS5gKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGlzc3VlSWRzLnB1c2goaXNzdWVJZE5vZGUuY2hhcmFjdGVycyk7XG4gICAgICAgICAgICAgICAgICAgIG5vZGVJZHMucHVzaChub2RlLmlkKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZmlnbWEudWkucG9zdE1lc3NhZ2UoeyBub2RlSWRzOiBub2RlSWRzLCBpc3N1ZUlkczogaXNzdWVJZHMsIHR5cGU6ICdnZXRUaWNrZXREYXRhJyB9KTtcbiAgICB9KTtcbn1cbi8qKlxuICogVXBkYXRlcyBhIHNldCBvZiB0aWNrZXRzIGJhc2VkIG9uIHRoZWlyIHN0YXR1cy5cbiAqIElzIGNhbGxlZCBhZnRlciB0aGUgZGF0YSBpcyBmZXRjaGVkLlxuICogQHBhcmFtIHRpY2tldEluc3RhbmNlcyBBIHNldCBvZiB0aWNrZXQgaW5zdGFuY2VzXG4gKiBAcGFyYW0gbXNnIEEgbWVzc2FnZSBzZW50IGZyb20gdGhlIFVJXG4gKiBAcGFyYW0gaXNDcmVhdGVOZXcgV2V0aGVyIHRoZSBmdW5jdGlvbiBjYWxsIGlzIGNvbWluZyBmcm9tIGFuIGFjdHVhbCB0aWNrZXQgdXBkYXRlIG9yIGZyb20gY3JlYXRpbmcgYSBuZXcgdGlja2V0XG4gKiBAcmV0dXJucyBVcGRhdGVkIHRpY2tldCBpbnN0YW5jZXNcbiAqL1xuZnVuY3Rpb24gdXBkYXRlVGlja2V0cyh0aWNrZXRJbnN0YW5jZXMsIG1zZywgaXNDcmVhdGVOZXcgPSBmYWxzZSkge1xuICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgIHZhciB0aWNrZXREYXRhQXJyYXkgPSBtc2cuZGF0YTtcbiAgICAgICAgdmFyIGlzc3VlSWRzID0gbXNnLmlzc3VlSWRzO1xuICAgICAgICB2YXIgbnVtYmVyT2ZOb2RlcyA9IHRpY2tldEluc3RhbmNlcy5sZW5ndGg7XG4gICAgICAgIHZhciBpbnZhbGlkSWRzID0gW107XG4gICAgICAgIHZhciBudW1iZXJPZk1pc3NpbmdUaXRsZXMgPSAwO1xuICAgICAgICB2YXIgbnVtYmVyT2ZNaXNzaW5nRGF0ZXMgPSAwO1xuICAgICAgICB2YXIgbnVtYmVyT2ZNaXNzaW5nQXNzaWduZWVzID0gMDtcbiAgICAgICAgdmFyIG1pc3NpbmdWYXJpYW50cyA9IFtdO1xuICAgICAgICAvLyBHbyB0aHJvdWdoIGFsbCBub2RlcyBhbmQgdXBkYXRlIHRoZWlyIGNvbnRlbnRcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBudW1iZXJPZk5vZGVzOyBpKyspIHtcbiAgICAgICAgICAgIGxldCB0aWNrZXRJbnN0YW5jZSA9IHRpY2tldEluc3RhbmNlc1tpXTtcbiAgICAgICAgICAgIGxldCB0aWNrZXREYXRhID0gY2hlY2tUaWNrZXREYXRhUmVwb25zZSh0aWNrZXREYXRhQXJyYXlbaV0sIGlzc3VlSWRzW2ldKTtcbiAgICAgICAgICAgIGxldCB0aWNrZXRTdGF0dXMgPSBnZXRTdGF0dXModGlja2V0RGF0YSk7XG4gICAgICAgICAgICBpZiAodGlja2V0U3RhdHVzID09PSAnRXJyb3InKVxuICAgICAgICAgICAgICAgIGludmFsaWRJZHMucHVzaChpc3N1ZUlkc1tpXSk7XG4gICAgICAgICAgICAvLyBHZXQgdGhlIHZhcmlhbnQgYmFzZWQgb24gdGhlIHRpY2tldCBzdGF0dXMgYW5kIHN3YXAgaXQgd2l0aCB0aGUgY3VycmVudFxuICAgICAgICAgICAgbGV0IG5ld1ZhcmlhbnQgPSB0aWNrZXRDb21wb25lbnQuZmluZENoaWxkKG4gPT4gbi5uYW1lID09PSBDT01QT05FTlRfU0VUX1BST1BFUlRZX05BTUUgKyB0aWNrZXRTdGF0dXMpO1xuICAgICAgICAgICAgaWYgKCFuZXdWYXJpYW50KSB7IC8vIElmIHRoZSBzdGF0dXMgZG9lc24ndCBtYXRjaCBhbnkgb2YgdGhlIHZhcmlhbnRzLCB1c2UgZGVmYXVsdFxuICAgICAgICAgICAgICAgIG5ld1ZhcmlhbnQgPSB0aWNrZXRDb21wb25lbnQuZGVmYXVsdFZhcmlhbnQ7XG4gICAgICAgICAgICAgICAgbWlzc2luZ1ZhcmlhbnRzLnB1c2godGlja2V0U3RhdHVzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIFVwZGF0ZSB0aXRsZVxuICAgICAgICAgICAgbGV0IHRpdGxlVHh0ID0gdGlja2V0SW5zdGFuY2UuZmluZE9uZShuID0+IG4udHlwZSA9PT0gXCJURVhUXCIgJiYgbi5uYW1lID09PSBJU1NVRV9USVRMRV9OQU1FKTtcbiAgICAgICAgICAgIGlmICh0aXRsZVR4dCkge1xuICAgICAgICAgICAgICAgIHlpZWxkIGZpZ21hLmxvYWRGb250QXN5bmModGl0bGVUeHQuZm9udE5hbWUpO1xuICAgICAgICAgICAgICAgIHRpdGxlVHh0LmNoYXJhY3RlcnMgPSBnZXRUaXRsZSh0aWNrZXREYXRhKTtcbiAgICAgICAgICAgICAgICB0aXRsZVR4dC5oeXBlcmxpbmsgPSB7IHR5cGU6IFwiVVJMXCIsIHZhbHVlOiBgaHR0cHM6Ly8ke2NvbXBhbnlfbmFtZX0uYXRsYXNzaWFuLm5ldC9icm93c2UvJHt0aWNrZXREYXRhLmtleX1gIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBudW1iZXJPZk1pc3NpbmdUaXRsZXMgKz0gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIFVwZGF0ZSBkYXRlXG4gICAgICAgICAgICBsZXQgY2hhbmdlRGF0ZVR4dCA9IHRpY2tldEluc3RhbmNlLmZpbmRPbmUobiA9PiBuLnR5cGUgPT09IFwiVEVYVFwiICYmIG4ubmFtZSA9PT0gSVNTVUVfQ0hBTkdFX0RBVEVfTkFNRSk7XG4gICAgICAgICAgICBpZiAoY2hhbmdlRGF0ZVR4dCkge1xuICAgICAgICAgICAgICAgIHlpZWxkIGZpZ21hLmxvYWRGb250QXN5bmMoY2hhbmdlRGF0ZVR4dC5mb250TmFtZSk7XG4gICAgICAgICAgICAgICAgLy8gRmlsdGVycyBvdXQgdGhlIGRhdGEgdG8gYSBzaW1wbGV0IGZvcm1hdCAoTW1tIEREIFlZWVkpXG4gICAgICAgICAgICAgICAgdmFyIGRhdGUgPSBuZXcgRGF0ZShnZXRDaGFuZ2VEYXRlKHRpY2tldERhdGEpLnJlcGxhY2UoL1tUXSsuKi8sIFwiXCIpKTtcbiAgICAgICAgICAgICAgICBjaGFuZ2VEYXRlVHh0LmNoYXJhY3RlcnMgPSBkYXRlLnRvRGF0ZVN0cmluZygpO1xuICAgICAgICAgICAgICAgIC8vIGNoYW5nZURhdGVUeHQuY2hhcmFjdGVycyA9IGRhdGUudG9EYXRlU3RyaW5nKCkucmVwbGFjZSgvXihbQS1aYS16XSopLi8sXCJcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBudW1iZXJPZk1pc3NpbmdEYXRlcyArPSAxO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gVXBkYXRlIGFzc2lnbmVlXG4gICAgICAgICAgICBsZXQgYXNzaWduZWVUeHQgPSB0aWNrZXRJbnN0YW5jZS5maW5kT25lKG4gPT4gbi50eXBlID09PSBcIlRFWFRcIiAmJiBuLm5hbWUgPT09IEFTU0lHTkVFX05BTUUpO1xuICAgICAgICAgICAgaWYgKGFzc2lnbmVlVHh0KSB7XG4gICAgICAgICAgICAgICAgeWllbGQgZmlnbWEubG9hZEZvbnRBc3luYyhhc3NpZ25lZVR4dC5mb250TmFtZSk7XG4gICAgICAgICAgICAgICAgaWYgKHRpY2tldERhdGEuZmllbGRzLmFzc2lnbmVlKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBhc3NpZ25lZSA9IGdldEFzc2lnbmVlKHRpY2tldERhdGEpO1xuICAgICAgICAgICAgICAgICAgICBhc3NpZ25lZVR4dC5jaGFyYWN0ZXJzID0gYXNzaWduZWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBhc3NpZ25lZVR4dC5jaGFyYWN0ZXJzID0gXCJOb3QgYXNzaWduZWRcIjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBudW1iZXJPZk1pc3NpbmdBc3NpZ25lZXMgKz0gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIEFkZCB0aGUgcmVsYXVuY2ggYnV0dG9uXG4gICAgICAgICAgICB0aWNrZXRJbnN0YW5jZS5zd2FwQ29tcG9uZW50KG5ld1ZhcmlhbnQpO1xuICAgICAgICAgICAgdGlja2V0SW5zdGFuY2Uuc2V0UmVsYXVuY2hEYXRhKHsgdXBkYXRlX3NlbGVjdGlvbjogJycgfSk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gTm90aWZ5IGFib3V0IGVycm9ycyAobWlzc2luZyB0ZXh0IGZpZWxkcylcbiAgICAgICAgaWYgKG1pc3NpbmdWYXJpYW50cy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBtaXNzaW5nVmFyaWFudHMgPSBbLi4ubmV3IFNldChtaXNzaW5nVmFyaWFudHMpXTtcbiAgICAgICAgICAgIGxldCB2YXJpYW50U3RyaW5nID0gbWlzc2luZ1ZhcmlhbnRzLmpvaW4oXCInLCAnXCIpO1xuICAgICAgICAgICAgZmlnbWEubm90aWZ5KGBTdGF0dXMgJyR7dmFyaWFudFN0cmluZ30nIG5vdCBleGlzdGluZy4gWW91IGNhbiBhZGQgaXQgYXMgYSBuZXcgdmFyaWFudCB0byB0aGUgbWFpbiBjb21wb25lbnQuYCwgeyB0aW1lb3V0OiA2MDAwIH0pO1xuICAgICAgICB9XG4gICAgICAgIGlmIChudW1iZXJPZk1pc3NpbmdUaXRsZXMgPiAwKVxuICAgICAgICAgICAgZmlnbWEubm90aWZ5KGAke251bWJlck9mTWlzc2luZ1RpdGxlc30gdGlja2V0cyBhcmUgbWlzc2luZyB0ZXh0IGVsZW1lbnQgJyR7SVNTVUVfVElUTEVfTkFNRX0nLmApO1xuICAgICAgICBpZiAobnVtYmVyT2ZNaXNzaW5nRGF0ZXMgPiAwKVxuICAgICAgICAgICAgZmlnbWEubm90aWZ5KGAke251bWJlck9mTWlzc2luZ0RhdGVzfSB0aWNrZXRzIGFyZSBtaXNzaW5nIHRleHQgZWxlbWVudCAnJHtJU1NVRV9DSEFOR0VfREFURV9OQU1FfScuYCk7XG4gICAgICAgIGlmIChudW1iZXJPZk1pc3NpbmdBc3NpZ25lZXMgPiAwKVxuICAgICAgICAgICAgZmlnbWEubm90aWZ5KGAke251bWJlck9mTWlzc2luZ0Fzc2lnbmVlc30gdGlja2V0cyBhcmUgbWlzc2luZyB0ZXh0IGVsZW1lbnQgJyR7QVNTSUdORUVfTkFNRX0nLmApO1xuICAgICAgICAvLyBTdWNjZXNzIG1lc3NhZ2VcbiAgICAgICAgdmFyIG1lc3NhZ2U7XG4gICAgICAgIHZhciBudW1iZXJPZkludmFsaWRJZHMgPSBpbnZhbGlkSWRzLmxlbmd0aDtcbiAgICAgICAgaWYgKG51bWJlck9mSW52YWxpZElkcyA9PSBudW1iZXJPZk5vZGVzKSB7XG4gICAgICAgICAgICAvLyBBbGwgaW52YWxpZFxuICAgICAgICAgICAgbWVzc2FnZSA9IChudW1iZXJPZk5vZGVzID09IDEpID8gXCJJbnZhbGlkIElELlwiIDogYCR7bnVtYmVyT2ZJbnZhbGlkSWRzfSBvZiAke251bWJlck9mTm9kZXN9IElEcyBhcmUgaW52YWxpZCBvciBkbyBub3QgZXhpc3QuYDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChudW1iZXJPZkludmFsaWRJZHMgPT0gMCkge1xuICAgICAgICAgICAgLy8gQWxsIHZhbGlkXG4gICAgICAgICAgICBtZXNzYWdlID0gKG51bWJlck9mTm9kZXMgPT0gMSkgPyBcIlVwZGF0ZWQuXCIgOiBgJHtudW1iZXJPZk5vZGVzfSBvZiAke251bWJlck9mTm9kZXN9IGhlYWRlcihzKSB1cGRhdGVkIWA7XG4gICAgICAgICAgICBpZiAoaXNDcmVhdGVOZXcpXG4gICAgICAgICAgICAgICAgbWVzc2FnZSA9IFwiXCI7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAvLyBTb21lIHZhbGlkXG4gICAgICAgICAgICBsZXQgZmlyc3RTZW50ZW5jZSA9IGAke251bWJlck9mTm9kZXMgLSBudW1iZXJPZkludmFsaWRJZHN9IG9mICR7bnVtYmVyT2ZOb2Rlc30gc3VjY2Vzc2Z1bGx5IHVwZGF0ZWQuIGA7XG4gICAgICAgICAgICBsZXQgc2Vjb25kU2VudGVuY2UgPSAobnVtYmVyT2ZJbnZhbGlkSWRzID09IDEpID8gXCIxIElEIGlzIGludmFsaWQgb3IgZG9lcyBub3QgZXhpc3QuXCIgOiBgJHtudW1iZXJPZkludmFsaWRJZHN9IElEcyBhcmUgaW52YWxpZCBvciBkbyBub3QgZXhpc3QuYDtcbiAgICAgICAgICAgIG1lc3NhZ2UgPSBmaXJzdFNlbnRlbmNlICsgc2Vjb25kU2VudGVuY2U7XG4gICAgICAgIH1cbiAgICAgICAgLy8gSWYgY2FsbGVkIHZpYSB0aGUgcmVsYXVuY2ggYnV0dG9uLCBjbG9zZSBwbHVnaW4gYWZ0ZXIgdXBkYXRpbmcgdGhlIHRpY2tldHNcbiAgICAgICAgaWYgKGZpZ21hLmNvbW1hbmQgPT09ICd1cGRhdGVfcGFnZScgfHwgZmlnbWEuY29tbWFuZCA9PT0gJ3VwZGF0ZV9hbGwnIHx8IGZpZ21hLmNvbW1hbmQgPT09ICd1cGRhdGVfc2VsZWN0aW9uJykge1xuICAgICAgICAgICAgZmlnbWEuY2xvc2VQbHVnaW4obWVzc2FnZSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBmaWdtYS5ub3RpZnkobWVzc2FnZSwgeyB0aW1lb3V0OiAyMDAwIH0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aWNrZXRJbnN0YW5jZXM7XG4gICAgfSk7XG59XG4vKipcbiAqIENyZWF0ZSBpbnN0YW5jZXMgb2YgdGhlIG1haW4gdGlja2V0IGNvbXBvbmVudCBhbmQgcmVwbGFjZXMgdGhlIGNvbnRlbnQgd2l0aCBkYXRhIG9mIHRoZSBhY3R1YWwgSmlyYSB0aWNrZXRcbiAqIEBwYXJhbSBtc2cgSlNPTiB3aXRoIGluZm8gc2VudCBmcm9tIFVJXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZVRpY2tldEluc3RhbmNlKG1zZykge1xuICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgIC8vIENyZWF0ZSBhbiBpbnN0YW5jZSBhbmQgdXBkYXRlIGl0IHRvIHRoZSBjb3JyZWN0IHN0YXR1c1xuICAgICAgICBsZXQgdGlja2V0VmFyaWFudCA9IHRpY2tldENvbXBvbmVudC5kZWZhdWx0VmFyaWFudDtcbiAgICAgICAgbGV0IHRpY2tldEluc3RhbmNlID0gdGlja2V0VmFyaWFudC5jcmVhdGVJbnN0YW5jZSgpO1xuICAgICAgICB0aWNrZXRJbnN0YW5jZS54ID0gKGZpZ21hLnZpZXdwb3J0LmNlbnRlci54IC0gdGlja2V0SW5zdGFuY2Uud2lkdGggLyAyKSArIG5leHRUaWNrZXRPZmZzZXQ7XG4gICAgICAgIHRpY2tldEluc3RhbmNlLnkgPSAoZmlnbWEudmlld3BvcnQuY2VudGVyLnkgLSB0aWNrZXRJbnN0YW5jZS5oZWlnaHQgLyAyKSArIG5leHRUaWNrZXRPZmZzZXQ7XG4gICAgICAgIG5leHRUaWNrZXRPZmZzZXQgPSAobmV4dFRpY2tldE9mZnNldCArIDEwKSAlIDcwO1xuICAgICAgICBmaWdtYS5jdXJyZW50UGFnZS5zZWxlY3Rpb24gPSBbdGlja2V0SW5zdGFuY2VdO1xuICAgICAgICBsZXQgdGlja2V0RGF0YSA9IGNoZWNrVGlja2V0RGF0YVJlcG9uc2UobXNnLmRhdGFbMF0sIG1zZy5pc3N1ZUlkc1swXSk7XG4gICAgICAgIGxldCB0aWNrZXRJbnN0YW5jZXMgPSB5aWVsZCB1cGRhdGVUaWNrZXRzKFt0aWNrZXRJbnN0YW5jZV0sIG1zZywgdHJ1ZSk7XG4gICAgICAgIHRpY2tldEluc3RhbmNlID0gdGlja2V0SW5zdGFuY2VzWzBdO1xuICAgICAgICAvLyBBZGQgSURcbiAgICAgICAgbGV0IGlzc3VlSURUeHQgPSB0aWNrZXRJbnN0YW5jZS5maW5kT25lKG4gPT4gbi50eXBlID09PSBcIlRFWFRcIiAmJiBuLm5hbWUgPT09IElTU1VFX0lEX05BTUUpO1xuICAgICAgICBpZiAoaXNzdWVJRFR4dCkge1xuICAgICAgICAgICAgeWllbGQgZmlnbWEubG9hZEZvbnRBc3luYyhpc3N1ZUlEVHh0LmZvbnROYW1lKTtcbiAgICAgICAgICAgIGlzc3VlSURUeHQuY2hhcmFjdGVycyA9IGdldElzc3VlSWQodGlja2V0RGF0YSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBmaWdtYS5ub3RpZnkoXCJDb3VsZCBub3QgZmluZCB0ZXh0IGVsZW1lbnQgbmFtZWQgJ1wiICsgSVNTVUVfSURfTkFNRSArIFwiJy5cIik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRpY2tldEluc3RhbmNlO1xuICAgIH0pO1xufVxuLyoqXG4gKiBDcmVhdGVzIGEgbmV3IGNvbXBvbmVudCB0aGF0IHJlcHJlc2VudHMgYSB0aWNrZXQgc3RhdHVzXG4gKiBAcGFyYW0gc3RhdHVzQ29sb3IgUkdCIHZhbHVlIGZvciBzdGF0dXMgY29sb3JcbiAqIEBwYXJhbSBzdGF0dXNOYW1lIE5hbWUgb2Ygc3RhdHVzXG4gKiBAcmV0dXJucyBBIGNvbXBvbmVudCB0aGF0IHJlcHJlc2VudCBhIHRpY2tldFxuICovXG5mdW5jdGlvbiBjcmVhdGVUaWNrZXRWYXJpYW50KHN0YXR1c0NvbG9yLCBzdGF0dXNOYW1lKSB7XG4gICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgLy8gQ3JlYXRlIHRoZSBtYWluIGZyYW1lXG4gICAgICAgIHZhciB0aWNrZXRWYXJpYW50ID0gZmlnbWEuY3JlYXRlQ29tcG9uZW50KCk7XG4gICAgICAgIGxldCBwYWRkaW5nID0gMjQ7XG4gICAgICAgIHRpY2tldFZhcmlhbnQubmFtZSA9IHN0YXR1c05hbWU7XG4gICAgICAgIHRpY2tldFZhcmlhbnQubGF5b3V0TW9kZSA9IFwiVkVSVElDQUxcIjtcbiAgICAgICAgdGlja2V0VmFyaWFudC5yZXNpemUoNjAwLCAyMDApO1xuICAgICAgICB0aWNrZXRWYXJpYW50LmNvdW50ZXJBeGlzU2l6aW5nTW9kZSA9IFwiRklYRURcIjtcbiAgICAgICAgdGlja2V0VmFyaWFudC5wcmltYXJ5QXhpc1NpemluZ01vZGUgPSBcIkFVVE9cIjtcbiAgICAgICAgdGlja2V0VmFyaWFudC5wYWRkaW5nVG9wID0gcGFkZGluZztcbiAgICAgICAgdGlja2V0VmFyaWFudC5wYWRkaW5nUmlnaHQgPSBwYWRkaW5nO1xuICAgICAgICB0aWNrZXRWYXJpYW50LnBhZGRpbmdCb3R0b20gPSBwYWRkaW5nO1xuICAgICAgICB0aWNrZXRWYXJpYW50LnBhZGRpbmdMZWZ0ID0gcGFkZGluZztcbiAgICAgICAgdGlja2V0VmFyaWFudC5pdGVtU3BhY2luZyA9IDE2O1xuICAgICAgICB0aWNrZXRWYXJpYW50LmNvcm5lclJhZGl1cyA9IDQ7XG4gICAgICAgIHRpY2tldFZhcmlhbnQuZmlsbHMgPSBbeyB0eXBlOiAnU09MSUQnLCBjb2xvcjogc3RhdHVzQ29sb3IgfV07XG4gICAgICAgIC8vIENyZWF0ZSB0aGUgaGVhZGVyIGZyYW1lXG4gICAgICAgIHZhciBoZWFkZXJGcmFtZSA9IGZpZ21hLmNyZWF0ZUZyYW1lKCk7XG4gICAgICAgIGhlYWRlckZyYW1lLm5hbWUgPSBcIkNvbnRhaW5lclwiO1xuICAgICAgICBoZWFkZXJGcmFtZS5sYXlvdXRNb2RlID0gXCJIT1JJWk9OVEFMXCI7XG4gICAgICAgIGhlYWRlckZyYW1lLmNvdW50ZXJBeGlzU2l6aW5nTW9kZSA9IFwiQVVUT1wiO1xuICAgICAgICBoZWFkZXJGcmFtZS5sYXlvdXRBbGlnbiA9IFwiU1RSRVRDSFwiO1xuICAgICAgICBoZWFkZXJGcmFtZS5pdGVtU3BhY2luZyA9IDQwO1xuICAgICAgICBoZWFkZXJGcmFtZS5maWxscyA9IFtdO1xuICAgICAgICAvLyBDcmVhdGUgdGhlIGhlYWRlciBmcmFtZVxuICAgICAgICB2YXIgZGV0YWlsc0ZyYW1lID0gZmlnbWEuY3JlYXRlRnJhbWUoKTtcbiAgICAgICAgZGV0YWlsc0ZyYW1lLm5hbWUgPSBcIkNvbnRhaW5lclwiO1xuICAgICAgICBkZXRhaWxzRnJhbWUubGF5b3V0TW9kZSA9IFwiSE9SSVpPTlRBTFwiO1xuICAgICAgICBkZXRhaWxzRnJhbWUuY291bnRlckF4aXNTaXppbmdNb2RlID0gXCJBVVRPXCI7XG4gICAgICAgIGRldGFpbHNGcmFtZS5sYXlvdXRBbGlnbiA9IFwiU1RSRVRDSFwiO1xuICAgICAgICBkZXRhaWxzRnJhbWUuaXRlbVNwYWNpbmcgPSAzMjtcbiAgICAgICAgZGV0YWlsc0ZyYW1lLmZpbGxzID0gW107XG4gICAgICAgIGxvYWRGb250cygpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgLy8gQWRkIHRoZSB0aWNrZXQgdGV4dCBmaWVsZHNcbiAgICAgICAgICAgIGNvbnN0IHRpdGxlVHh0ID0gZmlnbWEuY3JlYXRlVGV4dCgpO1xuICAgICAgICAgICAgdGl0bGVUeHQuZm9udE5hbWUgPSBGT05UX1JFRztcbiAgICAgICAgICAgIHRpdGxlVHh0LmZvbnRTaXplID0gMzI7XG4gICAgICAgICAgICB0aXRsZVR4dC50ZXh0RGVjb3JhdGlvbiA9IFwiVU5ERVJMSU5FXCI7XG4gICAgICAgICAgICB0aXRsZVR4dC5hdXRvUmVuYW1lID0gZmFsc2U7XG4gICAgICAgICAgICB0aXRsZVR4dC5jaGFyYWN0ZXJzID0gXCJUaWNrZXQgdGl0bGVcIjtcbiAgICAgICAgICAgIHRpdGxlVHh0Lm5hbWUgPSBJU1NVRV9USVRMRV9OQU1FO1xuICAgICAgICAgICAgY29uc3QgaXNzdWVJZFR4dCA9IGZpZ21hLmNyZWF0ZVRleHQoKTtcbiAgICAgICAgICAgIGlzc3VlSWRUeHQuZm9udE5hbWUgPSBGT05UX01FRDtcbiAgICAgICAgICAgIGlzc3VlSWRUeHQuZm9udFNpemUgPSAzMjtcbiAgICAgICAgICAgIGlzc3VlSWRUeHQuYXV0b1JlbmFtZSA9IGZhbHNlO1xuICAgICAgICAgICAgaXNzdWVJZFR4dC5jaGFyYWN0ZXJzID0gXCJJRC0xXCI7XG4gICAgICAgICAgICBpc3N1ZUlkVHh0Lm5hbWUgPSBJU1NVRV9JRF9OQU1FO1xuICAgICAgICAgICAgY29uc3QgY2hhbmdlRGF0ZVR4dCA9IGZpZ21hLmNyZWF0ZVRleHQoKTtcbiAgICAgICAgICAgIGNoYW5nZURhdGVUeHQuZm9udE5hbWUgPSBGT05UX1JFRztcbiAgICAgICAgICAgIGNoYW5nZURhdGVUeHQuZm9udFNpemUgPSAyNDtcbiAgICAgICAgICAgIGNoYW5nZURhdGVUeHQuYXV0b1JlbmFtZSA9IGZhbHNlO1xuICAgICAgICAgICAgY2hhbmdlRGF0ZVR4dC5jaGFyYWN0ZXJzID0gXCJNTSBERCBZWVlZXCI7XG4gICAgICAgICAgICBjaGFuZ2VEYXRlVHh0Lm5hbWUgPSBJU1NVRV9DSEFOR0VfREFURV9OQU1FO1xuICAgICAgICAgICAgY29uc3QgYXNzaWduZWVUeHQgPSBmaWdtYS5jcmVhdGVUZXh0KCk7XG4gICAgICAgICAgICBhc3NpZ25lZVR4dC5mb250TmFtZSA9IEZPTlRfUkVHO1xuICAgICAgICAgICAgYXNzaWduZWVUeHQuZm9udFNpemUgPSAyNDtcbiAgICAgICAgICAgIGFzc2lnbmVlVHh0LmF1dG9SZW5hbWUgPSBmYWxzZTtcbiAgICAgICAgICAgIGFzc2lnbmVlVHh0LmNoYXJhY3RlcnMgPSBcIk5hbWUgb2YgYXNzaWduZWVcIjtcbiAgICAgICAgICAgIGFzc2lnbmVlVHh0Lm5hbWUgPSBBU1NJR05FRV9OQU1FO1xuICAgICAgICAgICAgdGlja2V0VmFyaWFudC5hcHBlbmRDaGlsZChoZWFkZXJGcmFtZSk7XG4gICAgICAgICAgICB0aWNrZXRWYXJpYW50LmFwcGVuZENoaWxkKGRldGFpbHNGcmFtZSk7XG4gICAgICAgICAgICBoZWFkZXJGcmFtZS5hcHBlbmRDaGlsZChpc3N1ZUlkVHh0KTtcbiAgICAgICAgICAgIGhlYWRlckZyYW1lLmFwcGVuZENoaWxkKHRpdGxlVHh0KTtcbiAgICAgICAgICAgIGRldGFpbHNGcmFtZS5hcHBlbmRDaGlsZChhc3NpZ25lZVR4dCk7XG4gICAgICAgICAgICBkZXRhaWxzRnJhbWUuYXBwZW5kQ2hpbGQoY2hhbmdlRGF0ZVR4dCk7XG4gICAgICAgICAgICB0aXRsZVR4dC5sYXlvdXRHcm93ID0gMTtcbiAgICAgICAgICAgIGFzc2lnbmVlVHh0LmxheW91dEdyb3cgPSAxO1xuICAgICAgICB9KS5jYXRjaCgoKSA9PiB7XG4gICAgICAgICAgICBmaWdtYS5ub3RpZnkoXCJGb250ICdcIiArIEZPTlRfUkVHLmZhbWlseSArIFwiJyBjb3VsZCBub3QgYmUgbG9hZGVkLiBQbGVhc2UgaW5zdGFsbCB0aGUgZm9udC5cIik7XG4gICAgICAgIH0pO1xuICAgICAgICAvLyBGaXhlcyBhIHdlaXJkIGJ1ZyBpbiB3aGljaCB0aGUgJ3N0cmV0Y2gnIGRvZXNudCB3b3JrIHByb3Blcmx5XG4gICAgICAgIGhlYWRlckZyYW1lLnByaW1hcnlBeGlzU2l6aW5nTW9kZSA9IFwiRklYRURcIjtcbiAgICAgICAgaGVhZGVyRnJhbWUubGF5b3V0QWxpZ24gPSBcIlNUUkVUQ0hcIjtcbiAgICAgICAgZGV0YWlsc0ZyYW1lLnByaW1hcnlBeGlzU2l6aW5nTW9kZSA9IFwiRklYRURcIjtcbiAgICAgICAgZGV0YWlsc0ZyYW1lLmxheW91dEFsaWduID0gXCJTVFJFVENIXCI7XG4gICAgICAgIHJldHVybiB0aWNrZXRWYXJpYW50O1xuICAgIH0pO1xufVxuLyoqXG4gKiBDcmVhdGVzIHRoZSBtYWluIGNvbXBvbmVudCBmb3IgdGhlIHRpY2tldHNcbiAqIEByZXR1cm5zIFRoZSBtYWluIGNvbXBvbmVudFxuICovXG5mdW5jdGlvbiBjcmVhdGVUaWNrZXRDb21wb25lbnRTZXQoKSB7XG4gICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgbGV0IHRpY2tldENvbXBvbmVudDtcbiAgICAgICAgLy8gQ3JlYXRlIHZhcmlhbnRzIChvbmUgZm9yIGVhY2ggc3RhdHVzKVxuICAgICAgICBsZXQgdmFyRGVmYXVsdCA9IHlpZWxkIGNyZWF0ZVRpY2tldFZhcmlhbnQoVkFSSUFOVF9DT0xPUl9ERUZBVUxULCBDT01QT05FTlRfU0VUX1BST1BFUlRZX05BTUUgKyBWQVJJQU5UX05BTUVfREVGQVVMVCk7XG4gICAgICAgIGxldCB2YXIxID0geWllbGQgY3JlYXRlVGlja2V0VmFyaWFudChWQVJJQU5UX0NPTE9SXzEsIENPTVBPTkVOVF9TRVRfUFJPUEVSVFlfTkFNRSArIFZBUklBTlRfTkFNRV8xKTtcbiAgICAgICAgbGV0IHZhcjIgPSB5aWVsZCBjcmVhdGVUaWNrZXRWYXJpYW50KFZBUklBTlRfQ09MT1JfMiwgQ09NUE9ORU5UX1NFVF9QUk9QRVJUWV9OQU1FICsgVkFSSUFOVF9OQU1FXzIpO1xuICAgICAgICBsZXQgdmFyMyA9IHlpZWxkIGNyZWF0ZVRpY2tldFZhcmlhbnQoVkFSSUFOVF9DT0xPUl8zLCBDT01QT05FTlRfU0VUX1BST1BFUlRZX05BTUUgKyBWQVJJQU5UX05BTUVfMyk7XG4gICAgICAgIGxldCB2YXI0ID0geWllbGQgY3JlYXRlVGlja2V0VmFyaWFudChWQVJJQU5UX0NPTE9SXzQsIENPTVBPTkVOVF9TRVRfUFJPUEVSVFlfTkFNRSArIFZBUklBTlRfTkFNRV80KTtcbiAgICAgICAgbGV0IHZhcjUgPSB5aWVsZCBjcmVhdGVUaWNrZXRWYXJpYW50KFZBUklBTlRfQ09MT1JfRE9ORSwgQ09NUE9ORU5UX1NFVF9QUk9QRVJUWV9OQU1FICsgVkFSSUFOVF9OQU1FX0RPTkUpO1xuICAgICAgICBsZXQgdmFyRXJyb3IgPSB5aWVsZCBjcmVhdGVUaWNrZXRWYXJpYW50KFZBUklBTlRfQ09MT1JfRVJST1IsIENPTVBPTkVOVF9TRVRfUFJPUEVSVFlfTkFNRSArIFZBUklBTlRfTkFNRV9FUlJPUik7XG4gICAgICAgIGNvbnN0IHZhcmlhbnRzID0gW3ZhckRlZmF1bHQsIHZhcjEsIHZhcjIsIHZhcjMsIHZhcjQsIHZhcjUsIHZhckVycm9yXTtcbiAgICAgICAgLy8gQ3JlYXRlIGEgY29tcG9uZW50IG91dCBvZiBhbGwgdGhlc2UgdmFyaWFudHNcbiAgICAgICAgdGlja2V0Q29tcG9uZW50ID0gZmlnbWEuY29tYmluZUFzVmFyaWFudHModmFyaWFudHMsIGZpZ21hLmN1cnJlbnRQYWdlKTtcbiAgICAgICAgbGV0IHBhZGRpbmcgPSAxNjtcbiAgICAgICAgdGlja2V0Q29tcG9uZW50Lm5hbWUgPSBDT01QT05FTlRfU0VUX05BTUU7XG4gICAgICAgIHRpY2tldENvbXBvbmVudC5sYXlvdXRNb2RlID0gXCJWRVJUSUNBTFwiO1xuICAgICAgICB0aWNrZXRDb21wb25lbnQuY291bnRlckF4aXNTaXppbmdNb2RlID0gXCJBVVRPXCI7XG4gICAgICAgIHRpY2tldENvbXBvbmVudC5wcmltYXJ5QXhpc1NpemluZ01vZGUgPSBcIkFVVE9cIjtcbiAgICAgICAgdGlja2V0Q29tcG9uZW50LnBhZGRpbmdUb3AgPSBwYWRkaW5nO1xuICAgICAgICB0aWNrZXRDb21wb25lbnQucGFkZGluZ1JpZ2h0ID0gcGFkZGluZztcbiAgICAgICAgdGlja2V0Q29tcG9uZW50LnBhZGRpbmdCb3R0b20gPSBwYWRkaW5nO1xuICAgICAgICB0aWNrZXRDb21wb25lbnQucGFkZGluZ0xlZnQgPSBwYWRkaW5nO1xuICAgICAgICB0aWNrZXRDb21wb25lbnQuaXRlbVNwYWNpbmcgPSAyNDtcbiAgICAgICAgdGlja2V0Q29tcG9uZW50LmNvcm5lclJhZGl1cyA9IDQ7XG4gICAgICAgIC8vIFNhdmUgY29tcG9uZW50IElEIGZvciBsYXRlciByZWZlcmVuY2VcbiAgICAgICAgRE9DVU1FTlRfTk9ERS5zZXRQbHVnaW5EYXRhKCd0aWNrZXRDb21wb25lbnRJRCcsIHRpY2tldENvbXBvbmVudC5pZCk7XG4gICAgICAgIC8vIE1ha2Ugc3VyZSB0aGUgY29tcG9uZW50IGlzIHZpc2libGUgd2hlcmUgd2UncmUgY3VycmVudGx5IGxvb2tpbmdcbiAgICAgICAgdGlja2V0Q29tcG9uZW50LnggPSBmaWdtYS52aWV3cG9ydC5jZW50ZXIueCAtICh0aWNrZXRDb21wb25lbnQud2lkdGggLyAyKTtcbiAgICAgICAgdGlja2V0Q29tcG9uZW50LnkgPSBmaWdtYS52aWV3cG9ydC5jZW50ZXIueSAtICh0aWNrZXRDb21wb25lbnQuaGVpZ2h0IC8gMik7XG4gICAgICAgIHJldHVybiB0aWNrZXRDb21wb25lbnQ7XG4gICAgfSk7XG59XG4vKipcbiAqIENyZWF0ZXMgYSBuZXcgbWFpbiB0aWNrZXQgY29tcG9uZW50IG9yIGdldHMgdGhlIHJlZmVyZW5jZSB0byB0aGUgZXhpc3Rpbmcgb25lXG4gKi9cbmZ1bmN0aW9uIHJlZmVyZW5jZVRpY2tldENvbXBvbmVudFNldCgpIHtcbiAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAvLyBDaGVjayBpZiB0aGUgdGlja2V0IGNvbXBvbmVudCBpcyBhbHJlYWR5IHNhdmVkIGluIHRoZSB2YXJpYWJsZVxuICAgICAgICBpZiAoIXRpY2tldENvbXBvbmVudCkge1xuICAgICAgICAgICAgLy8gSWYgbm8sIHRyeSB0aGUgZ2V0IHRoZSB0aWNrZXQgY29tcG9uZW50IGJ5IGl0cyBJRFxuICAgICAgICAgICAgdmFyIHRpY2tldENvbXBvbmVudElkID0gRE9DVU1FTlRfTk9ERS5nZXRQbHVnaW5EYXRhKCd0aWNrZXRDb21wb25lbnRJRCcpO1xuICAgICAgICAgICAgbGV0IG5vZGU7XG4gICAgICAgICAgICBpZiAodGlja2V0Q29tcG9uZW50SWQgJiYgKG5vZGUgPSBmaWdtYS5nZXROb2RlQnlJZCh0aWNrZXRDb21wb25lbnRJZCkpKSB7XG4gICAgICAgICAgICAgICAgLy8gSWYgdGhlcmUgaXMgYW4gSUQgc2F2ZWQsIGFjY2VzcyB0aGUgdGlja2V0IGNvbXBvbmVudFxuICAgICAgICAgICAgICAgIHRpY2tldENvbXBvbmVudCA9IG5vZGU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBJZiB0aGVyZSBpcyBubyBJRCwgY3JlYXRlIGEgbmV3IGNvbXBvbmVudFxuICAgICAgICAgICAgICAgIHRpY2tldENvbXBvbmVudCA9IHlpZWxkIGNyZWF0ZVRpY2tldENvbXBvbmVudFNldCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG59XG4vLyBDaGVja3MgaWYgZmV0Y2hpbmcgZGF0YSB3YXMgc3VjY2Vzc2Z1bCBhdCBhbGwgXG5mdW5jdGlvbiBjaGVja0ZldGNoU3VjY2VzcyhkYXRhKSB7XG4gICAgdmFyIGlzU3VjY2VzcyA9IGZhbHNlO1xuICAgIC8vIENhbiB0aGlzIGV2ZW4gaGFwcGVuP1xuICAgIGlmICghZGF0YSkge1xuICAgICAgICBmaWdtYS5ub3RpZnkoXCJTb21ldGhpbmcgd2VudCB3cm9uZy5cIik7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIlNvbWV0aGluZyB3ZW50IHdyb25nLlwiICsgZGF0YSk7XG4gICAgfVxuICAgIC8vIE5vIGNvbm5lY3Rpb24gdG8gRmlyZWJhc2VcbiAgICBlbHNlIGlmIChkYXRhLnR5cGUgPT0gXCJFcnJvclwiKSB7XG4gICAgICAgIGZpZ21hLm5vdGlmeShcIkNvdWxkIG5vdCBnZXQgZGF0YS4gVGhlcmUgc2VlbXMgdG8gYmUgbm8gY29ubmVjdGlvbiB0byB0aGUgc2VydmVyLlwiKTtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGRhdGEubWVzc2FnZSk7XG4gICAgfVxuICAgIC8vIFdyb25nIGUtbWFpbFxuICAgIGVsc2UgaWYgKGRhdGFbMF0ubWVzc2FnZSA9PSBcIkNsaWVudCBtdXN0IGJlIGF1dGhlbnRpY2F0ZWQgdG8gYWNjZXNzIHRoaXMgcmVzb3VyY2UuXCIpIHtcbiAgICAgICAgZmlnbWEubm90aWZ5KFwiWW91IGhhdmUgZW50ZXJlZCBhbiBpbnZhbGlkIGUtbWFpbC4gU2VlICdBdXRob3JpemF0aW9uJyBzZXR0aW5ncy5cIik7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihkYXRhLm1lc3NhZ2UpO1xuICAgIH1cbiAgICAvLyBXcm9uZyBjb21wYW55IG5hbWVcbiAgICBlbHNlIGlmIChkYXRhWzBdLmVycm9yTWVzc2FnZSA9PSBcIlNpdGUgdGVtcG9yYXJpbHkgdW5hdmFpbGFibGVcIikge1xuICAgICAgICBmaWdtYS5ub3RpZnkoXCJDb21wYW55IGRvbWFpbiBuYW1lIGRvZXMgbm90IGV4aXN0LiBTZWUgJ1Byb2plY3QgU2V0dGluZ3MnLlwiKTtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGRhdGFbMF0uZXJyb3JNZXNzYWdlKTtcbiAgICB9XG4gICAgLy8gV3JvbmcgcGFzc3dvcmRcbiAgICBlbHNlIGlmIChkYXRhWzBdWzBdKSB7XG4gICAgICAgIGZpZ21hLm5vdGlmeShcIkNvdWxkIG5vdCBhY2Nlc3MgZGF0YS4gWW91ciBKaXJhIEFQSSBUb2tlbiBzZWVtcyB0byBiZSBpbnZhbGlkLiBTZWUgJ0F1dGhvcml6YXRpb24nIHNldHRpbmdzLlwiKTtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGRhdGFbMF1bMF0pO1xuICAgIH1cbiAgICAvLyBFbHNlLCBpdCB3YXMgcHJvYmFibHkgc3VjY2Vzc2Z1bFxuICAgIGVsc2Uge1xuICAgICAgICBpc1N1Y2Nlc3MgPSB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gaXNTdWNjZXNzO1xufVxuLy8gQ2hlY2tzIGlmIHBlciByZWNlaXZlZCB0aWNrZXQgZGF0YSBpZiB0aGUgZmV0Y2hpbmcgd2FzIHN1Y2Nlc3NmdWxcbmZ1bmN0aW9uIGNoZWNrVGlja2V0RGF0YVJlcG9uc2UodGlja2V0RGF0YSwgaXNzdWVJZCkge1xuICAgIHZhciBjaGVja2VkRGF0YTtcbiAgICAvLyBJZiB0aGUgSlNPTiBoYXMgYSBrZXkgZmllbGQsIHRoZSBkYXRhIGlzIHZhbGlkXG4gICAgaWYgKHRpY2tldERhdGEgJiYgdGlja2V0RGF0YS5rZXkpIHtcbiAgICAgICAgY2hlY2tlZERhdGEgPSB0aWNrZXREYXRhO1xuICAgIH1cbiAgICAvLyBJRCBkb2VzIG5vdCBleGlzdFxuICAgIGVsc2UgaWYgKHRpY2tldERhdGEuZXJyb3JNZXNzYWdlcyA9PSBcIlRoZSBpc3N1ZSBubyBsb25nZXIgZXhpc3RzLlwiKSB7XG4gICAgICAgIGNoZWNrZWREYXRhID0gY3JlYXRlRXJyb3JEYXRhSlNPTihgRXJyb3I6IFRpY2tldCBJRCAnJHtpc3N1ZUlkfScgZG9lcyBub3QgZXhpc3QuYCwgaXNzdWVJZCk7XG4gICAgICAgIC8vIGZpZ21hLm5vdGlmeShgVGlja2V0IElEICcke2lzc3VlSWR9JyBkb2VzIG5vdCBleGlzdC5gKVxuICAgIH1cbiAgICAvLyBJRCBoYXMgaW52YWxpZCBmb3JtYXRcbiAgICBlbHNlIGlmICh0aWNrZXREYXRhLmVycm9yTWVzc2FnZXMgPT0gXCJJc3N1ZSBrZXkgaXMgaW4gYW4gaW52YWxpZCBmb3JtYXQuXCIpIHtcbiAgICAgICAgY2hlY2tlZERhdGEgPSBjcmVhdGVFcnJvckRhdGFKU09OKGBFcnJvcjogVGlja2V0IElEICcke2lzc3VlSWR9JyBpcyBpbiBhbiBpbnZhbGlkIGZvcm1hdC5gLCBpc3N1ZUlkKTtcbiAgICAgICAgLy8gZmlnbWEubm90aWZ5KGBUaWNrZXQgSUQgJyR7aXNzdWVJZH0nIGlzIGluIGFuIGludmFsaWQgZm9ybWF0LmApXG4gICAgfVxuICAgIC8vIE90aGVyXG4gICAgZWxzZSB7XG4gICAgICAgIGNoZWNrZWREYXRhID0gY3JlYXRlRXJyb3JEYXRhSlNPTihcIkVycm9yOiBBbiB1bmV4cGVjdGVkIGVycm9yIG9jY3VyZWQuXCIsIGlzc3VlSWQpO1xuICAgICAgICBmaWdtYS5ub3RpZnkoXCJVbmV4cGVjdGVkIGVycm9yLlwiKTtcbiAgICAgICAgY29uc29sZS5lcnJvcihcIlVuZXhwZWN0ZWQgZXJyb3IuXCIsIHRpY2tldERhdGEpO1xuICAgICAgICAvLyB0aHJvdyBuZXcgRXJyb3IodGlja2V0RGF0YS5tZXNzYWdlKVxuICAgIH1cbiAgICByZXR1cm4gY2hlY2tlZERhdGE7XG59XG4vLyBDcmVhdGUgYSBlcnJvciB2YXJpYWJsZSB0aGF0IGhhcyB0aGUgc2FtZSBtYWluIGZpZWxkcyBhcyB0aGUgSmlyYSBUaWNrZXQgdmFyaWFibGUuIFxuLy8gVGhpcyB3aWxsIGJlIHVzZWQgdGhlIGZpbGwgdGhlIHRpY2tldCBkYXRhIHdpdGggdGhlIGVycm9yIG1lc3NhZ2UuXG5mdW5jdGlvbiBjcmVhdGVFcnJvckRhdGFKU09OKG1lc3NhZ2UsIGlzc3VlSWQpIHtcbiAgICB2YXIgdG9kYXkgPSBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCk7XG4gICAgdmFyIGVycm9yRGF0YSA9IHtcbiAgICAgICAgXCJrZXlcIjogaXNzdWVJZCxcbiAgICAgICAgXCJmaWVsZHNcIjoge1xuICAgICAgICAgICAgXCJzdW1tYXJ5XCI6IG1lc3NhZ2UsXG4gICAgICAgICAgICBcInN0YXR1c1wiOiB7XG4gICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiRXJyb3JcIlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwic3RhdHVzY2F0ZWdvcnljaGFuZ2VkYXRlXCI6IHRvZGF5XG4gICAgICAgIH1cbiAgICB9O1xuICAgIHJldHVybiBlcnJvckRhdGE7XG59XG4vLyBGdW5jdGlvbiBmb3IgbG9hZGluZyBhbGwgdGhlIGZvbnRzIGZvciB0aGUgbWFpbiBjb21wb25lbnRcbmZ1bmN0aW9uIGxvYWRGb250cygpIHtcbiAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICB5aWVsZCBmaWdtYS5sb2FkRm9udEFzeW5jKEZPTlRfUkVHKTtcbiAgICAgICAgeWllbGQgZmlnbWEubG9hZEZvbnRBc3luYyhGT05UX01FRCk7XG4gICAgICAgIHlpZWxkIGZpZ21hLmxvYWRGb250QXN5bmMoRk9OVF9CT0xEKTtcbiAgICB9KTtcbn1cbi8vIEZvcm1hdHMgYSBoZXggdmFsdWUgdG8gUkdCXG5mdW5jdGlvbiBoZXhUb1JnYihoZXgpIHtcbiAgICB2YXIgYmlnaW50ID0gcGFyc2VJbnQoaGV4LCAxNik7XG4gICAgdmFyIHIgPSAoYmlnaW50ID4+IDE2KSAmIDI1NTtcbiAgICB2YXIgZyA9IChiaWdpbnQgPj4gOCkgJiAyNTU7XG4gICAgdmFyIGIgPSBiaWdpbnQgJiAyNTU7XG4gICAgcmV0dXJuIHsgcjogciAvIDI1NSwgZzogZyAvIDI1NSwgYjogYiAvIDI1NSB9O1xufVxuIiwiIiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBpcyByZWZlcmVuY2VkIGJ5IG90aGVyIG1vZHVsZXMgc28gaXQgY2FuJ3QgYmUgaW5saW5lZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSB7fTtcbl9fd2VicGFja19tb2R1bGVzX19bXCIuL3NyYy9jb2RlLnRzXCJdKCk7XG4iLCIiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=