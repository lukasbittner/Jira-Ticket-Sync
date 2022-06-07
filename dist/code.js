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
DOCUMENT_NODE.setRelaunchData({ open_plugin: "", update_all: "" });
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
const FONT_DEFAULT = { family: "Arial", style: "Regular" };
tryLoadingFont(FONT_DEFAULT);
var UNLOADED_FONTS = new Set();
const FONT_PRIMARY = { family: "Inter", style: "Medium" };
const FONT_SECONDARY = { family: "Inter", style: "Regular" };
const FONT_DESCRIPTION = { family: "Inter", style: "Regular" };
const FONT_SIZE_PRIMARY = 24;
const FONT_SIZE_SECONDARY = 16;
const FONT_COLOR_PRIMARY = [
    { type: "SOLID", color: hexToRgb("172B4D") },
];
const FONT_COLOR_SECONDARY = [
    { type: "SOLID", color: hexToRgb("6B778C") },
];
const FONT_COLOR_URL = [
    { type: "SOLID", color: hexToRgb("0065FF") },
];
function getStatus(data) {
    var _a, _b;
    return (_b = (_a = data.fields) === null || _a === void 0 ? void 0 : _a.status) === null || _b === void 0 ? void 0 : _b.name;
}
function getTitle(data) {
    var _a;
    return ((_a = data.fields) === null || _a === void 0 ? void 0 : _a.summary) || "ERROR: No summary existing.";
}
function getIssueId(data) {
    return data.key;
}
function getAssignee(data) {
    var _a, _b;
    return ((_b = (_a = data.fields) === null || _a === void 0 ? void 0 : _a.assignee) === null || _b === void 0 ? void 0 : _b.displayName) || "Not assigned";
}
function getDescription(data) {
    var _a;
    return ((_a = data.fields) === null || _a === void 0 ? void 0 : _a.description) || "No description";
}
function getAcceptanceCriteria(data) {
    var _a;
    return ((_a = data.fields) === null || _a === void 0 ? void 0 : _a.customfield_10103) || "No acceptance criteria";
}
function getChangeDate(data) {
    var _a, _b;
    let date = (_a = data.fields) === null || _a === void 0 ? void 0 : _a.statuscategorychangedate;
    if (!date)
        ((_b = data.fields) === null || _b === void 0 ? void 0 : _b.created) || "No date";
    return date;
}
var nextTicketOffset = 0;
// ticketdata.fields.assignee.avatarUrls
// ticketdata.fields.status.name
// ticketdata.fields.status.statusCategory.name
const ISSUE_ID_NAME = "Ticket ID";
const ISSUE_TITLE_NAME = "Ticket Title";
const ISSUE_CHANGE_DATE_NAME = "Date of Status Change";
const ASSIGNEE_NAME = "Assignee";
const DESCRIPTION_NAME = "Description";
const ACCEPTANCE_NAME = "Acceptance Criteria";
const STATUS_NAME = "Status";
const COMPONENT_SET_NAME = "Jira Ticket Header";
const COMPONENT_SET_PROPERTY_NAME = "Status=";
const VARIANT_NAME_DEFAULT = "Backlog";
const VARIANT_COLOR_DEFAULT = hexToRgb("5E6C84");
const VARIANT_NAME_1 = "To Do";
const VARIANT_COLOR_1 = hexToRgb("5E6C84");
const VARIANT_NAME_2 = "In Progress";
const VARIANT_COLOR_2 = hexToRgb("0065FF");
const VARIANT_NAME_3 = "In Review";
const VARIANT_COLOR_3 = hexToRgb("00A3BF");
const VARIANT_NAME_4 = "Dev Ready";
const VARIANT_COLOR_4 = hexToRgb("00A3BF");
const VARIANT_NAME_DONE = "Done";
const VARIANT_COLOR_DONE = hexToRgb("36B37E");
const VARIANT_NAME_ERROR = "Error";
const VARIANT_COLOR_ERROR = hexToRgb("FF5630");
var ticketComponent;
// Don't show UI if relaunch buttons are run
if (figma.command === "update_selection") {
    updateWithoutUI("selection");
}
else if (figma.command === "update_all") {
    updateWithoutUI("all");
}
else if (figma.command === "update_page") {
    updateWithoutUI("page");
}
else if (figma.command === "set_library_component") {
    let selection = figma.currentPage.selection[0];
    saveLibraryComponent(selection);
}
else if (figma.command === "remove_library_component") {
    let selection = figma.currentPage.selection[0];
    deleteLibraryComponent(selection);
    selection.setRelaunchData({
        remove_library_component: "Unpublish global component. It will not be used in other files anymore.",
    });
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
        if (hasFailed &&
            (type === "all" || type === "page" || type === "selection")) {
            figma.closePlugin();
        }
    });
}
// Send the stored authorization data to the UI
function sendData() {
    return __awaiter(this, void 0, void 0, function* () {
        company_name = yield getAuthorizationInfo(COMPANY_NAME_KEY, true);
        project_id = yield getAuthorizationInfo(PROJECT_ID_KEY, true);
        issueId = yield getAuthorizationInfo(ISSUE_ID_KEY, true);
        username = yield getAuthorizationInfo(USERNAME_KEY, false);
        password = yield getAuthorizationInfo(PASSWORD_KEY, false);
        createLink = yield getAuthorizationInfo(CREATE_LINK_KEY, false);
        if (createLink === "")
            createLink = true;
        figma.ui.postMessage({
            company_name: company_name,
            project_id: project_id,
            username: username,
            password: password,
            issueId: issueId,
            createLink: createLink,
            type: "setAuthorizationVariables",
        });
    });
}
// All the functions that can be started from the UI
figma.ui.onmessage = (msg) => __awaiter(this, void 0, void 0, function* () {
    // Called to create a new main component and save its ID
    if (msg.type === "create-component") {
        ticketComponent = yield createTicketComponentSet();
        DOCUMENT_NODE.setPluginData("ticketComponentID", ticketComponent.id);
    }
    // Called to create a new instance of a component (based on the issueId entered in the UI)
    if (msg.type === "create-new-ticket" && checkFetchSuccess(msg.data)) {
        let ticketInstance = yield createTicketInstance(msg);
        // Create a link in Jira
        if (msg.createLink && msg.data[0].key && project_id != "") {
            let projectName = encodeURIComponent(figma.root.name);
            let nodeId = encodeURIComponent(ticketInstance.id);
            let link = `https://www.figma.com/file/${project_id}/${projectName}?node-id=${nodeId}`;
            figma.ui.postMessage({
                issueId: msg.issueIds[0],
                link: link,
                type: "post-link-to-jira-issue",
            });
        }
    }
    // Called to get all Jira Ticker Header instances and update them one by one.
    if (msg.type === "update-all") {
        requestUpdateForTickets("all");
    }
    // Called to get Jira Ticker Header instances on this page and update them one by one.
    if (msg.type === "update-page") {
        requestUpdateForTickets("page");
    }
    // Called to get selected Jira Ticker Header instances and update them one by one.
    if (msg.type === "update-selected") {
        requestUpdateForTickets("selection");
    }
    // Save new authorization info
    if (msg.type === "authorization-detail-changed") {
        setAuthorizationInfo(msg.key, msg.data, msg.save_public);
    }
    // Resize the UI
    if (msg.type === "resize-ui") {
        msg.big_size
            ? figma.ui.resize(WINDOW_WIDTH, WINDOW_HEIGHT_BIG)
            : figma.ui.resize(WINDOW_WIDTH, WINDOW_HEIGHT_SMALL);
    }
    // Allows the UI to create notifications
    if (msg.type === "create-visual-bell") {
        figma.notify(msg.message);
    }
    // Updates instances based on the received ticket data.
    if (msg.type === "ticketDataSent" && checkFetchSuccess(msg.data)) {
        // console.log("Ticket data:", msg.data)
        var nodeIds = msg.nodeIds;
        var nodes = nodeIds.map((id) => figma.getNodeById(id));
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
        // console.log(key, valueSaved)
        if (!valueSaved && valueSaved != false)
            valueSaved = "";
        return valueSaved;
    });
}
/**
 * Saves a component library key so it can be referenced and reused in other files.
 * @param componentNode The component to be used globally
 */
function saveLibraryComponent(componentNode) {
    return __awaiter(this, void 0, void 0, function* () {
        let componentKey;
        if (componentNode.type === "COMPONENT_SET") {
            componentKey = componentNode.key;
            yield figma.clientStorage.setAsync(LIBRARY_COMPONENT_KEY, componentKey);
            componentNode.absoluteRenderBounds;
            // componentNode.setRelaunchData({})
            componentNode.setRelaunchData({
                remove_library_component: "The component will not be used anymore in new files.",
            });
            figma.closePlugin("Set as global JTS component. Make sure the component is published in a library.");
        }
        else {
            figma.closePlugin("Element is not a component set. Could not be saved as library component.");
        }
    });
}
/**
 * Removes a component library key so it can not be referenced and reused in other files anymore.
 * @param componentNode The component on which the relaunch data button should be switched
 */
