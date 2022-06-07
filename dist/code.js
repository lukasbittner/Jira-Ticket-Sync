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
const VARIANT_NAME_2 = "In progress";
const VARIANT_COLOR_2 = hexToRgb("0065FF");
const VARIANT_NAME_3 = "In QA";
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
        const descriptionTitleTxt = figma.createText();
        const acceptanceTitleTxt = figma.createText();
        const descriptionTxt = figma.createText();
        const acceptanceTxt = figma.createText();
        ticketVariant.appendChild(statusColorRect);
        ticketVariant.appendChild(idFrame);
        idFrame.appendChild(issueIdTxt);
        idFrame.appendChild(titleFrame);
        titleFrame.appendChild(titleTxt);
        titleFrame.appendChild(detailsFrame);
        titleFrame.appendChild(descriptionFrame);
        descriptionFrame.appendChild(descriptionTitleTxt);
        descriptionFrame.appendChild(descriptionTxt);
        descriptionFrame.appendChild(acceptanceTitleTxt);
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
        idFrame.name = "Ticket Body";
        idFrame.layoutMode = "VERTICAL";
        idFrame.counterAxisSizingMode = "AUTO";
        idFrame.layoutAlign = "STRETCH";
        idFrame.layoutGrow = 1;
        idFrame.itemSpacing = 8;
        idFrame.fills = [];
        // Create the title frame
        titleFrame.name = "Ticket Contents";
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
        descriptionFrame.layoutMode = "VERTICAL";
        descriptionFrame.primaryAxisSizingMode = "AUTO";
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
        acceptanceTitleTxt.fontName = yield tryLoadingFont(FONT_PRIMARY);
        acceptanceTitleTxt.fontSize = 16;
        acceptanceTitleTxt.fills = FONT_COLOR_PRIMARY;
        acceptanceTitleTxt.autoRename = false;
        acceptanceTitleTxt.characters = "Acceptance Criteria";
        acceptanceTitleTxt.name = "Title";
        acceptanceTxt.fontName = yield tryLoadingFont(FONT_DESCRIPTION);
        acceptanceTxt.fontSize = 16;
        acceptanceTxt.fills = FONT_COLOR_PRIMARY;
        acceptanceTxt.autoRename = false;
        acceptanceTxt.characters = "Description";
        acceptanceTxt.name = ACCEPTANCE_NAME;
        descriptionTitleTxt.fontName = yield tryLoadingFont(FONT_PRIMARY);
        descriptionTitleTxt.fontSize = 16;
        descriptionTitleTxt.fills = FONT_COLOR_PRIMARY;
        descriptionTitleTxt.autoRename = false;
        descriptionTitleTxt.characters = "Description";
        descriptionTitleTxt.name = "Title";
        descriptionTxt.fontName = yield tryLoadingFont(FONT_DESCRIPTION);
        descriptionTxt.fontSize = 16;
        descriptionTxt.fills = FONT_COLOR_PRIMARY;
        descriptionTxt.autoRename = false;
        descriptionTxt.characters = "Description";
        descriptionTxt.name = DESCRIPTION_NAME;
        acceptanceTxt.layoutAlign = "STRETCH";
        descriptionTxt.layoutAlign = "STRETCH";
        titleTxt.layoutAlign = "STRETCH";
        // Fixes a weird bug in which the 'stretch' doesnt work properly
        idFrame.primaryAxisSizingMode = "AUTO";
        idFrame.layoutAlign = "STRETCH";
        detailsFrame.primaryAxisSizingMode = "FIXED";
        detailsFrame.layoutAlign = "STRETCH";
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29kZS5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQTtBQUNBLDRCQUE0QiwrREFBK0QsaUJBQWlCO0FBQzVHO0FBQ0Esb0NBQW9DLE1BQU0sK0JBQStCLFlBQVk7QUFDckYsbUNBQW1DLE1BQU0sbUNBQW1DLFlBQVk7QUFDeEYsZ0NBQWdDO0FBQ2hDO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLGdDQUFnQyxpQ0FBaUM7QUFDakU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0I7QUFDbEIsZ0JBQWdCO0FBQ2hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCO0FBQ3ZCO0FBQ0E7QUFDQSx1QkFBdUI7QUFDdkIseUJBQXlCO0FBQ3pCLDJCQUEyQjtBQUMzQjtBQUNBO0FBQ0E7QUFDQSxNQUFNLDBDQUEwQztBQUNoRDtBQUNBO0FBQ0EsTUFBTSwwQ0FBMEM7QUFDaEQ7QUFDQTtBQUNBLE1BQU0sMENBQTBDO0FBQ2hEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSw2QkFBNkIsa0RBQWtEO0FBQy9FO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUNBQWlDLGdCQUFnQjtBQUNqRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVCxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscURBQXFELFdBQVcsR0FBRyxZQUFZLFdBQVcsT0FBTztBQUNqRztBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQ0FBK0M7QUFDL0M7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3Q0FBd0M7QUFDeEM7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsZ0RBQWdELG1CQUFtQjtBQUNuRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsZ0RBQWdELG1CQUFtQjtBQUNuRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0NBQWdDLG1CQUFtQjtBQUNuRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLHNCQUFzQjtBQUM5QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNEJBQTRCLFlBQVksMkNBQTJDLGNBQWM7QUFDakc7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdCQUF3QixtQkFBbUI7QUFDM0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNDQUFzQyxhQUFhLFVBQVUsZUFBZTtBQUM1RTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUZBQW1GLE9BQU87QUFDMUY7QUFDQTtBQUNBO0FBQ0Esb0NBQW9DLFNBQVMsT0FBTyxPQUFPO0FBQzNELGtDQUFrQztBQUNsQztBQUNBO0FBQ0EsbUNBQW1DLFVBQVUsT0FBTyxVQUFVO0FBQzlELGlDQUFpQztBQUNqQztBQUNBO0FBQ0E7QUFDQSxpQ0FBaUM7QUFDakM7QUFDQTtBQUNBO0FBQ0EsaUNBQWlDO0FBQ2pDO0FBQ0E7QUFDQTtBQUNBLG1DQUFtQztBQUNuQztBQUNBO0FBQ0E7QUFDQSxrQ0FBa0M7QUFDbEM7QUFDQTtBQUNBO0FBQ0EsNkNBQTZDLHNCQUFzQjtBQUNuRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0NBQW9DLGNBQWMsMkVBQTJFLGVBQWU7QUFDNUk7QUFDQTtBQUNBLDRCQUE0Qix1QkFBdUIsb0NBQW9DLGlCQUFpQjtBQUN4RztBQUNBLDRCQUE0QixzQkFBc0Isb0NBQW9DLHVCQUF1QjtBQUM3RztBQUNBLDRCQUE0QiwwQkFBMEIsb0NBQW9DLGNBQWM7QUFDeEc7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlCQUF5QixvQkFBb0IsS0FBSyxlQUFlO0FBQ2pFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlCQUF5QixlQUFlLEtBQUssZUFBZTtBQUM1RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUNBQW1DLG9DQUFvQyxLQUFLLGVBQWU7QUFDM0Y7QUFDQTtBQUNBLHFCQUFxQixvQkFBb0I7QUFDekM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQ0FBb0MsZUFBZTtBQUNuRDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQjtBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUNBQWlDLHdCQUF3QixvQkFBb0I7QUFDN0U7QUFDQTtBQUNBLG1DQUFtQyxtQ0FBbUM7QUFDdEU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9DQUFvQywwQ0FBMEM7QUFDOUU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1HQUFtRztBQUNuRztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0RBQW9ELHlCQUF5QjtBQUM3RSxzQ0FBc0MsUUFBUTtBQUM5QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjs7Ozs7Ozs7VUVsL0JBO1VBQ0E7VUFDQTtVQUNBO1VBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly93ZWJwYWNrLXJlYWN0Ly4vc3JjL2NvZGUudHMiLCJ3ZWJwYWNrOi8vd2VicGFjay1yZWFjdC93ZWJwYWNrL2JlZm9yZS1zdGFydHVwIiwid2VicGFjazovL3dlYnBhY2stcmVhY3Qvd2VicGFjay9zdGFydHVwIiwid2VicGFjazovL3dlYnBhY2stcmVhY3Qvd2VicGFjay9hZnRlci1zdGFydHVwIl0sInNvdXJjZXNDb250ZW50IjpbInZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xuICAgIGZ1bmN0aW9uIGFkb3B0KHZhbHVlKSB7IHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFAgPyB2YWx1ZSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUodmFsdWUpOyB9KTsgfVxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IGFkb3B0KHJlc3VsdC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XG4gICAgfSk7XG59O1xuY29uc3QgRE9DVU1FTlRfTk9ERSA9IGZpZ21hLmN1cnJlbnRQYWdlLnBhcmVudDtcbi8vIFNldCB0aGUgcmVsYXVuY2ggYnV0dG9uIGZvciB0aGUgd2hvbGUgZG9jdW1lbnRcbkRPQ1VNRU5UX05PREUuc2V0UmVsYXVuY2hEYXRhKHsgb3Blbl9wbHVnaW46IFwiXCIsIHVwZGF0ZV9hbGw6IFwiXCIgfSk7XG5jb25zdCBXSU5ET1dfV0lEVEggPSAyNTA7XG5jb25zdCBXSU5ET1dfSEVJR0hUX0JJRyA9IDY1MDtcbmNvbnN0IFdJTkRPV19IRUlHSFRfU01BTEwgPSAzMDg7XG5jb25zdCBDT01QQU5ZX05BTUVfS0VZID0gXCJDT01QQU5ZX05BTUVcIjtcbmNvbnN0IFBST0pFQ1RfSURfS0VZID0gXCJQUk9KRUNUX0lEXCI7XG5jb25zdCBVU0VSTkFNRV9LRVkgPSBcIlVTRVJOQU1FXCI7XG5jb25zdCBQQVNTV09SRF9LRVkgPSBcIlBBU1NXT1JEXCI7XG5jb25zdCBJU1NVRV9JRF9LRVkgPSBcIklTU1VFX0lEXCI7XG5jb25zdCBDUkVBVEVfTElOS19LRVkgPSBcIkNSRUFURV9MSU5LXCI7XG5jb25zdCBMSUJSQVJZX0NPTVBPTkVOVF9LRVkgPSBcIkxJQlJBUllfQ09NUE9ORU5UXCI7XG52YXIgY29tcGFueV9uYW1lOyAvLyBTYXZlZCBwdWJsaWNseSB3aXRoIHNldFBsdWdpbkRhdGFcbnZhciBwcm9qZWN0X2lkOyAvLyBTYXZlZCBwdWJsaWNseSB3aXRoIHNldFBsdWdpbkRhdGFcbnZhciB1c2VybmFtZTtcbnZhciBwYXNzd29yZDtcbnZhciBpc3N1ZUlkO1xudmFyIGNyZWF0ZUxpbms7XG5jb25zdCBGT05UX0RFRkFVTFQgPSB7IGZhbWlseTogXCJBcmlhbFwiLCBzdHlsZTogXCJSZWd1bGFyXCIgfTtcbnRyeUxvYWRpbmdGb250KEZPTlRfREVGQVVMVCk7XG52YXIgVU5MT0FERURfRk9OVFMgPSBuZXcgU2V0KCk7XG5jb25zdCBGT05UX1BSSU1BUlkgPSB7IGZhbWlseTogXCJJbnRlclwiLCBzdHlsZTogXCJNZWRpdW1cIiB9O1xuY29uc3QgRk9OVF9TRUNPTkRBUlkgPSB7IGZhbWlseTogXCJJbnRlclwiLCBzdHlsZTogXCJSZWd1bGFyXCIgfTtcbmNvbnN0IEZPTlRfREVTQ1JJUFRJT04gPSB7IGZhbWlseTogXCJJbnRlclwiLCBzdHlsZTogXCJSZWd1bGFyXCIgfTtcbmNvbnN0IEZPTlRfU0laRV9QUklNQVJZID0gMjQ7XG5jb25zdCBGT05UX1NJWkVfU0VDT05EQVJZID0gMTY7XG5jb25zdCBGT05UX0NPTE9SX1BSSU1BUlkgPSBbXG4gICAgeyB0eXBlOiBcIlNPTElEXCIsIGNvbG9yOiBoZXhUb1JnYihcIjE3MkI0RFwiKSB9LFxuXTtcbmNvbnN0IEZPTlRfQ09MT1JfU0VDT05EQVJZID0gW1xuICAgIHsgdHlwZTogXCJTT0xJRFwiLCBjb2xvcjogaGV4VG9SZ2IoXCI2Qjc3OENcIikgfSxcbl07XG5jb25zdCBGT05UX0NPTE9SX1VSTCA9IFtcbiAgICB7IHR5cGU6IFwiU09MSURcIiwgY29sb3I6IGhleFRvUmdiKFwiMDA2NUZGXCIpIH0sXG5dO1xuZnVuY3Rpb24gZ2V0U3RhdHVzKGRhdGEpIHtcbiAgICB2YXIgX2EsIF9iO1xuICAgIHJldHVybiAoX2IgPSAoX2EgPSBkYXRhLmZpZWxkcykgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLnN0YXR1cykgPT09IG51bGwgfHwgX2IgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9iLm5hbWU7XG59XG5mdW5jdGlvbiBnZXRUaXRsZShkYXRhKSB7XG4gICAgdmFyIF9hO1xuICAgIHJldHVybiAoKF9hID0gZGF0YS5maWVsZHMpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5zdW1tYXJ5KSB8fCBcIkVSUk9SOiBObyBzdW1tYXJ5IGV4aXN0aW5nLlwiO1xufVxuZnVuY3Rpb24gZ2V0SXNzdWVJZChkYXRhKSB7XG4gICAgcmV0dXJuIGRhdGEua2V5O1xufVxuZnVuY3Rpb24gZ2V0QXNzaWduZWUoZGF0YSkge1xuICAgIHZhciBfYSwgX2I7XG4gICAgcmV0dXJuICgoX2IgPSAoX2EgPSBkYXRhLmZpZWxkcykgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmFzc2lnbmVlKSA9PT0gbnVsbCB8fCBfYiA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2IuZGlzcGxheU5hbWUpIHx8IFwiTm90IGFzc2lnbmVkXCI7XG59XG5mdW5jdGlvbiBnZXREZXNjcmlwdGlvbihkYXRhKSB7XG4gICAgdmFyIF9hO1xuICAgIHJldHVybiAoKF9hID0gZGF0YS5maWVsZHMpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5kZXNjcmlwdGlvbikgfHwgXCJObyBkZXNjcmlwdGlvblwiO1xufVxuZnVuY3Rpb24gZ2V0QWNjZXB0YW5jZUNyaXRlcmlhKGRhdGEpIHtcbiAgICB2YXIgX2E7XG4gICAgcmV0dXJuICgoX2EgPSBkYXRhLmZpZWxkcykgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmN1c3RvbWZpZWxkXzEwMTAzKSB8fCBcIk5vIGFjY2VwdGFuY2UgY3JpdGVyaWFcIjtcbn1cbmZ1bmN0aW9uIGdldENoYW5nZURhdGUoZGF0YSkge1xuICAgIHZhciBfYSwgX2I7XG4gICAgbGV0IGRhdGUgPSAoX2EgPSBkYXRhLmZpZWxkcykgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLnN0YXR1c2NhdGVnb3J5Y2hhbmdlZGF0ZTtcbiAgICBpZiAoIWRhdGUpXG4gICAgICAgICgoX2IgPSBkYXRhLmZpZWxkcykgPT09IG51bGwgfHwgX2IgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9iLmNyZWF0ZWQpIHx8IFwiTm8gZGF0ZVwiO1xuICAgIHJldHVybiBkYXRlO1xufVxudmFyIG5leHRUaWNrZXRPZmZzZXQgPSAwO1xuLy8gdGlja2V0ZGF0YS5maWVsZHMuYXNzaWduZWUuYXZhdGFyVXJsc1xuLy8gdGlja2V0ZGF0YS5maWVsZHMuc3RhdHVzLm5hbWVcbi8vIHRpY2tldGRhdGEuZmllbGRzLnN0YXR1cy5zdGF0dXNDYXRlZ29yeS5uYW1lXG5jb25zdCBJU1NVRV9JRF9OQU1FID0gXCJUaWNrZXQgSURcIjtcbmNvbnN0IElTU1VFX1RJVExFX05BTUUgPSBcIlRpY2tldCBUaXRsZVwiO1xuY29uc3QgSVNTVUVfQ0hBTkdFX0RBVEVfTkFNRSA9IFwiRGF0ZSBvZiBTdGF0dXMgQ2hhbmdlXCI7XG5jb25zdCBBU1NJR05FRV9OQU1FID0gXCJBc3NpZ25lZVwiO1xuY29uc3QgREVTQ1JJUFRJT05fTkFNRSA9IFwiRGVzY3JpcHRpb25cIjtcbmNvbnN0IEFDQ0VQVEFOQ0VfTkFNRSA9IFwiQWNjZXB0YW5jZSBDcml0ZXJpYVwiO1xuY29uc3QgU1RBVFVTX05BTUUgPSBcIlN0YXR1c1wiO1xuY29uc3QgQ09NUE9ORU5UX1NFVF9OQU1FID0gXCJKaXJhIFRpY2tldCBIZWFkZXJcIjtcbmNvbnN0IENPTVBPTkVOVF9TRVRfUFJPUEVSVFlfTkFNRSA9IFwiU3RhdHVzPVwiO1xuY29uc3QgVkFSSUFOVF9OQU1FX0RFRkFVTFQgPSBcIkJhY2tsb2dcIjtcbmNvbnN0IFZBUklBTlRfQ09MT1JfREVGQVVMVCA9IGhleFRvUmdiKFwiNUU2Qzg0XCIpO1xuY29uc3QgVkFSSUFOVF9OQU1FXzEgPSBcIlRvIERvXCI7XG5jb25zdCBWQVJJQU5UX0NPTE9SXzEgPSBoZXhUb1JnYihcIjVFNkM4NFwiKTtcbmNvbnN0IFZBUklBTlRfTkFNRV8yID0gXCJJbiBwcm9ncmVzc1wiO1xuY29uc3QgVkFSSUFOVF9DT0xPUl8yID0gaGV4VG9SZ2IoXCIwMDY1RkZcIik7XG5jb25zdCBWQVJJQU5UX05BTUVfMyA9IFwiSW4gUUFcIjtcbmNvbnN0IFZBUklBTlRfQ09MT1JfMyA9IGhleFRvUmdiKFwiMDBBM0JGXCIpO1xuY29uc3QgVkFSSUFOVF9OQU1FXzQgPSBcIkRldiBSZWFkeVwiO1xuY29uc3QgVkFSSUFOVF9DT0xPUl80ID0gaGV4VG9SZ2IoXCIwMEEzQkZcIik7XG5jb25zdCBWQVJJQU5UX05BTUVfRE9ORSA9IFwiRG9uZVwiO1xuY29uc3QgVkFSSUFOVF9DT0xPUl9ET05FID0gaGV4VG9SZ2IoXCIzNkIzN0VcIik7XG5jb25zdCBWQVJJQU5UX05BTUVfRVJST1IgPSBcIkVycm9yXCI7XG5jb25zdCBWQVJJQU5UX0NPTE9SX0VSUk9SID0gaGV4VG9SZ2IoXCJGRjU2MzBcIik7XG52YXIgdGlja2V0Q29tcG9uZW50O1xuLy8gRG9uJ3Qgc2hvdyBVSSBpZiByZWxhdW5jaCBidXR0b25zIGFyZSBydW5cbmlmIChmaWdtYS5jb21tYW5kID09PSBcInVwZGF0ZV9zZWxlY3Rpb25cIikge1xuICAgIHVwZGF0ZVdpdGhvdXRVSShcInNlbGVjdGlvblwiKTtcbn1cbmVsc2UgaWYgKGZpZ21hLmNvbW1hbmQgPT09IFwidXBkYXRlX2FsbFwiKSB7XG4gICAgdXBkYXRlV2l0aG91dFVJKFwiYWxsXCIpO1xufVxuZWxzZSBpZiAoZmlnbWEuY29tbWFuZCA9PT0gXCJ1cGRhdGVfcGFnZVwiKSB7XG4gICAgdXBkYXRlV2l0aG91dFVJKFwicGFnZVwiKTtcbn1cbmVsc2UgaWYgKGZpZ21hLmNvbW1hbmQgPT09IFwic2V0X2xpYnJhcnlfY29tcG9uZW50XCIpIHtcbiAgICBsZXQgc2VsZWN0aW9uID0gZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uWzBdO1xuICAgIHNhdmVMaWJyYXJ5Q29tcG9uZW50KHNlbGVjdGlvbik7XG59XG5lbHNlIGlmIChmaWdtYS5jb21tYW5kID09PSBcInJlbW92ZV9saWJyYXJ5X2NvbXBvbmVudFwiKSB7XG4gICAgbGV0IHNlbGVjdGlvbiA9IGZpZ21hLmN1cnJlbnRQYWdlLnNlbGVjdGlvblswXTtcbiAgICBkZWxldGVMaWJyYXJ5Q29tcG9uZW50KHNlbGVjdGlvbik7XG4gICAgc2VsZWN0aW9uLnNldFJlbGF1bmNoRGF0YSh7XG4gICAgICAgIHJlbW92ZV9saWJyYXJ5X2NvbXBvbmVudDogXCJVbnB1Ymxpc2ggZ2xvYmFsIGNvbXBvbmVudC4gSXQgd2lsbCBub3QgYmUgdXNlZCBpbiBvdGhlciBmaWxlcyBhbnltb3JlLlwiLFxuICAgIH0pO1xufVxuZWxzZSB7XG4gICAgLy8gT3RoZXJ3aXNlIHNob3cgVUlcbiAgICBmaWdtYS5zaG93VUkoX19odG1sX18sIHsgd2lkdGg6IFdJTkRPV19XSURUSCwgaGVpZ2h0OiBXSU5ET1dfSEVJR0hUX1NNQUxMIH0pO1xuICAgIHNlbmREYXRhKCk7XG59XG4vLyBNYWtlIHN1cmUgdGhlIG1haW4gY29tcG9uZW50IGlzIHJlZmVyZW5jZWRcbnJlZmVyZW5jZVRpY2tldENvbXBvbmVudFNldCgpO1xuLy8gU3RhcnQgcGx1Z2luIHdpdGhvdXQgdmlzaWJsZSBVSSBhbmQgdXBkYXRlIHRpY2tldHNcbmZ1bmN0aW9uIHVwZGF0ZVdpdGhvdXRVSSh0eXBlKSB7XG4gICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgZmlnbWEuc2hvd1VJKF9faHRtbF9fLCB7IHZpc2libGU6IGZhbHNlIH0pO1xuICAgICAgICB5aWVsZCBzZW5kRGF0YSgpO1xuICAgICAgICB2YXIgaGFzRmFpbGVkID0gcmVxdWVzdFVwZGF0ZUZvclRpY2tldHModHlwZSk7XG4gICAgICAgIGlmIChoYXNGYWlsZWQgJiZcbiAgICAgICAgICAgICh0eXBlID09PSBcImFsbFwiIHx8IHR5cGUgPT09IFwicGFnZVwiIHx8IHR5cGUgPT09IFwic2VsZWN0aW9uXCIpKSB7XG4gICAgICAgICAgICBmaWdtYS5jbG9zZVBsdWdpbigpO1xuICAgICAgICB9XG4gICAgfSk7XG59XG4vLyBTZW5kIHRoZSBzdG9yZWQgYXV0aG9yaXphdGlvbiBkYXRhIHRvIHRoZSBVSVxuZnVuY3Rpb24gc2VuZERhdGEoKSB7XG4gICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgY29tcGFueV9uYW1lID0geWllbGQgZ2V0QXV0aG9yaXphdGlvbkluZm8oQ09NUEFOWV9OQU1FX0tFWSwgdHJ1ZSk7XG4gICAgICAgIHByb2plY3RfaWQgPSB5aWVsZCBnZXRBdXRob3JpemF0aW9uSW5mbyhQUk9KRUNUX0lEX0tFWSwgdHJ1ZSk7XG4gICAgICAgIGlzc3VlSWQgPSB5aWVsZCBnZXRBdXRob3JpemF0aW9uSW5mbyhJU1NVRV9JRF9LRVksIHRydWUpO1xuICAgICAgICB1c2VybmFtZSA9IHlpZWxkIGdldEF1dGhvcml6YXRpb25JbmZvKFVTRVJOQU1FX0tFWSwgZmFsc2UpO1xuICAgICAgICBwYXNzd29yZCA9IHlpZWxkIGdldEF1dGhvcml6YXRpb25JbmZvKFBBU1NXT1JEX0tFWSwgZmFsc2UpO1xuICAgICAgICBjcmVhdGVMaW5rID0geWllbGQgZ2V0QXV0aG9yaXphdGlvbkluZm8oQ1JFQVRFX0xJTktfS0VZLCBmYWxzZSk7XG4gICAgICAgIGlmIChjcmVhdGVMaW5rID09PSBcIlwiKVxuICAgICAgICAgICAgY3JlYXRlTGluayA9IHRydWU7XG4gICAgICAgIGZpZ21hLnVpLnBvc3RNZXNzYWdlKHtcbiAgICAgICAgICAgIGNvbXBhbnlfbmFtZTogY29tcGFueV9uYW1lLFxuICAgICAgICAgICAgcHJvamVjdF9pZDogcHJvamVjdF9pZCxcbiAgICAgICAgICAgIHVzZXJuYW1lOiB1c2VybmFtZSxcbiAgICAgICAgICAgIHBhc3N3b3JkOiBwYXNzd29yZCxcbiAgICAgICAgICAgIGlzc3VlSWQ6IGlzc3VlSWQsXG4gICAgICAgICAgICBjcmVhdGVMaW5rOiBjcmVhdGVMaW5rLFxuICAgICAgICAgICAgdHlwZTogXCJzZXRBdXRob3JpemF0aW9uVmFyaWFibGVzXCIsXG4gICAgICAgIH0pO1xuICAgIH0pO1xufVxuLy8gQWxsIHRoZSBmdW5jdGlvbnMgdGhhdCBjYW4gYmUgc3RhcnRlZCBmcm9tIHRoZSBVSVxuZmlnbWEudWkub25tZXNzYWdlID0gKG1zZykgPT4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgIC8vIENhbGxlZCB0byBjcmVhdGUgYSBuZXcgbWFpbiBjb21wb25lbnQgYW5kIHNhdmUgaXRzIElEXG4gICAgaWYgKG1zZy50eXBlID09PSBcImNyZWF0ZS1jb21wb25lbnRcIikge1xuICAgICAgICB0aWNrZXRDb21wb25lbnQgPSB5aWVsZCBjcmVhdGVUaWNrZXRDb21wb25lbnRTZXQoKTtcbiAgICAgICAgRE9DVU1FTlRfTk9ERS5zZXRQbHVnaW5EYXRhKFwidGlja2V0Q29tcG9uZW50SURcIiwgdGlja2V0Q29tcG9uZW50LmlkKTtcbiAgICB9XG4gICAgLy8gQ2FsbGVkIHRvIGNyZWF0ZSBhIG5ldyBpbnN0YW5jZSBvZiBhIGNvbXBvbmVudCAoYmFzZWQgb24gdGhlIGlzc3VlSWQgZW50ZXJlZCBpbiB0aGUgVUkpXG4gICAgaWYgKG1zZy50eXBlID09PSBcImNyZWF0ZS1uZXctdGlja2V0XCIgJiYgY2hlY2tGZXRjaFN1Y2Nlc3MobXNnLmRhdGEpKSB7XG4gICAgICAgIGxldCB0aWNrZXRJbnN0YW5jZSA9IHlpZWxkIGNyZWF0ZVRpY2tldEluc3RhbmNlKG1zZyk7XG4gICAgICAgIC8vIENyZWF0ZSBhIGxpbmsgaW4gSmlyYVxuICAgICAgICBpZiAobXNnLmNyZWF0ZUxpbmsgJiYgbXNnLmRhdGFbMF0ua2V5ICYmIHByb2plY3RfaWQgIT0gXCJcIikge1xuICAgICAgICAgICAgbGV0IHByb2plY3ROYW1lID0gZW5jb2RlVVJJQ29tcG9uZW50KGZpZ21hLnJvb3QubmFtZSk7XG4gICAgICAgICAgICBsZXQgbm9kZUlkID0gZW5jb2RlVVJJQ29tcG9uZW50KHRpY2tldEluc3RhbmNlLmlkKTtcbiAgICAgICAgICAgIGxldCBsaW5rID0gYGh0dHBzOi8vd3d3LmZpZ21hLmNvbS9maWxlLyR7cHJvamVjdF9pZH0vJHtwcm9qZWN0TmFtZX0/bm9kZS1pZD0ke25vZGVJZH1gO1xuICAgICAgICAgICAgZmlnbWEudWkucG9zdE1lc3NhZ2Uoe1xuICAgICAgICAgICAgICAgIGlzc3VlSWQ6IG1zZy5pc3N1ZUlkc1swXSxcbiAgICAgICAgICAgICAgICBsaW5rOiBsaW5rLFxuICAgICAgICAgICAgICAgIHR5cGU6IFwicG9zdC1saW5rLXRvLWppcmEtaXNzdWVcIixcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8vIENhbGxlZCB0byBnZXQgYWxsIEppcmEgVGlja2VyIEhlYWRlciBpbnN0YW5jZXMgYW5kIHVwZGF0ZSB0aGVtIG9uZSBieSBvbmUuXG4gICAgaWYgKG1zZy50eXBlID09PSBcInVwZGF0ZS1hbGxcIikge1xuICAgICAgICByZXF1ZXN0VXBkYXRlRm9yVGlja2V0cyhcImFsbFwiKTtcbiAgICB9XG4gICAgLy8gQ2FsbGVkIHRvIGdldCBKaXJhIFRpY2tlciBIZWFkZXIgaW5zdGFuY2VzIG9uIHRoaXMgcGFnZSBhbmQgdXBkYXRlIHRoZW0gb25lIGJ5IG9uZS5cbiAgICBpZiAobXNnLnR5cGUgPT09IFwidXBkYXRlLXBhZ2VcIikge1xuICAgICAgICByZXF1ZXN0VXBkYXRlRm9yVGlja2V0cyhcInBhZ2VcIik7XG4gICAgfVxuICAgIC8vIENhbGxlZCB0byBnZXQgc2VsZWN0ZWQgSmlyYSBUaWNrZXIgSGVhZGVyIGluc3RhbmNlcyBhbmQgdXBkYXRlIHRoZW0gb25lIGJ5IG9uZS5cbiAgICBpZiAobXNnLnR5cGUgPT09IFwidXBkYXRlLXNlbGVjdGVkXCIpIHtcbiAgICAgICAgcmVxdWVzdFVwZGF0ZUZvclRpY2tldHMoXCJzZWxlY3Rpb25cIik7XG4gICAgfVxuICAgIC8vIFNhdmUgbmV3IGF1dGhvcml6YXRpb24gaW5mb1xuICAgIGlmIChtc2cudHlwZSA9PT0gXCJhdXRob3JpemF0aW9uLWRldGFpbC1jaGFuZ2VkXCIpIHtcbiAgICAgICAgc2V0QXV0aG9yaXphdGlvbkluZm8obXNnLmtleSwgbXNnLmRhdGEsIG1zZy5zYXZlX3B1YmxpYyk7XG4gICAgfVxuICAgIC8vIFJlc2l6ZSB0aGUgVUlcbiAgICBpZiAobXNnLnR5cGUgPT09IFwicmVzaXplLXVpXCIpIHtcbiAgICAgICAgbXNnLmJpZ19zaXplXG4gICAgICAgICAgICA/IGZpZ21hLnVpLnJlc2l6ZShXSU5ET1dfV0lEVEgsIFdJTkRPV19IRUlHSFRfQklHKVxuICAgICAgICAgICAgOiBmaWdtYS51aS5yZXNpemUoV0lORE9XX1dJRFRILCBXSU5ET1dfSEVJR0hUX1NNQUxMKTtcbiAgICB9XG4gICAgLy8gQWxsb3dzIHRoZSBVSSB0byBjcmVhdGUgbm90aWZpY2F0aW9uc1xuICAgIGlmIChtc2cudHlwZSA9PT0gXCJjcmVhdGUtdmlzdWFsLWJlbGxcIikge1xuICAgICAgICBmaWdtYS5ub3RpZnkobXNnLm1lc3NhZ2UpO1xuICAgIH1cbiAgICAvLyBVcGRhdGVzIGluc3RhbmNlcyBiYXNlZCBvbiB0aGUgcmVjZWl2ZWQgdGlja2V0IGRhdGEuXG4gICAgaWYgKG1zZy50eXBlID09PSBcInRpY2tldERhdGFTZW50XCIgJiYgY2hlY2tGZXRjaFN1Y2Nlc3MobXNnLmRhdGEpKSB7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwiVGlja2V0IGRhdGE6XCIsIG1zZy5kYXRhKVxuICAgICAgICB2YXIgbm9kZUlkcyA9IG1zZy5ub2RlSWRzO1xuICAgICAgICB2YXIgbm9kZXMgPSBub2RlSWRzLm1hcCgoaWQpID0+IGZpZ21hLmdldE5vZGVCeUlkKGlkKSk7XG4gICAgICAgIHlpZWxkIHVwZGF0ZVRpY2tldHMobm9kZXMsIG1zZyk7XG4gICAgfVxufSk7XG4vLyBTYXZlcyBhdXRob3JpemF0aW9uIGRldGFpbHMgaW4gY2xpZW50IHN0b3JhZ2VcbmZ1bmN0aW9uIHNldEF1dGhvcml6YXRpb25JbmZvKGtleSwgdmFsdWUsIHNhdmVQdWJsaWMgPSBmYWxzZSkge1xuICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgIGlmIChzYXZlUHVibGljKSB7XG4gICAgICAgICAgICBET0NVTUVOVF9OT0RFLnNldFBsdWdpbkRhdGEoa2V5LCB2YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB5aWVsZCBmaWdtYS5jbGllbnRTdG9yYWdlLnNldEFzeW5jKGtleSwgdmFsdWUpO1xuICAgICAgICB9XG4gICAgICAgIC8vIE1ha2Ugc3VyZSB0aGF0IHZhcmlhYmxlIGdldHMgdXBkYXRlZFxuICAgICAgICBpZiAoa2V5ID09PSBDT01QQU5ZX05BTUVfS0VZKVxuICAgICAgICAgICAgY29tcGFueV9uYW1lID0gdmFsdWU7XG4gICAgICAgIGVsc2UgaWYgKGtleSA9PT0gUFJPSkVDVF9JRF9LRVkpXG4gICAgICAgICAgICBwcm9qZWN0X2lkID0gdmFsdWU7XG4gICAgICAgIGVsc2UgaWYgKGtleSA9PT0gVVNFUk5BTUVfS0VZKVxuICAgICAgICAgICAgdXNlcm5hbWUgPSB2YWx1ZTtcbiAgICAgICAgZWxzZSBpZiAoa2V5ID09PSBQQVNTV09SRF9LRVkpXG4gICAgICAgICAgICBwYXNzd29yZCA9IHZhbHVlO1xuICAgICAgICBlbHNlIGlmIChrZXkgPT09IElTU1VFX0lEX0tFWSlcbiAgICAgICAgICAgIGlzc3VlSWQgPSB2YWx1ZTtcbiAgICAgICAgZWxzZSBpZiAoa2V5ID09PSBDUkVBVEVfTElOS19LRVkpXG4gICAgICAgICAgICBjcmVhdGVMaW5rID0gdmFsdWU7XG4gICAgfSk7XG59XG4vLyBHZXQgYXV0aG9yaXphdGlvbiBkZXRhaWxzIGZyb20gY2xpZW50IHN0b3JhZ2VcbmZ1bmN0aW9uIGdldEF1dGhvcml6YXRpb25JbmZvKGtleSwgc2F2ZWRQdWJsaWMgPSBmYWxzZSkge1xuICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgIHZhciB2YWx1ZVNhdmVkO1xuICAgICAgICBpZiAoc2F2ZWRQdWJsaWMpIHtcbiAgICAgICAgICAgIHZhbHVlU2F2ZWQgPSBET0NVTUVOVF9OT0RFLmdldFBsdWdpbkRhdGEoa2V5KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHZhbHVlU2F2ZWQgPSB5aWVsZCBmaWdtYS5jbGllbnRTdG9yYWdlLmdldEFzeW5jKGtleSk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gY29uc29sZS5sb2coa2V5LCB2YWx1ZVNhdmVkKVxuICAgICAgICBpZiAoIXZhbHVlU2F2ZWQgJiYgdmFsdWVTYXZlZCAhPSBmYWxzZSlcbiAgICAgICAgICAgIHZhbHVlU2F2ZWQgPSBcIlwiO1xuICAgICAgICByZXR1cm4gdmFsdWVTYXZlZDtcbiAgICB9KTtcbn1cbi8qKlxuICogU2F2ZXMgYSBjb21wb25lbnQgbGlicmFyeSBrZXkgc28gaXQgY2FuIGJlIHJlZmVyZW5jZWQgYW5kIHJldXNlZCBpbiBvdGhlciBmaWxlcy5cbiAqIEBwYXJhbSBjb21wb25lbnROb2RlIFRoZSBjb21wb25lbnQgdG8gYmUgdXNlZCBnbG9iYWxseVxuICovXG5mdW5jdGlvbiBzYXZlTGlicmFyeUNvbXBvbmVudChjb21wb25lbnROb2RlKSB7XG4gICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgbGV0IGNvbXBvbmVudEtleTtcbiAgICAgICAgaWYgKGNvbXBvbmVudE5vZGUudHlwZSA9PT0gXCJDT01QT05FTlRfU0VUXCIpIHtcbiAgICAgICAgICAgIGNvbXBvbmVudEtleSA9IGNvbXBvbmVudE5vZGUua2V5O1xuICAgICAgICAgICAgeWllbGQgZmlnbWEuY2xpZW50U3RvcmFnZS5zZXRBc3luYyhMSUJSQVJZX0NPTVBPTkVOVF9LRVksIGNvbXBvbmVudEtleSk7XG4gICAgICAgICAgICBjb21wb25lbnROb2RlLmFic29sdXRlUmVuZGVyQm91bmRzO1xuICAgICAgICAgICAgLy8gY29tcG9uZW50Tm9kZS5zZXRSZWxhdW5jaERhdGEoe30pXG4gICAgICAgICAgICBjb21wb25lbnROb2RlLnNldFJlbGF1bmNoRGF0YSh7XG4gICAgICAgICAgICAgICAgcmVtb3ZlX2xpYnJhcnlfY29tcG9uZW50OiBcIlRoZSBjb21wb25lbnQgd2lsbCBub3QgYmUgdXNlZCBhbnltb3JlIGluIG5ldyBmaWxlcy5cIixcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgZmlnbWEuY2xvc2VQbHVnaW4oXCJTZXQgYXMgZ2xvYmFsIEpUUyBjb21wb25lbnQuIE1ha2Ugc3VyZSB0aGUgY29tcG9uZW50IGlzIHB1Ymxpc2hlZCBpbiBhIGxpYnJhcnkuXCIpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgZmlnbWEuY2xvc2VQbHVnaW4oXCJFbGVtZW50IGlzIG5vdCBhIGNvbXBvbmVudCBzZXQuIENvdWxkIG5vdCBiZSBzYXZlZCBhcyBsaWJyYXJ5IGNvbXBvbmVudC5cIik7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cbi8qKlxuICogUmVtb3ZlcyBhIGNvbXBvbmVudCBsaWJyYXJ5IGtleSBzbyBpdCBjYW4gbm90IGJlIHJlZmVyZW5jZWQgYW5kIHJldXNlZCBpbiBvdGhlciBmaWxlcyBhbnltb3JlLlxuICogQHBhcmFtIGNvbXBvbmVudE5vZGUgVGhlIGNvbXBvbmVudCBvbiB3aGljaCB0aGUgcmVsYXVuY2ggZGF0YSBidXR0b24gc2hvdWxkIGJlIHN3aXRjaGVkXG4gKi9cbmZ1bmN0aW9uIGRlbGV0ZUxpYnJhcnlDb21wb25lbnQoY29tcG9uZW50Tm9kZSkge1xuICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgIHlpZWxkIGZpZ21hLmNsaWVudFN0b3JhZ2UuZGVsZXRlQXN5bmMoTElCUkFSWV9DT01QT05FTlRfS0VZKTtcbiAgICAgICAgY29tcG9uZW50Tm9kZS5zZXRSZWxhdW5jaERhdGEoe30pO1xuICAgICAgICBjb21wb25lbnROb2RlLnNldFJlbGF1bmNoRGF0YSh7XG4gICAgICAgICAgICBzZXRfbGlicmFyeV9jb21wb25lbnQ6IFwiUHVibGlzaCB0aGUgY29tcG9uZW50IGluIGEgbGlicmFyeSBhbmQgdGhlbiBjbGljayB0aGlzIGJ1dHRvbi5cIixcbiAgICAgICAgfSk7XG4gICAgICAgIGZpZ21hLmNsb3NlUGx1Z2luKFwiVW5wdWJsaXNoZWQgZ2xvYmFsIEpUUyBjb21wb25lbnQuXCIpO1xuICAgIH0pO1xufVxuLyoqXG4gKiBHZXQgc3Vic2V0IG9mIHRpY2tldHMgaW4gZG9jdW1lbnQgYW5kIHN0YXJ0IHVwZGF0ZSBwcm9jZXNzXG4gKiBAcGFyYW0gc3Vic2V0IEEgc3Vic2V0IG9mIHRpY2tldCBpbnN0YW5jZXMgaW4gdGhlIGRvY3VtZW50XG4gKiBAcmV0dXJucyBCb29sZWFuIGlmIHRoZSBzdWJzZXQgY291bGQgYmUgdXBkYXRlZFxuICovXG5mdW5jdGlvbiByZXF1ZXN0VXBkYXRlRm9yVGlja2V0cyhzdWJzZXQpIHtcbiAgICBsZXQgbm9kZXM7XG4gICAgbGV0IGlzRmFpbGVkID0gZmFsc2U7XG4gICAgLy8gQWxsIGluIGRvY3VtZW50XG4gICAgaWYgKHN1YnNldCA9PSBcImFsbFwiKSB7XG4gICAgICAgIG5vZGVzID0gRE9DVU1FTlRfTk9ERS5maW5kQWxsV2l0aENyaXRlcmlhKHtcbiAgICAgICAgICAgIHR5cGVzOiBbXCJJTlNUQU5DRVwiXSxcbiAgICAgICAgfSk7XG4gICAgICAgIG5vZGVzID0gbm9kZXMuZmlsdGVyKChub2RlKSA9PiBub2RlLm5hbWUgPT09IENPTVBPTkVOVF9TRVRfTkFNRSk7XG4gICAgICAgIGlmIChub2Rlcy5sZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgZmlnbWEubm90aWZ5KGBObyBpbnN0YW5jZXMgbmFtZWQgJyR7Q09NUE9ORU5UX1NFVF9OQU1FfScgZm91bmQgaW4gZG9jdW1lbnQuYCk7XG4gICAgICAgICAgICBpc0ZhaWxlZCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBnZXREYXRhRm9yVGlja2V0cyhub2Rlcyk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8gQWxsIG9uIHBhZ2VcbiAgICBlbHNlIGlmIChzdWJzZXQgPT0gXCJwYWdlXCIpIHtcbiAgICAgICAgbm9kZXMgPSBmaWdtYS5jdXJyZW50UGFnZS5maW5kQWxsV2l0aENyaXRlcmlhKHtcbiAgICAgICAgICAgIHR5cGVzOiBbXCJJTlNUQU5DRVwiXSxcbiAgICAgICAgfSk7XG4gICAgICAgIG5vZGVzID0gbm9kZXMuZmlsdGVyKChub2RlKSA9PiBub2RlLm5hbWUgPT09IENPTVBPTkVOVF9TRVRfTkFNRSk7XG4gICAgICAgIGlmIChub2Rlcy5sZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgZmlnbWEubm90aWZ5KGBObyBpbnN0YW5jZXMgbmFtZWQgJyR7Q09NUE9ORU5UX1NFVF9OQU1FfScgZm91bmQgb24gcGFnZS5gKTtcbiAgICAgICAgICAgIGlzRmFpbGVkID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGdldERhdGFGb3JUaWNrZXRzKG5vZGVzKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvLyBTZWxlY3RlZCBlbGVtZW50c1xuICAgIGVsc2UgaWYgKHN1YnNldCA9PSBcInNlbGVjdGlvblwiKSB7XG4gICAgICAgIG5vZGVzID0gZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uO1xuICAgICAgICBub2RlcyA9IG5vZGVzLmZpbHRlcigobm9kZSkgPT4gbm9kZS5uYW1lID09PSBDT01QT05FTlRfU0VUX05BTUUpO1xuICAgICAgICBpZiAobm9kZXMubGVuZ3RoID09IDApIHtcbiAgICAgICAgICAgIGZpZ21hLm5vdGlmeShgTm8gXCIke0NPTVBPTkVOVF9TRVRfTkFNRX1cIiBpbnN0YW5jZSBzZWxlY3RlZC5gKTtcbiAgICAgICAgICAgIGlzRmFpbGVkID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGdldERhdGFGb3JUaWNrZXRzKG5vZGVzKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gaXNGYWlsZWQ7XG59XG4vKipcbiAqIFNlbmRzIGEgcmVxdWVzdCB0byB0aGUgVUkgdG8gZmV0Y2ggZGF0YSBmb3IgYW4gYXJyYXkgb2YgdGlja2V0c1xuICogQHBhcmFtIGluc3RhbmNlcyBJbnN0YW5jZXMgb2YgdGhlIEpUUyBjb21wb25lbnRcbiAqL1xuZnVuY3Rpb24gZ2V0RGF0YUZvclRpY2tldHMoaW5zdGFuY2VzKSB7XG4gICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgdmFyIG5vZGVJZHMgPSBbXTtcbiAgICAgICAgdmFyIGlzc3VlSWRzID0gW107XG4gICAgICAgIHZhciBtaXNzaW5nSWRzID0gMDtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpbnN0YW5jZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IG5vZGUgPSBpbnN0YW5jZXNbaV07XG4gICAgICAgICAgICBpZiAobm9kZS50eXBlID09PSBcIklOU1RBTkNFXCIpIHtcbiAgICAgICAgICAgICAgICBsZXQgaXNzdWVJZE5vZGUgPSBub2RlLmZpbmRPbmUoKG4pID0+IG4udHlwZSA9PT0gXCJURVhUXCIgJiYgbi5uYW1lID09PSBJU1NVRV9JRF9OQU1FKTtcbiAgICAgICAgICAgICAgICBpZiAoIWlzc3VlSWROb2RlIHx8IGlzc3VlSWROb2RlLmNoYXJhY3RlcnMgPT09IFwiXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgbWlzc2luZ0lkcyArPSAxO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaXNzdWVJZHMucHVzaChpc3N1ZUlkTm9kZS5jaGFyYWN0ZXJzKTtcbiAgICAgICAgICAgICAgICAgICAgbm9kZUlkcy5wdXNoKG5vZGUuaWQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBJZiBhbnkgaW5zdGFuY2UgaXMgbWlzc2luZyB0aGUgSUQuXG4gICAgICAgIGlmIChtaXNzaW5nSWRzID4gMClcbiAgICAgICAgICAgIGZpZ21hLm5vdGlmeShgJHttaXNzaW5nSWRzfSBpbnN0YW5jZShzKSBpcyBtaXNzaW5nIHRoZSB0ZXh0IGVsZW1lbnQgJyR7SVNTVUVfSURfTkFNRX0nIGFuZCBjb3VsZCBub3QgYmUgdXBkYXRlZC5gKTtcbiAgICAgICAgLy8gR2V0IHRpY2tldCBkYXRhIGlmXG4gICAgICAgIGlmIChpc3N1ZUlkcy5sZW5ndGggPT09IDAgfHwgbm9kZUlkcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIGlmIChmaWdtYS5jb21tYW5kKVxuICAgICAgICAgICAgICAgIGZpZ21hLmNsb3NlUGx1Z2luKCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBmaWdtYS51aS5wb3N0TWVzc2FnZSh7XG4gICAgICAgICAgICAgICAgbm9kZUlkczogbm9kZUlkcyxcbiAgICAgICAgICAgICAgICBpc3N1ZUlkczogaXNzdWVJZHMsXG4gICAgICAgICAgICAgICAgdHlwZTogXCJnZXRUaWNrZXREYXRhXCIsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH0pO1xufVxuLyoqXG4gKiBVcGRhdGVzIGEgc2V0IG9mIHRpY2tldHMgYmFzZWQgb24gdGhlaXIgc3RhdHVzLlxuICogSXMgY2FsbGVkIGFmdGVyIHRoZSBkYXRhIGlzIGZldGNoZWQuXG4gKiBAcGFyYW0gdGlja2V0SW5zdGFuY2VzIEEgc2V0IG9mIHRpY2tldCBpbnN0YW5jZXNcbiAqIEBwYXJhbSBtc2cgQSBtZXNzYWdlIHNlbnQgZnJvbSB0aGUgVUlcbiAqIEBwYXJhbSBpc0NyZWF0ZU5ldyBXZXRoZXIgdGhlIGZ1bmN0aW9uIGNhbGwgaXMgY29taW5nIGZyb20gYW4gYWN0dWFsIHRpY2tldCB1cGRhdGUgb3IgZnJvbSBjcmVhdGluZyBhIG5ldyB0aWNrZXRcbiAqIEByZXR1cm5zIFVwZGF0ZWQgdGlja2V0IGluc3RhbmNlc1xuICovXG5mdW5jdGlvbiB1cGRhdGVUaWNrZXRzKHRpY2tldEluc3RhbmNlcywgbXNnLCBpc0NyZWF0ZU5ldyA9IGZhbHNlKSB7XG4gICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgdmFyIHRpY2tldERhdGFBcnJheSA9IG1zZy5kYXRhO1xuICAgICAgICB2YXIgaXNzdWVJZHMgPSBtc2cuaXNzdWVJZHM7XG4gICAgICAgIHZhciBudW1iZXJPZk5vZGVzID0gdGlja2V0SW5zdGFuY2VzLmxlbmd0aDtcbiAgICAgICAgdmFyIGludmFsaWRJZHMgPSBbXTtcbiAgICAgICAgdmFyIG51bWJlck9mTWlzc2luZ1RpdGxlcyA9IDA7XG4gICAgICAgIHZhciBudW1iZXJPZk1pc3NpbmdEYXRlcyA9IDA7XG4gICAgICAgIHZhciBudW1iZXJPZk1pc3NpbmdBc3NpZ25lZXMgPSAwO1xuICAgICAgICB2YXIgbWlzc2luZ1ZhcmlhbnRzID0gW107XG4gICAgICAgIC8vIEdvIHRocm91Z2ggYWxsIG5vZGVzIGFuZCB1cGRhdGUgdGhlaXIgY29udGVudFxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG51bWJlck9mTm9kZXM7IGkrKykge1xuICAgICAgICAgICAgbGV0IHRpY2tldEluc3RhbmNlID0gdGlja2V0SW5zdGFuY2VzW2ldO1xuICAgICAgICAgICAgbGV0IHRpY2tldERhdGEgPSBjaGVja1RpY2tldERhdGFSZXBvbnNlKHRpY2tldERhdGFBcnJheVtpXSwgaXNzdWVJZHNbaV0pO1xuICAgICAgICAgICAgbGV0IHRpY2tldFN0YXR1cyA9IGdldFN0YXR1cyh0aWNrZXREYXRhKTtcbiAgICAgICAgICAgIGlmICh0aWNrZXRTdGF0dXMgPT09IFwiRXJyb3JcIilcbiAgICAgICAgICAgICAgICBpbnZhbGlkSWRzLnB1c2goaXNzdWVJZHNbaV0pO1xuICAgICAgICAgICAgLy8gR2V0IHRoZSB2YXJpYW50IGJhc2VkIG9uIHRoZSB0aWNrZXQgc3RhdHVzIGFuZCBzd2FwIGl0IHdpdGggdGhlIGN1cnJlbnRcbiAgICAgICAgICAgIGxldCBuZXdWYXJpYW50ID0gdGlja2V0Q29tcG9uZW50LmZpbmRDaGlsZCgobikgPT4gbi5uYW1lID09PSBDT01QT05FTlRfU0VUX1BST1BFUlRZX05BTUUgKyB0aWNrZXRTdGF0dXMpO1xuICAgICAgICAgICAgaWYgKCFuZXdWYXJpYW50KSB7XG4gICAgICAgICAgICAgICAgLy8gSWYgdGhlIHN0YXR1cyBkb2Vzbid0IG1hdGNoIGFueSBvZiB0aGUgdmFyaWFudHMsIHVzZSBkZWZhdWx0XG4gICAgICAgICAgICAgICAgbmV3VmFyaWFudCA9IHRpY2tldENvbXBvbmVudC5kZWZhdWx0VmFyaWFudDtcbiAgICAgICAgICAgICAgICBtaXNzaW5nVmFyaWFudHMucHVzaCh0aWNrZXRTdGF0dXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGlja2V0SW5zdGFuY2Uuc3dhcENvbXBvbmVudChuZXdWYXJpYW50KTtcbiAgICAgICAgICAgIC8vIFVwZGF0ZSB0aXRsZVxuICAgICAgICAgICAgbGV0IHRpdGxlTm9kZSA9IHRpY2tldEluc3RhbmNlLmZpbmRPbmUoKG4pID0+IG4udHlwZSA9PT0gXCJURVhUXCIgJiYgbi5uYW1lID09PSBJU1NVRV9USVRMRV9OQU1FKTtcbiAgICAgICAgICAgIGlmICh0aXRsZU5vZGUpIHtcbiAgICAgICAgICAgICAgICB0aXRsZU5vZGUuZm9udE5hbWUgPSB5aWVsZCB0cnlMb2FkaW5nRm9udCh0aXRsZU5vZGUuZm9udE5hbWUpO1xuICAgICAgICAgICAgICAgIHRpdGxlTm9kZS5jaGFyYWN0ZXJzID0gZ2V0VGl0bGUodGlja2V0RGF0YSk7XG4gICAgICAgICAgICAgICAgdGl0bGVOb2RlLmh5cGVybGluayA9IHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJVUkxcIixcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IGBodHRwczovLyR7Y29tcGFueV9uYW1lfS9icm93c2UvJHt0aWNrZXREYXRhLmtleX1gLFxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBudW1iZXJPZk1pc3NpbmdUaXRsZXMgKz0gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIFVwZGF0ZSBkYXRlXG4gICAgICAgICAgICBsZXQgY2hhbmdlRGF0ZU5vZGUgPSB0aWNrZXRJbnN0YW5jZS5maW5kT25lKChuKSA9PiBuLnR5cGUgPT09IFwiVEVYVFwiICYmIG4ubmFtZSA9PT0gSVNTVUVfQ0hBTkdFX0RBVEVfTkFNRSk7XG4gICAgICAgICAgICBpZiAoY2hhbmdlRGF0ZU5vZGUgJiYgZ2V0Q2hhbmdlRGF0ZSh0aWNrZXREYXRhKSkge1xuICAgICAgICAgICAgICAgIGNoYW5nZURhdGVOb2RlLmZvbnROYW1lID0geWllbGQgdHJ5TG9hZGluZ0ZvbnQoY2hhbmdlRGF0ZU5vZGUuZm9udE5hbWUpO1xuICAgICAgICAgICAgICAgIC8vIEZpbHRlcnMgb3V0IHRoZSBkYXRhIHRvIGEgc2ltcGxlciBmb3JtYXQgKE1tbSBERCBZWVlZKVxuICAgICAgICAgICAgICAgIHZhciBkYXRlID0gbmV3IERhdGUoZ2V0Q2hhbmdlRGF0ZSh0aWNrZXREYXRhKS5yZXBsYWNlKC9bVF0rLiovLCBcIlwiKSk7XG4gICAgICAgICAgICAgICAgY2hhbmdlRGF0ZU5vZGUuY2hhcmFjdGVycyA9IGRhdGUudG9EYXRlU3RyaW5nKCk7XG4gICAgICAgICAgICAgICAgLy8gY2hhbmdlRGF0ZVR4dC5jaGFyYWN0ZXJzID0gZGF0ZS50b0RhdGVTdHJpbmcoKS5yZXBsYWNlKC9eKFtBLVphLXpdKikuLyxcIlwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIG51bWJlck9mTWlzc2luZ0RhdGVzICs9IDE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBVcGRhdGUgYXNzaWduZWVcbiAgICAgICAgICAgIGxldCBhc3NpZ25lZU5vZGUgPSB0aWNrZXRJbnN0YW5jZS5maW5kT25lKChuKSA9PiBuLnR5cGUgPT09IFwiVEVYVFwiICYmIG4ubmFtZSA9PT0gQVNTSUdORUVfTkFNRSk7XG4gICAgICAgICAgICBpZiAoYXNzaWduZWVOb2RlKSB7XG4gICAgICAgICAgICAgICAgYXNzaWduZWVOb2RlLmZvbnROYW1lID0geWllbGQgdHJ5TG9hZGluZ0ZvbnQoYXNzaWduZWVOb2RlLmZvbnROYW1lKTtcbiAgICAgICAgICAgICAgICBhc3NpZ25lZU5vZGUuY2hhcmFjdGVycyA9IGdldEFzc2lnbmVlKHRpY2tldERhdGEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgbnVtYmVyT2ZNaXNzaW5nQXNzaWduZWVzICs9IDE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBVcGRhdGUgc3RhdHVzIHRleHQgZmllbGRcbiAgICAgICAgICAgIGxldCBzdGF0dXNOb2RlID0gdGlja2V0SW5zdGFuY2UuZmluZE9uZSgobikgPT4gbi50eXBlID09PSBcIlRFWFRcIiAmJiBuLm5hbWUgPT09IFNUQVRVU19OQU1FKTtcbiAgICAgICAgICAgIGlmIChzdGF0dXNOb2RlKSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzTm9kZS5mb250TmFtZSA9IHlpZWxkIHRyeUxvYWRpbmdGb250KHN0YXR1c05vZGUuZm9udE5hbWUpO1xuICAgICAgICAgICAgICAgIHN0YXR1c05vZGUuY2hhcmFjdGVycyA9IGdldFN0YXR1cyh0aWNrZXREYXRhKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vVXBkYXRlIGFjY2VwdGFuY2UgY3JpdGVyaWFcbiAgICAgICAgICAgIGxldCBhY2NlcHRhbmNlTm9kZSA9IHRpY2tldEluc3RhbmNlLmZpbmRPbmUoKG4pID0+IG4udHlwZSA9PT0gXCJURVhUXCIgJiYgbi5uYW1lID09PSBBQ0NFUFRBTkNFX05BTUUpO1xuICAgICAgICAgICAgaWYgKGFjY2VwdGFuY2VOb2RlKSB7XG4gICAgICAgICAgICAgICAgYWNjZXB0YW5jZU5vZGUuZm9udE5hbWUgPSB5aWVsZCB0cnlMb2FkaW5nRm9udChhY2NlcHRhbmNlTm9kZS5mb250TmFtZSk7XG4gICAgICAgICAgICAgICAgYWNjZXB0YW5jZU5vZGUuY2hhcmFjdGVycyA9IGdldEFjY2VwdGFuY2VDcml0ZXJpYSh0aWNrZXREYXRhKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIFVwZGF0ZSBkZXNjcmlwdGlvblxuICAgICAgICAgICAgbGV0IGRlc2NyaXB0aW9uTm9kZSA9IHRpY2tldEluc3RhbmNlLmZpbmRPbmUoKG4pID0+IG4udHlwZSA9PT0gXCJURVhUXCIgJiYgbi5uYW1lID09PSBERVNDUklQVElPTl9OQU1FKTtcbiAgICAgICAgICAgIGxldCBkZXNjcmlwdGlvblRleHQgPSBnZXREZXNjcmlwdGlvbih0aWNrZXREYXRhKTtcbiAgICAgICAgICAgIGlmIChkZXNjcmlwdGlvbk5vZGUgJiYgZGVzY3JpcHRpb25UZXh0KSB7XG4gICAgICAgICAgICAgICAgbGV0IGxvYWRlZEZvbnQgPSB5aWVsZCB0cnlMb2FkaW5nRm9udChGT05UX0RFU0NSSVBUSU9OKTtcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbk5vZGUuZm9udE5hbWUgPSBsb2FkZWRGb250O1xuICAgICAgICAgICAgICAgIGxldCBmb250RmFtaWx5ID0gbG9hZGVkRm9udC5mYW1pbHk7XG4gICAgICAgICAgICAgICAgLy8gQnVsbGV0IHBvaW50c1xuICAgICAgICAgICAgICAgIHdoaWxlIChkZXNjcmlwdGlvblRleHQubWF0Y2goL1xcbihcXCopK1teXFx3XS8pKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBjb3VudCA9IGRlc2NyaXB0aW9uVGV4dC5tYXRjaCgvXFxuKFxcKikrW15cXHddLylbMF0ubGVuZ3RoO1xuICAgICAgICAgICAgICAgICAgICBjb3VudCA9IChjb3VudCAtIDIpICogMjtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHNwYWNlcyA9IG5ldyBBcnJheShjb3VudCkuam9pbihcIiBcIik7XG4gICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uVGV4dCA9IGRlc2NyaXB0aW9uVGV4dC5yZXBsYWNlKC9cXG4oXFwqKStbXlxcd10vLCBgXFxuJHtzcGFjZXN94oCiIGApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbk5vZGUuY2hhcmFjdGVycyA9IGRlc2NyaXB0aW9uVGV4dDtcbiAgICAgICAgICAgICAgICAvLyBQYW5lbFxuICAgICAgICAgICAgICAgIGxldCByZWdleFBhbmVsID0gL1xce3BhbmVsLio/fSguKz8pXFx7cGFuZWxcXH0vcztcbiAgICAgICAgICAgICAgICBsZXQgZm9udFBhbmVsID0geyBmYW1pbHk6IGZvbnRGYW1pbHksIHN0eWxlOiBcIlJlZ3VsYXJcIiB9O1xuICAgICAgICAgICAgICAgIHlpZWxkIGNoYW5nZUZvbnRzQnlSZWdleChkZXNjcmlwdGlvbk5vZGUsIHJlZ2V4UGFuZWwsIGZvbnRQYW5lbCwgMSwgXCItLS0tLS0tXCIsIFwiLS0tLS0tLVwiKTtcbiAgICAgICAgICAgICAgICAvLyBDb2RlXG4gICAgICAgICAgICAgICAgbGV0IHJlZ2V4Q29kZSA9IC9cXHtub2Zvcm1hdFxcfSguKj8pXFx7bm9mb3JtYXRcXH0vcztcbiAgICAgICAgICAgICAgICBsZXQgZm9udENvZGUgPSB7IGZhbWlseTogXCJDb3VyaWVyXCIsIHN0eWxlOiBcIlJlZ3VsYXJcIiB9O1xuICAgICAgICAgICAgICAgIHlpZWxkIGNoYW5nZUZvbnRzQnlSZWdleChkZXNjcmlwdGlvbk5vZGUsIHJlZ2V4Q29kZSwgZm9udENvZGUsIDEsIFwiLS0tLS0tLVxcblwiLCBcIi0tLS0tLS1cIik7XG4gICAgICAgICAgICAgICAgLy8gTGlua1xuICAgICAgICAgICAgICAgIGxldCByZWdleExpbmsgPSAvXFxbKGh0dHBzOi4qKVxcfGh0dHAuKlxcfHNtYXJ0LWxpbmtdLztcbiAgICAgICAgICAgICAgICBsZXQgZm9udExpbmsgPSB7IGZhbWlseTogZm9udEZhbWlseSwgc3R5bGU6IFwiUmVndWxhclwiIH07XG4gICAgICAgICAgICAgICAgeWllbGQgY2hhbmdlRm9udHNCeVJlZ2V4KGRlc2NyaXB0aW9uTm9kZSwgcmVnZXhMaW5rLCBmb250TGluaywgMSwgXCJcIiwgXCJcIiwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgLy8gQm9sZFxuICAgICAgICAgICAgICAgIGxldCByZWdleEJvbGQgPSAvXFwqKC4rPylcXCovO1xuICAgICAgICAgICAgICAgIGxldCBmb250Qm9sZCA9IHsgZmFtaWx5OiBmb250RmFtaWx5LCBzdHlsZTogXCJCb2xkXCIgfTtcbiAgICAgICAgICAgICAgICB5aWVsZCBjaGFuZ2VGb250c0J5UmVnZXgoZGVzY3JpcHRpb25Ob2RlLCByZWdleEJvbGQsIGZvbnRCb2xkLCAxKTtcbiAgICAgICAgICAgICAgICAvLyBJdGFsaWNcbiAgICAgICAgICAgICAgICBsZXQgcmVnZXhJdGFsaWMgPSAvXyhbXl9dLio/KV8vO1xuICAgICAgICAgICAgICAgIGxldCBmb250SXRhbGljID0geyBmYW1pbHk6IGZvbnRGYW1pbHksIHN0eWxlOiBcIk9ibGlxdWVcIiB9O1xuICAgICAgICAgICAgICAgIHlpZWxkIGNoYW5nZUZvbnRzQnlSZWdleChkZXNjcmlwdGlvbk5vZGUsIHJlZ2V4SXRhbGljLCBmb250SXRhbGljLCAxKTtcbiAgICAgICAgICAgICAgICAvLyBUaXRsZVxuICAgICAgICAgICAgICAgIGxldCByZWdleFRpdGxlID0gL2goWzEtOV0pXFwuXFxzKC4qKS87XG4gICAgICAgICAgICAgICAgbGV0IGZvbnRUaXRsZSA9IHsgZmFtaWx5OiBmb250RmFtaWx5LCBzdHlsZTogXCJCb2xkXCIgfTtcbiAgICAgICAgICAgICAgICB5aWVsZCBjaGFuZ2VGb250c0J5UmVnZXgoZGVzY3JpcHRpb25Ob2RlLCByZWdleFRpdGxlLCBmb250VGl0bGUsIDIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gQWRkIHRoZSByZWxhdW5jaCBidXR0b25cbiAgICAgICAgICAgIHRpY2tldEluc3RhbmNlLnNldFJlbGF1bmNoRGF0YSh7IHVwZGF0ZV9zZWxlY3Rpb246IFwiXCIgfSk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gTm90aWZ5IGFib3V0IGVycm9ycyAobWlzc2luZyB0ZXh0IGZpZWxkcylcbiAgICAgICAgaWYgKG1pc3NpbmdWYXJpYW50cy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBtaXNzaW5nVmFyaWFudHMgPSBbLi4ubmV3IFNldChtaXNzaW5nVmFyaWFudHMpXTtcbiAgICAgICAgICAgIGxldCB2YXJpYW50U3RyaW5nID0gbWlzc2luZ1ZhcmlhbnRzLmpvaW4oXCInLCAnXCIpO1xuICAgICAgICAgICAgZmlnbWEubm90aWZ5KGBTdGF0dXMgJyR7dmFyaWFudFN0cmluZ30nIG5vdCBleGlzdGluZy4gWW91IGNhbiBhZGQgaXQgYXMgYSBuZXcgdmFyaWFudCB0byB0aGUgbWFpbiBjb21wb25lbnQuYCwgeyB0aW1lb3V0OiA2MDAwIH0pO1xuICAgICAgICB9XG4gICAgICAgIGlmIChudW1iZXJPZk1pc3NpbmdUaXRsZXMgPiAwKVxuICAgICAgICAgICAgZmlnbWEubm90aWZ5KGAke251bWJlck9mTWlzc2luZ1RpdGxlc30gdGlja2V0cyBhcmUgbWlzc2luZyB0ZXh0IGVsZW1lbnQgJyR7SVNTVUVfVElUTEVfTkFNRX0nLmApO1xuICAgICAgICBpZiAobnVtYmVyT2ZNaXNzaW5nRGF0ZXMgPiAwKVxuICAgICAgICAgICAgZmlnbWEubm90aWZ5KGAke251bWJlck9mTWlzc2luZ0RhdGVzfSB0aWNrZXRzIGFyZSBtaXNzaW5nIHRleHQgZWxlbWVudCAnJHtJU1NVRV9DSEFOR0VfREFURV9OQU1FfScuYCk7XG4gICAgICAgIGlmIChudW1iZXJPZk1pc3NpbmdBc3NpZ25lZXMgPiAwKVxuICAgICAgICAgICAgZmlnbWEubm90aWZ5KGAke251bWJlck9mTWlzc2luZ0Fzc2lnbmVlc30gdGlja2V0cyBhcmUgbWlzc2luZyB0ZXh0IGVsZW1lbnQgJyR7QVNTSUdORUVfTkFNRX0nLmApO1xuICAgICAgICAvLyBTdWNjZXNzIG1lc3NhZ2VcbiAgICAgICAgdmFyIG1lc3NhZ2U7XG4gICAgICAgIHZhciBudW1iZXJPZkludmFsaWRJZHMgPSBpbnZhbGlkSWRzLmxlbmd0aDtcbiAgICAgICAgaWYgKG51bWJlck9mSW52YWxpZElkcyA9PSBudW1iZXJPZk5vZGVzKSB7XG4gICAgICAgICAgICAvLyBBbGwgaW52YWxpZFxuICAgICAgICAgICAgbWVzc2FnZSA9XG4gICAgICAgICAgICAgICAgbnVtYmVyT2ZOb2RlcyA9PSAxXG4gICAgICAgICAgICAgICAgICAgID8gXCJJbnZhbGlkIElELlwiXG4gICAgICAgICAgICAgICAgICAgIDogYCR7bnVtYmVyT2ZJbnZhbGlkSWRzfSBvZiAke251bWJlck9mTm9kZXN9IElEcyBhcmUgaW52YWxpZCBvciBkbyBub3QgZXhpc3QuYDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChudW1iZXJPZkludmFsaWRJZHMgPT0gMCkge1xuICAgICAgICAgICAgLy8gQWxsIHZhbGlkXG4gICAgICAgICAgICBtZXNzYWdlID1cbiAgICAgICAgICAgICAgICBudW1iZXJPZk5vZGVzID09IDFcbiAgICAgICAgICAgICAgICAgICAgPyBcIlVwZGF0ZWQuXCJcbiAgICAgICAgICAgICAgICAgICAgOiBgJHtudW1iZXJPZk5vZGVzfSBvZiAke251bWJlck9mTm9kZXN9IGhlYWRlcihzKSB1cGRhdGVkIWA7XG4gICAgICAgICAgICBpZiAoaXNDcmVhdGVOZXcpXG4gICAgICAgICAgICAgICAgbWVzc2FnZSA9IFwiXCI7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAvLyBTb21lIHZhbGlkXG4gICAgICAgICAgICBsZXQgZmlyc3RTZW50ZW5jZSA9IGAke251bWJlck9mTm9kZXMgLSBudW1iZXJPZkludmFsaWRJZHN9IG9mICR7bnVtYmVyT2ZOb2Rlc30gc3VjY2Vzc2Z1bGx5IHVwZGF0ZWQuIGA7XG4gICAgICAgICAgICBsZXQgc2Vjb25kU2VudGVuY2UgPSBudW1iZXJPZkludmFsaWRJZHMgPT0gMVxuICAgICAgICAgICAgICAgID8gXCIxIElEIGlzIGludmFsaWQgb3IgZG9lcyBub3QgZXhpc3QuXCJcbiAgICAgICAgICAgICAgICA6IGAke251bWJlck9mSW52YWxpZElkc30gSURzIGFyZSBpbnZhbGlkIG9yIGRvIG5vdCBleGlzdC5gO1xuICAgICAgICAgICAgbWVzc2FnZSA9IGZpcnN0U2VudGVuY2UgKyBzZWNvbmRTZW50ZW5jZTtcbiAgICAgICAgfVxuICAgICAgICAvLyBJZiBub3QgYWxsIGZvbnQgY291bGQgYmUgbG9hZGVkXG4gICAgICAgIGlmIChVTkxPQURFRF9GT05UUy5zaXplID4gMCkge1xuICAgICAgICAgICAgZmlnbWEubm90aWZ5KFwiRm9udChzKSAnXCIgK1xuICAgICAgICAgICAgICAgIFsuLi5VTkxPQURFRF9GT05UU10uam9pbihcIiwgXCIpICtcbiAgICAgICAgICAgICAgICBcIicgY291bGQgbm90IGJlIGxvYWRlZC4gUGxlYXNlIGluc3RhbGwgdGhlIGZvbnQgb3IgY2hhbmdlIHRoZSBjb21wb25lbnQgZm9udC5cIik7XG4gICAgICAgICAgICBVTkxPQURFRF9GT05UUy5jbGVhcigpO1xuICAgICAgICB9XG4gICAgICAgIC8vIElmIGNhbGxlZCB2aWEgdGhlIHJlbGF1bmNoIGJ1dHRvbiwgY2xvc2UgcGx1Z2luIGFmdGVyIHVwZGF0aW5nIHRoZSB0aWNrZXRzXG4gICAgICAgIGlmIChmaWdtYS5jb21tYW5kID09PSBcInVwZGF0ZV9wYWdlXCIgfHxcbiAgICAgICAgICAgIGZpZ21hLmNvbW1hbmQgPT09IFwidXBkYXRlX2FsbFwiIHx8XG4gICAgICAgICAgICBmaWdtYS5jb21tYW5kID09PSBcInVwZGF0ZV9zZWxlY3Rpb25cIikge1xuICAgICAgICAgICAgZmlnbWEuY2xvc2VQbHVnaW4obWVzc2FnZSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBmaWdtYS5ub3RpZnkobWVzc2FnZSwgeyB0aW1lb3V0OiAyMDAwIH0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aWNrZXRJbnN0YW5jZXM7XG4gICAgfSk7XG59XG4vKipcbiAqIENoYW5nZXMgdGhlIGZvbnQgaW4gYSBUZXh0IG5vZGUgYmFzZWQgb24gYW4gaW5kaWNlcyBhcnJheS5cbiAqIEBwYXJhbSB0ZXh0Tm9kZSBUZXh0IE5vZGVcbiAqIEBwYXJhbSByZWdleCBSZWd1bGFyIGV4cHJlc3Npb24gdG8gbWF0Y2ggY2VydGFpbiByYW5nZVxuICogQHBhcmFtIGZvbnQgRm9udCBuYW1lIGZvciByYW5nZVxuICogQHBhcmFtIGNvbnRlbnRHcm91cCBXaGljaCBjb250ZW50IGdyb3VwIGluIHRoZSByZWdleCBzaG91bGQgYmUgdGhlIG5ldyB0ZXh0XG4gKiBAcGFyYW0gcHJlVGV4dCBBZGQgYSB0ZXh0IGJlZm9yZSB0aGUgcmVnZXggbWF0Y2hcbiAqIEBwYXJhbSBwb3N0VGV4dCBBZGQgYSB0ZXh0IGFmdGVyIHRoZSByZWdleCBtYXRjaFxuICogQHBhcmFtIGNyZWF0ZUh5cGVyTGluayBDcmVhdGUgYSBVUkwgZm9yIHRoaXMgdGV4dCByYW5nZT9cbiAqIEByZXR1cm4gVGV4dCBOb2RlXG4gKi9cbmZ1bmN0aW9uIGNoYW5nZUZvbnRzQnlSZWdleCh0ZXh0Tm9kZSwgcmVnZXgsIGZvbnQsIGNvbnRlbnRHcm91cCwgcHJlVGV4dCA9IFwiXCIsIHBvc3RUZXh0ID0gXCJcIiwgY3JlYXRlSHlwZXJMaW5rID0gZmFsc2UpIHtcbiAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICBmb250ID0geWllbGQgdHJ5TG9hZGluZ0ZvbnQoZm9udCk7XG4gICAgICAgIHdoaWxlICh0ZXh0Tm9kZS5jaGFyYWN0ZXJzLm1hdGNoKHJlZ2V4KSkge1xuICAgICAgICAgICAgbGV0IG1hdGNoID0gdGV4dE5vZGUuY2hhcmFjdGVycy5tYXRjaChyZWdleCk7XG4gICAgICAgICAgICBsZXQgbGVuZ3RoID0gbWF0Y2hbMF0ubGVuZ3RoO1xuICAgICAgICAgICAgbGV0IGluZGV4ID0gbWF0Y2guaW5kZXg7XG4gICAgICAgICAgICBsZXQgbmV3VGV4dCA9IG1hdGNoW2NvbnRlbnRHcm91cF07XG4gICAgICAgICAgICBsZXQgd2hvbGVUZXh0ID0gcHJlVGV4dCArIG5ld1RleHQgKyBwb3N0VGV4dDtcbiAgICAgICAgICAgIGxldCB3aG9sZUxlbmd0aCA9IHdob2xlVGV4dC5sZW5ndGg7XG4gICAgICAgICAgICBpZiAobGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIHRleHROb2RlLmRlbGV0ZUNoYXJhY3RlcnMoaW5kZXgsIGluZGV4ICsgbGVuZ3RoKTtcbiAgICAgICAgICAgICAgICB0ZXh0Tm9kZS5pbnNlcnRDaGFyYWN0ZXJzKGluZGV4LCB3aG9sZVRleHQpO1xuICAgICAgICAgICAgICAgIHRleHROb2RlLnNldFJhbmdlRm9udE5hbWUoaW5kZXgsIGluZGV4ICsgd2hvbGVMZW5ndGgsIGZvbnQpO1xuICAgICAgICAgICAgICAgIGlmIChjcmVhdGVIeXBlckxpbmspIHtcbiAgICAgICAgICAgICAgICAgICAgdGV4dE5vZGUuc2V0UmFuZ2VIeXBlcmxpbmsoaW5kZXgsIGluZGV4ICsgd2hvbGVMZW5ndGgsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IFwiVVJMXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogbmV3VGV4dCxcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIHRleHROb2RlLnNldFJhbmdlRmlsbHMoaW5kZXgsIGluZGV4ICsgd2hvbGVMZW5ndGgsIEZPTlRfQ09MT1JfVVJMKTtcbiAgICAgICAgICAgICAgICAgICAgdGV4dE5vZGUuc2V0UmFuZ2VUZXh0RGVjb3JhdGlvbihpbmRleCwgaW5kZXggKyB3aG9sZUxlbmd0aCwgXCJVTkRFUkxJTkVcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0ZXh0Tm9kZTtcbiAgICB9KTtcbn1cbi8qKlxuICogQ3JlYXRlIGluc3RhbmNlcyBvZiB0aGUgbWFpbiB0aWNrZXQgY29tcG9uZW50IGFuZCByZXBsYWNlcyB0aGUgY29udGVudCB3aXRoIGRhdGEgb2YgdGhlIGFjdHVhbCBKaXJhIHRpY2tldFxuICogQHBhcmFtIG1zZyBKU09OIHdpdGggaW5mbyBzZW50IGZyb20gVUlcbiAqL1xuZnVuY3Rpb24gY3JlYXRlVGlja2V0SW5zdGFuY2UobXNnKSB7XG4gICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgLy8gQ3JlYXRlIGFuIGluc3RhbmNlIGFuZCB1cGRhdGUgaXQgdG8gdGhlIGNvcnJlY3Qgc3RhdHVzXG4gICAgICAgIGxldCB0aWNrZXRWYXJpYW50ID0gdGlja2V0Q29tcG9uZW50LmRlZmF1bHRWYXJpYW50O1xuICAgICAgICBsZXQgdGlja2V0SW5zdGFuY2UgPSB0aWNrZXRWYXJpYW50LmNyZWF0ZUluc3RhbmNlKCk7XG4gICAgICAgIC8vIFBvc2l0aW9uIHRoZSB0aWNrZXQgaW5zdGFuY2UgYW5kIGdpdmUgaXQgYSBzbGlnaHQgb2Zmc2V0IChzbyB0aGF0IHdoZW4gbXVsdGlwbGUgdGlja2V0cyBhcmUgY3JlYXRlZCB0aGV5IGRvbnQgb3ZlcmxhcClcbiAgICAgICAgdGlja2V0SW5zdGFuY2UueCA9XG4gICAgICAgICAgICBmaWdtYS52aWV3cG9ydC5jZW50ZXIueCAtIHRpY2tldEluc3RhbmNlLndpZHRoIC8gMiArIG5leHRUaWNrZXRPZmZzZXQ7XG4gICAgICAgIHRpY2tldEluc3RhbmNlLnkgPVxuICAgICAgICAgICAgZmlnbWEudmlld3BvcnQuY2VudGVyLnkgLSB0aWNrZXRJbnN0YW5jZS5oZWlnaHQgLyAyICsgbmV4dFRpY2tldE9mZnNldDtcbiAgICAgICAgbmV4dFRpY2tldE9mZnNldCA9IChuZXh0VGlja2V0T2Zmc2V0ICsgMTApICUgNzA7XG4gICAgICAgIGZpZ21hLmN1cnJlbnRQYWdlLnNlbGVjdGlvbiA9IFt0aWNrZXRJbnN0YW5jZV07XG4gICAgICAgIC8vIENoZWNrIGlmIHRoZSBkYXRhIGlzIHZhbGlkIGFuZCB1cGRhdGUgdGhlIGluc3RhbmNlIHRleHQgZmllbGRzXG4gICAgICAgIGxldCB0aWNrZXREYXRhID0gY2hlY2tUaWNrZXREYXRhUmVwb25zZShtc2cuZGF0YVswXSwgbXNnLmlzc3VlSWRzWzBdKTtcbiAgICAgICAgbGV0IHRpY2tldEluc3RhbmNlcyA9IHlpZWxkIHVwZGF0ZVRpY2tldHMoW3RpY2tldEluc3RhbmNlXSwgbXNnLCB0cnVlKTtcbiAgICAgICAgdGlja2V0SW5zdGFuY2UgPSB0aWNrZXRJbnN0YW5jZXNbMF07XG4gICAgICAgIC8vIEFkZCBJRFxuICAgICAgICBsZXQgaXNzdWVJRFR4dCA9IHRpY2tldEluc3RhbmNlLmZpbmRPbmUoKG4pID0+IG4udHlwZSA9PT0gXCJURVhUXCIgJiYgbi5uYW1lID09PSBJU1NVRV9JRF9OQU1FKTtcbiAgICAgICAgaWYgKGlzc3VlSURUeHQpIHtcbiAgICAgICAgICAgIGlzc3VlSURUeHQuZm9udE5hbWUgPSB5aWVsZCB0cnlMb2FkaW5nRm9udChpc3N1ZUlEVHh0LmZvbnROYW1lKTtcbiAgICAgICAgICAgIGlzc3VlSURUeHQuY2hhcmFjdGVycyA9IGdldElzc3VlSWQodGlja2V0RGF0YSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBmaWdtYS5ub3RpZnkoXCJDb3VsZCBub3QgZmluZCB0ZXh0IGVsZW1lbnQgbmFtZWQgJ1wiICsgSVNTVUVfSURfTkFNRSArIFwiJy5cIik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRpY2tldEluc3RhbmNlO1xuICAgIH0pO1xufVxuLyoqXG4gKiBDcmVhdGVzIGEgbmV3IGNvbXBvbmVudCB0aGF0IHJlcHJlc2VudHMgYSB0aWNrZXQgc3RhdHVzXG4gKiBAcGFyYW0gc3RhdHVzQ29sb3IgUkdCIHZhbHVlIGZvciBzdGF0dXMgY29sb3JcbiAqIEBwYXJhbSBzdGF0dXNOYW1lIE5hbWUgb2Ygc3RhdHVzXG4gKiBAcmV0dXJucyBBIGNvbXBvbmVudCB0aGF0IHJlcHJlc2VudCBhIHRpY2tldFxuICovXG5mdW5jdGlvbiBjcmVhdGVUaWNrZXRWYXJpYW50KHN0YXR1c0NvbG9yLCBzdGF0dXNOYW1lKSB7XG4gICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgdmFyIHRpY2tldFZhcmlhbnQgPSBmaWdtYS5jcmVhdGVDb21wb25lbnQoKTtcbiAgICAgICAgdGlja2V0VmFyaWFudC52aXNpYmxlID0gZmFsc2U7XG4gICAgICAgIHZhciBzdGF0dXNDb2xvclJlY3QgPSBmaWdtYS5jcmVhdGVSZWN0YW5nbGUoKTtcbiAgICAgICAgdmFyIGlkRnJhbWUgPSBmaWdtYS5jcmVhdGVGcmFtZSgpO1xuICAgICAgICB2YXIgdGl0bGVGcmFtZSA9IGZpZ21hLmNyZWF0ZUZyYW1lKCk7XG4gICAgICAgIHZhciBkZXRhaWxzRnJhbWUgPSBmaWdtYS5jcmVhdGVGcmFtZSgpO1xuICAgICAgICB2YXIgZGVzY3JpcHRpb25GcmFtZSA9IGZpZ21hLmNyZWF0ZUZyYW1lKCk7XG4gICAgICAgIGNvbnN0IHRpdGxlVHh0ID0gZmlnbWEuY3JlYXRlVGV4dCgpO1xuICAgICAgICBjb25zdCBpc3N1ZUlkVHh0ID0gZmlnbWEuY3JlYXRlVGV4dCgpO1xuICAgICAgICBjb25zdCBzdGF0dXNUeHQgPSBmaWdtYS5jcmVhdGVUZXh0KCk7XG4gICAgICAgIGNvbnN0IGNoYW5nZURhdGVUeHQgPSBmaWdtYS5jcmVhdGVUZXh0KCk7XG4gICAgICAgIGNvbnN0IGFzc2lnbmVlVHh0ID0gZmlnbWEuY3JlYXRlVGV4dCgpO1xuICAgICAgICBjb25zdCBkaXZpZGVyVHh0MSA9IGZpZ21hLmNyZWF0ZVRleHQoKTtcbiAgICAgICAgY29uc3QgZGl2aWRlclR4dDIgPSBmaWdtYS5jcmVhdGVUZXh0KCk7XG4gICAgICAgIGNvbnN0IGRlc2NyaXB0aW9uVGl0bGVUeHQgPSBmaWdtYS5jcmVhdGVUZXh0KCk7XG4gICAgICAgIGNvbnN0IGFjY2VwdGFuY2VUaXRsZVR4dCA9IGZpZ21hLmNyZWF0ZVRleHQoKTtcbiAgICAgICAgY29uc3QgZGVzY3JpcHRpb25UeHQgPSBmaWdtYS5jcmVhdGVUZXh0KCk7XG4gICAgICAgIGNvbnN0IGFjY2VwdGFuY2VUeHQgPSBmaWdtYS5jcmVhdGVUZXh0KCk7XG4gICAgICAgIHRpY2tldFZhcmlhbnQuYXBwZW5kQ2hpbGQoc3RhdHVzQ29sb3JSZWN0KTtcbiAgICAgICAgdGlja2V0VmFyaWFudC5hcHBlbmRDaGlsZChpZEZyYW1lKTtcbiAgICAgICAgaWRGcmFtZS5hcHBlbmRDaGlsZChpc3N1ZUlkVHh0KTtcbiAgICAgICAgaWRGcmFtZS5hcHBlbmRDaGlsZCh0aXRsZUZyYW1lKTtcbiAgICAgICAgdGl0bGVGcmFtZS5hcHBlbmRDaGlsZCh0aXRsZVR4dCk7XG4gICAgICAgIHRpdGxlRnJhbWUuYXBwZW5kQ2hpbGQoZGV0YWlsc0ZyYW1lKTtcbiAgICAgICAgdGl0bGVGcmFtZS5hcHBlbmRDaGlsZChkZXNjcmlwdGlvbkZyYW1lKTtcbiAgICAgICAgZGVzY3JpcHRpb25GcmFtZS5hcHBlbmRDaGlsZChkZXNjcmlwdGlvblRpdGxlVHh0KTtcbiAgICAgICAgZGVzY3JpcHRpb25GcmFtZS5hcHBlbmRDaGlsZChkZXNjcmlwdGlvblR4dCk7XG4gICAgICAgIGRlc2NyaXB0aW9uRnJhbWUuYXBwZW5kQ2hpbGQoYWNjZXB0YW5jZVRpdGxlVHh0KTtcbiAgICAgICAgZGVzY3JpcHRpb25GcmFtZS5hcHBlbmRDaGlsZChhY2NlcHRhbmNlVHh0KTtcbiAgICAgICAgZGV0YWlsc0ZyYW1lLmFwcGVuZENoaWxkKHN0YXR1c1R4dCk7XG4gICAgICAgIGRldGFpbHNGcmFtZS5hcHBlbmRDaGlsZChkaXZpZGVyVHh0MSk7XG4gICAgICAgIGRldGFpbHNGcmFtZS5hcHBlbmRDaGlsZChhc3NpZ25lZVR4dCk7XG4gICAgICAgIGRldGFpbHNGcmFtZS5hcHBlbmRDaGlsZChkaXZpZGVyVHh0Mik7XG4gICAgICAgIGRldGFpbHNGcmFtZS5hcHBlbmRDaGlsZChjaGFuZ2VEYXRlVHh0KTtcbiAgICAgICAgLy8gQ3JlYXRlIHZhcmlhbnQgZnJhbWVcbiAgICAgICAgdGlja2V0VmFyaWFudC5uYW1lID0gc3RhdHVzTmFtZTtcbiAgICAgICAgdGlja2V0VmFyaWFudC5yZXNpemUoNjAwLCAyMDApO1xuICAgICAgICB0aWNrZXRWYXJpYW50LmNvcm5lclJhZGl1cyA9IDE2O1xuICAgICAgICB0aWNrZXRWYXJpYW50Lml0ZW1TcGFjaW5nID0gMDtcbiAgICAgICAgdGlja2V0VmFyaWFudC5sYXlvdXRNb2RlID0gXCJIT1JJWk9OVEFMXCI7XG4gICAgICAgIHRpY2tldFZhcmlhbnQuY291bnRlckF4aXNTaXppbmdNb2RlID0gXCJBVVRPXCI7XG4gICAgICAgIHRpY2tldFZhcmlhbnQucHJpbWFyeUF4aXNTaXppbmdNb2RlID0gXCJGSVhFRFwiO1xuICAgICAgICB0aWNrZXRWYXJpYW50LmZpbGxzID0gW3sgdHlwZTogXCJTT0xJRFwiLCBjb2xvcjogeyByOiAxLCBnOiAxLCBiOiAxIH0gfV07XG4gICAgICAgIC8vIENyZWF0ZSBSZWN0YW5nbGVcbiAgICAgICAgc3RhdHVzQ29sb3JSZWN0LnJlc2l6ZSgxMiwgMjAwKTtcbiAgICAgICAgc3RhdHVzQ29sb3JSZWN0LmZpbGxzID0gW3sgdHlwZTogXCJTT0xJRFwiLCBjb2xvcjogc3RhdHVzQ29sb3IgfV07XG4gICAgICAgIHN0YXR1c0NvbG9yUmVjdC5sYXlvdXRBbGlnbiA9IFwiU1RSRVRDSFwiO1xuICAgICAgICBzdGF0dXNDb2xvclJlY3QubGF5b3V0R3JvdyA9IDA7XG4gICAgICAgIHN0YXR1c0NvbG9yUmVjdC50b3BMZWZ0UmFkaXVzID0gMTY7XG4gICAgICAgIHN0YXR1c0NvbG9yUmVjdC5ib3R0b21MZWZ0UmFkaXVzID0gMTY7XG4gICAgICAgIHN0YXR1c0NvbG9yUmVjdC5uYW1lID0gXCJTdGF0dXMgQ29sb3IgSW5kaWNhdG9yXCI7XG4gICAgICAgIC8vIENyZWF0ZSB0aGUgbWFpbiBmcmFtZVxuICAgICAgICBsZXQgcGFkZGluZyA9IDI0O1xuICAgICAgICBpZEZyYW1lLnBhZGRpbmdUb3AgPSBwYWRkaW5nO1xuICAgICAgICBpZEZyYW1lLnBhZGRpbmdSaWdodCA9IHBhZGRpbmc7XG4gICAgICAgIGlkRnJhbWUucGFkZGluZ0JvdHRvbSA9IHBhZGRpbmc7XG4gICAgICAgIGlkRnJhbWUucGFkZGluZ0xlZnQgPSBwYWRkaW5nO1xuICAgICAgICBpZEZyYW1lLm5hbWUgPSBcIlRpY2tldCBCb2R5XCI7XG4gICAgICAgIGlkRnJhbWUubGF5b3V0TW9kZSA9IFwiVkVSVElDQUxcIjtcbiAgICAgICAgaWRGcmFtZS5jb3VudGVyQXhpc1NpemluZ01vZGUgPSBcIkFVVE9cIjtcbiAgICAgICAgaWRGcmFtZS5sYXlvdXRBbGlnbiA9IFwiU1RSRVRDSFwiO1xuICAgICAgICBpZEZyYW1lLmxheW91dEdyb3cgPSAxO1xuICAgICAgICBpZEZyYW1lLml0ZW1TcGFjaW5nID0gODtcbiAgICAgICAgaWRGcmFtZS5maWxscyA9IFtdO1xuICAgICAgICAvLyBDcmVhdGUgdGhlIHRpdGxlIGZyYW1lXG4gICAgICAgIHRpdGxlRnJhbWUubmFtZSA9IFwiVGlja2V0IENvbnRlbnRzXCI7XG4gICAgICAgIHRpdGxlRnJhbWUubGF5b3V0TW9kZSA9IFwiVkVSVElDQUxcIjtcbiAgICAgICAgdGl0bGVGcmFtZS5jb3VudGVyQXhpc1NpemluZ01vZGUgPSBcIkFVVE9cIjtcbiAgICAgICAgdGl0bGVGcmFtZS5sYXlvdXRBbGlnbiA9IFwiU1RSRVRDSFwiO1xuICAgICAgICB0aXRsZUZyYW1lLml0ZW1TcGFjaW5nID0gMTY7XG4gICAgICAgIHRpdGxlRnJhbWUuZmlsbHMgPSBbXTtcbiAgICAgICAgLy8gQ3JlYXRlIHRoZSBkZXRhaWxzIGZyYW1lXG4gICAgICAgIGRldGFpbHNGcmFtZS5uYW1lID0gXCJDb250YWluZXJcIjtcbiAgICAgICAgZGV0YWlsc0ZyYW1lLmxheW91dE1vZGUgPSBcIkhPUklaT05UQUxcIjtcbiAgICAgICAgZGV0YWlsc0ZyYW1lLmNvdW50ZXJBeGlzU2l6aW5nTW9kZSA9IFwiQVVUT1wiO1xuICAgICAgICBkZXRhaWxzRnJhbWUubGF5b3V0QWxpZ24gPSBcIlNUUkVUQ0hcIjtcbiAgICAgICAgZGV0YWlsc0ZyYW1lLml0ZW1TcGFjaW5nID0gODtcbiAgICAgICAgZGV0YWlsc0ZyYW1lLmZpbGxzID0gW107XG4gICAgICAgIC8vIENyZWF0ZSB0aGUgZGVzY3JpcHRpb24gZnJhbWVcbiAgICAgICAgZGVzY3JpcHRpb25GcmFtZS5uYW1lID0gXCJEZXNjcmlwdGlvblwiO1xuICAgICAgICBkZXNjcmlwdGlvbkZyYW1lLmxheW91dE1vZGUgPSBcIlZFUlRJQ0FMXCI7XG4gICAgICAgIGRlc2NyaXB0aW9uRnJhbWUucHJpbWFyeUF4aXNTaXppbmdNb2RlID0gXCJBVVRPXCI7XG4gICAgICAgIGRlc2NyaXB0aW9uRnJhbWUubGF5b3V0QWxpZ24gPSBcIlNUUkVUQ0hcIjtcbiAgICAgICAgZGVzY3JpcHRpb25GcmFtZS5pdGVtU3BhY2luZyA9IDMyO1xuICAgICAgICBkZXNjcmlwdGlvbkZyYW1lLmNvcm5lclJhZGl1cyA9IDg7XG4gICAgICAgIGRlc2NyaXB0aW9uRnJhbWUudmVydGljYWxQYWRkaW5nID0gMTY7XG4gICAgICAgIGRlc2NyaXB0aW9uRnJhbWUuaG9yaXpvbnRhbFBhZGRpbmcgPSAxNjtcbiAgICAgICAgZGVzY3JpcHRpb25GcmFtZS5maWxscyA9IFt7IHR5cGU6IFwiU09MSURcIiwgY29sb3I6IGhleFRvUmdiKFwiZjRmNWY3XCIpIH1dO1xuICAgICAgICAvLyBBZGQgdGhlIHRpY2tldCB0ZXh0IGZpZWxkc1xuICAgICAgICB0aXRsZVR4dC5mb250TmFtZSA9IHlpZWxkIHRyeUxvYWRpbmdGb250KEZPTlRfUFJJTUFSWSk7XG4gICAgICAgIHRpdGxlVHh0LmZvbnRTaXplID0gRk9OVF9TSVpFX1BSSU1BUlk7XG4gICAgICAgIHRpdGxlVHh0LmZpbGxzID0gRk9OVF9DT0xPUl9QUklNQVJZO1xuICAgICAgICB0aXRsZVR4dC50ZXh0RGVjb3JhdGlvbiA9IFwiVU5ERVJMSU5FXCI7XG4gICAgICAgIHRpdGxlVHh0LmF1dG9SZW5hbWUgPSBmYWxzZTtcbiAgICAgICAgdGl0bGVUeHQuY2hhcmFjdGVycyA9IFwiVGlja2V0IHRpdGxlXCI7XG4gICAgICAgIHRpdGxlVHh0Lm5hbWUgPSBJU1NVRV9USVRMRV9OQU1FO1xuICAgICAgICBpc3N1ZUlkVHh0LmZvbnROYW1lID0geWllbGQgdHJ5TG9hZGluZ0ZvbnQoRk9OVF9TRUNPTkRBUlkpO1xuICAgICAgICBpc3N1ZUlkVHh0LmZvbnRTaXplID0gRk9OVF9TSVpFX1NFQ09OREFSWTtcbiAgICAgICAgaXNzdWVJZFR4dC5maWxscyA9IEZPTlRfQ09MT1JfU0VDT05EQVJZO1xuICAgICAgICBpc3N1ZUlkVHh0LmF1dG9SZW5hbWUgPSBmYWxzZTtcbiAgICAgICAgaXNzdWVJZFR4dC5jaGFyYWN0ZXJzID0gXCJJRC0xXCI7XG4gICAgICAgIGlzc3VlSWRUeHQubmFtZSA9IElTU1VFX0lEX05BTUU7XG4gICAgICAgIHN0YXR1c1R4dC5mb250TmFtZSA9IHlpZWxkIHRyeUxvYWRpbmdGb250KEZPTlRfU0VDT05EQVJZKTtcbiAgICAgICAgc3RhdHVzVHh0LmZvbnRTaXplID0gRk9OVF9TSVpFX1NFQ09OREFSWTtcbiAgICAgICAgc3RhdHVzVHh0LmZpbGxzID0gRk9OVF9DT0xPUl9TRUNPTkRBUlk7XG4gICAgICAgIHN0YXR1c1R4dC5hdXRvUmVuYW1lID0gZmFsc2U7XG4gICAgICAgIHN0YXR1c1R4dC5jaGFyYWN0ZXJzID0gc3RhdHVzTmFtZS5yZXBsYWNlKFwiU3RhdHVzPVwiLCBcIlwiKTtcbiAgICAgICAgc3RhdHVzVHh0Lm5hbWUgPSBTVEFUVVNfTkFNRTtcbiAgICAgICAgY2hhbmdlRGF0ZVR4dC5mb250U2l6ZSA9IEZPTlRfU0laRV9TRUNPTkRBUlk7XG4gICAgICAgIGNoYW5nZURhdGVUeHQuZmlsbHMgPSBGT05UX0NPTE9SX1NFQ09OREFSWTtcbiAgICAgICAgY2hhbmdlRGF0ZVR4dC5hdXRvUmVuYW1lID0gZmFsc2U7XG4gICAgICAgIGNoYW5nZURhdGVUeHQuY2hhcmFjdGVycyA9IFwiTU0gREQgWVlZWVwiO1xuICAgICAgICBjaGFuZ2VEYXRlVHh0Lm5hbWUgPSBJU1NVRV9DSEFOR0VfREFURV9OQU1FO1xuICAgICAgICBhc3NpZ25lZVR4dC5mb250U2l6ZSA9IEZPTlRfU0laRV9TRUNPTkRBUlk7XG4gICAgICAgIGFzc2lnbmVlVHh0LmZpbGxzID0gRk9OVF9DT0xPUl9TRUNPTkRBUlk7XG4gICAgICAgIGFzc2lnbmVlVHh0LmF1dG9SZW5hbWUgPSBmYWxzZTtcbiAgICAgICAgYXNzaWduZWVUeHQuY2hhcmFjdGVycyA9IFwiTmFtZSBvZiBhc3NpZ25lZVwiO1xuICAgICAgICBhc3NpZ25lZVR4dC5uYW1lID0gQVNTSUdORUVfTkFNRTtcbiAgICAgICAgZGl2aWRlclR4dDEuZm9udFNpemUgPSBGT05UX1NJWkVfU0VDT05EQVJZO1xuICAgICAgICBkaXZpZGVyVHh0MS5maWxscyA9IEZPTlRfQ09MT1JfU0VDT05EQVJZO1xuICAgICAgICBkaXZpZGVyVHh0MS5hdXRvUmVuYW1lID0gZmFsc2U7XG4gICAgICAgIGRpdmlkZXJUeHQxLmNoYXJhY3RlcnMgPSBcIi9cIjtcbiAgICAgICAgZGl2aWRlclR4dDEubmFtZSA9IFwiL1wiO1xuICAgICAgICBkaXZpZGVyVHh0Mi5mb250U2l6ZSA9IEZPTlRfU0laRV9TRUNPTkRBUlk7XG4gICAgICAgIGRpdmlkZXJUeHQyLmZpbGxzID0gRk9OVF9DT0xPUl9TRUNPTkRBUlk7XG4gICAgICAgIGRpdmlkZXJUeHQyLmF1dG9SZW5hbWUgPSBmYWxzZTtcbiAgICAgICAgZGl2aWRlclR4dDIuY2hhcmFjdGVycyA9IFwiL1wiO1xuICAgICAgICBkaXZpZGVyVHh0Mi5uYW1lID0gXCIvXCI7XG4gICAgICAgIGFjY2VwdGFuY2VUaXRsZVR4dC5mb250TmFtZSA9IHlpZWxkIHRyeUxvYWRpbmdGb250KEZPTlRfUFJJTUFSWSk7XG4gICAgICAgIGFjY2VwdGFuY2VUaXRsZVR4dC5mb250U2l6ZSA9IDE2O1xuICAgICAgICBhY2NlcHRhbmNlVGl0bGVUeHQuZmlsbHMgPSBGT05UX0NPTE9SX1BSSU1BUlk7XG4gICAgICAgIGFjY2VwdGFuY2VUaXRsZVR4dC5hdXRvUmVuYW1lID0gZmFsc2U7XG4gICAgICAgIGFjY2VwdGFuY2VUaXRsZVR4dC5jaGFyYWN0ZXJzID0gXCJBY2NlcHRhbmNlIENyaXRlcmlhXCI7XG4gICAgICAgIGFjY2VwdGFuY2VUaXRsZVR4dC5uYW1lID0gXCJUaXRsZVwiO1xuICAgICAgICBhY2NlcHRhbmNlVHh0LmZvbnROYW1lID0geWllbGQgdHJ5TG9hZGluZ0ZvbnQoRk9OVF9ERVNDUklQVElPTik7XG4gICAgICAgIGFjY2VwdGFuY2VUeHQuZm9udFNpemUgPSAxNjtcbiAgICAgICAgYWNjZXB0YW5jZVR4dC5maWxscyA9IEZPTlRfQ09MT1JfUFJJTUFSWTtcbiAgICAgICAgYWNjZXB0YW5jZVR4dC5hdXRvUmVuYW1lID0gZmFsc2U7XG4gICAgICAgIGFjY2VwdGFuY2VUeHQuY2hhcmFjdGVycyA9IFwiRGVzY3JpcHRpb25cIjtcbiAgICAgICAgYWNjZXB0YW5jZVR4dC5uYW1lID0gQUNDRVBUQU5DRV9OQU1FO1xuICAgICAgICBkZXNjcmlwdGlvblRpdGxlVHh0LmZvbnROYW1lID0geWllbGQgdHJ5TG9hZGluZ0ZvbnQoRk9OVF9QUklNQVJZKTtcbiAgICAgICAgZGVzY3JpcHRpb25UaXRsZVR4dC5mb250U2l6ZSA9IDE2O1xuICAgICAgICBkZXNjcmlwdGlvblRpdGxlVHh0LmZpbGxzID0gRk9OVF9DT0xPUl9QUklNQVJZO1xuICAgICAgICBkZXNjcmlwdGlvblRpdGxlVHh0LmF1dG9SZW5hbWUgPSBmYWxzZTtcbiAgICAgICAgZGVzY3JpcHRpb25UaXRsZVR4dC5jaGFyYWN0ZXJzID0gXCJEZXNjcmlwdGlvblwiO1xuICAgICAgICBkZXNjcmlwdGlvblRpdGxlVHh0Lm5hbWUgPSBcIlRpdGxlXCI7XG4gICAgICAgIGRlc2NyaXB0aW9uVHh0LmZvbnROYW1lID0geWllbGQgdHJ5TG9hZGluZ0ZvbnQoRk9OVF9ERVNDUklQVElPTik7XG4gICAgICAgIGRlc2NyaXB0aW9uVHh0LmZvbnRTaXplID0gMTY7XG4gICAgICAgIGRlc2NyaXB0aW9uVHh0LmZpbGxzID0gRk9OVF9DT0xPUl9QUklNQVJZO1xuICAgICAgICBkZXNjcmlwdGlvblR4dC5hdXRvUmVuYW1lID0gZmFsc2U7XG4gICAgICAgIGRlc2NyaXB0aW9uVHh0LmNoYXJhY3RlcnMgPSBcIkRlc2NyaXB0aW9uXCI7XG4gICAgICAgIGRlc2NyaXB0aW9uVHh0Lm5hbWUgPSBERVNDUklQVElPTl9OQU1FO1xuICAgICAgICBhY2NlcHRhbmNlVHh0LmxheW91dEFsaWduID0gXCJTVFJFVENIXCI7XG4gICAgICAgIGRlc2NyaXB0aW9uVHh0LmxheW91dEFsaWduID0gXCJTVFJFVENIXCI7XG4gICAgICAgIHRpdGxlVHh0LmxheW91dEFsaWduID0gXCJTVFJFVENIXCI7XG4gICAgICAgIC8vIEZpeGVzIGEgd2VpcmQgYnVnIGluIHdoaWNoIHRoZSAnc3RyZXRjaCcgZG9lc250IHdvcmsgcHJvcGVybHlcbiAgICAgICAgaWRGcmFtZS5wcmltYXJ5QXhpc1NpemluZ01vZGUgPSBcIkFVVE9cIjtcbiAgICAgICAgaWRGcmFtZS5sYXlvdXRBbGlnbiA9IFwiU1RSRVRDSFwiO1xuICAgICAgICBkZXRhaWxzRnJhbWUucHJpbWFyeUF4aXNTaXppbmdNb2RlID0gXCJGSVhFRFwiO1xuICAgICAgICBkZXRhaWxzRnJhbWUubGF5b3V0QWxpZ24gPSBcIlNUUkVUQ0hcIjtcbiAgICAgICAgZGVzY3JpcHRpb25GcmFtZS5sYXlvdXRBbGlnbiA9IFwiU1RSRVRDSFwiO1xuICAgICAgICB0aWNrZXRWYXJpYW50LnZpc2libGUgPSB0cnVlO1xuICAgICAgICByZXR1cm4gdGlja2V0VmFyaWFudDtcbiAgICB9KTtcbn1cbi8qKlxuICogQ3JlYXRlcyB0aGUgbWFpbiBjb21wb25lbnQgZm9yIHRoZSB0aWNrZXRzXG4gKiBAcmV0dXJucyBUaGUgbWFpbiBjb21wb25lbnRcbiAqL1xuZnVuY3Rpb24gY3JlYXRlVGlja2V0Q29tcG9uZW50U2V0KCkge1xuICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgIGxldCB0aWNrZXRDb21wb25lbnQ7XG4gICAgICAgIC8vIENyZWF0ZSB2YXJpYW50cyAob25lIGZvciBlYWNoIHN0YXR1cylcbiAgICAgICAgbGV0IHZhckRlZmF1bHQgPSB5aWVsZCBjcmVhdGVUaWNrZXRWYXJpYW50KFZBUklBTlRfQ09MT1JfREVGQVVMVCwgQ09NUE9ORU5UX1NFVF9QUk9QRVJUWV9OQU1FICsgVkFSSUFOVF9OQU1FX0RFRkFVTFQpO1xuICAgICAgICBsZXQgdmFyMSA9IHlpZWxkIGNyZWF0ZVRpY2tldFZhcmlhbnQoVkFSSUFOVF9DT0xPUl8xLCBDT01QT05FTlRfU0VUX1BST1BFUlRZX05BTUUgKyBWQVJJQU5UX05BTUVfMSk7XG4gICAgICAgIGxldCB2YXIyID0geWllbGQgY3JlYXRlVGlja2V0VmFyaWFudChWQVJJQU5UX0NPTE9SXzIsIENPTVBPTkVOVF9TRVRfUFJPUEVSVFlfTkFNRSArIFZBUklBTlRfTkFNRV8yKTtcbiAgICAgICAgbGV0IHZhcjMgPSB5aWVsZCBjcmVhdGVUaWNrZXRWYXJpYW50KFZBUklBTlRfQ09MT1JfMywgQ09NUE9ORU5UX1NFVF9QUk9QRVJUWV9OQU1FICsgVkFSSUFOVF9OQU1FXzMpO1xuICAgICAgICBsZXQgdmFyNCA9IHlpZWxkIGNyZWF0ZVRpY2tldFZhcmlhbnQoVkFSSUFOVF9DT0xPUl80LCBDT01QT05FTlRfU0VUX1BST1BFUlRZX05BTUUgKyBWQVJJQU5UX05BTUVfNCk7XG4gICAgICAgIGxldCB2YXI1ID0geWllbGQgY3JlYXRlVGlja2V0VmFyaWFudChWQVJJQU5UX0NPTE9SX0RPTkUsIENPTVBPTkVOVF9TRVRfUFJPUEVSVFlfTkFNRSArIFZBUklBTlRfTkFNRV9ET05FKTtcbiAgICAgICAgbGV0IHZhckVycm9yID0geWllbGQgY3JlYXRlVGlja2V0VmFyaWFudChWQVJJQU5UX0NPTE9SX0VSUk9SLCBDT01QT05FTlRfU0VUX1BST1BFUlRZX05BTUUgKyBWQVJJQU5UX05BTUVfRVJST1IpO1xuICAgICAgICBjb25zdCB2YXJpYW50cyA9IFt2YXJEZWZhdWx0LCB2YXIxLCB2YXIyLCB2YXIzLCB2YXI0LCB2YXI1LCB2YXJFcnJvcl07XG4gICAgICAgIC8vIENyZWF0ZSBhIGNvbXBvbmVudCBvdXQgb2YgYWxsIHRoZXNlIHZhcmlhbnRzXG4gICAgICAgIHRpY2tldENvbXBvbmVudCA9IGZpZ21hLmNvbWJpbmVBc1ZhcmlhbnRzKHZhcmlhbnRzLCBmaWdtYS5jdXJyZW50UGFnZSk7XG4gICAgICAgIGxldCBwYWRkaW5nID0gMTY7XG4gICAgICAgIHRpY2tldENvbXBvbmVudC5uYW1lID0gQ09NUE9ORU5UX1NFVF9OQU1FO1xuICAgICAgICB0aWNrZXRDb21wb25lbnQubGF5b3V0TW9kZSA9IFwiVkVSVElDQUxcIjtcbiAgICAgICAgdGlja2V0Q29tcG9uZW50LmNvdW50ZXJBeGlzU2l6aW5nTW9kZSA9IFwiQVVUT1wiO1xuICAgICAgICB0aWNrZXRDb21wb25lbnQucHJpbWFyeUF4aXNTaXppbmdNb2RlID0gXCJBVVRPXCI7XG4gICAgICAgIHRpY2tldENvbXBvbmVudC5wYWRkaW5nVG9wID0gcGFkZGluZztcbiAgICAgICAgdGlja2V0Q29tcG9uZW50LnBhZGRpbmdSaWdodCA9IHBhZGRpbmc7XG4gICAgICAgIHRpY2tldENvbXBvbmVudC5wYWRkaW5nQm90dG9tID0gcGFkZGluZztcbiAgICAgICAgdGlja2V0Q29tcG9uZW50LnBhZGRpbmdMZWZ0ID0gcGFkZGluZztcbiAgICAgICAgdGlja2V0Q29tcG9uZW50Lml0ZW1TcGFjaW5nID0gMjQ7XG4gICAgICAgIHRpY2tldENvbXBvbmVudC5jb3JuZXJSYWRpdXMgPSA0O1xuICAgICAgICAvLyBTYXZlIGNvbXBvbmVudCBJRCBmb3IgbGF0ZXIgcmVmZXJlbmNlXG4gICAgICAgIERPQ1VNRU5UX05PREUuc2V0UGx1Z2luRGF0YShcInRpY2tldENvbXBvbmVudElEXCIsIHRpY2tldENvbXBvbmVudC5pZCk7XG4gICAgICAgIHRpY2tldENvbXBvbmVudC5zZXRSZWxhdW5jaERhdGEoe1xuICAgICAgICAgICAgc2V0X2xpYnJhcnlfY29tcG9uZW50OiBcIlB1Ymxpc2ggdGhlIGNvbXBvbmVudCBpbiBhIGxpYnJhcnkgYW5kIHRoZW4gY2xpY2sgdGhpcyBidXR0b24uXCIsXG4gICAgICAgIH0pO1xuICAgICAgICAvLyBNYWtlIHN1cmUgdGhlIGNvbXBvbmVudCBpcyB2aXNpYmxlIHdoZXJlIHdlJ3JlIGN1cnJlbnRseSBsb29raW5nXG4gICAgICAgIHRpY2tldENvbXBvbmVudC54ID0gZmlnbWEudmlld3BvcnQuY2VudGVyLnggLSB0aWNrZXRDb21wb25lbnQud2lkdGggLyAyO1xuICAgICAgICB0aWNrZXRDb21wb25lbnQueSA9IGZpZ21hLnZpZXdwb3J0LmNlbnRlci55IC0gdGlja2V0Q29tcG9uZW50LmhlaWdodCAvIDI7XG4gICAgICAgIHJldHVybiB0aWNrZXRDb21wb25lbnQ7XG4gICAgfSk7XG59XG4vKipcbiAqIENyZWF0ZXMgYSBuZXcgbWFpbiB0aWNrZXQgY29tcG9uZW50IG9yIGdldHMgdGhlIHJlZmVyZW5jZSB0byB0aGUgZXhpc3Rpbmcgb25lIGluIHRoZSBmb2xsb3dpbmcgb3JkZXI6XG4gKiAxLiBMb29rcyBmb3IgbG9jYWwgY29tcG9uZW50IGJhc2VkIG9uIGNvbXBvbmVudCBuYW1lXG4gKiAxLiBMb29rcyBmb3IgbGlicmFyeSBjb21wb25lbnQgYmFzZWQgb24gcHVibGljIGtleVxuICogMi4gTG9va3MgZm9yIGxpYnJhcnkgY29tcG9uZW50IGJhc2VkIG9uIHByaXZhdGUga2V5XG4gKiA1LiBDcmVhdGVzIGEgbmV3IGNvbXBvbmVudFxuICovXG5mdW5jdGlvbiByZWZlcmVuY2VUaWNrZXRDb21wb25lbnRTZXQoKSB7XG4gICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgLy8gSWYgdGhlcmUgaXMgYSBjb21wb25lbnQgc29tZXdoZXJlIHdpdGggdGhlIHJpZ2h0IG5hbWVcbiAgICAgICAgbGV0IGNvbXBvbmVudFNldHMgPSBmaWdtYS5yb290LmZpbmRBbGxXaXRoQ3JpdGVyaWEoe1xuICAgICAgICAgICAgdHlwZXM6IFtcIkNPTVBPTkVOVF9TRVRcIl0sXG4gICAgICAgIH0pO1xuICAgICAgICBjb21wb25lbnRTZXRzID0gY29tcG9uZW50U2V0cy5maWx0ZXIoKG5vZGUpID0+IG5vZGUubmFtZSA9PT0gQ09NUE9ORU5UX1NFVF9OQU1FKTtcbiAgICAgICAgaWYgKGNvbXBvbmVudFNldHNbMF0pIHtcbiAgICAgICAgICAgIHRpY2tldENvbXBvbmVudCA9IGNvbXBvbmVudFNldHNbMF07XG4gICAgICAgICAgICBET0NVTUVOVF9OT0RFLnNldFBsdWdpbkRhdGEoXCJ0aWNrZXRDb21wb25lbnRJRFwiLCB0aWNrZXRDb21wb25lbnQuaWQpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgLy8gSWYgdGhlcmUgaXMgbm8gbGlicmFyeSBjb21wb25lbnQsIHRyeSB0aGUgZ2V0IHRoZSB0aWNrZXQgY29tcG9uZW50IGJ5IGl0cyBJRFxuICAgICAgICAgICAgLy8gdmFyIHRpY2tldENvbXBvbmVudElkID0gRE9DVU1FTlRfTk9ERS5nZXRQbHVnaW5EYXRhKCd0aWNrZXRDb21wb25lbnRJRCcpXG4gICAgICAgICAgICAvLyBsZXQgbm9kZVxuICAgICAgICAgICAgLy8gaWYgKHRpY2tldENvbXBvbmVudElkICYmIChub2RlID0gZmlnbWEuZ2V0Tm9kZUJ5SWQodGlja2V0Q29tcG9uZW50SWQpKSkge1xuICAgICAgICAgICAgLy8gSWYgdGhlcmUgaXMgYW4gSUQgc2F2ZWQsIGFjY2VzcyB0aGUgdGlja2V0IGNvbXBvbmVudFxuICAgICAgICAgICAgLy8gdGlja2V0Q29tcG9uZW50ID0gbm9kZVxuICAgICAgICAgICAgLy8gfVxuICAgICAgICAgICAgLy8gZWxzZSB7XG4gICAgICAgICAgICAvL1RyeSB0byBnZXQgbGlicmFyeSBjb21wb25lbnQuLi5cbiAgICAgICAgICAgIC8vLi4uZnJvbSBjb21wb25lbnQga2V5IHNhdmVkIGluIHRoaXMgcHJvamVjdFxuICAgICAgICAgICAgdmFyIHB1YmxpY1RpY2tldENvbXBvbmVudEtleSA9IERPQ1VNRU5UX05PREUuZ2V0UGx1Z2luRGF0YShMSUJSQVJZX0NPTVBPTkVOVF9LRVkpO1xuICAgICAgICAgICAgbGV0IGxpYnJhcnlDb21wb25lbnQ7XG4gICAgICAgICAgICBpZiAocHVibGljVGlja2V0Q29tcG9uZW50S2V5ICYmXG4gICAgICAgICAgICAgICAgKGxpYnJhcnlDb21wb25lbnQgPSB5aWVsZCBpbXBvcnRMaWJyYXJ5Q29tcG9uZW50KHB1YmxpY1RpY2tldENvbXBvbmVudEtleSkpKSB7XG4gICAgICAgICAgICAgICAgdGlja2V0Q29tcG9uZW50ID0gbGlicmFyeUNvbXBvbmVudDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vLi4ub3IgZnJvbSBjb21wb25lbnQga2V5IHNhdmVkIHdpdGggdGhlIHVzZXJcbiAgICAgICAgICAgICAgICB2YXIgcHJpdmF0ZVRpY2tldENvbXBvbmVudEtleSA9IHlpZWxkIGZpZ21hLmNsaWVudFN0b3JhZ2UuZ2V0QXN5bmMoTElCUkFSWV9DT01QT05FTlRfS0VZKTtcbiAgICAgICAgICAgICAgICBpZiAocHJpdmF0ZVRpY2tldENvbXBvbmVudEtleSAmJlxuICAgICAgICAgICAgICAgICAgICAobGlicmFyeUNvbXBvbmVudCA9IHlpZWxkIGltcG9ydExpYnJhcnlDb21wb25lbnQocHJpdmF0ZVRpY2tldENvbXBvbmVudEtleSkpKSB7XG4gICAgICAgICAgICAgICAgICAgIERPQ1VNRU5UX05PREUuc2V0UGx1Z2luRGF0YShMSUJSQVJZX0NPTVBPTkVOVF9LRVksIHByaXZhdGVUaWNrZXRDb21wb25lbnRLZXkpOyAvLyBTYWZlIGtleSBwdWJsaWNseVxuICAgICAgICAgICAgICAgICAgICB0aWNrZXRDb21wb25lbnQgPSBsaWJyYXJ5Q29tcG9uZW50O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gSWYgdGhlcmUgaXMgbm8gY29tcG9uZW50LCBjcmVhdGUgYSBuZXcgY29tcG9uZW50XG4gICAgICAgICAgICAgICAgICAgIHRpY2tldENvbXBvbmVudCA9IHlpZWxkIGNyZWF0ZVRpY2tldENvbXBvbmVudFNldCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xufVxuZnVuY3Rpb24gaW1wb3J0TGlicmFyeUNvbXBvbmVudChrZXkpIHtcbiAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICB2YXIgbGlicmFyeUNvbXBvbmVudDtcbiAgICAgICAgeWllbGQgZmlnbWFcbiAgICAgICAgICAgIC5pbXBvcnRDb21wb25lbnRTZXRCeUtleUFzeW5jKGtleSlcbiAgICAgICAgICAgIC50aGVuKChyZXN1bHQpID0+IHtcbiAgICAgICAgICAgIGxpYnJhcnlDb21wb25lbnQgPSByZXN1bHQ7XG4gICAgICAgIH0pXG4gICAgICAgICAgICAuY2F0Y2goKCkgPT4ge1xuICAgICAgICAgICAgbGlicmFyeUNvbXBvbmVudCA9IGZhbHNlO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGxpYnJhcnlDb21wb25lbnQ7XG4gICAgfSk7XG59XG4vLyBDaGVja3MgaWYgZmV0Y2hpbmcgZGF0YSB3YXMgc3VjY2Vzc2Z1bCBhdCBhbGxcbmZ1bmN0aW9uIGNoZWNrRmV0Y2hTdWNjZXNzKGRhdGEpIHtcbiAgICB2YXIgaXNTdWNjZXNzID0gZmFsc2U7XG4gICAgLy8gQ2FuIHRoaXMgZXZlbiBoYXBwZW4/XG4gICAgaWYgKCFkYXRhKSB7XG4gICAgICAgIGZpZ21hLm5vdGlmeShcIlNvbWV0aGluZyB3ZW50IHdyb25nLlwiKTtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiU29tZXRoaW5nIHdlbnQgd3JvbmcuXCIgKyBkYXRhKTtcbiAgICB9XG4gICAgLy8gTm8gY29ubmVjdGlvbiB0byBGaXJlYmFzZVxuICAgIGVsc2UgaWYgKGRhdGEudHlwZSA9PSBcIkVycm9yXCIpIHtcbiAgICAgICAgZmlnbWEubm90aWZ5KFwiQ291bGQgbm90IGdldCBkYXRhLiBUaGVyZSBzZWVtcyB0byBiZSBubyBjb25uZWN0aW9uIHRvIHRoZSBzZXJ2ZXIuXCIpO1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoZGF0YS5tZXNzYWdlKTtcbiAgICB9XG4gICAgLy8gV3JvbmcgZS1tYWlsXG4gICAgZWxzZSBpZiAoZGF0YVswXS5tZXNzYWdlID09IFwiQ2xpZW50IG11c3QgYmUgYXV0aGVudGljYXRlZCB0byBhY2Nlc3MgdGhpcyByZXNvdXJjZS5cIikge1xuICAgICAgICBmaWdtYS5ub3RpZnkoXCJZb3UgaGF2ZSBlbnRlcmVkIGFuIGludmFsaWQgZS1tYWlsLiBTZWUgJ0F1dGhvcml6YXRpb24nIHNldHRpbmdzLlwiKTtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGRhdGEubWVzc2FnZSk7XG4gICAgfVxuICAgIC8vIFdyb25nIGNvbXBhbnkgbmFtZVxuICAgIGVsc2UgaWYgKGRhdGFbMF0uZXJyb3JNZXNzYWdlID09IFwiU2l0ZSB0ZW1wb3JhcmlseSB1bmF2YWlsYWJsZVwiKSB7XG4gICAgICAgIGZpZ21hLm5vdGlmeShcIkNvbXBhbnkgZG9tYWluIG5hbWUgZG9lcyBub3QgZXhpc3QuIFNlZSAnUHJvamVjdCBTZXR0aW5ncycuXCIpO1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoZGF0YVswXS5lcnJvck1lc3NhZ2UpO1xuICAgIH1cbiAgICAvLyBXcm9uZyBwYXNzd29yZFxuICAgIGVsc2UgaWYgKGRhdGFbMF1bMF0pIHtcbiAgICAgICAgZmlnbWEubm90aWZ5KFwiQ291bGQgbm90IGFjY2VzcyBkYXRhLiBZb3VyIEppcmEgQVBJIFRva2VuIHNlZW1zIHRvIGJlIGludmFsaWQuIFNlZSAnQXV0aG9yaXphdGlvbicgc2V0dGluZ3MuXCIpO1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoZGF0YVswXVswXSk7XG4gICAgfVxuICAgIC8vIEVsc2UsIGl0IHdhcyBwcm9iYWJseSBzdWNjZXNzZnVsXG4gICAgZWxzZSB7XG4gICAgICAgIGlzU3VjY2VzcyA9IHRydWU7XG4gICAgfVxuICAgIHJldHVybiBpc1N1Y2Nlc3M7XG59XG4vLyBDaGVja3MgaWYgcGVyIHJlY2VpdmVkIHRpY2tldCBkYXRhIGlmIHRoZSBmZXRjaGluZyB3YXMgc3VjY2Vzc2Z1bFxuZnVuY3Rpb24gY2hlY2tUaWNrZXREYXRhUmVwb25zZSh0aWNrZXREYXRhLCBpc3N1ZUlkKSB7XG4gICAgdmFyIGNoZWNrZWREYXRhO1xuICAgIC8vIElmIHRoZSBKU09OIGhhcyBhIGtleSBmaWVsZCwgdGhlIGRhdGEgaXMgdmFsaWRcbiAgICBpZiAodGlja2V0RGF0YSAmJiB0aWNrZXREYXRhLmtleSkge1xuICAgICAgICBjaGVja2VkRGF0YSA9IHRpY2tldERhdGE7XG4gICAgfVxuICAgIC8vIElEIGRvZXMgbm90IGV4aXN0XG4gICAgZWxzZSBpZiAodGlja2V0RGF0YS5lcnJvck1lc3NhZ2VzKSB7XG4gICAgICAgIGNoZWNrZWREYXRhID0gY3JlYXRlRXJyb3JEYXRhSlNPTihgRXJyb3I6ICR7dGlja2V0RGF0YS5lcnJvck1lc3NhZ2VzfWAsIGlzc3VlSWQpO1xuICAgICAgICAvLyBmaWdtYS5ub3RpZnkoYFRpY2tldCBJRCAnJHtpc3N1ZUlkfScgZG9lcyBub3QgZXhpc3QuYClcbiAgICB9XG4gICAgLy8gT3RoZXJcbiAgICBlbHNlIHtcbiAgICAgICAgY2hlY2tlZERhdGEgPSBjcmVhdGVFcnJvckRhdGFKU09OKFwiRXJyb3I6IEFuIHVuZXhwZWN0ZWQgZXJyb3Igb2NjdXJlZC5cIiwgaXNzdWVJZCk7XG4gICAgICAgIGZpZ21hLm5vdGlmeShcIlVuZXhwZWN0ZWQgZXJyb3IuXCIpO1xuICAgICAgICBjb25zb2xlLmVycm9yKFwiVW5leHBlY3RlZCBlcnJvci5cIiwgdGlja2V0RGF0YSk7XG4gICAgICAgIC8vIHRocm93IG5ldyBFcnJvcih0aWNrZXREYXRhLm1lc3NhZ2UpXG4gICAgfVxuICAgIHJldHVybiBjaGVja2VkRGF0YTtcbn1cbi8vIENyZWF0ZSBhIGVycm9yIHZhcmlhYmxlIHRoYXQgaGFzIHRoZSBzYW1lIG1haW4gZmllbGRzIGFzIHRoZSBKaXJhIFRpY2tldCB2YXJpYWJsZS5cbi8vIFRoaXMgd2lsbCBiZSB1c2VkIHRoZSBmaWxsIHRoZSB0aWNrZXQgZGF0YSB3aXRoIHRoZSBlcnJvciBtZXNzYWdlLlxuZnVuY3Rpb24gY3JlYXRlRXJyb3JEYXRhSlNPTihtZXNzYWdlLCBpc3N1ZUlkKSB7XG4gICAgdmFyIHRvZGF5ID0gbmV3IERhdGUoKS50b0lTT1N0cmluZygpO1xuICAgIHZhciBlcnJvckRhdGEgPSB7XG4gICAgICAgIGtleTogaXNzdWVJZCxcbiAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgICBzdW1tYXJ5OiBtZXNzYWdlLFxuICAgICAgICAgICAgc3RhdHVzOiB7XG4gICAgICAgICAgICAgICAgbmFtZTogXCJFcnJvclwiLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHN0YXR1c2NhdGVnb3J5Y2hhbmdlZGF0ZTogdG9kYXksXG4gICAgICAgIH0sXG4gICAgfTtcbiAgICByZXR1cm4gZXJyb3JEYXRhO1xufVxuZnVuY3Rpb24gdHJ5TG9hZGluZ0ZvbnQoZm9udE5hbWUpIHtcbiAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICB2YXIgbG9hZGVkRm9udCA9IEZPTlRfREVGQVVMVDtcbiAgICAgICAgeWllbGQgZmlnbWFcbiAgICAgICAgICAgIC5sb2FkRm9udEFzeW5jKGZvbnROYW1lKVxuICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgbG9hZGVkRm9udCA9IGZvbnROYW1lO1xuICAgICAgICB9KVxuICAgICAgICAgICAgLmNhdGNoKCgpID0+IHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRm9udCAnXCIgK1xuICAgICAgICAgICAgICAgIGZvbnROYW1lLmZhbWlseSArXG4gICAgICAgICAgICAgICAgXCInIGNvdWxkIG5vdCBiZSBsb2FkZWQuIFBsZWFzZSBpbnN0YWxsIG9yIGNoYW5nZSB0aGUgY29tcG9uZW50IGZvbnQuXCIpO1xuICAgICAgICAgICAgVU5MT0FERURfRk9OVFMuYWRkKGZvbnROYW1lLmZhbWlseSk7XG4gICAgICAgICAgICBsb2FkZWRGb250ID0gRk9OVF9ERUZBVUxUO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGxvYWRlZEZvbnQ7XG4gICAgfSk7XG59XG4vLyBGb3JtYXRzIGEgaGV4IHZhbHVlIHRvIFJHQlxuZnVuY3Rpb24gaGV4VG9SZ2IoaGV4KSB7XG4gICAgdmFyIGJpZ2ludCA9IHBhcnNlSW50KGhleCwgMTYpO1xuICAgIHZhciByID0gKGJpZ2ludCA+PiAxNikgJiAyNTU7XG4gICAgdmFyIGcgPSAoYmlnaW50ID4+IDgpICYgMjU1O1xuICAgIHZhciBiID0gYmlnaW50ICYgMjU1O1xuICAgIHJldHVybiB7IHI6IHIgLyAyNTUsIGc6IGcgLyAyNTUsIGI6IGIgLyAyNTUgfTtcbn1cbiIsIiIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgaXMgcmVmZXJlbmNlZCBieSBvdGhlciBtb2R1bGVzIHNvIGl0IGNhbid0IGJlIGlubGluZWRcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0ge307XG5fX3dlYnBhY2tfbW9kdWxlc19fW1wiLi9zcmMvY29kZS50c1wiXSgpO1xuIiwiIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9