function deleteLibraryComponent(componentNode) {
    return __awaiter(this, void 0, void 0, function* () {
        yield figma.clientStorage.deleteAsync(LIBRARY_COMPONENT_KEY);
        componentNode.setRelaunchData({});
        componentNode.setRelaunchData({
            set_library_component: "Publish the component in a library and then click this button.",
        });
        figma.closePlugin("Unpublished global JTS component.");
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
            types: ["INSTANCE"],
        });
        nodes = nodes.filter((node) => node.name === COMPONENT_SET_NAME);
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
            types: ["INSTANCE"],
        });
        nodes = nodes.filter((node) => node.name === COMPONENT_SET_NAME);
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
        nodes = nodes.filter((node) => node.name === COMPONENT_SET_NAME);
        if (nodes.length == 0) {
            figma.notify(`No "${COMPONENT_SET_NAME}" instance selected.`);
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
 * @param instances Instances of the JTS component
 */
function getDataForTickets(instances) {
    return __awaiter(this, void 0, void 0, function* () {
        var nodeIds = [];
        var issueIds = [];
        var missingIds = 0;
        for (let i = 0; i < instances.length; i++) {
            const node = instances[i];
            if (node.type === "INSTANCE") {
                let issueIdNode = node.findOne((n) => n.type === "TEXT" && n.name === ISSUE_ID_NAME);
                if (!issueIdNode || issueIdNode.characters === "") {
                    missingIds += 1;
                }
                else {
                    issueIds.push(issueIdNode.characters);
                    nodeIds.push(node.id);
                }
            }
        }
        // If any instance is missing the ID.
        if (missingIds > 0)
            figma.notify(`${missingIds} instance(s) is missing the text element '${ISSUE_ID_NAME}' and could not be updated.`);
        // Get ticket data if
        if (issueIds.length === 0 || nodeIds.length === 0) {
            if (figma.command)
                figma.closePlugin();
        }
        else {
            figma.ui.postMessage({
                nodeIds: nodeIds,
                issueIds: issueIds,
                type: "getTicketData",
            });
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
            if (ticketStatus === "Error")
                invalidIds.push(issueIds[i]);
            // Get the variant based on the ticket status and swap it with the current
            let newVariant = ticketComponent.findChild((n) => n.name === COMPONENT_SET_PROPERTY_NAME + ticketStatus);
            if (!newVariant) {
                // If the status doesn't match any of the variants, use default
                newVariant = ticketComponent.defaultVariant;
                missingVariants.push(ticketStatus);
            }
            ticketInstance.swapComponent(newVariant);
            // Update title
            let titleNode = ticketInstance.findOne((n) => n.type === "TEXT" && n.name === ISSUE_TITLE_NAME);
            if (titleNode) {
                titleNode.fontName = yield tryLoadingFont(titleNode.fontName);
                titleNode.characters = getTitle(ticketData);
                titleNode.hyperlink = {
                    type: "URL",
                    value: `https://${company_name}/browse/${ticketData.key}`,
                };
            }
            else {
                numberOfMissingTitles += 1;
            }
            // Update date
            let changeDateNode = ticketInstance.findOne((n) => n.type === "TEXT" && n.name === ISSUE_CHANGE_DATE_NAME);
            if (changeDateNode && getChangeDate(ticketData)) {
                changeDateNode.fontName = yield tryLoadingFont(changeDateNode.fontName);
                // Filters out the data to a simpler format (Mmm DD YYYY)
                var date = new Date(getChangeDate(ticketData).replace(/[T]+.*/, ""));
                changeDateNode.characters = date.toDateString();
                // changeDateTxt.characters = date.toDateString().replace(/^([A-Za-z]*)./,"");
            }
            else {
                numberOfMissingDates += 1;
            }
            // Update assignee
            let assigneeNode = ticketInstance.findOne((n) => n.type === "TEXT" && n.name === ASSIGNEE_NAME);
            if (assigneeNode) {
                assigneeNode.fontName = yield tryLoadingFont(assigneeNode.fontName);
                assigneeNode.characters = getAssignee(ticketData);
            }
            else {
                numberOfMissingAssignees += 1;
            }
            // Update status text field
            let statusNode = ticketInstance.findOne((n) => n.type === "TEXT" && n.name === STATUS_NAME);
            if (statusNode) {
                statusNode.fontName = yield tryLoadingFont(statusNode.fontName);
                statusNode.characters = getStatus(ticketData);
            }
            //Update acceptance criteria
            let acceptanceNode = ticketInstance.findOne((n) => n.type === "TEXT" && n.name === ACCEPTANCE_NAME);
            if (acceptanceNode) {
                acceptanceNode.fontName = yield tryLoadingFont(acceptanceNode.fontName);
                acceptanceNode.characters = getAcceptanceCriteria(ticketData);
            }
            // Update description
            let descriptionNode = ticketInstance.findOne((n) => n.type === "TEXT" && n.name === DESCRIPTION_NAME);
            let descriptionText = getDescription(ticketData);
            if (descriptionNode && descriptionText) {
                let loadedFont = yield tryLoadingFont(FONT_DESCRIPTION);
                descriptionNode.fontName = loadedFont;
                let fontFamily = loadedFont.family;
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
                // Link
                let regexLink = /\[(https:.*)\|http.*\|smart-link]/;
                let fontLink = { family: fontFamily, style: "Regular" };
                yield changeFontsByRegex(descriptionNode, regexLink, fontLink, 1, "", "", true);
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
            ticketInstance.setRelaunchData({ update_selection: "" });
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
            message =
                numberOfNodes == 1
                    ? "Invalid ID."
                    : `${numberOfInvalidIds} of ${numberOfNodes} IDs are invalid or do not exist.`;
        }
        else if (numberOfInvalidIds == 0) {
            // All valid
            message =
                numberOfNodes == 1
                    ? "Updated."
                    : `${numberOfNodes} of ${numberOfNodes} header(s) updated!`;
            if (isCreateNew)
                message = "";
        }
        else {
            // Some valid
            let firstSentence = `${numberOfNodes - numberOfInvalidIds} of ${numberOfNodes} successfully updated. `;
            let secondSentence = numberOfInvalidIds == 1
                ? "1 ID is invalid or does not exist."
                : `${numberOfInvalidIds} IDs are invalid or do not exist.`;
            message = firstSentence + secondSentence;
        }
        // If not all font could be loaded
        if (UNLOADED_FONTS.size > 0) {
            figma.notify("Font(s) '" +
                [...UNLOADED_FONTS].join(", ") +
                "' could not be loaded. Please install the font or change the component font.");
            UNLOADED_FONTS.clear();
        }
        // If called via the relaunch button, close plugin after updating the tickets
        if (figma.command === "update_page" ||
            figma.command === "update_all" ||
            figma.command === "update_selection") {
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
 * @param textNode Text Node
 * @param regex Regular expression to match certain range
 * @param font Font name for range
 * @param contentGroup Which content group in the regex should be the new text
 * @param preText Add a text before the regex match
 * @param postText Add a text after the regex match
 * @param createHyperLink Create a URL for this text range?
 * @return Text Node
 */
function changeFontsByRegex(textNode, regex, font, contentGroup, preText = "", postText = "", createHyperLink = false) {
    return __awaiter(this, void 0, void 0, function* () {
        font = yield tryLoadingFont(font);
        while (textNode.characters.match(regex)) {
            let match = textNode.characters.match(regex);
            let length = match[0].length;
            let index = match.index;
            let newText = match[contentGroup];
            let wholeText = preText + newText + postText;
            let wholeLength = wholeText.length;
            if (length > 0) {
                textNode.deleteCharacters(index, index + length);
                textNode.insertCharacters(index, wholeText);
                textNode.setRangeFontName(index, index + wholeLength, font);
                if (createHyperLink) {
                    textNode.setRangeHyperlink(index, index + wholeLength, {
                        type: "URL",
                        value: newText,
                    });
                    textNode.setRangeFills(index, index + wholeLength, FONT_COLOR_URL);
                    textNode.setRangeTextDecoration(index, index + wholeLength, "UNDERLINE");
                }
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
        // Position the ticket instance and give it a slight offset (so that when multiple tickets are created they dont overlap)
        ticketInstance.x =
            figma.viewport.center.x - ticketInstance.width / 2 + nextTicketOffset;
        ticketInstance.y =
            figma.viewport.center.y - ticketInstance.height / 2 + nextTicketOffset;
        nextTicketOffset = (nextTicketOffset + 10) % 70;
        figma.currentPage.selection = [ticketInstance];
        // Check if the data is valid and update the instance text fields
        let ticketData = checkTicketDataReponse(msg.data[0], msg.issueIds[0]);
        let ticketInstances = yield updateTickets([ticketInstance], msg, true);
        ticketInstance = ticketInstances[0];
        // Add ID
        let issueIDTxt = ticketInstance.findOne((n) => n.type === "TEXT" && n.name === ISSUE_ID_NAME);
        if (issueIDTxt) {
            issueIDTxt.fontName = yield tryLoadingFont(issueIDTxt.fontName);
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
        var ticketVariant = figma.createComponent();
        ticketVariant.visible = false;
        var statusColorRect = figma.createRectangle();
        var idFrame = figma.createFrame();
        var titleFrame = figma.createFrame();
        var detailsFrame = figma.createFrame();
        var descriptionFrame = figma.createFrame();
        const titleTxt = figma.createText();
        const issueIdTxt = figma.createText();
        const statusTxt = figma.createText();
        const changeDateTxt = figma.createText();
        const assigneeTxt = figma.createText();
        const dividerTxt1 = figma.createText();
        const dividerTxt2 = figma.createText();
        const descriptionTxt = figma.createText();
        const acceptanceTxt = figma.createText();
        ticketVariant.appendChild(statusColorRect);
        ticketVariant.appendChild(idFrame);
        idFrame.appendChild(issueIdTxt);
        idFrame.appendChild(titleFrame);
        titleFrame.appendChild(titleTxt);
        titleFrame.appendChild(detailsFrame);
        titleFrame.appendChild(descriptionFrame);
        descriptionFrame.appendChild(descriptionTxt);
        descriptionFrame.appendChild(acceptanceTxt);
        detailsFrame.appendChild(statusTxt);
        detailsFrame.appendChild(dividerTxt1);
        detailsFrame.appendChild(assigneeTxt);
        detailsFrame.appendChild(dividerTxt2);
        detailsFrame.appendChild(changeDateTxt);
        // Create variant frame
        ticketVariant.name = statusName;
        ticketVariant.resize(600, 200);
        ticketVariant.cornerRadius = 16;
        ticketVariant.itemSpacing = 0;
        ticketVariant.layoutMode = "HORIZONTAL";
        ticketVariant.counterAxisSizingMode = "AUTO";
        ticketVariant.primaryAxisSizingMode = "FIXED";
        ticketVariant.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 } }];
        // Create Rectangle
        statusColorRect.resize(12, 200);
        statusColorRect.fills = [{ type: "SOLID", color: statusColor }];
        statusColorRect.layoutAlign = "STRETCH";
        statusColorRect.layoutGrow = 0;
        statusColorRect.topLeftRadius = 16;
        statusColorRect.bottomLeftRadius = 16;
        statusColorRect.name = "Status Color Indicator";
        // Create the main frame
        let padding = 24;
        idFrame.paddingTop = padding;
        idFrame.paddingRight = padding;
        idFrame.paddingBottom = padding;
        idFrame.paddingLeft = padding;
        idFrame.name = "Container";
        idFrame.layoutMode = "VERTICAL";
        idFrame.counterAxisSizingMode = "AUTO";
        idFrame.layoutAlign = "STRETCH";
        idFrame.layoutGrow = 1;
        idFrame.itemSpacing = 8;
        idFrame.fills = [];
        // Create the title frame
        titleFrame.name = "Container";
        titleFrame.layoutMode = "VERTICAL";
        titleFrame.counterAxisSizingMode = "AUTO";
        titleFrame.layoutAlign = "STRETCH";
        titleFrame.itemSpacing = 16;
        titleFrame.fills = [];
        // Create the details frame
        detailsFrame.name = "Container";
        detailsFrame.layoutMode = "HORIZONTAL";
        detailsFrame.counterAxisSizingMode = "AUTO";
        detailsFrame.layoutAlign = "STRETCH";
        detailsFrame.itemSpacing = 8;
        detailsFrame.fills = [];
        // Create the description frame
        descriptionFrame.name = "Description";
        descriptionFrame.layoutMode = "HORIZONTAL";
        descriptionFrame.counterAxisSizingMode = "AUTO";
        descriptionFrame.layoutAlign = "STRETCH";
        descriptionFrame.itemSpacing = 32;
        descriptionFrame.cornerRadius = 8;
        descriptionFrame.verticalPadding = 16;
        descriptionFrame.horizontalPadding = 16;
        descriptionFrame.fills = [{ type: "SOLID", color: hexToRgb("f4f5f7") }];
        // Add the ticket text fields
        titleTxt.fontName = yield tryLoadingFont(FONT_PRIMARY);
        titleTxt.fontSize = FONT_SIZE_PRIMARY;
        titleTxt.fills = FONT_COLOR_PRIMARY;
        titleTxt.textDecoration = "UNDERLINE";
        titleTxt.autoRename = false;
        titleTxt.characters = "Ticket title";
        titleTxt.name = ISSUE_TITLE_NAME;
        issueIdTxt.fontName = yield tryLoadingFont(FONT_SECONDARY);
        issueIdTxt.fontSize = FONT_SIZE_SECONDARY;
        issueIdTxt.fills = FONT_COLOR_SECONDARY;
        issueIdTxt.autoRename = false;
        issueIdTxt.characters = "ID-1";
        issueIdTxt.name = ISSUE_ID_NAME;
        statusTxt.fontName = yield tryLoadingFont(FONT_SECONDARY);
        statusTxt.fontSize = FONT_SIZE_SECONDARY;
        statusTxt.fills = FONT_COLOR_SECONDARY;
        statusTxt.autoRename = false;
        statusTxt.characters = statusName.replace("Status=", "");
        statusTxt.name = STATUS_NAME;
        changeDateTxt.fontSize = FONT_SIZE_SECONDARY;
        changeDateTxt.fills = FONT_COLOR_SECONDARY;
        changeDateTxt.autoRename = false;
        changeDateTxt.characters = "MM DD YYYY";
        changeDateTxt.name = ISSUE_CHANGE_DATE_NAME;
        assigneeTxt.fontSize = FONT_SIZE_SECONDARY;
        assigneeTxt.fills = FONT_COLOR_SECONDARY;
        assigneeTxt.autoRename = false;
        assigneeTxt.characters = "Name of assignee";
        assigneeTxt.name = ASSIGNEE_NAME;
        dividerTxt1.fontSize = FONT_SIZE_SECONDARY;
        dividerTxt1.fills = FONT_COLOR_SECONDARY;
        dividerTxt1.autoRename = false;
        dividerTxt1.characters = "/";
        dividerTxt1.name = "/";
        dividerTxt2.fontSize = FONT_SIZE_SECONDARY;
        dividerTxt2.fills = FONT_COLOR_SECONDARY;
        dividerTxt2.autoRename = false;
        dividerTxt2.characters = "/";
        dividerTxt2.name = "/";
        acceptanceTxt.fontName = yield tryLoadingFont(FONT_DESCRIPTION);
        acceptanceTxt.fontSize = 16;
        acceptanceTxt.fills = FONT_COLOR_PRIMARY;
        acceptanceTxt.autoRename = false;
        acceptanceTxt.characters = "Description";
        acceptanceTxt.name = ACCEPTANCE_NAME;
        acceptanceTxt.layoutGrow = 1;
        descriptionTxt.fontName = yield tryLoadingFont(FONT_DESCRIPTION);
        descriptionTxt.fontSize = 16;
        descriptionTxt.fills = FONT_COLOR_PRIMARY;
        descriptionTxt.autoRename = false;
        descriptionTxt.characters = "Description";
        descriptionTxt.name = DESCRIPTION_NAME;
        descriptionTxt.layoutGrow = 1;
        titleTxt.layoutAlign = "STRETCH";
        // Fixes a weird bug in which the 'stretch' doesnt work properly
        idFrame.primaryAxisSizingMode = "FIXED";
        idFrame.layoutAlign = "STRETCH";
        detailsFrame.primaryAxisSizingMode = "FIXED";
        detailsFrame.layoutAlign = "STRETCH";
        descriptionFrame.primaryAxisSizingMode = "FIXED";
        descriptionFrame.layoutAlign = "STRETCH";
        ticketVariant.visible = true;
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
        DOCUMENT_NODE.setPluginData("ticketComponentID", ticketComponent.id);
        ticketComponent.setRelaunchData({
            set_library_component: "Publish the component in a library and then click this button.",
        });
        // Make sure the component is visible where we're currently looking
        ticketComponent.x = figma.viewport.center.x - ticketComponent.width / 2;
        ticketComponent.y = figma.viewport.center.y - ticketComponent.height / 2;
        return ticketComponent;
    });
}
/**
 * Creates a new main ticket component or gets the reference to the existing one in the following order:
 * 1. Looks for local component based on component name
 * 1. Looks for library component based on public key
 * 2. Looks for library component based on private key
 * 5. Creates a new component
 */
function referenceTicketComponentSet() {
    return __awaiter(this, void 0, void 0, function* () {
        // If there is a component somewhere with the right name
        let componentSets = figma.root.findAllWithCriteria({
            types: ["COMPONENT_SET"],
        });
        componentSets = componentSets.filter((node) => node.name === COMPONENT_SET_NAME);
        if (componentSets[0]) {
            ticketComponent = componentSets[0];
            DOCUMENT_NODE.setPluginData("ticketComponentID", ticketComponent.id);
        }
        else {
            // If there is no library component, try the get the ticket component by its ID
            // var ticketComponentId = DOCUMENT_NODE.getPluginData('ticketComponentID')
            // let node
            // if (ticketComponentId && (node = figma.getNodeById(ticketComponentId))) {
            // If there is an ID saved, access the ticket component
            // ticketComponent = node
            // }
            // else {
            //Try to get library component...
            //...from component key saved in this project
            var publicTicketComponentKey = DOCUMENT_NODE.getPluginData(LIBRARY_COMPONENT_KEY);
            let libraryComponent;
            if (publicTicketComponentKey &&
                (libraryComponent = yield importLibraryComponent(publicTicketComponentKey))) {
                ticketComponent = libraryComponent;
            }
            else {
                //...or from component key saved with the user
                var privateTicketComponentKey = yield figma.clientStorage.getAsync(LIBRARY_COMPONENT_KEY);
                if (privateTicketComponentKey &&
                    (libraryComponent = yield importLibraryComponent(privateTicketComponentKey))) {
                    DOCUMENT_NODE.setPluginData(LIBRARY_COMPONENT_KEY, privateTicketComponentKey); // Safe key publicly
                    ticketComponent = libraryComponent;
                }
                else {
                    // If there is no component, create a new component
                    ticketComponent = yield createTicketComponentSet();
                }
            }
        }
    });
}
function importLibraryComponent(key) {
    return __awaiter(this, void 0, void 0, function* () {
        var libraryComponent;
        yield figma
            .importComponentSetByKeyAsync(key)
            .then((result) => {
            libraryComponent = result;
        })
            .catch(() => {
            libraryComponent = false;
        });
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
    else if (ticketData.errorMessages) {
        checkedData = createErrorDataJSON(`Error: ${ticketData.errorMessages}`, issueId);
        // figma.notify(`Ticket ID '${issueId}' does not exist.`)
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
        key: issueId,
        fields: {
            summary: message,
            status: {
                name: "Error",
            },
            statuscategorychangedate: today,
        },
    };
    return errorData;
}
function tryLoadingFont(fontName) {
    return __awaiter(this, void 0, void 0, function* () {
        var loadedFont = FONT_DEFAULT;
        yield figma
            .loadFontAsync(fontName)
            .then(() => {
            loadedFont = fontName;
        })
            .catch(() => {
            console.log("Font '" +
                fontName.family +
                "' could not be loaded. Please install or change the component font.");
            UNLOADED_FONTS.add(fontName.family);
            loadedFont = FONT_DEFAULT;
        });
        return loadedFont;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29kZS5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQTtBQUNBLDRCQUE0QiwrREFBK0QsaUJBQWlCO0FBQzVHO0FBQ0Esb0NBQW9DLE1BQU0sK0JBQStCLFlBQVk7QUFDckYsbUNBQW1DLE1BQU0sbUNBQW1DLFlBQVk7QUFDeEYsZ0NBQWdDO0FBQ2hDO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLGdDQUFnQyxpQ0FBaUM7QUFDakU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0I7QUFDbEIsZ0JBQWdCO0FBQ2hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCO0FBQ3ZCO0FBQ0E7QUFDQSx1QkFBdUI7QUFDdkIseUJBQXlCO0FBQ3pCLDJCQUEyQjtBQUMzQjtBQUNBO0FBQ0E7QUFDQSxNQUFNLDBDQUEwQztBQUNoRDtBQUNBO0FBQ0EsTUFBTSwwQ0FBMEM7QUFDaEQ7QUFDQTtBQUNBLE1BQU0sMENBQTBDO0FBQ2hEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSw2QkFBNkIsa0RBQWtEO0FBQy9FO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUNBQWlDLGdCQUFnQjtBQUNqRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVCxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscURBQXFELFdBQVcsR0FBRyxZQUFZLFdBQVcsT0FBTztBQUNqRztBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQ0FBK0M7QUFDL0M7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3Q0FBd0M7QUFDeEM7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsZ0RBQWdELG1CQUFtQjtBQUNuRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsZ0RBQWdELG1CQUFtQjtBQUNuRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0NBQWdDLG1CQUFtQjtBQUNuRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLHNCQUFzQjtBQUM5QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNEJBQTRCLFlBQVksMkNBQTJDLGNBQWM7QUFDakc7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdCQUF3QixtQkFBbUI7QUFDM0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNDQUFzQyxhQUFhLFVBQVUsZUFBZTtBQUM1RTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUZBQW1GLE9BQU87QUFDMUY7QUFDQTtBQUNBO0FBQ0Esb0NBQW9DLFNBQVMsT0FBTyxPQUFPO0FBQzNELGtDQUFrQztBQUNsQztBQUNBO0FBQ0EsbUNBQW1DLFVBQVUsT0FBTyxVQUFVO0FBQzlELGlDQUFpQztBQUNqQztBQUNBO0FBQ0E7QUFDQSxpQ0FBaUM7QUFDakM7QUFDQTtBQUNBO0FBQ0EsaUNBQWlDO0FBQ2pDO0FBQ0E7QUFDQTtBQUNBLG1DQUFtQztBQUNuQztBQUNBO0FBQ0E7QUFDQSxrQ0FBa0M7QUFDbEM7QUFDQTtBQUNBO0FBQ0EsNkNBQTZDLHNCQUFzQjtBQUNuRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0NBQW9DLGNBQWMsMkVBQTJFLGVBQWU7QUFDNUk7QUFDQTtBQUNBLDRCQUE0Qix1QkFBdUIsb0NBQW9DLGlCQUFpQjtBQUN4RztBQUNBLDRCQUE0QixzQkFBc0Isb0NBQW9DLHVCQUF1QjtBQUM3RztBQUNBLDRCQUE0QiwwQkFBMEIsb0NBQW9DLGNBQWM7QUFDeEc7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlCQUF5QixvQkFBb0IsS0FBSyxlQUFlO0FBQ2pFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlCQUF5QixlQUFlLEtBQUssZUFBZTtBQUM1RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUNBQW1DLG9DQUFvQyxLQUFLLGVBQWU7QUFDM0Y7QUFDQTtBQUNBLHFCQUFxQixvQkFBb0I7QUFDekM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQ0FBb0MsZUFBZTtBQUNuRDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQjtBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlDQUFpQyx3QkFBd0Isb0JBQW9CO0FBQzdFO0FBQ0E7QUFDQSxtQ0FBbUMsbUNBQW1DO0FBQ3RFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQ0FBb0MsMENBQTBDO0FBQzlFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1HQUFtRztBQUNuRztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0RBQW9ELHlCQUF5QjtBQUM3RSxzQ0FBc0MsUUFBUTtBQUM5QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjs7Ozs7Ozs7VUVuK0JBO1VBQ0E7VUFDQTtVQUNBO1VBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly93ZWJwYWNrLXJlYWN0Ly4vc3JjL2NvZGUudHMiLCJ3ZWJwYWNrOi8vd2VicGFjay1yZWFjdC93ZWJwYWNrL2JlZm9yZS1zdGFydHVwIiwid2VicGFjazovL3dlYnBhY2stcmVhY3Qvd2VicGFjay9zdGFydHVwIiwid2VicGFjazovL3dlYnBhY2stcmVhY3Qvd2VicGFjay9hZnRlci1zdGFydHVwIl0sInNvdXJjZXNDb250ZW50IjpbInZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xuICAgIGZ1bmN0aW9uIGFkb3B0KHZhbHVlKSB7IHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFAgPyB2YWx1ZSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUodmFsdWUpOyB9KTsgfVxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IGFkb3B0KHJlc3VsdC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XG4gICAgfSk7XG59O1xuY29uc3QgRE9DVU1FTlRfTk9ERSA9IGZpZ21hLmN1cnJlbnRQYWdlLnBhcmVudDtcbi8vIFNldCB0aGUgcmVsYXVuY2ggYnV0dG9uIGZvciB0aGUgd2hvbGUgZG9jdW1lbnRcbkRPQ1VNRU5UX05PREUuc2V0UmVsYXVuY2hEYXRhKHsgb3Blbl9wbHVnaW46IFwiXCIsIHVwZGF0ZV9hbGw6IFwiXCIgfSk7XG5jb25zdCBXSU5ET1dfV0lEVEggPSAyNTA7XG5jb25zdCBXSU5ET1dfSEVJR0hUX0JJRyA9IDY1MDtcbmNvbnN0IFdJTkRPV19IRUlHSFRfU01BTEwgPSAzMDg7XG5jb25zdCBDT01QQU5ZX05BTUVfS0VZID0gXCJDT01QQU5ZX05BTUVcIjtcbmNvbnN0IFBST0pFQ1RfSURfS0VZID0gXCJQUk9KRUNUX0lEXCI7XG5jb25zdCBVU0VSTkFNRV9LRVkgPSBcIlVTRVJOQU1FXCI7XG5jb25zdCBQQVNTV09SRF9LRVkgPSBcIlBBU1NXT1JEXCI7XG5jb25zdCBJU1NVRV9JRF9LRVkgPSBcIklTU1VFX0lEXCI7XG5jb25zdCBDUkVBVEVfTElOS19LRVkgPSBcIkNSRUFURV9MSU5LXCI7XG5jb25zdCBMSUJSQVJZX0NPTVBPTkVOVF9LRVkgPSBcIkxJQlJBUllfQ09NUE9ORU5UXCI7XG52YXIgY29tcGFueV9uYW1lOyAvLyBTYXZlZCBwdWJsaWNseSB3aXRoIHNldFBsdWdpbkRhdGFcbnZhciBwcm9qZWN0X2lkOyAvLyBTYXZlZCBwdWJsaWNseSB3aXRoIHNldFBsdWdpbkRhdGFcbnZhciB1c2VybmFtZTtcbnZhciBwYXNzd29yZDtcbnZhciBpc3N1ZUlkO1xudmFyIGNyZWF0ZUxpbms7XG5jb25zdCBGT05UX0RFRkFVTFQgPSB7IGZhbWlseTogXCJBcmlhbFwiLCBzdHlsZTogXCJSZWd1bGFyXCIgfTtcbnRyeUxvYWRpbmdGb250KEZPTlRfREVGQVVMVCk7XG52YXIgVU5MT0FERURfRk9OVFMgPSBuZXcgU2V0KCk7XG5jb25zdCBGT05UX1BSSU1BUlkgPSB7IGZhbWlseTogXCJJbnRlclwiLCBzdHlsZTogXCJNZWRpdW1cIiB9O1xuY29uc3QgRk9OVF9TRUNPTkRBUlkgPSB7IGZhbWlseTogXCJJbnRlclwiLCBzdHlsZTogXCJSZWd1bGFyXCIgfTtcbmNvbnN0IEZPTlRfREVTQ1JJUFRJT04gPSB7IGZhbWlseTogXCJJbnRlclwiLCBzdHlsZTogXCJSZWd1bGFyXCIgfTtcbmNvbnN0IEZPTlRfU0laRV9QUklNQVJZID0gMjQ7XG5jb25zdCBGT05UX1NJWkVfU0VDT05EQVJZID0gMTY7XG5jb25zdCBGT05UX0NPTE9SX1BSSU1BUlkgPSBbXG4gICAgeyB0eXBlOiBcIlNPTElEXCIsIGNvbG9yOiBoZXhUb1JnYihcIjE3MkI0RFwiKSB9LFxuXTtcbmNvbnN0IEZPTlRfQ09MT1JfU0VDT05EQVJZID0gW1xuICAgIHsgdHlwZTogXCJTT0xJRFwiLCBjb2xvcjogaGV4VG9SZ2IoXCI2Qjc3OENcIikgfSxcbl07XG5jb25zdCBGT05UX0NPTE9SX1VSTCA9IFtcbiAgICB7IHR5cGU6IFwiU09MSURcIiwgY29sb3I6IGhleFRvUmdiKFwiMDA2NUZGXCIpIH0sXG5dO1xuZnVuY3Rpb24gZ2V0U3RhdHVzKGRhdGEpIHtcbiAgICB2YXIgX2EsIF9iO1xuICAgIHJldHVybiAoX2IgPSAoX2EgPSBkYXRhLmZpZWxkcykgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLnN0YXR1cykgPT09IG51bGwgfHwgX2IgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9iLm5hbWU7XG59XG5mdW5jdGlvbiBnZXRUaXRsZShkYXRhKSB7XG4gICAgdmFyIF9hO1xuICAgIHJldHVybiAoKF9hID0gZGF0YS5maWVsZHMpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5zdW1tYXJ5KSB8fCBcIkVSUk9SOiBObyBzdW1tYXJ5IGV4aXN0aW5nLlwiO1xufVxuZnVuY3Rpb24gZ2V0SXNzdWVJZChkYXRhKSB7XG4gICAgcmV0dXJuIGRhdGEua2V5O1xufVxuZnVuY3Rpb24gZ2V0QXNzaWduZWUoZGF0YSkge1xuICAgIHZhciBfYSwgX2I7XG4gICAgcmV0dXJuICgoX2IgPSAoX2EgPSBkYXRhLmZpZWxkcykgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmFzc2lnbmVlKSA9PT0gbnVsbCB8fCBfYiA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2IuZGlzcGxheU5hbWUpIHx8IFwiTm90IGFzc2lnbmVkXCI7XG59XG5mdW5jdGlvbiBnZXREZXNjcmlwdGlvbihkYXRhKSB7XG4gICAgdmFyIF9hO1xuICAgIHJldHVybiAoKF9hID0gZGF0YS5maWVsZHMpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5kZXNjcmlwdGlvbikgfHwgXCJObyBkZXNjcmlwdGlvblwiO1xufVxuZnVuY3Rpb24gZ2V0QWNjZXB0YW5jZUNyaXRlcmlhKGRhdGEpIHtcbiAgICB2YXIgX2E7XG4gICAgcmV0dXJuICgoX2EgPSBkYXRhLmZpZWxkcykgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmN1c3RvbWZpZWxkXzEwMTAzKSB8fCBcIk5vIGFjY2VwdGFuY2UgY3JpdGVyaWFcIjtcbn1cbmZ1bmN0aW9uIGdldENoYW5nZURhdGUoZGF0YSkge1xuICAgIHZhciBfYSwgX2I7XG4gICAgbGV0IGRhdGUgPSAoX2EgPSBkYXRhLmZpZWxkcykgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLnN0YXR1c2NhdGVnb3J5Y2hhbmdlZGF0ZTtcbiAgICBpZiAoIWRhdGUpXG4gICAgICAgICgoX2IgPSBkYXRhLmZpZWxkcykgPT09IG51bGwgfHwgX2IgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9iLmNyZWF0ZWQpIHx8IFwiTm8gZGF0ZVwiO1xuICAgIHJldHVybiBkYXRlO1xufVxudmFyIG5leHRUaWNrZXRPZmZzZXQgPSAwO1xuLy8gdGlja2V0ZGF0YS5maWVsZHMuYXNzaWduZWUuYXZhdGFyVXJsc1xuLy8gdGlja2V0ZGF0YS5maWVsZHMuc3RhdHVzLm5hbWVcbi8vIHRpY2tldGRhdGEuZmllbGRzLnN0YXR1cy5zdGF0dXNDYXRlZ29yeS5uYW1lXG5jb25zdCBJU1NVRV9JRF9OQU1FID0gXCJUaWNrZXQgSURcIjtcbmNvbnN0IElTU1VFX1RJVExFX05BTUUgPSBcIlRpY2tldCBUaXRsZVwiO1xuY29uc3QgSVNTVUVfQ0hBTkdFX0RBVEVfTkFNRSA9IFwiRGF0ZSBvZiBTdGF0dXMgQ2hhbmdlXCI7XG5jb25zdCBBU1NJR05FRV9OQU1FID0gXCJBc3NpZ25lZVwiO1xuY29uc3QgREVTQ1JJUFRJT05fTkFNRSA9IFwiRGVzY3JpcHRpb25cIjtcbmNvbnN0IEFDQ0VQVEFOQ0VfTkFNRSA9IFwiQWNjZXB0YW5jZSBDcml0ZXJpYVwiO1xuY29uc3QgU1RBVFVTX05BTUUgPSBcIlN0YXR1c1wiO1xuY29uc3QgQ09NUE9ORU5UX1NFVF9OQU1FID0gXCJKaXJhIFRpY2tldCBIZWFkZXJcIjtcbmNvbnN0IENPTVBPTkVOVF9TRVRfUFJPUEVSVFlfTkFNRSA9IFwiU3RhdHVzPVwiO1xuY29uc3QgVkFSSUFOVF9OQU1FX0RFRkFVTFQgPSBcIkJhY2tsb2dcIjtcbmNvbnN0IFZBUklBTlRfQ09MT1JfREVGQVVMVCA9IGhleFRvUmdiKFwiNUU2Qzg0XCIpO1xuY29uc3QgVkFSSUFOVF9OQU1FXzEgPSBcIlRvIERvXCI7XG5jb25zdCBWQVJJQU5UX0NPTE9SXzEgPSBoZXhUb1JnYihcIjVFNkM4NFwiKTtcbmNvbnN0IFZBUklBTlRfTkFNRV8yID0gXCJJbiBQcm9ncmVzc1wiO1xuY29uc3QgVkFSSUFOVF9DT0xPUl8yID0gaGV4VG9SZ2IoXCIwMDY1RkZcIik7XG5jb25zdCBWQVJJQU5UX05BTUVfMyA9IFwiSW4gUmV2aWV3XCI7XG5jb25zdCBWQVJJQU5UX0NPTE9SXzMgPSBoZXhUb1JnYihcIjAwQTNCRlwiKTtcbmNvbnN0IFZBUklBTlRfTkFNRV80ID0gXCJEZXYgUmVhZHlcIjtcbmNvbnN0IFZBUklBTlRfQ09MT1JfNCA9IGhleFRvUmdiKFwiMDBBM0JGXCIpO1xuY29uc3QgVkFSSUFOVF9OQU1FX0RPTkUgPSBcIkRvbmVcIjtcbmNvbnN0IFZBUklBTlRfQ09MT1JfRE9ORSA9IGhleFRvUmdiKFwiMzZCMzdFXCIpO1xuY29uc3QgVkFSSUFOVF9OQU1FX0VSUk9SID0gXCJFcnJvclwiO1xuY29uc3QgVkFSSUFOVF9DT0xPUl9FUlJPUiA9IGhleFRvUmdiKFwiRkY1NjMwXCIpO1xudmFyIHRpY2tldENvbXBvbmVudDtcbi8vIERvbid0IHNob3cgVUkgaWYgcmVsYXVuY2ggYnV0dG9ucyBhcmUgcnVuXG5pZiAoZmlnbWEuY29tbWFuZCA9PT0gXCJ1cGRhdGVfc2VsZWN0aW9uXCIpIHtcbiAgICB1cGRhdGVXaXRob3V0VUkoXCJzZWxlY3Rpb25cIik7XG59XG5lbHNlIGlmIChmaWdtYS5jb21tYW5kID09PSBcInVwZGF0ZV9hbGxcIikge1xuICAgIHVwZGF0ZVdpdGhvdXRVSShcImFsbFwiKTtcbn1cbmVsc2UgaWYgKGZpZ21hLmNvbW1hbmQgPT09IFwidXBkYXRlX3BhZ2VcIikge1xuICAgIHVwZGF0ZVdpdGhvdXRVSShcInBhZ2VcIik7XG59XG5lbHNlIGlmIChmaWdtYS5jb21tYW5kID09PSBcInNldF9saWJyYXJ5X2NvbXBvbmVudFwiKSB7XG4gICAgbGV0IHNlbGVjdGlvbiA9IGZpZ21hLmN1cnJlbnRQYWdlLnNlbGVjdGlvblswXTtcbiAgICBzYXZlTGlicmFyeUNvbXBvbmVudChzZWxlY3Rpb24pO1xufVxuZWxzZSBpZiAoZmlnbWEuY29tbWFuZCA9PT0gXCJyZW1vdmVfbGlicmFyeV9jb21wb25lbnRcIikge1xuICAgIGxldCBzZWxlY3Rpb24gPSBmaWdtYS5jdXJyZW50UGFnZS5zZWxlY3Rpb25bMF07XG4gICAgZGVsZXRlTGlicmFyeUNvbXBvbmVudChzZWxlY3Rpb24pO1xuICAgIHNlbGVjdGlvbi5zZXRSZWxhdW5jaERhdGEoe1xuICAgICAgICByZW1vdmVfbGlicmFyeV9jb21wb25lbnQ6IFwiVW5wdWJsaXNoIGdsb2JhbCBjb21wb25lbnQuIEl0IHdpbGwgbm90IGJlIHVzZWQgaW4gb3RoZXIgZmlsZXMgYW55bW9yZS5cIixcbiAgICB9KTtcbn1cbmVsc2Uge1xuICAgIC8vIE90aGVyd2lzZSBzaG93IFVJXG4gICAgZmlnbWEuc2hvd1VJKF9faHRtbF9fLCB7IHdpZHRoOiBXSU5ET1dfV0lEVEgsIGhlaWdodDogV0lORE9XX0hFSUdIVF9TTUFMTCB9KTtcbiAgICBzZW5kRGF0YSgpO1xufVxuLy8gTWFrZSBzdXJlIHRoZSBtYWluIGNvbXBvbmVudCBpcyByZWZlcmVuY2VkXG5yZWZlcmVuY2VUaWNrZXRDb21wb25lbnRTZXQoKTtcbi8vIFN0YXJ0IHBsdWdpbiB3aXRob3V0IHZpc2libGUgVUkgYW5kIHVwZGF0ZSB0aWNrZXRzXG5mdW5jdGlvbiB1cGRhdGVXaXRob3V0VUkodHlwZSkge1xuICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgIGZpZ21hLnNob3dVSShfX2h0bWxfXywgeyB2aXNpYmxlOiBmYWxzZSB9KTtcbiAgICAgICAgeWllbGQgc2VuZERhdGEoKTtcbiAgICAgICAgdmFyIGhhc0ZhaWxlZCA9IHJlcXVlc3RVcGRhdGVGb3JUaWNrZXRzKHR5cGUpO1xuICAgICAgICBpZiAoaGFzRmFpbGVkICYmXG4gICAgICAgICAgICAodHlwZSA9PT0gXCJhbGxcIiB8fCB0eXBlID09PSBcInBhZ2VcIiB8fCB0eXBlID09PSBcInNlbGVjdGlvblwiKSkge1xuICAgICAgICAgICAgZmlnbWEuY2xvc2VQbHVnaW4oKTtcbiAgICAgICAgfVxuICAgIH0pO1xufVxuLy8gU2VuZCB0aGUgc3RvcmVkIGF1dGhvcml6YXRpb24gZGF0YSB0byB0aGUgVUlcbmZ1bmN0aW9uIHNlbmREYXRhKCkge1xuICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgIGNvbXBhbnlfbmFtZSA9IHlpZWxkIGdldEF1dGhvcml6YXRpb25JbmZvKENPTVBBTllfTkFNRV9LRVksIHRydWUpO1xuICAgICAgICBwcm9qZWN0X2lkID0geWllbGQgZ2V0QXV0aG9yaXphdGlvbkluZm8oUFJPSkVDVF9JRF9LRVksIHRydWUpO1xuICAgICAgICBpc3N1ZUlkID0geWllbGQgZ2V0QXV0aG9yaXphdGlvbkluZm8oSVNTVUVfSURfS0VZLCB0cnVlKTtcbiAgICAgICAgdXNlcm5hbWUgPSB5aWVsZCBnZXRBdXRob3JpemF0aW9uSW5mbyhVU0VSTkFNRV9LRVksIGZhbHNlKTtcbiAgICAgICAgcGFzc3dvcmQgPSB5aWVsZCBnZXRBdXRob3JpemF0aW9uSW5mbyhQQVNTV09SRF9LRVksIGZhbHNlKTtcbiAgICAgICAgY3JlYXRlTGluayA9IHlpZWxkIGdldEF1dGhvcml6YXRpb25JbmZvKENSRUFURV9MSU5LX0tFWSwgZmFsc2UpO1xuICAgICAgICBpZiAoY3JlYXRlTGluayA9PT0gXCJcIilcbiAgICAgICAgICAgIGNyZWF0ZUxpbmsgPSB0cnVlO1xuICAgICAgICBmaWdtYS51aS5wb3N0TWVzc2FnZSh7XG4gICAgICAgICAgICBjb21wYW55X25hbWU6IGNvbXBhbnlfbmFtZSxcbiAgICAgICAgICAgIHByb2plY3RfaWQ6IHByb2plY3RfaWQsXG4gICAgICAgICAgICB1c2VybmFtZTogdXNlcm5hbWUsXG4gICAgICAgICAgICBwYXNzd29yZDogcGFzc3dvcmQsXG4gICAgICAgICAgICBpc3N1ZUlkOiBpc3N1ZUlkLFxuICAgICAgICAgICAgY3JlYXRlTGluazogY3JlYXRlTGluayxcbiAgICAgICAgICAgIHR5cGU6IFwic2V0QXV0aG9yaXphdGlvblZhcmlhYmxlc1wiLFxuICAgICAgICB9KTtcbiAgICB9KTtcbn1cbi8vIEFsbCB0aGUgZnVuY3Rpb25zIHRoYXQgY2FuIGJlIHN0YXJ0ZWQgZnJvbSB0aGUgVUlcbmZpZ21hLnVpLm9ubWVzc2FnZSA9IChtc2cpID0+IF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAvLyBDYWxsZWQgdG8gY3JlYXRlIGEgbmV3IG1haW4gY29tcG9uZW50IGFuZCBzYXZlIGl0cyBJRFxuICAgIGlmIChtc2cudHlwZSA9PT0gXCJjcmVhdGUtY29tcG9uZW50XCIpIHtcbiAgICAgICAgdGlja2V0Q29tcG9uZW50ID0geWllbGQgY3JlYXRlVGlja2V0Q29tcG9uZW50U2V0KCk7XG4gICAgICAgIERPQ1VNRU5UX05PREUuc2V0UGx1Z2luRGF0YShcInRpY2tldENvbXBvbmVudElEXCIsIHRpY2tldENvbXBvbmVudC5pZCk7XG4gICAgfVxuICAgIC8vIENhbGxlZCB0byBjcmVhdGUgYSBuZXcgaW5zdGFuY2Ugb2YgYSBjb21wb25lbnQgKGJhc2VkIG9uIHRoZSBpc3N1ZUlkIGVudGVyZWQgaW4gdGhlIFVJKVxuICAgIGlmIChtc2cudHlwZSA9PT0gXCJjcmVhdGUtbmV3LXRpY2tldFwiICYmIGNoZWNrRmV0Y2hTdWNjZXNzKG1zZy5kYXRhKSkge1xuICAgICAgICBsZXQgdGlja2V0SW5zdGFuY2UgPSB5aWVsZCBjcmVhdGVUaWNrZXRJbnN0YW5jZShtc2cpO1xuICAgICAgICAvLyBDcmVhdGUgYSBsaW5rIGluIEppcmFcbiAgICAgICAgaWYgKG1zZy5jcmVhdGVMaW5rICYmIG1zZy5kYXRhWzBdLmtleSAmJiBwcm9qZWN0X2lkICE9IFwiXCIpIHtcbiAgICAgICAgICAgIGxldCBwcm9qZWN0TmFtZSA9IGVuY29kZVVSSUNvbXBvbmVudChmaWdtYS5yb290Lm5hbWUpO1xuICAgICAgICAgICAgbGV0IG5vZGVJZCA9IGVuY29kZVVSSUNvbXBvbmVudCh0aWNrZXRJbnN0YW5jZS5pZCk7XG4gICAgICAgICAgICBsZXQgbGluayA9IGBodHRwczovL3d3dy5maWdtYS5jb20vZmlsZS8ke3Byb2plY3RfaWR9LyR7cHJvamVjdE5hbWV9P25vZGUtaWQ9JHtub2RlSWR9YDtcbiAgICAgICAgICAgIGZpZ21hLnVpLnBvc3RNZXNzYWdlKHtcbiAgICAgICAgICAgICAgICBpc3N1ZUlkOiBtc2cuaXNzdWVJZHNbMF0sXG4gICAgICAgICAgICAgICAgbGluazogbGluayxcbiAgICAgICAgICAgICAgICB0eXBlOiBcInBvc3QtbGluay10by1qaXJhLWlzc3VlXCIsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvLyBDYWxsZWQgdG8gZ2V0IGFsbCBKaXJhIFRpY2tlciBIZWFkZXIgaW5zdGFuY2VzIGFuZCB1cGRhdGUgdGhlbSBvbmUgYnkgb25lLlxuICAgIGlmIChtc2cudHlwZSA9PT0gXCJ1cGRhdGUtYWxsXCIpIHtcbiAgICAgICAgcmVxdWVzdFVwZGF0ZUZvclRpY2tldHMoXCJhbGxcIik7XG4gICAgfVxuICAgIC8vIENhbGxlZCB0byBnZXQgSmlyYSBUaWNrZXIgSGVhZGVyIGluc3RhbmNlcyBvbiB0aGlzIHBhZ2UgYW5kIHVwZGF0ZSB0aGVtIG9uZSBieSBvbmUuXG4gICAgaWYgKG1zZy50eXBlID09PSBcInVwZGF0ZS1wYWdlXCIpIHtcbiAgICAgICAgcmVxdWVzdFVwZGF0ZUZvclRpY2tldHMoXCJwYWdlXCIpO1xuICAgIH1cbiAgICAvLyBDYWxsZWQgdG8gZ2V0IHNlbGVjdGVkIEppcmEgVGlja2VyIEhlYWRlciBpbnN0YW5jZXMgYW5kIHVwZGF0ZSB0aGVtIG9uZSBieSBvbmUuXG4gICAgaWYgKG1zZy50eXBlID09PSBcInVwZGF0ZS1zZWxlY3RlZFwiKSB7XG4gICAgICAgIHJlcXVlc3RVcGRhdGVGb3JUaWNrZXRzKFwic2VsZWN0aW9uXCIpO1xuICAgIH1cbiAgICAvLyBTYXZlIG5ldyBhdXRob3JpemF0aW9uIGluZm9cbiAgICBpZiAobXNnLnR5cGUgPT09IFwiYXV0aG9yaXphdGlvbi1kZXRhaWwtY2hhbmdlZFwiKSB7XG4gICAgICAgIHNldEF1dGhvcml6YXRpb25JbmZvKG1zZy5rZXksIG1zZy5kYXRhLCBtc2cuc2F2ZV9wdWJsaWMpO1xuICAgIH1cbiAgICAvLyBSZXNpemUgdGhlIFVJXG4gICAgaWYgKG1zZy50eXBlID09PSBcInJlc2l6ZS11aVwiKSB7XG4gICAgICAgIG1zZy5iaWdfc2l6ZVxuICAgICAgICAgICAgPyBmaWdtYS51aS5yZXNpemUoV0lORE9XX1dJRFRILCBXSU5ET1dfSEVJR0hUX0JJRylcbiAgICAgICAgICAgIDogZmlnbWEudWkucmVzaXplKFdJTkRPV19XSURUSCwgV0lORE9XX0hFSUdIVF9TTUFMTCk7XG4gICAgfVxuICAgIC8vIEFsbG93cyB0aGUgVUkgdG8gY3JlYXRlIG5vdGlmaWNhdGlvbnNcbiAgICBpZiAobXNnLnR5cGUgPT09IFwiY3JlYXRlLXZpc3VhbC1iZWxsXCIpIHtcbiAgICAgICAgZmlnbWEubm90aWZ5KG1zZy5tZXNzYWdlKTtcbiAgICB9XG4gICAgLy8gVXBkYXRlcyBpbnN0YW5jZXMgYmFzZWQgb24gdGhlIHJlY2VpdmVkIHRpY2tldCBkYXRhLlxuICAgIGlmIChtc2cudHlwZSA9PT0gXCJ0aWNrZXREYXRhU2VudFwiICYmIGNoZWNrRmV0Y2hTdWNjZXNzKG1zZy5kYXRhKSkge1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhcIlRpY2tldCBkYXRhOlwiLCBtc2cuZGF0YSlcbiAgICAgICAgdmFyIG5vZGVJZHMgPSBtc2cubm9kZUlkcztcbiAgICAgICAgdmFyIG5vZGVzID0gbm9kZUlkcy5tYXAoKGlkKSA9PiBmaWdtYS5nZXROb2RlQnlJZChpZCkpO1xuICAgICAgICB5aWVsZCB1cGRhdGVUaWNrZXRzKG5vZGVzLCBtc2cpO1xuICAgIH1cbn0pO1xuLy8gU2F2ZXMgYXV0aG9yaXphdGlvbiBkZXRhaWxzIGluIGNsaWVudCBzdG9yYWdlXG5mdW5jdGlvbiBzZXRBdXRob3JpemF0aW9uSW5mbyhrZXksIHZhbHVlLCBzYXZlUHVibGljID0gZmFsc2UpIHtcbiAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICBpZiAoc2F2ZVB1YmxpYykge1xuICAgICAgICAgICAgRE9DVU1FTlRfTk9ERS5zZXRQbHVnaW5EYXRhKGtleSwgdmFsdWUpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgeWllbGQgZmlnbWEuY2xpZW50U3RvcmFnZS5zZXRBc3luYyhrZXksIHZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBNYWtlIHN1cmUgdGhhdCB2YXJpYWJsZSBnZXRzIHVwZGF0ZWRcbiAgICAgICAgaWYgKGtleSA9PT0gQ09NUEFOWV9OQU1FX0tFWSlcbiAgICAgICAgICAgIGNvbXBhbnlfbmFtZSA9IHZhbHVlO1xuICAgICAgICBlbHNlIGlmIChrZXkgPT09IFBST0pFQ1RfSURfS0VZKVxuICAgICAgICAgICAgcHJvamVjdF9pZCA9IHZhbHVlO1xuICAgICAgICBlbHNlIGlmIChrZXkgPT09IFVTRVJOQU1FX0tFWSlcbiAgICAgICAgICAgIHVzZXJuYW1lID0gdmFsdWU7XG4gICAgICAgIGVsc2UgaWYgKGtleSA9PT0gUEFTU1dPUkRfS0VZKVxuICAgICAgICAgICAgcGFzc3dvcmQgPSB2YWx1ZTtcbiAgICAgICAgZWxzZSBpZiAoa2V5ID09PSBJU1NVRV9JRF9LRVkpXG4gICAgICAgICAgICBpc3N1ZUlkID0gdmFsdWU7XG4gICAgICAgIGVsc2UgaWYgKGtleSA9PT0gQ1JFQVRFX0xJTktfS0VZKVxuICAgICAgICAgICAgY3JlYXRlTGluayA9IHZhbHVlO1xuICAgIH0pO1xufVxuLy8gR2V0IGF1dGhvcml6YXRpb24gZGV0YWlscyBmcm9tIGNsaWVudCBzdG9yYWdlXG5mdW5jdGlvbiBnZXRBdXRob3JpemF0aW9uSW5mbyhrZXksIHNhdmVkUHVibGljID0gZmFsc2UpIHtcbiAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICB2YXIgdmFsdWVTYXZlZDtcbiAgICAgICAgaWYgKHNhdmVkUHVibGljKSB7XG4gICAgICAgICAgICB2YWx1ZVNhdmVkID0gRE9DVU1FTlRfTk9ERS5nZXRQbHVnaW5EYXRhKGtleSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB2YWx1ZVNhdmVkID0geWllbGQgZmlnbWEuY2xpZW50U3RvcmFnZS5nZXRBc3luYyhrZXkpO1xuICAgICAgICB9XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKGtleSwgdmFsdWVTYXZlZClcbiAgICAgICAgaWYgKCF2YWx1ZVNhdmVkICYmIHZhbHVlU2F2ZWQgIT0gZmFsc2UpXG4gICAgICAgICAgICB2YWx1ZVNhdmVkID0gXCJcIjtcbiAgICAgICAgcmV0dXJuIHZhbHVlU2F2ZWQ7XG4gICAgfSk7XG59XG4vKipcbiAqIFNhdmVzIGEgY29tcG9uZW50IGxpYnJhcnkga2V5IHNvIGl0IGNhbiBiZSByZWZlcmVuY2VkIGFuZCByZXVzZWQgaW4gb3RoZXIgZmlsZXMuXG4gKiBAcGFyYW0gY29tcG9uZW50Tm9kZSBUaGUgY29tcG9uZW50IHRvIGJlIHVzZWQgZ2xvYmFsbHlcbiAqL1xuZnVuY3Rpb24gc2F2ZUxpYnJhcnlDb21wb25lbnQoY29tcG9uZW50Tm9kZSkge1xuICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgIGxldCBjb21wb25lbnRLZXk7XG4gICAgICAgIGlmIChjb21wb25lbnROb2RlLnR5cGUgPT09IFwiQ09NUE9ORU5UX1NFVFwiKSB7XG4gICAgICAgICAgICBjb21wb25lbnRLZXkgPSBjb21wb25lbnROb2RlLmtleTtcbiAgICAgICAgICAgIHlpZWxkIGZpZ21hLmNsaWVudFN0b3JhZ2Uuc2V0QXN5bmMoTElCUkFSWV9DT01QT05FTlRfS0VZLCBjb21wb25lbnRLZXkpO1xuICAgICAgICAgICAgY29tcG9uZW50Tm9kZS5hYnNvbHV0ZVJlbmRlckJvdW5kcztcbiAgICAgICAgICAgIC8vIGNvbXBvbmVudE5vZGUuc2V0UmVsYXVuY2hEYXRhKHt9KVxuICAgICAgICAgICAgY29tcG9uZW50Tm9kZS5zZXRSZWxhdW5jaERhdGEoe1xuICAgICAgICAgICAgICAgIHJlbW92ZV9saWJyYXJ5X2NvbXBvbmVudDogXCJUaGUgY29tcG9uZW50IHdpbGwgbm90IGJlIHVzZWQgYW55bW9yZSBpbiBuZXcgZmlsZXMuXCIsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGZpZ21hLmNsb3NlUGx1Z2luKFwiU2V0IGFzIGdsb2JhbCBKVFMgY29tcG9uZW50LiBNYWtlIHN1cmUgdGhlIGNvbXBvbmVudCBpcyBwdWJsaXNoZWQgaW4gYSBsaWJyYXJ5LlwiKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGZpZ21hLmNsb3NlUGx1Z2luKFwiRWxlbWVudCBpcyBub3QgYSBjb21wb25lbnQgc2V0LiBDb3VsZCBub3QgYmUgc2F2ZWQgYXMgbGlicmFyeSBjb21wb25lbnQuXCIpO1xuICAgICAgICB9XG4gICAgfSk7XG59XG4vKipcbiAqIFJlbW92ZXMgYSBjb21wb25lbnQgbGlicmFyeSBrZXkgc28gaXQgY2FuIG5vdCBiZSByZWZlcmVuY2VkIGFuZCByZXVzZWQgaW4gb3RoZXIgZmlsZXMgYW55bW9yZS5cbiAqIEBwYXJhbSBjb21wb25lbnROb2RlIFRoZSBjb21wb25lbnQgb24gd2hpY2ggdGhlIHJlbGF1bmNoIGRhdGEgYnV0dG9uIHNob3VsZCBiZSBzd2l0Y2hlZFxuICovXG5mdW5jdGlvbiBkZWxldGVMaWJyYXJ5Q29tcG9uZW50KGNvbXBvbmVudE5vZGUpIHtcbiAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICB5aWVsZCBmaWdtYS5jbGllbnRTdG9yYWdlLmRlbGV0ZUFzeW5jKExJQlJBUllfQ09NUE9ORU5UX0tFWSk7XG4gICAgICAgIGNvbXBvbmVudE5vZGUuc2V0UmVsYXVuY2hEYXRhKHt9KTtcbiAgICAgICAgY29tcG9uZW50Tm9kZS5zZXRSZWxhdW5jaERhdGEoe1xuICAgICAgICAgICAgc2V0X2xpYnJhcnlfY29tcG9uZW50OiBcIlB1Ymxpc2ggdGhlIGNvbXBvbmVudCBpbiBhIGxpYnJhcnkgYW5kIHRoZW4gY2xpY2sgdGhpcyBidXR0b24uXCIsXG4gICAgICAgIH0pO1xuICAgICAgICBmaWdtYS5jbG9zZVBsdWdpbihcIlVucHVibGlzaGVkIGdsb2JhbCBKVFMgY29tcG9uZW50LlwiKTtcbiAgICB9KTtcbn1cbi8qKlxuICogR2V0IHN1YnNldCBvZiB0aWNrZXRzIGluIGRvY3VtZW50IGFuZCBzdGFydCB1cGRhdGUgcHJvY2Vzc1xuICogQHBhcmFtIHN1YnNldCBBIHN1YnNldCBvZiB0aWNrZXQgaW5zdGFuY2VzIGluIHRoZSBkb2N1bWVudFxuICogQHJldHVybnMgQm9vbGVhbiBpZiB0aGUgc3Vic2V0IGNvdWxkIGJlIHVwZGF0ZWRcbiAqL1xuZnVuY3Rpb24gcmVxdWVzdFVwZGF0ZUZvclRpY2tldHMoc3Vic2V0KSB7XG4gICAgbGV0IG5vZGVzO1xuICAgIGxldCBpc0ZhaWxlZCA9IGZhbHNlO1xuICAgIC8vIEFsbCBpbiBkb2N1bWVudFxuICAgIGlmIChzdWJzZXQgPT0gXCJhbGxcIikge1xuICAgICAgICBub2RlcyA9IERPQ1VNRU5UX05PREUuZmluZEFsbFdpdGhDcml0ZXJpYSh7XG4gICAgICAgICAgICB0eXBlczogW1wiSU5TVEFOQ0VcIl0sXG4gICAgICAgIH0pO1xuICAgICAgICBub2RlcyA9IG5vZGVzLmZpbHRlcigobm9kZSkgPT4gbm9kZS5uYW1lID09PSBDT01QT05FTlRfU0VUX05BTUUpO1xuICAgICAgICBpZiAobm9kZXMubGVuZ3RoID09IDApIHtcbiAgICAgICAgICAgIGZpZ21hLm5vdGlmeShgTm8gaW5zdGFuY2VzIG5hbWVkICcke0NPTVBPTkVOVF9TRVRfTkFNRX0nIGZvdW5kIGluIGRvY3VtZW50LmApO1xuICAgICAgICAgICAgaXNGYWlsZWQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgZ2V0RGF0YUZvclRpY2tldHMobm9kZXMpO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8vIEFsbCBvbiBwYWdlXG4gICAgZWxzZSBpZiAoc3Vic2V0ID09IFwicGFnZVwiKSB7XG4gICAgICAgIG5vZGVzID0gZmlnbWEuY3VycmVudFBhZ2UuZmluZEFsbFdpdGhDcml0ZXJpYSh7XG4gICAgICAgICAgICB0eXBlczogW1wiSU5TVEFOQ0VcIl0sXG4gICAgICAgIH0pO1xuICAgICAgICBub2RlcyA9IG5vZGVzLmZpbHRlcigobm9kZSkgPT4gbm9kZS5uYW1lID09PSBDT01QT05FTlRfU0VUX05BTUUpO1xuICAgICAgICBpZiAobm9kZXMubGVuZ3RoID09IDApIHtcbiAgICAgICAgICAgIGZpZ21hLm5vdGlmeShgTm8gaW5zdGFuY2VzIG5hbWVkICcke0NPTVBPTkVOVF9TRVRfTkFNRX0nIGZvdW5kIG9uIHBhZ2UuYCk7XG4gICAgICAgICAgICBpc0ZhaWxlZCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBnZXREYXRhRm9yVGlja2V0cyhub2Rlcyk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8gU2VsZWN0ZWQgZWxlbWVudHNcbiAgICBlbHNlIGlmIChzdWJzZXQgPT0gXCJzZWxlY3Rpb25cIikge1xuICAgICAgICBub2RlcyA9IGZpZ21hLmN1cnJlbnRQYWdlLnNlbGVjdGlvbjtcbiAgICAgICAgbm9kZXMgPSBub2Rlcy5maWx0ZXIoKG5vZGUpID0+IG5vZGUubmFtZSA9PT0gQ09NUE9ORU5UX1NFVF9OQU1FKTtcbiAgICAgICAgaWYgKG5vZGVzLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgICAgICBmaWdtYS5ub3RpZnkoYE5vIFwiJHtDT01QT05FTlRfU0VUX05BTUV9XCIgaW5zdGFuY2Ugc2VsZWN0ZWQuYCk7XG4gICAgICAgICAgICBpc0ZhaWxlZCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBnZXREYXRhRm9yVGlja2V0cyhub2Rlcyk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGlzRmFpbGVkO1xufVxuLyoqXG4gKiBTZW5kcyBhIHJlcXVlc3QgdG8gdGhlIFVJIHRvIGZldGNoIGRhdGEgZm9yIGFuIGFycmF5IG9mIHRpY2tldHNcbiAqIEBwYXJhbSBpbnN0YW5jZXMgSW5zdGFuY2VzIG9mIHRoZSBKVFMgY29tcG9uZW50XG4gKi9cbmZ1bmN0aW9uIGdldERhdGFGb3JUaWNrZXRzKGluc3RhbmNlcykge1xuICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgIHZhciBub2RlSWRzID0gW107XG4gICAgICAgIHZhciBpc3N1ZUlkcyA9IFtdO1xuICAgICAgICB2YXIgbWlzc2luZ0lkcyA9IDA7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaW5zdGFuY2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCBub2RlID0gaW5zdGFuY2VzW2ldO1xuICAgICAgICAgICAgaWYgKG5vZGUudHlwZSA9PT0gXCJJTlNUQU5DRVwiKSB7XG4gICAgICAgICAgICAgICAgbGV0IGlzc3VlSWROb2RlID0gbm9kZS5maW5kT25lKChuKSA9PiBuLnR5cGUgPT09IFwiVEVYVFwiICYmIG4ubmFtZSA9PT0gSVNTVUVfSURfTkFNRSk7XG4gICAgICAgICAgICAgICAgaWYgKCFpc3N1ZUlkTm9kZSB8fCBpc3N1ZUlkTm9kZS5jaGFyYWN0ZXJzID09PSBcIlwiKSB7XG4gICAgICAgICAgICAgICAgICAgIG1pc3NpbmdJZHMgKz0gMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGlzc3VlSWRzLnB1c2goaXNzdWVJZE5vZGUuY2hhcmFjdGVycyk7XG4gICAgICAgICAgICAgICAgICAgIG5vZGVJZHMucHVzaChub2RlLmlkKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gSWYgYW55IGluc3RhbmNlIGlzIG1pc3NpbmcgdGhlIElELlxuICAgICAgICBpZiAobWlzc2luZ0lkcyA+IDApXG4gICAgICAgICAgICBmaWdtYS5ub3RpZnkoYCR7bWlzc2luZ0lkc30gaW5zdGFuY2UocykgaXMgbWlzc2luZyB0aGUgdGV4dCBlbGVtZW50ICcke0lTU1VFX0lEX05BTUV9JyBhbmQgY291bGQgbm90IGJlIHVwZGF0ZWQuYCk7XG4gICAgICAgIC8vIEdldCB0aWNrZXQgZGF0YSBpZlxuICAgICAgICBpZiAoaXNzdWVJZHMubGVuZ3RoID09PSAwIHx8IG5vZGVJZHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICBpZiAoZmlnbWEuY29tbWFuZClcbiAgICAgICAgICAgICAgICBmaWdtYS5jbG9zZVBsdWdpbigpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgZmlnbWEudWkucG9zdE1lc3NhZ2Uoe1xuICAgICAgICAgICAgICAgIG5vZGVJZHM6IG5vZGVJZHMsXG4gICAgICAgICAgICAgICAgaXNzdWVJZHM6IGlzc3VlSWRzLFxuICAgICAgICAgICAgICAgIHR5cGU6IFwiZ2V0VGlja2V0RGF0YVwiLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cbi8qKlxuICogVXBkYXRlcyBhIHNldCBvZiB0aWNrZXRzIGJhc2VkIG9uIHRoZWlyIHN0YXR1cy5cbiAqIElzIGNhbGxlZCBhZnRlciB0aGUgZGF0YSBpcyBmZXRjaGVkLlxuICogQHBhcmFtIHRpY2tldEluc3RhbmNlcyBBIHNldCBvZiB0aWNrZXQgaW5zdGFuY2VzXG4gKiBAcGFyYW0gbXNnIEEgbWVzc2FnZSBzZW50IGZyb20gdGhlIFVJXG4gKiBAcGFyYW0gaXNDcmVhdGVOZXcgV2V0aGVyIHRoZSBmdW5jdGlvbiBjYWxsIGlzIGNvbWluZyBmcm9tIGFuIGFjdHVhbCB0aWNrZXQgdXBkYXRlIG9yIGZyb20gY3JlYXRpbmcgYSBuZXcgdGlja2V0XG4gKiBAcmV0dXJucyBVcGRhdGVkIHRpY2tldCBpbnN0YW5jZXNcbiAqL1xuZnVuY3Rpb24gdXBkYXRlVGlja2V0cyh0aWNrZXRJbnN0YW5jZXMsIG1zZywgaXNDcmVhdGVOZXcgPSBmYWxzZSkge1xuICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgIHZhciB0aWNrZXREYXRhQXJyYXkgPSBtc2cuZGF0YTtcbiAgICAgICAgdmFyIGlzc3VlSWRzID0gbXNnLmlzc3VlSWRzO1xuICAgICAgICB2YXIgbnVtYmVyT2ZOb2RlcyA9IHRpY2tldEluc3RhbmNlcy5sZW5ndGg7XG4gICAgICAgIHZhciBpbnZhbGlkSWRzID0gW107XG4gICAgICAgIHZhciBudW1iZXJPZk1pc3NpbmdUaXRsZXMgPSAwO1xuICAgICAgICB2YXIgbnVtYmVyT2ZNaXNzaW5nRGF0ZXMgPSAwO1xuICAgICAgICB2YXIgbnVtYmVyT2ZNaXNzaW5nQXNzaWduZWVzID0gMDtcbiAgICAgICAgdmFyIG1pc3NpbmdWYXJpYW50cyA9IFtdO1xuICAgICAgICAvLyBHbyB0aHJvdWdoIGFsbCBub2RlcyBhbmQgdXBkYXRlIHRoZWlyIGNvbnRlbnRcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBudW1iZXJPZk5vZGVzOyBpKyspIHtcbiAgICAgICAgICAgIGxldCB0aWNrZXRJbnN0YW5jZSA9IHRpY2tldEluc3RhbmNlc1tpXTtcbiAgICAgICAgICAgIGxldCB0aWNrZXREYXRhID0gY2hlY2tUaWNrZXREYXRhUmVwb25zZSh0aWNrZXREYXRhQXJyYXlbaV0sIGlzc3VlSWRzW2ldKTtcbiAgICAgICAgICAgIGxldCB0aWNrZXRTdGF0dXMgPSBnZXRTdGF0dXModGlja2V0RGF0YSk7XG4gICAgICAgICAgICBpZiAodGlja2V0U3RhdHVzID09PSBcIkVycm9yXCIpXG4gICAgICAgICAgICAgICAgaW52YWxpZElkcy5wdXNoKGlzc3VlSWRzW2ldKTtcbiAgICAgICAgICAgIC8vIEdldCB0aGUgdmFyaWFudCBiYXNlZCBvbiB0aGUgdGlja2V0IHN0YXR1cyBhbmQgc3dhcCBpdCB3aXRoIHRoZSBjdXJyZW50XG4gICAgICAgICAgICBsZXQgbmV3VmFyaWFudCA9IHRpY2tldENvbXBvbmVudC5maW5kQ2hpbGQoKG4pID0+IG4ubmFtZSA9PT0gQ09NUE9ORU5UX1NFVF9QUk9QRVJUWV9OQU1FICsgdGlja2V0U3RhdHVzKTtcbiAgICAgICAgICAgIGlmICghbmV3VmFyaWFudCkge1xuICAgICAgICAgICAgICAgIC8vIElmIHRoZSBzdGF0dXMgZG9lc24ndCBtYXRjaCBhbnkgb2YgdGhlIHZhcmlhbnRzLCB1c2UgZGVmYXVsdFxuICAgICAgICAgICAgICAgIG5ld1ZhcmlhbnQgPSB0aWNrZXRDb21wb25lbnQuZGVmYXVsdFZhcmlhbnQ7XG4gICAgICAgICAgICAgICAgbWlzc2luZ1ZhcmlhbnRzLnB1c2godGlja2V0U3RhdHVzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRpY2tldEluc3RhbmNlLnN3YXBDb21wb25lbnQobmV3VmFyaWFudCk7XG4gICAgICAgICAgICAvLyBVcGRhdGUgdGl0bGVcbiAgICAgICAgICAgIGxldCB0aXRsZU5vZGUgPSB0aWNrZXRJbnN0YW5jZS5maW5kT25lKChuKSA9PiBuLnR5cGUgPT09IFwiVEVYVFwiICYmIG4ubmFtZSA9PT0gSVNTVUVfVElUTEVfTkFNRSk7XG4gICAgICAgICAgICBpZiAodGl0bGVOb2RlKSB7XG4gICAgICAgICAgICAgICAgdGl0bGVOb2RlLmZvbnROYW1lID0geWllbGQgdHJ5TG9hZGluZ0ZvbnQodGl0bGVOb2RlLmZvbnROYW1lKTtcbiAgICAgICAgICAgICAgICB0aXRsZU5vZGUuY2hhcmFjdGVycyA9IGdldFRpdGxlKHRpY2tldERhdGEpO1xuICAgICAgICAgICAgICAgIHRpdGxlTm9kZS5oeXBlcmxpbmsgPSB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IFwiVVJMXCIsXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiBgaHR0cHM6Ly8ke2NvbXBhbnlfbmFtZX0vYnJvd3NlLyR7dGlja2V0RGF0YS5rZXl9YCxcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgbnVtYmVyT2ZNaXNzaW5nVGl0bGVzICs9IDE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBVcGRhdGUgZGF0ZVxuICAgICAgICAgICAgbGV0IGNoYW5nZURhdGVOb2RlID0gdGlja2V0SW5zdGFuY2UuZmluZE9uZSgobikgPT4gbi50eXBlID09PSBcIlRFWFRcIiAmJiBuLm5hbWUgPT09IElTU1VFX0NIQU5HRV9EQVRFX05BTUUpO1xuICAgICAgICAgICAgaWYgKGNoYW5nZURhdGVOb2RlICYmIGdldENoYW5nZURhdGUodGlja2V0RGF0YSkpIHtcbiAgICAgICAgICAgICAgICBjaGFuZ2VEYXRlTm9kZS5mb250TmFtZSA9IHlpZWxkIHRyeUxvYWRpbmdGb250KGNoYW5nZURhdGVOb2RlLmZvbnROYW1lKTtcbiAgICAgICAgICAgICAgICAvLyBGaWx0ZXJzIG91dCB0aGUgZGF0YSB0byBhIHNpbXBsZXIgZm9ybWF0IChNbW0gREQgWVlZWSlcbiAgICAgICAgICAgICAgICB2YXIgZGF0ZSA9IG5ldyBEYXRlKGdldENoYW5nZURhdGUodGlja2V0RGF0YSkucmVwbGFjZSgvW1RdKy4qLywgXCJcIikpO1xuICAgICAgICAgICAgICAgIGNoYW5nZURhdGVOb2RlLmNoYXJhY3RlcnMgPSBkYXRlLnRvRGF0ZVN0cmluZygpO1xuICAgICAgICAgICAgICAgIC8vIGNoYW5nZURhdGVUeHQuY2hhcmFjdGVycyA9IGRhdGUudG9EYXRlU3RyaW5nKCkucmVwbGFjZSgvXihbQS1aYS16XSopLi8sXCJcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBudW1iZXJPZk1pc3NpbmdEYXRlcyArPSAxO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gVXBkYXRlIGFzc2lnbmVlXG4gICAgICAgICAgICBsZXQgYXNzaWduZWVOb2RlID0gdGlja2V0SW5zdGFuY2UuZmluZE9uZSgobikgPT4gbi50eXBlID09PSBcIlRFWFRcIiAmJiBuLm5hbWUgPT09IEFTU0lHTkVFX05BTUUpO1xuICAgICAgICAgICAgaWYgKGFzc2lnbmVlTm9kZSkge1xuICAgICAgICAgICAgICAgIGFzc2lnbmVlTm9kZS5mb250TmFtZSA9IHlpZWxkIHRyeUxvYWRpbmdGb250KGFzc2lnbmVlTm9kZS5mb250TmFtZSk7XG4gICAgICAgICAgICAgICAgYXNzaWduZWVOb2RlLmNoYXJhY3RlcnMgPSBnZXRBc3NpZ25lZSh0aWNrZXREYXRhKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIG51bWJlck9mTWlzc2luZ0Fzc2lnbmVlcyArPSAxO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gVXBkYXRlIHN0YXR1cyB0ZXh0IGZpZWxkXG4gICAgICAgICAgICBsZXQgc3RhdHVzTm9kZSA9IHRpY2tldEluc3RhbmNlLmZpbmRPbmUoKG4pID0+IG4udHlwZSA9PT0gXCJURVhUXCIgJiYgbi5uYW1lID09PSBTVEFUVVNfTkFNRSk7XG4gICAgICAgICAgICBpZiAoc3RhdHVzTm9kZSkge1xuICAgICAgICAgICAgICAgIHN0YXR1c05vZGUuZm9udE5hbWUgPSB5aWVsZCB0cnlMb2FkaW5nRm9udChzdGF0dXNOb2RlLmZvbnROYW1lKTtcbiAgICAgICAgICAgICAgICBzdGF0dXNOb2RlLmNoYXJhY3RlcnMgPSBnZXRTdGF0dXModGlja2V0RGF0YSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvL1VwZGF0ZSBhY2NlcHRhbmNlIGNyaXRlcmlhXG4gICAgICAgICAgICBsZXQgYWNjZXB0YW5jZU5vZGUgPSB0aWNrZXRJbnN0YW5jZS5maW5kT25lKChuKSA9PiBuLnR5cGUgPT09IFwiVEVYVFwiICYmIG4ubmFtZSA9PT0gQUNDRVBUQU5DRV9OQU1FKTtcbiAgICAgICAgICAgIGlmIChhY2NlcHRhbmNlTm9kZSkge1xuICAgICAgICAgICAgICAgIGFjY2VwdGFuY2VOb2RlLmZvbnROYW1lID0geWllbGQgdHJ5TG9hZGluZ0ZvbnQoYWNjZXB0YW5jZU5vZGUuZm9udE5hbWUpO1xuICAgICAgICAgICAgICAgIGFjY2VwdGFuY2VOb2RlLmNoYXJhY3RlcnMgPSBnZXRBY2NlcHRhbmNlQ3JpdGVyaWEodGlja2V0RGF0YSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBVcGRhdGUgZGVzY3JpcHRpb25cbiAgICAgICAgICAgIGxldCBkZXNjcmlwdGlvbk5vZGUgPSB0aWNrZXRJbnN0YW5jZS5maW5kT25lKChuKSA9PiBuLnR5cGUgPT09IFwiVEVYVFwiICYmIG4ubmFtZSA9PT0gREVTQ1JJUFRJT05fTkFNRSk7XG4gICAgICAgICAgICBsZXQgZGVzY3JpcHRpb25UZXh0ID0gZ2V0RGVzY3JpcHRpb24odGlja2V0RGF0YSk7XG4gICAgICAgICAgICBpZiAoZGVzY3JpcHRpb25Ob2RlICYmIGRlc2NyaXB0aW9uVGV4dCkge1xuICAgICAgICAgICAgICAgIGxldCBsb2FkZWRGb250ID0geWllbGQgdHJ5TG9hZGluZ0ZvbnQoRk9OVF9ERVNDUklQVElPTik7XG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb25Ob2RlLmZvbnROYW1lID0gbG9hZGVkRm9udDtcbiAgICAgICAgICAgICAgICBsZXQgZm9udEZhbWlseSA9IGxvYWRlZEZvbnQuZmFtaWx5O1xuICAgICAgICAgICAgICAgIC8vIEJ1bGxldCBwb2ludHNcbiAgICAgICAgICAgICAgICB3aGlsZSAoZGVzY3JpcHRpb25UZXh0Lm1hdGNoKC9cXG4oXFwqKStbXlxcd10vKSkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgY291bnQgPSBkZXNjcmlwdGlvblRleHQubWF0Y2goL1xcbihcXCopK1teXFx3XS8pWzBdLmxlbmd0aDtcbiAgICAgICAgICAgICAgICAgICAgY291bnQgPSAoY291bnQgLSAyKSAqIDI7XG4gICAgICAgICAgICAgICAgICAgIHZhciBzcGFjZXMgPSBuZXcgQXJyYXkoY291bnQpLmpvaW4oXCIgXCIpO1xuICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvblRleHQgPSBkZXNjcmlwdGlvblRleHQucmVwbGFjZSgvXFxuKFxcKikrW15cXHddLywgYFxcbiR7c3BhY2VzfeKAoiBgKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb25Ob2RlLmNoYXJhY3RlcnMgPSBkZXNjcmlwdGlvblRleHQ7XG4gICAgICAgICAgICAgICAgLy8gUGFuZWxcbiAgICAgICAgICAgICAgICBsZXQgcmVnZXhQYW5lbCA9IC9cXHtwYW5lbC4qP30oLis/KVxce3BhbmVsXFx9L3M7XG4gICAgICAgICAgICAgICAgbGV0IGZvbnRQYW5lbCA9IHsgZmFtaWx5OiBmb250RmFtaWx5LCBzdHlsZTogXCJSZWd1bGFyXCIgfTtcbiAgICAgICAgICAgICAgICB5aWVsZCBjaGFuZ2VGb250c0J5UmVnZXgoZGVzY3JpcHRpb25Ob2RlLCByZWdleFBhbmVsLCBmb250UGFuZWwsIDEsIFwiLS0tLS0tLVwiLCBcIi0tLS0tLS1cIik7XG4gICAgICAgICAgICAgICAgLy8gQ29kZVxuICAgICAgICAgICAgICAgIGxldCByZWdleENvZGUgPSAvXFx7bm9mb3JtYXRcXH0oLio/KVxce25vZm9ybWF0XFx9L3M7XG4gICAgICAgICAgICAgICAgbGV0IGZvbnRDb2RlID0geyBmYW1pbHk6IFwiQ291cmllclwiLCBzdHlsZTogXCJSZWd1bGFyXCIgfTtcbiAgICAgICAgICAgICAgICB5aWVsZCBjaGFuZ2VGb250c0J5UmVnZXgoZGVzY3JpcHRpb25Ob2RlLCByZWdleENvZGUsIGZvbnRDb2RlLCAxLCBcIi0tLS0tLS1cXG5cIiwgXCItLS0tLS0tXCIpO1xuICAgICAgICAgICAgICAgIC8vIExpbmtcbiAgICAgICAgICAgICAgICBsZXQgcmVnZXhMaW5rID0gL1xcWyhodHRwczouKilcXHxodHRwLipcXHxzbWFydC1saW5rXS87XG4gICAgICAgICAgICAgICAgbGV0IGZvbnRMaW5rID0geyBmYW1pbHk6IGZvbnRGYW1pbHksIHN0eWxlOiBcIlJlZ3VsYXJcIiB9O1xuICAgICAgICAgICAgICAgIHlpZWxkIGNoYW5nZUZvbnRzQnlSZWdleChkZXNjcmlwdGlvbk5vZGUsIHJlZ2V4TGluaywgZm9udExpbmssIDEsIFwiXCIsIFwiXCIsIHRydWUpO1xuICAgICAgICAgICAgICAgIC8vIEJvbGRcbiAgICAgICAgICAgICAgICBsZXQgcmVnZXhCb2xkID0gL1xcKiguKz8pXFwqLztcbiAgICAgICAgICAgICAgICBsZXQgZm9udEJvbGQgPSB7IGZhbWlseTogZm9udEZhbWlseSwgc3R5bGU6IFwiQm9sZFwiIH07XG4gICAgICAgICAgICAgICAgeWllbGQgY2hhbmdlRm9udHNCeVJlZ2V4KGRlc2NyaXB0aW9uTm9kZSwgcmVnZXhCb2xkLCBmb250Qm9sZCwgMSk7XG4gICAgICAgICAgICAgICAgLy8gSXRhbGljXG4gICAgICAgICAgICAgICAgbGV0IHJlZ2V4SXRhbGljID0gL18oW15fXS4qPylfLztcbiAgICAgICAgICAgICAgICBsZXQgZm9udEl0YWxpYyA9IHsgZmFtaWx5OiBmb250RmFtaWx5LCBzdHlsZTogXCJPYmxpcXVlXCIgfTtcbiAgICAgICAgICAgICAgICB5aWVsZCBjaGFuZ2VGb250c0J5UmVnZXgoZGVzY3JpcHRpb25Ob2RlLCByZWdleEl0YWxpYywgZm9udEl0YWxpYywgMSk7XG4gICAgICAgICAgICAgICAgLy8gVGl0bGVcbiAgICAgICAgICAgICAgICBsZXQgcmVnZXhUaXRsZSA9IC9oKFsxLTldKVxcLlxccyguKikvO1xuICAgICAgICAgICAgICAgIGxldCBmb250VGl0bGUgPSB7IGZhbWlseTogZm9udEZhbWlseSwgc3R5bGU6IFwiQm9sZFwiIH07XG4gICAgICAgICAgICAgICAgeWllbGQgY2hhbmdlRm9udHNCeVJlZ2V4KGRlc2NyaXB0aW9uTm9kZSwgcmVnZXhUaXRsZSwgZm9udFRpdGxlLCAyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIEFkZCB0aGUgcmVsYXVuY2ggYnV0dG9uXG4gICAgICAgICAgICB0aWNrZXRJbnN0YW5jZS5zZXRSZWxhdW5jaERhdGEoeyB1cGRhdGVfc2VsZWN0aW9uOiBcIlwiIH0pO1xuICAgICAgICB9XG4gICAgICAgIC8vIE5vdGlmeSBhYm91dCBlcnJvcnMgKG1pc3NpbmcgdGV4dCBmaWVsZHMpXG4gICAgICAgIGlmIChtaXNzaW5nVmFyaWFudHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgbWlzc2luZ1ZhcmlhbnRzID0gWy4uLm5ldyBTZXQobWlzc2luZ1ZhcmlhbnRzKV07XG4gICAgICAgICAgICBsZXQgdmFyaWFudFN0cmluZyA9IG1pc3NpbmdWYXJpYW50cy5qb2luKFwiJywgJ1wiKTtcbiAgICAgICAgICAgIGZpZ21hLm5vdGlmeShgU3RhdHVzICcke3ZhcmlhbnRTdHJpbmd9JyBub3QgZXhpc3RpbmcuIFlvdSBjYW4gYWRkIGl0IGFzIGEgbmV3IHZhcmlhbnQgdG8gdGhlIG1haW4gY29tcG9uZW50LmAsIHsgdGltZW91dDogNjAwMCB9KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAobnVtYmVyT2ZNaXNzaW5nVGl0bGVzID4gMClcbiAgICAgICAgICAgIGZpZ21hLm5vdGlmeShgJHtudW1iZXJPZk1pc3NpbmdUaXRsZXN9IHRpY2tldHMgYXJlIG1pc3NpbmcgdGV4dCBlbGVtZW50ICcke0lTU1VFX1RJVExFX05BTUV9Jy5gKTtcbiAgICAgICAgaWYgKG51bWJlck9mTWlzc2luZ0RhdGVzID4gMClcbiAgICAgICAgICAgIGZpZ21hLm5vdGlmeShgJHtudW1iZXJPZk1pc3NpbmdEYXRlc30gdGlja2V0cyBhcmUgbWlzc2luZyB0ZXh0IGVsZW1lbnQgJyR7SVNTVUVfQ0hBTkdFX0RBVEVfTkFNRX0nLmApO1xuICAgICAgICBpZiAobnVtYmVyT2ZNaXNzaW5nQXNzaWduZWVzID4gMClcbiAgICAgICAgICAgIGZpZ21hLm5vdGlmeShgJHtudW1iZXJPZk1pc3NpbmdBc3NpZ25lZXN9IHRpY2tldHMgYXJlIG1pc3NpbmcgdGV4dCBlbGVtZW50ICcke0FTU0lHTkVFX05BTUV9Jy5gKTtcbiAgICAgICAgLy8gU3VjY2VzcyBtZXNzYWdlXG4gICAgICAgIHZhciBtZXNzYWdlO1xuICAgICAgICB2YXIgbnVtYmVyT2ZJbnZhbGlkSWRzID0gaW52YWxpZElkcy5sZW5ndGg7XG4gICAgICAgIGlmIChudW1iZXJPZkludmFsaWRJZHMgPT0gbnVtYmVyT2ZOb2Rlcykge1xuICAgICAgICAgICAgLy8gQWxsIGludmFsaWRcbiAgICAgICAgICAgIG1lc3NhZ2UgPVxuICAgICAgICAgICAgICAgIG51bWJlck9mTm9kZXMgPT0gMVxuICAgICAgICAgICAgICAgICAgICA/IFwiSW52YWxpZCBJRC5cIlxuICAgICAgICAgICAgICAgICAgICA6IGAke251bWJlck9mSW52YWxpZElkc30gb2YgJHtudW1iZXJPZk5vZGVzfSBJRHMgYXJlIGludmFsaWQgb3IgZG8gbm90IGV4aXN0LmA7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAobnVtYmVyT2ZJbnZhbGlkSWRzID09IDApIHtcbiAgICAgICAgICAgIC8vIEFsbCB2YWxpZFxuICAgICAgICAgICAgbWVzc2FnZSA9XG4gICAgICAgICAgICAgICAgbnVtYmVyT2ZOb2RlcyA9PSAxXG4gICAgICAgICAgICAgICAgICAgID8gXCJVcGRhdGVkLlwiXG4gICAgICAgICAgICAgICAgICAgIDogYCR7bnVtYmVyT2ZOb2Rlc30gb2YgJHtudW1iZXJPZk5vZGVzfSBoZWFkZXIocykgdXBkYXRlZCFgO1xuICAgICAgICAgICAgaWYgKGlzQ3JlYXRlTmV3KVxuICAgICAgICAgICAgICAgIG1lc3NhZ2UgPSBcIlwiO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgLy8gU29tZSB2YWxpZFxuICAgICAgICAgICAgbGV0IGZpcnN0U2VudGVuY2UgPSBgJHtudW1iZXJPZk5vZGVzIC0gbnVtYmVyT2ZJbnZhbGlkSWRzfSBvZiAke251bWJlck9mTm9kZXN9IHN1Y2Nlc3NmdWxseSB1cGRhdGVkLiBgO1xuICAgICAgICAgICAgbGV0IHNlY29uZFNlbnRlbmNlID0gbnVtYmVyT2ZJbnZhbGlkSWRzID09IDFcbiAgICAgICAgICAgICAgICA/IFwiMSBJRCBpcyBpbnZhbGlkIG9yIGRvZXMgbm90IGV4aXN0LlwiXG4gICAgICAgICAgICAgICAgOiBgJHtudW1iZXJPZkludmFsaWRJZHN9IElEcyBhcmUgaW52YWxpZCBvciBkbyBub3QgZXhpc3QuYDtcbiAgICAgICAgICAgIG1lc3NhZ2UgPSBmaXJzdFNlbnRlbmNlICsgc2Vjb25kU2VudGVuY2U7XG4gICAgICAgIH1cbiAgICAgICAgLy8gSWYgbm90IGFsbCBmb250IGNvdWxkIGJlIGxvYWRlZFxuICAgICAgICBpZiAoVU5MT0FERURfRk9OVFMuc2l6ZSA+IDApIHtcbiAgICAgICAgICAgIGZpZ21hLm5vdGlmeShcIkZvbnQocykgJ1wiICtcbiAgICAgICAgICAgICAgICBbLi4uVU5MT0FERURfRk9OVFNdLmpvaW4oXCIsIFwiKSArXG4gICAgICAgICAgICAgICAgXCInIGNvdWxkIG5vdCBiZSBsb2FkZWQuIFBsZWFzZSBpbnN0YWxsIHRoZSBmb250IG9yIGNoYW5nZSB0aGUgY29tcG9uZW50IGZvbnQuXCIpO1xuICAgICAgICAgICAgVU5MT0FERURfRk9OVFMuY2xlYXIoKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBJZiBjYWxsZWQgdmlhIHRoZSByZWxhdW5jaCBidXR0b24sIGNsb3NlIHBsdWdpbiBhZnRlciB1cGRhdGluZyB0aGUgdGlja2V0c1xuICAgICAgICBpZiAoZmlnbWEuY29tbWFuZCA9PT0gXCJ1cGRhdGVfcGFnZVwiIHx8XG4gICAgICAgICAgICBmaWdtYS5jb21tYW5kID09PSBcInVwZGF0ZV9hbGxcIiB8fFxuICAgICAgICAgICAgZmlnbWEuY29tbWFuZCA9PT0gXCJ1cGRhdGVfc2VsZWN0aW9uXCIpIHtcbiAgICAgICAgICAgIGZpZ21hLmNsb3NlUGx1Z2luKG1lc3NhZ2UpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgZmlnbWEubm90aWZ5KG1lc3NhZ2UsIHsgdGltZW91dDogMjAwMCB9KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGlja2V0SW5zdGFuY2VzO1xuICAgIH0pO1xufVxuLyoqXG4gKiBDaGFuZ2VzIHRoZSBmb250IGluIGEgVGV4dCBub2RlIGJhc2VkIG9uIGFuIGluZGljZXMgYXJyYXkuXG4gKiBAcGFyYW0gdGV4dE5vZGUgVGV4dCBOb2RlXG4gKiBAcGFyYW0gcmVnZXggUmVndWxhciBleHByZXNzaW9uIHRvIG1hdGNoIGNlcnRhaW4gcmFuZ2VcbiAqIEBwYXJhbSBmb250IEZvbnQgbmFtZSBmb3IgcmFuZ2VcbiAqIEBwYXJhbSBjb250ZW50R3JvdXAgV2hpY2ggY29udGVudCBncm91cCBpbiB0aGUgcmVnZXggc2hvdWxkIGJlIHRoZSBuZXcgdGV4dFxuICogQHBhcmFtIHByZVRleHQgQWRkIGEgdGV4dCBiZWZvcmUgdGhlIHJlZ2V4IG1hdGNoXG4gKiBAcGFyYW0gcG9zdFRleHQgQWRkIGEgdGV4dCBhZnRlciB0aGUgcmVnZXggbWF0Y2hcbiAqIEBwYXJhbSBjcmVhdGVIeXBlckxpbmsgQ3JlYXRlIGEgVVJMIGZvciB0aGlzIHRleHQgcmFuZ2U/XG4gKiBAcmV0dXJuIFRleHQgTm9kZVxuICovXG5mdW5jdGlvbiBjaGFuZ2VGb250c0J5UmVnZXgodGV4dE5vZGUsIHJlZ2V4LCBmb250LCBjb250ZW50R3JvdXAsIHByZVRleHQgPSBcIlwiLCBwb3N0VGV4dCA9IFwiXCIsIGNyZWF0ZUh5cGVyTGluayA9IGZhbHNlKSB7XG4gICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgZm9udCA9IHlpZWxkIHRyeUxvYWRpbmdGb250KGZvbnQpO1xuICAgICAgICB3aGlsZSAodGV4dE5vZGUuY2hhcmFjdGVycy5tYXRjaChyZWdleCkpIHtcbiAgICAgICAgICAgIGxldCBtYXRjaCA9IHRleHROb2RlLmNoYXJhY3RlcnMubWF0Y2gocmVnZXgpO1xuICAgICAgICAgICAgbGV0IGxlbmd0aCA9IG1hdGNoWzBdLmxlbmd0aDtcbiAgICAgICAgICAgIGxldCBpbmRleCA9IG1hdGNoLmluZGV4O1xuICAgICAgICAgICAgbGV0IG5ld1RleHQgPSBtYXRjaFtjb250ZW50R3JvdXBdO1xuICAgICAgICAgICAgbGV0IHdob2xlVGV4dCA9IHByZVRleHQgKyBuZXdUZXh0ICsgcG9zdFRleHQ7XG4gICAgICAgICAgICBsZXQgd2hvbGVMZW5ndGggPSB3aG9sZVRleHQubGVuZ3RoO1xuICAgICAgICAgICAgaWYgKGxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICB0ZXh0Tm9kZS5kZWxldGVDaGFyYWN0ZXJzKGluZGV4LCBpbmRleCArIGxlbmd0aCk7XG4gICAgICAgICAgICAgICAgdGV4dE5vZGUuaW5zZXJ0Q2hhcmFjdGVycyhpbmRleCwgd2hvbGVUZXh0KTtcbiAgICAgICAgICAgICAgICB0ZXh0Tm9kZS5zZXRSYW5nZUZvbnROYW1lKGluZGV4LCBpbmRleCArIHdob2xlTGVuZ3RoLCBmb250KTtcbiAgICAgICAgICAgICAgICBpZiAoY3JlYXRlSHlwZXJMaW5rKSB7XG4gICAgICAgICAgICAgICAgICAgIHRleHROb2RlLnNldFJhbmdlSHlwZXJsaW5rKGluZGV4LCBpbmRleCArIHdob2xlTGVuZ3RoLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBcIlVSTFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IG5ld1RleHQsXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB0ZXh0Tm9kZS5zZXRSYW5nZUZpbGxzKGluZGV4LCBpbmRleCArIHdob2xlTGVuZ3RoLCBGT05UX0NPTE9SX1VSTCk7XG4gICAgICAgICAgICAgICAgICAgIHRleHROb2RlLnNldFJhbmdlVGV4dERlY29yYXRpb24oaW5kZXgsIGluZGV4ICsgd2hvbGVMZW5ndGgsIFwiVU5ERVJMSU5FXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGV4dE5vZGU7XG4gICAgfSk7XG59XG4vKipcbiAqIENyZWF0ZSBpbnN0YW5jZXMgb2YgdGhlIG1haW4gdGlja2V0IGNvbXBvbmVudCBhbmQgcmVwbGFjZXMgdGhlIGNvbnRlbnQgd2l0aCBkYXRhIG9mIHRoZSBhY3R1YWwgSmlyYSB0aWNrZXRcbiAqIEBwYXJhbSBtc2cgSlNPTiB3aXRoIGluZm8gc2VudCBmcm9tIFVJXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZVRpY2tldEluc3RhbmNlKG1zZykge1xuICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgIC8vIENyZWF0ZSBhbiBpbnN0YW5jZSBhbmQgdXBkYXRlIGl0IHRvIHRoZSBjb3JyZWN0IHN0YXR1c1xuICAgICAgICBsZXQgdGlja2V0VmFyaWFudCA9IHRpY2tldENvbXBvbmVudC5kZWZhdWx0VmFyaWFudDtcbiAgICAgICAgbGV0IHRpY2tldEluc3RhbmNlID0gdGlja2V0VmFyaWFudC5jcmVhdGVJbnN0YW5jZSgpO1xuICAgICAgICAvLyBQb3NpdGlvbiB0aGUgdGlja2V0IGluc3RhbmNlIGFuZCBnaXZlIGl0IGEgc2xpZ2h0IG9mZnNldCAoc28gdGhhdCB3aGVuIG11bHRpcGxlIHRpY2tldHMgYXJlIGNyZWF0ZWQgdGhleSBkb250IG92ZXJsYXApXG4gICAgICAgIHRpY2tldEluc3RhbmNlLnggPVxuICAgICAgICAgICAgZmlnbWEudmlld3BvcnQuY2VudGVyLnggLSB0aWNrZXRJbnN0YW5jZS53aWR0aCAvIDIgKyBuZXh0VGlja2V0T2Zmc2V0O1xuICAgICAgICB0aWNrZXRJbnN0YW5jZS55ID1cbiAgICAgICAgICAgIGZpZ21hLnZpZXdwb3J0LmNlbnRlci55IC0gdGlja2V0SW5zdGFuY2UuaGVpZ2h0IC8gMiArIG5leHRUaWNrZXRPZmZzZXQ7XG4gICAgICAgIG5leHRUaWNrZXRPZmZzZXQgPSAobmV4dFRpY2tldE9mZnNldCArIDEwKSAlIDcwO1xuICAgICAgICBmaWdtYS5jdXJyZW50UGFnZS5zZWxlY3Rpb24gPSBbdGlja2V0SW5zdGFuY2VdO1xuICAgICAgICAvLyBDaGVjayBpZiB0aGUgZGF0YSBpcyB2YWxpZCBhbmQgdXBkYXRlIHRoZSBpbnN0YW5jZSB0ZXh0IGZpZWxkc1xuICAgICAgICBsZXQgdGlja2V0RGF0YSA9IGNoZWNrVGlja2V0RGF0YVJlcG9uc2UobXNnLmRhdGFbMF0sIG1zZy5pc3N1ZUlkc1swXSk7XG4gICAgICAgIGxldCB0aWNrZXRJbnN0YW5jZXMgPSB5aWVsZCB1cGRhdGVUaWNrZXRzKFt0aWNrZXRJbnN0YW5jZV0sIG1zZywgdHJ1ZSk7XG4gICAgICAgIHRpY2tldEluc3RhbmNlID0gdGlja2V0SW5zdGFuY2VzWzBdO1xuICAgICAgICAvLyBBZGQgSURcbiAgICAgICAgbGV0IGlzc3VlSURUeHQgPSB0aWNrZXRJbnN0YW5jZS5maW5kT25lKChuKSA9PiBuLnR5cGUgPT09IFwiVEVYVFwiICYmIG4ubmFtZSA9PT0gSVNTVUVfSURfTkFNRSk7XG4gICAgICAgIGlmIChpc3N1ZUlEVHh0KSB7XG4gICAgICAgICAgICBpc3N1ZUlEVHh0LmZvbnROYW1lID0geWllbGQgdHJ5TG9hZGluZ0ZvbnQoaXNzdWVJRFR4dC5mb250TmFtZSk7XG4gICAgICAgICAgICBpc3N1ZUlEVHh0LmNoYXJhY3RlcnMgPSBnZXRJc3N1ZUlkKHRpY2tldERhdGEpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgZmlnbWEubm90aWZ5KFwiQ291bGQgbm90IGZpbmQgdGV4dCBlbGVtZW50IG5hbWVkICdcIiArIElTU1VFX0lEX05BTUUgKyBcIicuXCIpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aWNrZXRJbnN0YW5jZTtcbiAgICB9KTtcbn1cbi8qKlxuICogQ3JlYXRlcyBhIG5ldyBjb21wb25lbnQgdGhhdCByZXByZXNlbnRzIGEgdGlja2V0IHN0YXR1c1xuICogQHBhcmFtIHN0YXR1c0NvbG9yIFJHQiB2YWx1ZSBmb3Igc3RhdHVzIGNvbG9yXG4gKiBAcGFyYW0gc3RhdHVzTmFtZSBOYW1lIG9mIHN0YXR1c1xuICogQHJldHVybnMgQSBjb21wb25lbnQgdGhhdCByZXByZXNlbnQgYSB0aWNrZXRcbiAqL1xuZnVuY3Rpb24gY3JlYXRlVGlja2V0VmFyaWFudChzdGF0dXNDb2xvciwgc3RhdHVzTmFtZSkge1xuICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgIHZhciB0aWNrZXRWYXJpYW50ID0gZmlnbWEuY3JlYXRlQ29tcG9uZW50KCk7XG4gICAgICAgIHRpY2tldFZhcmlhbnQudmlzaWJsZSA9IGZhbHNlO1xuICAgICAgICB2YXIgc3RhdHVzQ29sb3JSZWN0ID0gZmlnbWEuY3JlYXRlUmVjdGFuZ2xlKCk7XG4gICAgICAgIHZhciBpZEZyYW1lID0gZmlnbWEuY3JlYXRlRnJhbWUoKTtcbiAgICAgICAgdmFyIHRpdGxlRnJhbWUgPSBmaWdtYS5jcmVhdGVGcmFtZSgpO1xuICAgICAgICB2YXIgZGV0YWlsc0ZyYW1lID0gZmlnbWEuY3JlYXRlRnJhbWUoKTtcbiAgICAgICAgdmFyIGRlc2NyaXB0aW9uRnJhbWUgPSBmaWdtYS5jcmVhdGVGcmFtZSgpO1xuICAgICAgICBjb25zdCB0aXRsZVR4dCA9IGZpZ21hLmNyZWF0ZVRleHQoKTtcbiAgICAgICAgY29uc3QgaXNzdWVJZFR4dCA9IGZpZ21hLmNyZWF0ZVRleHQoKTtcbiAgICAgICAgY29uc3Qgc3RhdHVzVHh0ID0gZmlnbWEuY3JlYXRlVGV4dCgpO1xuICAgICAgICBjb25zdCBjaGFuZ2VEYXRlVHh0ID0gZmlnbWEuY3JlYXRlVGV4dCgpO1xuICAgICAgICBjb25zdCBhc3NpZ25lZVR4dCA9IGZpZ21hLmNyZWF0ZVRleHQoKTtcbiAgICAgICAgY29uc3QgZGl2aWRlclR4dDEgPSBmaWdtYS5jcmVhdGVUZXh0KCk7XG4gICAgICAgIGNvbnN0IGRpdmlkZXJUeHQyID0gZmlnbWEuY3JlYXRlVGV4dCgpO1xuICAgICAgICBjb25zdCBkZXNjcmlwdGlvblR4dCA9IGZpZ21hLmNyZWF0ZVRleHQoKTtcbiAgICAgICAgY29uc3QgYWNjZXB0YW5jZVR4dCA9IGZpZ21hLmNyZWF0ZVRleHQoKTtcbiAgICAgICAgdGlja2V0VmFyaWFudC5hcHBlbmRDaGlsZChzdGF0dXNDb2xvclJlY3QpO1xuICAgICAgICB0aWNrZXRWYXJpYW50LmFwcGVuZENoaWxkKGlkRnJhbWUpO1xuICAgICAgICBpZEZyYW1lLmFwcGVuZENoaWxkKGlzc3VlSWRUeHQpO1xuICAgICAgICBpZEZyYW1lLmFwcGVuZENoaWxkKHRpdGxlRnJhbWUpO1xuICAgICAgICB0aXRsZUZyYW1lLmFwcGVuZENoaWxkKHRpdGxlVHh0KTtcbiAgICAgICAgdGl0bGVGcmFtZS5hcHBlbmRDaGlsZChkZXRhaWxzRnJhbWUpO1xuICAgICAgICB0aXRsZUZyYW1lLmFwcGVuZENoaWxkKGRlc2NyaXB0aW9uRnJhbWUpO1xuICAgICAgICBkZXNjcmlwdGlvbkZyYW1lLmFwcGVuZENoaWxkKGRlc2NyaXB0aW9uVHh0KTtcbiAgICAgICAgZGVzY3JpcHRpb25GcmFtZS5hcHBlbmRDaGlsZChhY2NlcHRhbmNlVHh0KTtcbiAgICAgICAgZGV0YWlsc0ZyYW1lLmFwcGVuZENoaWxkKHN0YXR1c1R4dCk7XG4gICAgICAgIGRldGFpbHNGcmFtZS5hcHBlbmRDaGlsZChkaXZpZGVyVHh0MSk7XG4gICAgICAgIGRldGFpbHNGcmFtZS5hcHBlbmRDaGlsZChhc3NpZ25lZVR4dCk7XG4gICAgICAgIGRldGFpbHNGcmFtZS5hcHBlbmRDaGlsZChkaXZpZGVyVHh0Mik7XG4gICAgICAgIGRldGFpbHNGcmFtZS5hcHBlbmRDaGlsZChjaGFuZ2VEYXRlVHh0KTtcbiAgICAgICAgLy8gQ3JlYXRlIHZhcmlhbnQgZnJhbWVcbiAgICAgICAgdGlja2V0VmFyaWFudC5uYW1lID0gc3RhdHVzTmFtZTtcbiAgICAgICAgdGlja2V0VmFyaWFudC5yZXNpemUoNjAwLCAyMDApO1xuICAgICAgICB0aWNrZXRWYXJpYW50LmNvcm5lclJhZGl1cyA9IDE2O1xuICAgICAgICB0aWNrZXRWYXJpYW50Lml0ZW1TcGFjaW5nID0gMDtcbiAgICAgICAgdGlja2V0VmFyaWFudC5sYXlvdXRNb2RlID0gXCJIT1JJWk9OVEFMXCI7XG4gICAgICAgIHRpY2tldFZhcmlhbnQuY291bnRlckF4aXNTaXppbmdNb2RlID0gXCJBVVRPXCI7XG4gICAgICAgIHRpY2tldFZhcmlhbnQucHJpbWFyeUF4aXNTaXppbmdNb2RlID0gXCJGSVhFRFwiO1xuICAgICAgICB0aWNrZXRWYXJpYW50LmZpbGxzID0gW3sgdHlwZTogXCJTT0xJRFwiLCBjb2xvcjogeyByOiAxLCBnOiAxLCBiOiAxIH0gfV07XG4gICAgICAgIC8vIENyZWF0ZSBSZWN0YW5nbGVcbiAgICAgICAgc3RhdHVzQ29sb3JSZWN0LnJlc2l6ZSgxMiwgMjAwKTtcbiAgICAgICAgc3RhdHVzQ29sb3JSZWN0LmZpbGxzID0gW3sgdHlwZTogXCJTT0xJRFwiLCBjb2xvcjogc3RhdHVzQ29sb3IgfV07XG4gICAgICAgIHN0YXR1c0NvbG9yUmVjdC5sYXlvdXRBbGlnbiA9IFwiU1RSRVRDSFwiO1xuICAgICAgICBzdGF0dXNDb2xvclJlY3QubGF5b3V0R3JvdyA9IDA7XG4gICAgICAgIHN0YXR1c0NvbG9yUmVjdC50b3BMZWZ0UmFkaXVzID0gMTY7XG4gICAgICAgIHN0YXR1c0NvbG9yUmVjdC5ib3R0b21MZWZ0UmFkaXVzID0gMTY7XG4gICAgICAgIHN0YXR1c0NvbG9yUmVjdC5uYW1lID0gXCJTdGF0dXMgQ29sb3IgSW5kaWNhdG9yXCI7XG4gICAgICAgIC8vIENyZWF0ZSB0aGUgbWFpbiBmcmFtZVxuICAgICAgICBsZXQgcGFkZGluZyA9IDI0O1xuICAgICAgICBpZEZyYW1lLnBhZGRpbmdUb3AgPSBwYWRkaW5nO1xuICAgICAgICBpZEZyYW1lLnBhZGRpbmdSaWdodCA9IHBhZGRpbmc7XG4gICAgICAgIGlkRnJhbWUucGFkZGluZ0JvdHRvbSA9IHBhZGRpbmc7XG4gICAgICAgIGlkRnJhbWUucGFkZGluZ0xlZnQgPSBwYWRkaW5nO1xuICAgICAgICBpZEZyYW1lLm5hbWUgPSBcIkNvbnRhaW5lclwiO1xuICAgICAgICBpZEZyYW1lLmxheW91dE1vZGUgPSBcIlZFUlRJQ0FMXCI7XG4gICAgICAgIGlkRnJhbWUuY291bnRlckF4aXNTaXppbmdNb2RlID0gXCJBVVRPXCI7XG4gICAgICAgIGlkRnJhbWUubGF5b3V0QWxpZ24gPSBcIlNUUkVUQ0hcIjtcbiAgICAgICAgaWRGcmFtZS5sYXlvdXRHcm93ID0gMTtcbiAgICAgICAgaWRGcmFtZS5pdGVtU3BhY2luZyA9IDg7XG4gICAgICAgIGlkRnJhbWUuZmlsbHMgPSBbXTtcbiAgICAgICAgLy8gQ3JlYXRlIHRoZSB0aXRsZSBmcmFtZVxuICAgICAgICB0aXRsZUZyYW1lLm5hbWUgPSBcIkNvbnRhaW5lclwiO1xuICAgICAgICB0aXRsZUZyYW1lLmxheW91dE1vZGUgPSBcIlZFUlRJQ0FMXCI7XG4gICAgICAgIHRpdGxlRnJhbWUuY291bnRlckF4aXNTaXppbmdNb2RlID0gXCJBVVRPXCI7XG4gICAgICAgIHRpdGxlRnJhbWUubGF5b3V0QWxpZ24gPSBcIlNUUkVUQ0hcIjtcbiAgICAgICAgdGl0bGVGcmFtZS5pdGVtU3BhY2luZyA9IDE2O1xuICAgICAgICB0aXRsZUZyYW1lLmZpbGxzID0gW107XG4gICAgICAgIC8vIENyZWF0ZSB0aGUgZGV0YWlscyBmcmFtZVxuICAgICAgICBkZXRhaWxzRnJhbWUubmFtZSA9IFwiQ29udGFpbmVyXCI7XG4gICAgICAgIGRldGFpbHNGcmFtZS5sYXlvdXRNb2RlID0gXCJIT1JJWk9OVEFMXCI7XG4gICAgICAgIGRldGFpbHNGcmFtZS5jb3VudGVyQXhpc1NpemluZ01vZGUgPSBcIkFVVE9cIjtcbiAgICAgICAgZGV0YWlsc0ZyYW1lLmxheW91dEFsaWduID0gXCJTVFJFVENIXCI7XG4gICAgICAgIGRldGFpbHNGcmFtZS5pdGVtU3BhY2luZyA9IDg7XG4gICAgICAgIGRldGFpbHNGcmFtZS5maWxscyA9IFtdO1xuICAgICAgICAvLyBDcmVhdGUgdGhlIGRlc2NyaXB0aW9uIGZyYW1lXG4gICAgICAgIGRlc2NyaXB0aW9uRnJhbWUubmFtZSA9IFwiRGVzY3JpcHRpb25cIjtcbiAgICAgICAgZGVzY3JpcHRpb25GcmFtZS5sYXlvdXRNb2RlID0gXCJIT1JJWk9OVEFMXCI7XG4gICAgICAgIGRlc2NyaXB0aW9uRnJhbWUuY291bnRlckF4aXNTaXppbmdNb2RlID0gXCJBVVRPXCI7XG4gICAgICAgIGRlc2NyaXB0aW9uRnJhbWUubGF5b3V0QWxpZ24gPSBcIlNUUkVUQ0hcIjtcbiAgICAgICAgZGVzY3JpcHRpb25GcmFtZS5pdGVtU3BhY2luZyA9IDMyO1xuICAgICAgICBkZXNjcmlwdGlvbkZyYW1lLmNvcm5lclJhZGl1cyA9IDg7XG4gICAgICAgIGRlc2NyaXB0aW9uRnJhbWUudmVydGljYWxQYWRkaW5nID0gMTY7XG4gICAgICAgIGRlc2NyaXB0aW9uRnJhbWUuaG9yaXpvbnRhbFBhZGRpbmcgPSAxNjtcbiAgICAgICAgZGVzY3JpcHRpb25GcmFtZS5maWxscyA9IFt7IHR5cGU6IFwiU09MSURcIiwgY29sb3I6IGhleFRvUmdiKFwiZjRmNWY3XCIpIH1dO1xuICAgICAgICAvLyBBZGQgdGhlIHRpY2tldCB0ZXh0IGZpZWxkc1xuICAgICAgICB0aXRsZVR4dC5mb250TmFtZSA9IHlpZWxkIHRyeUxvYWRpbmdGb250KEZPTlRfUFJJTUFSWSk7XG4gICAgICAgIHRpdGxlVHh0LmZvbnRTaXplID0gRk9OVF9TSVpFX1BSSU1BUlk7XG4gICAgICAgIHRpdGxlVHh0LmZpbGxzID0gRk9OVF9DT0xPUl9QUklNQVJZO1xuICAgICAgICB0aXRsZVR4dC50ZXh0RGVjb3JhdGlvbiA9IFwiVU5ERVJMSU5FXCI7XG4gICAgICAgIHRpdGxlVHh0LmF1dG9SZW5hbWUgPSBmYWxzZTtcbiAgICAgICAgdGl0bGVUeHQuY2hhcmFjdGVycyA9IFwiVGlja2V0IHRpdGxlXCI7XG4gICAgICAgIHRpdGxlVHh0Lm5hbWUgPSBJU1NVRV9USVRMRV9OQU1FO1xuICAgICAgICBpc3N1ZUlkVHh0LmZvbnROYW1lID0geWllbGQgdHJ5TG9hZGluZ0ZvbnQoRk9OVF9TRUNPTkRBUlkpO1xuICAgICAgICBpc3N1ZUlkVHh0LmZvbnRTaXplID0gRk9OVF9TSVpFX1NFQ09OREFSWTtcbiAgICAgICAgaXNzdWVJZFR4dC5maWxscyA9IEZPTlRfQ09MT1JfU0VDT05EQVJZO1xuICAgICAgICBpc3N1ZUlkVHh0LmF1dG9SZW5hbWUgPSBmYWxzZTtcbiAgICAgICAgaXNzdWVJZFR4dC5jaGFyYWN0ZXJzID0gXCJJRC0xXCI7XG4gICAgICAgIGlzc3VlSWRUeHQubmFtZSA9IElTU1VFX0lEX05BTUU7XG4gICAgICAgIHN0YXR1c1R4dC5mb250TmFtZSA9IHlpZWxkIHRyeUxvYWRpbmdGb250KEZPTlRfU0VDT05EQVJZKTtcbiAgICAgICAgc3RhdHVzVHh0LmZvbnRTaXplID0gRk9OVF9TSVpFX1NFQ09OREFSWTtcbiAgICAgICAgc3RhdHVzVHh0LmZpbGxzID0gRk9OVF9DT0xPUl9TRUNPTkRBUlk7XG4gICAgICAgIHN0YXR1c1R4dC5hdXRvUmVuYW1lID0gZmFsc2U7XG4gICAgICAgIHN0YXR1c1R4dC5jaGFyYWN0ZXJzID0gc3RhdHVzTmFtZS5yZXBsYWNlKFwiU3RhdHVzPVwiLCBcIlwiKTtcbiAgICAgICAgc3RhdHVzVHh0Lm5hbWUgPSBTVEFUVVNfTkFNRTtcbiAgICAgICAgY2hhbmdlRGF0ZVR4dC5mb250U2l6ZSA9IEZPTlRfU0laRV9TRUNPTkRBUlk7XG4gICAgICAgIGNoYW5nZURhdGVUeHQuZmlsbHMgPSBGT05UX0NPTE9SX1NFQ09OREFSWTtcbiAgICAgICAgY2hhbmdlRGF0ZVR4dC5hdXRvUmVuYW1lID0gZmFsc2U7XG4gICAgICAgIGNoYW5nZURhdGVUeHQuY2hhcmFjdGVycyA9IFwiTU0gREQgWVlZWVwiO1xuICAgICAgICBjaGFuZ2VEYXRlVHh0Lm5hbWUgPSBJU1NVRV9DSEFOR0VfREFURV9OQU1FO1xuICAgICAgICBhc3NpZ25lZVR4dC5mb250U2l6ZSA9IEZPTlRfU0laRV9TRUNPTkRBUlk7XG4gICAgICAgIGFzc2lnbmVlVHh0LmZpbGxzID0gRk9OVF9DT0xPUl9TRUNPTkRBUlk7XG4gICAgICAgIGFzc2lnbmVlVHh0LmF1dG9SZW5hbWUgPSBmYWxzZTtcbiAgICAgICAgYXNzaWduZWVUeHQuY2hhcmFjdGVycyA9IFwiTmFtZSBvZiBhc3NpZ25lZVwiO1xuICAgICAgICBhc3NpZ25lZVR4dC5uYW1lID0gQVNTSUdORUVfTkFNRTtcbiAgICAgICAgZGl2aWRlclR4dDEuZm9udFNpemUgPSBGT05UX1NJWkVfU0VDT05EQVJZO1xuICAgICAgICBkaXZpZGVyVHh0MS5maWxscyA9IEZPTlRfQ09MT1JfU0VDT05EQVJZO1xuICAgICAgICBkaXZpZGVyVHh0MS5hdXRvUmVuYW1lID0gZmFsc2U7XG4gICAgICAgIGRpdmlkZXJUeHQxLmNoYXJhY3RlcnMgPSBcIi9cIjtcbiAgICAgICAgZGl2aWRlclR4dDEubmFtZSA9IFwiL1wiO1xuICAgICAgICBkaXZpZGVyVHh0Mi5mb250U2l6ZSA9IEZPTlRfU0laRV9TRUNPTkRBUlk7XG4gICAgICAgIGRpdmlkZXJUeHQyLmZpbGxzID0gRk9OVF9DT0xPUl9TRUNPTkRBUlk7XG4gICAgICAgIGRpdmlkZXJUeHQyLmF1dG9SZW5hbWUgPSBmYWxzZTtcbiAgICAgICAgZGl2aWRlclR4dDIuY2hhcmFjdGVycyA9IFwiL1wiO1xuICAgICAgICBkaXZpZGVyVHh0Mi5uYW1lID0gXCIvXCI7XG4gICAgICAgIGFjY2VwdGFuY2VUeHQuZm9udE5hbWUgPSB5aWVsZCB0cnlMb2FkaW5nRm9udChGT05UX0RFU0NSSVBUSU9OKTtcbiAgICAgICAgYWNjZXB0YW5jZVR4dC5mb250U2l6ZSA9IDE2O1xuICAgICAgICBhY2NlcHRhbmNlVHh0LmZpbGxzID0gRk9OVF9DT0xPUl9QUklNQVJZO1xuICAgICAgICBhY2NlcHRhbmNlVHh0LmF1dG9SZW5hbWUgPSBmYWxzZTtcbiAgICAgICAgYWNjZXB0YW5jZVR4dC5jaGFyYWN0ZXJzID0gXCJEZXNjcmlwdGlvblwiO1xuICAgICAgICBhY2NlcHRhbmNlVHh0Lm5hbWUgPSBBQ0NFUFRBTkNFX05BTUU7XG4gICAgICAgIGFjY2VwdGFuY2VUeHQubGF5b3V0R3JvdyA9IDE7XG4gICAgICAgIGRlc2NyaXB0aW9uVHh0LmZvbnROYW1lID0geWllbGQgdHJ5TG9hZGluZ0ZvbnQoRk9OVF9ERVNDUklQVElPTik7XG4gICAgICAgIGRlc2NyaXB0aW9uVHh0LmZvbnRTaXplID0gMTY7XG4gICAgICAgIGRlc2NyaXB0aW9uVHh0LmZpbGxzID0gRk9OVF9DT0xPUl9QUklNQVJZO1xuICAgICAgICBkZXNjcmlwdGlvblR4dC5hdXRvUmVuYW1lID0gZmFsc2U7XG4gICAgICAgIGRlc2NyaXB0aW9uVHh0LmNoYXJhY3RlcnMgPSBcIkRlc2NyaXB0aW9uXCI7XG4gICAgICAgIGRlc2NyaXB0aW9uVHh0Lm5hbWUgPSBERVNDUklQVElPTl9OQU1FO1xuICAgICAgICBkZXNjcmlwdGlvblR4dC5sYXlvdXRHcm93ID0gMTtcbiAgICAgICAgdGl0bGVUeHQubGF5b3V0QWxpZ24gPSBcIlNUUkVUQ0hcIjtcbiAgICAgICAgLy8gRml4ZXMgYSB3ZWlyZCBidWcgaW4gd2hpY2ggdGhlICdzdHJldGNoJyBkb2VzbnQgd29yayBwcm9wZXJseVxuICAgICAgICBpZEZyYW1lLnByaW1hcnlBeGlzU2l6aW5nTW9kZSA9IFwiRklYRURcIjtcbiAgICAgICAgaWRGcmFtZS5sYXlvdXRBbGlnbiA9IFwiU1RSRVRDSFwiO1xuICAgICAgICBkZXRhaWxzRnJhbWUucHJpbWFyeUF4aXNTaXppbmdNb2RlID0gXCJGSVhFRFwiO1xuICAgICAgICBkZXRhaWxzRnJhbWUubGF5b3V0QWxpZ24gPSBcIlNUUkVUQ0hcIjtcbiAgICAgICAgZGVzY3JpcHRpb25GcmFtZS5wcmltYXJ5QXhpc1NpemluZ01vZGUgPSBcIkZJWEVEXCI7XG4gICAgICAgIGRlc2NyaXB0aW9uRnJhbWUubGF5b3V0QWxpZ24gPSBcIlNUUkVUQ0hcIjtcbiAgICAgICAgdGlja2V0VmFyaWFudC52aXNpYmxlID0gdHJ1ZTtcbiAgICAgICAgcmV0dXJuIHRpY2tldFZhcmlhbnQ7XG4gICAgfSk7XG59XG4vKipcbiAqIENyZWF0ZXMgdGhlIG1haW4gY29tcG9uZW50IGZvciB0aGUgdGlja2V0c1xuICogQHJldHVybnMgVGhlIG1haW4gY29tcG9uZW50XG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZVRpY2tldENvbXBvbmVudFNldCgpIHtcbiAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICBsZXQgdGlja2V0Q29tcG9uZW50O1xuICAgICAgICAvLyBDcmVhdGUgdmFyaWFudHMgKG9uZSBmb3IgZWFjaCBzdGF0dXMpXG4gICAgICAgIGxldCB2YXJEZWZhdWx0ID0geWllbGQgY3JlYXRlVGlja2V0VmFyaWFudChWQVJJQU5UX0NPTE9SX0RFRkFVTFQsIENPTVBPTkVOVF9TRVRfUFJPUEVSVFlfTkFNRSArIFZBUklBTlRfTkFNRV9ERUZBVUxUKTtcbiAgICAgICAgbGV0IHZhcjEgPSB5aWVsZCBjcmVhdGVUaWNrZXRWYXJpYW50KFZBUklBTlRfQ09MT1JfMSwgQ09NUE9ORU5UX1NFVF9QUk9QRVJUWV9OQU1FICsgVkFSSUFOVF9OQU1FXzEpO1xuICAgICAgICBsZXQgdmFyMiA9IHlpZWxkIGNyZWF0ZVRpY2tldFZhcmlhbnQoVkFSSUFOVF9DT0xPUl8yLCBDT01QT05FTlRfU0VUX1BST1BFUlRZX05BTUUgKyBWQVJJQU5UX05BTUVfMik7XG4gICAgICAgIGxldCB2YXIzID0geWllbGQgY3JlYXRlVGlja2V0VmFyaWFudChWQVJJQU5UX0NPTE9SXzMsIENPTVBPTkVOVF9TRVRfUFJPUEVSVFlfTkFNRSArIFZBUklBTlRfTkFNRV8zKTtcbiAgICAgICAgbGV0IHZhcjQgPSB5aWVsZCBjcmVhdGVUaWNrZXRWYXJpYW50KFZBUklBTlRfQ09MT1JfNCwgQ09NUE9ORU5UX1NFVF9QUk9QRVJUWV9OQU1FICsgVkFSSUFOVF9OQU1FXzQpO1xuICAgICAgICBsZXQgdmFyNSA9IHlpZWxkIGNyZWF0ZVRpY2tldFZhcmlhbnQoVkFSSUFOVF9DT0xPUl9ET05FLCBDT01QT05FTlRfU0VUX1BST1BFUlRZX05BTUUgKyBWQVJJQU5UX05BTUVfRE9ORSk7XG4gICAgICAgIGxldCB2YXJFcnJvciA9IHlpZWxkIGNyZWF0ZVRpY2tldFZhcmlhbnQoVkFSSUFOVF9DT0xPUl9FUlJPUiwgQ09NUE9ORU5UX1NFVF9QUk9QRVJUWV9OQU1FICsgVkFSSUFOVF9OQU1FX0VSUk9SKTtcbiAgICAgICAgY29uc3QgdmFyaWFudHMgPSBbdmFyRGVmYXVsdCwgdmFyMSwgdmFyMiwgdmFyMywgdmFyNCwgdmFyNSwgdmFyRXJyb3JdO1xuICAgICAgICAvLyBDcmVhdGUgYSBjb21wb25lbnQgb3V0IG9mIGFsbCB0aGVzZSB2YXJpYW50c1xuICAgICAgICB0aWNrZXRDb21wb25lbnQgPSBmaWdtYS5jb21iaW5lQXNWYXJpYW50cyh2YXJpYW50cywgZmlnbWEuY3VycmVudFBhZ2UpO1xuICAgICAgICBsZXQgcGFkZGluZyA9IDE2O1xuICAgICAgICB0aWNrZXRDb21wb25lbnQubmFtZSA9IENPTVBPTkVOVF9TRVRfTkFNRTtcbiAgICAgICAgdGlja2V0Q29tcG9uZW50LmxheW91dE1vZGUgPSBcIlZFUlRJQ0FMXCI7XG4gICAgICAgIHRpY2tldENvbXBvbmVudC5jb3VudGVyQXhpc1NpemluZ01vZGUgPSBcIkFVVE9cIjtcbiAgICAgICAgdGlja2V0Q29tcG9uZW50LnByaW1hcnlBeGlzU2l6aW5nTW9kZSA9IFwiQVVUT1wiO1xuICAgICAgICB0aWNrZXRDb21wb25lbnQucGFkZGluZ1RvcCA9IHBhZGRpbmc7XG4gICAgICAgIHRpY2tldENvbXBvbmVudC5wYWRkaW5nUmlnaHQgPSBwYWRkaW5nO1xuICAgICAgICB0aWNrZXRDb21wb25lbnQucGFkZGluZ0JvdHRvbSA9IHBhZGRpbmc7XG4gICAgICAgIHRpY2tldENvbXBvbmVudC5wYWRkaW5nTGVmdCA9IHBhZGRpbmc7XG4gICAgICAgIHRpY2tldENvbXBvbmVudC5pdGVtU3BhY2luZyA9IDI0O1xuICAgICAgICB0aWNrZXRDb21wb25lbnQuY29ybmVyUmFkaXVzID0gNDtcbiAgICAgICAgLy8gU2F2ZSBjb21wb25lbnQgSUQgZm9yIGxhdGVyIHJlZmVyZW5jZVxuICAgICAgICBET0NVTUVOVF9OT0RFLnNldFBsdWdpbkRhdGEoXCJ0aWNrZXRDb21wb25lbnRJRFwiLCB0aWNrZXRDb21wb25lbnQuaWQpO1xuICAgICAgICB0aWNrZXRDb21wb25lbnQuc2V0UmVsYXVuY2hEYXRhKHtcbiAgICAgICAgICAgIHNldF9saWJyYXJ5X2NvbXBvbmVudDogXCJQdWJsaXNoIHRoZSBjb21wb25lbnQgaW4gYSBsaWJyYXJ5IGFuZCB0aGVuIGNsaWNrIHRoaXMgYnV0dG9uLlwiLFxuICAgICAgICB9KTtcbiAgICAgICAgLy8gTWFrZSBzdXJlIHRoZSBjb21wb25lbnQgaXMgdmlzaWJsZSB3aGVyZSB3ZSdyZSBjdXJyZW50bHkgbG9va2luZ1xuICAgICAgICB0aWNrZXRDb21wb25lbnQueCA9IGZpZ21hLnZpZXdwb3J0LmNlbnRlci54IC0gdGlja2V0Q29tcG9uZW50LndpZHRoIC8gMjtcbiAgICAgICAgdGlja2V0Q29tcG9uZW50LnkgPSBmaWdtYS52aWV3cG9ydC5jZW50ZXIueSAtIHRpY2tldENvbXBvbmVudC5oZWlnaHQgLyAyO1xuICAgICAgICByZXR1cm4gdGlja2V0Q29tcG9uZW50O1xuICAgIH0pO1xufVxuLyoqXG4gKiBDcmVhdGVzIGEgbmV3IG1haW4gdGlja2V0IGNvbXBvbmVudCBvciBnZXRzIHRoZSByZWZlcmVuY2UgdG8gdGhlIGV4aXN0aW5nIG9uZSBpbiB0aGUgZm9sbG93aW5nIG9yZGVyOlxuICogMS4gTG9va3MgZm9yIGxvY2FsIGNvbXBvbmVudCBiYXNlZCBvbiBjb21wb25lbnQgbmFtZVxuICogMS4gTG9va3MgZm9yIGxpYnJhcnkgY29tcG9uZW50IGJhc2VkIG9uIHB1YmxpYyBrZXlcbiAqIDIuIExvb2tzIGZvciBsaWJyYXJ5IGNvbXBvbmVudCBiYXNlZCBvbiBwcml2YXRlIGtleVxuICogNS4gQ3JlYXRlcyBhIG5ldyBjb21wb25lbnRcbiAqL1xuZnVuY3Rpb24gcmVmZXJlbmNlVGlja2V0Q29tcG9uZW50U2V0KCkge1xuICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgIC8vIElmIHRoZXJlIGlzIGEgY29tcG9uZW50IHNvbWV3aGVyZSB3aXRoIHRoZSByaWdodCBuYW1lXG4gICAgICAgIGxldCBjb21wb25lbnRTZXRzID0gZmlnbWEucm9vdC5maW5kQWxsV2l0aENyaXRlcmlhKHtcbiAgICAgICAgICAgIHR5cGVzOiBbXCJDT01QT05FTlRfU0VUXCJdLFxuICAgICAgICB9KTtcbiAgICAgICAgY29tcG9uZW50U2V0cyA9IGNvbXBvbmVudFNldHMuZmlsdGVyKChub2RlKSA9PiBub2RlLm5hbWUgPT09IENPTVBPTkVOVF9TRVRfTkFNRSk7XG4gICAgICAgIGlmIChjb21wb25lbnRTZXRzWzBdKSB7XG4gICAgICAgICAgICB0aWNrZXRDb21wb25lbnQgPSBjb21wb25lbnRTZXRzWzBdO1xuICAgICAgICAgICAgRE9DVU1FTlRfTk9ERS5zZXRQbHVnaW5EYXRhKFwidGlja2V0Q29tcG9uZW50SURcIiwgdGlja2V0Q29tcG9uZW50LmlkKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIC8vIElmIHRoZXJlIGlzIG5vIGxpYnJhcnkgY29tcG9uZW50LCB0cnkgdGhlIGdldCB0aGUgdGlja2V0IGNvbXBvbmVudCBieSBpdHMgSURcbiAgICAgICAgICAgIC8vIHZhciB0aWNrZXRDb21wb25lbnRJZCA9IERPQ1VNRU5UX05PREUuZ2V0UGx1Z2luRGF0YSgndGlja2V0Q29tcG9uZW50SUQnKVxuICAgICAgICAgICAgLy8gbGV0IG5vZGVcbiAgICAgICAgICAgIC8vIGlmICh0aWNrZXRDb21wb25lbnRJZCAmJiAobm9kZSA9IGZpZ21hLmdldE5vZGVCeUlkKHRpY2tldENvbXBvbmVudElkKSkpIHtcbiAgICAgICAgICAgIC8vIElmIHRoZXJlIGlzIGFuIElEIHNhdmVkLCBhY2Nlc3MgdGhlIHRpY2tldCBjb21wb25lbnRcbiAgICAgICAgICAgIC8vIHRpY2tldENvbXBvbmVudCA9IG5vZGVcbiAgICAgICAgICAgIC8vIH1cbiAgICAgICAgICAgIC8vIGVsc2Uge1xuICAgICAgICAgICAgLy9UcnkgdG8gZ2V0IGxpYnJhcnkgY29tcG9uZW50Li4uXG4gICAgICAgICAgICAvLy4uLmZyb20gY29tcG9uZW50IGtleSBzYXZlZCBpbiB0aGlzIHByb2plY3RcbiAgICAgICAgICAgIHZhciBwdWJsaWNUaWNrZXRDb21wb25lbnRLZXkgPSBET0NVTUVOVF9OT0RFLmdldFBsdWdpbkRhdGEoTElCUkFSWV9DT01QT05FTlRfS0VZKTtcbiAgICAgICAgICAgIGxldCBsaWJyYXJ5Q29tcG9uZW50O1xuICAgICAgICAgICAgaWYgKHB1YmxpY1RpY2tldENvbXBvbmVudEtleSAmJlxuICAgICAgICAgICAgICAgIChsaWJyYXJ5Q29tcG9uZW50ID0geWllbGQgaW1wb3J0TGlicmFyeUNvbXBvbmVudChwdWJsaWNUaWNrZXRDb21wb25lbnRLZXkpKSkge1xuICAgICAgICAgICAgICAgIHRpY2tldENvbXBvbmVudCA9IGxpYnJhcnlDb21wb25lbnQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLy4uLm9yIGZyb20gY29tcG9uZW50IGtleSBzYXZlZCB3aXRoIHRoZSB1c2VyXG4gICAgICAgICAgICAgICAgdmFyIHByaXZhdGVUaWNrZXRDb21wb25lbnRLZXkgPSB5aWVsZCBmaWdtYS5jbGllbnRTdG9yYWdlLmdldEFzeW5jKExJQlJBUllfQ09NUE9ORU5UX0tFWSk7XG4gICAgICAgICAgICAgICAgaWYgKHByaXZhdGVUaWNrZXRDb21wb25lbnRLZXkgJiZcbiAgICAgICAgICAgICAgICAgICAgKGxpYnJhcnlDb21wb25lbnQgPSB5aWVsZCBpbXBvcnRMaWJyYXJ5Q29tcG9uZW50KHByaXZhdGVUaWNrZXRDb21wb25lbnRLZXkpKSkge1xuICAgICAgICAgICAgICAgICAgICBET0NVTUVOVF9OT0RFLnNldFBsdWdpbkRhdGEoTElCUkFSWV9DT01QT05FTlRfS0VZLCBwcml2YXRlVGlja2V0Q29tcG9uZW50S2V5KTsgLy8gU2FmZSBrZXkgcHVibGljbHlcbiAgICAgICAgICAgICAgICAgICAgdGlja2V0Q29tcG9uZW50ID0gbGlicmFyeUNvbXBvbmVudDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIElmIHRoZXJlIGlzIG5vIGNvbXBvbmVudCwgY3JlYXRlIGEgbmV3IGNvbXBvbmVudFxuICAgICAgICAgICAgICAgICAgICB0aWNrZXRDb21wb25lbnQgPSB5aWVsZCBjcmVhdGVUaWNrZXRDb21wb25lbnRTZXQoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcbn1cbmZ1bmN0aW9uIGltcG9ydExpYnJhcnlDb21wb25lbnQoa2V5KSB7XG4gICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgdmFyIGxpYnJhcnlDb21wb25lbnQ7XG4gICAgICAgIHlpZWxkIGZpZ21hXG4gICAgICAgICAgICAuaW1wb3J0Q29tcG9uZW50U2V0QnlLZXlBc3luYyhrZXkpXG4gICAgICAgICAgICAudGhlbigocmVzdWx0KSA9PiB7XG4gICAgICAgICAgICBsaWJyYXJ5Q29tcG9uZW50ID0gcmVzdWx0O1xuICAgICAgICB9KVxuICAgICAgICAgICAgLmNhdGNoKCgpID0+IHtcbiAgICAgICAgICAgIGxpYnJhcnlDb21wb25lbnQgPSBmYWxzZTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBsaWJyYXJ5Q29tcG9uZW50O1xuICAgIH0pO1xufVxuLy8gQ2hlY2tzIGlmIGZldGNoaW5nIGRhdGEgd2FzIHN1Y2Nlc3NmdWwgYXQgYWxsXG5mdW5jdGlvbiBjaGVja0ZldGNoU3VjY2VzcyhkYXRhKSB7XG4gICAgdmFyIGlzU3VjY2VzcyA9IGZhbHNlO1xuICAgIC8vIENhbiB0aGlzIGV2ZW4gaGFwcGVuP1xuICAgIGlmICghZGF0YSkge1xuICAgICAgICBmaWdtYS5ub3RpZnkoXCJTb21ldGhpbmcgd2VudCB3cm9uZy5cIik7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIlNvbWV0aGluZyB3ZW50IHdyb25nLlwiICsgZGF0YSk7XG4gICAgfVxuICAgIC8vIE5vIGNvbm5lY3Rpb24gdG8gRmlyZWJhc2VcbiAgICBlbHNlIGlmIChkYXRhLnR5cGUgPT0gXCJFcnJvclwiKSB7XG4gICAgICAgIGZpZ21hLm5vdGlmeShcIkNvdWxkIG5vdCBnZXQgZGF0YS4gVGhlcmUgc2VlbXMgdG8gYmUgbm8gY29ubmVjdGlvbiB0byB0aGUgc2VydmVyLlwiKTtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGRhdGEubWVzc2FnZSk7XG4gICAgfVxuICAgIC8vIFdyb25nIGUtbWFpbFxuICAgIGVsc2UgaWYgKGRhdGFbMF0ubWVzc2FnZSA9PSBcIkNsaWVudCBtdXN0IGJlIGF1dGhlbnRpY2F0ZWQgdG8gYWNjZXNzIHRoaXMgcmVzb3VyY2UuXCIpIHtcbiAgICAgICAgZmlnbWEubm90aWZ5KFwiWW91IGhhdmUgZW50ZXJlZCBhbiBpbnZhbGlkIGUtbWFpbC4gU2VlICdBdXRob3JpemF0aW9uJyBzZXR0aW5ncy5cIik7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihkYXRhLm1lc3NhZ2UpO1xuICAgIH1cbiAgICAvLyBXcm9uZyBjb21wYW55IG5hbWVcbiAgICBlbHNlIGlmIChkYXRhWzBdLmVycm9yTWVzc2FnZSA9PSBcIlNpdGUgdGVtcG9yYXJpbHkgdW5hdmFpbGFibGVcIikge1xuICAgICAgICBmaWdtYS5ub3RpZnkoXCJDb21wYW55IGRvbWFpbiBuYW1lIGRvZXMgbm90IGV4aXN0LiBTZWUgJ1Byb2plY3QgU2V0dGluZ3MnLlwiKTtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGRhdGFbMF0uZXJyb3JNZXNzYWdlKTtcbiAgICB9XG4gICAgLy8gV3JvbmcgcGFzc3dvcmRcbiAgICBlbHNlIGlmIChkYXRhWzBdWzBdKSB7XG4gICAgICAgIGZpZ21hLm5vdGlmeShcIkNvdWxkIG5vdCBhY2Nlc3MgZGF0YS4gWW91ciBKaXJhIEFQSSBUb2tlbiBzZWVtcyB0byBiZSBpbnZhbGlkLiBTZWUgJ0F1dGhvcml6YXRpb24nIHNldHRpbmdzLlwiKTtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGRhdGFbMF1bMF0pO1xuICAgIH1cbiAgICAvLyBFbHNlLCBpdCB3YXMgcHJvYmFibHkgc3VjY2Vzc2Z1bFxuICAgIGVsc2Uge1xuICAgICAgICBpc1N1Y2Nlc3MgPSB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gaXNTdWNjZXNzO1xufVxuLy8gQ2hlY2tzIGlmIHBlciByZWNlaXZlZCB0aWNrZXQgZGF0YSBpZiB0aGUgZmV0Y2hpbmcgd2FzIHN1Y2Nlc3NmdWxcbmZ1bmN0aW9uIGNoZWNrVGlja2V0RGF0YVJlcG9uc2UodGlja2V0RGF0YSwgaXNzdWVJZCkge1xuICAgIHZhciBjaGVja2VkRGF0YTtcbiAgICAvLyBJZiB0aGUgSlNPTiBoYXMgYSBrZXkgZmllbGQsIHRoZSBkYXRhIGlzIHZhbGlkXG4gICAgaWYgKHRpY2tldERhdGEgJiYgdGlja2V0RGF0YS5rZXkpIHtcbiAgICAgICAgY2hlY2tlZERhdGEgPSB0aWNrZXREYXRhO1xuICAgIH1cbiAgICAvLyBJRCBkb2VzIG5vdCBleGlzdFxuICAgIGVsc2UgaWYgKHRpY2tldERhdGEuZXJyb3JNZXNzYWdlcykge1xuICAgICAgICBjaGVja2VkRGF0YSA9IGNyZWF0ZUVycm9yRGF0YUpTT04oYEVycm9yOiAke3RpY2tldERhdGEuZXJyb3JNZXNzYWdlc31gLCBpc3N1ZUlkKTtcbiAgICAgICAgLy8gZmlnbWEubm90aWZ5KGBUaWNrZXQgSUQgJyR7aXNzdWVJZH0nIGRvZXMgbm90IGV4aXN0LmApXG4gICAgfVxuICAgIC8vIE90aGVyXG4gICAgZWxzZSB7XG4gICAgICAgIGNoZWNrZWREYXRhID0gY3JlYXRlRXJyb3JEYXRhSlNPTihcIkVycm9yOiBBbiB1bmV4cGVjdGVkIGVycm9yIG9jY3VyZWQuXCIsIGlzc3VlSWQpO1xuICAgICAgICBmaWdtYS5ub3RpZnkoXCJVbmV4cGVjdGVkIGVycm9yLlwiKTtcbiAgICAgICAgY29uc29sZS5lcnJvcihcIlVuZXhwZWN0ZWQgZXJyb3IuXCIsIHRpY2tldERhdGEpO1xuICAgICAgICAvLyB0aHJvdyBuZXcgRXJyb3IodGlja2V0RGF0YS5tZXNzYWdlKVxuICAgIH1cbiAgICByZXR1cm4gY2hlY2tlZERhdGE7XG59XG4vLyBDcmVhdGUgYSBlcnJvciB2YXJpYWJsZSB0aGF0IGhhcyB0aGUgc2FtZSBtYWluIGZpZWxkcyBhcyB0aGUgSmlyYSBUaWNrZXQgdmFyaWFibGUuXG4vLyBUaGlzIHdpbGwgYmUgdXNlZCB0aGUgZmlsbCB0aGUgdGlja2V0IGRhdGEgd2l0aCB0aGUgZXJyb3IgbWVzc2FnZS5cbmZ1bmN0aW9uIGNyZWF0ZUVycm9yRGF0YUpTT04obWVzc2FnZSwgaXNzdWVJZCkge1xuICAgIHZhciB0b2RheSA9IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKTtcbiAgICB2YXIgZXJyb3JEYXRhID0ge1xuICAgICAgICBrZXk6IGlzc3VlSWQsXG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgc3VtbWFyeTogbWVzc2FnZSxcbiAgICAgICAgICAgIHN0YXR1czoge1xuICAgICAgICAgICAgICAgIG5hbWU6IFwiRXJyb3JcIixcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzdGF0dXNjYXRlZ29yeWNoYW5nZWRhdGU6IHRvZGF5LFxuICAgICAgICB9LFxuICAgIH07XG4gICAgcmV0dXJuIGVycm9yRGF0YTtcbn1cbmZ1bmN0aW9uIHRyeUxvYWRpbmdGb250KGZvbnROYW1lKSB7XG4gICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgdmFyIGxvYWRlZEZvbnQgPSBGT05UX0RFRkFVTFQ7XG4gICAgICAgIHlpZWxkIGZpZ21hXG4gICAgICAgICAgICAubG9hZEZvbnRBc3luYyhmb250TmFtZSlcbiAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIGxvYWRlZEZvbnQgPSBmb250TmFtZTtcbiAgICAgICAgfSlcbiAgICAgICAgICAgIC5jYXRjaCgoKSA9PiB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkZvbnQgJ1wiICtcbiAgICAgICAgICAgICAgICBmb250TmFtZS5mYW1pbHkgK1xuICAgICAgICAgICAgICAgIFwiJyBjb3VsZCBub3QgYmUgbG9hZGVkLiBQbGVhc2UgaW5zdGFsbCBvciBjaGFuZ2UgdGhlIGNvbXBvbmVudCBmb250LlwiKTtcbiAgICAgICAgICAgIFVOTE9BREVEX0ZPTlRTLmFkZChmb250TmFtZS5mYW1pbHkpO1xuICAgICAgICAgICAgbG9hZGVkRm9udCA9IEZPTlRfREVGQVVMVDtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBsb2FkZWRGb250O1xuICAgIH0pO1xufVxuLy8gRm9ybWF0cyBhIGhleCB2YWx1ZSB0byBSR0JcbmZ1bmN0aW9uIGhleFRvUmdiKGhleCkge1xuICAgIHZhciBiaWdpbnQgPSBwYXJzZUludChoZXgsIDE2KTtcbiAgICB2YXIgciA9IChiaWdpbnQgPj4gMTYpICYgMjU1O1xuICAgIHZhciBnID0gKGJpZ2ludCA+PiA4KSAmIDI1NTtcbiAgICB2YXIgYiA9IGJpZ2ludCAmIDI1NTtcbiAgICByZXR1cm4geyByOiByIC8gMjU1LCBnOiBnIC8gMjU1LCBiOiBiIC8gMjU1IH07XG59XG4iLCIiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8vIFRoaXMgZW50cnkgbW9kdWxlIGlzIHJlZmVyZW5jZWQgYnkgb3RoZXIgbW9kdWxlcyBzbyBpdCBjYW4ndCBiZSBpbmxpbmVkXG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IHt9O1xuX193ZWJwYWNrX21vZHVsZXNfX1tcIi4vc3JjL2NvZGUudHNcIl0oKTtcbiIsIiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==