// All the functions used to to call the Firebase server and fetch data

// const BASELINK = "http://localhost:5000/figma-jira-plugin-function/us-central1" // To test locally with Firebase emulator
const BASELINK = "https://us-central1-figma-jira-plugin-function.cloudfunctions.net"
const FIREBASE_URL_GET_ISSUES = `${BASELINK}/getIssue`
const FIREBASE_URL_POST_LINK = `${BASELINK}/postLinkToIssue`
const FIREBASE_URL_TEST_AUTHENTICATION = `${BASELINK}/testAuthentication`


/**
 * Fetch ticket info from Jira (via Firebase function)
 * If fetching fails for some reason, return a JSON file with error data
 * @param issueIds Array of issue keys (e.g [ FIG-12, FIG-1, FIG-4 ])
 * @param basicAuth Basic auth created as base64 string 
 * @param companyName Atlassian domain name of company
 * @returns Array of ticket JSON data
 */
export async function getTicketDataFromJira(issueIds, basicAuth, companyName) {
  var jsonArray
  var config = {
    method: 'POST',
    body: JSON.stringify({
      basicAuth: basicAuth,
      companyName: companyName,
      issueIds: issueIds
    })
  };

  await fetchWithTimeout(FIREBASE_URL_GET_ISSUES, config)
    .then((response: Response) => {
      return response.json()
    })
    .then((data) => {
      jsonArray = data
    })
    .catch((error: Error) => {
      console.error('Could not access Firebase.', error.message)
      const responseError = {
        type: 'Error',
        message: error.message || 'Something went wrong',
      };
      jsonArray = responseError
    })
  return jsonArray
}

/**
 * Add a link of the Figma node into the Jira issue
 * @param issueId Issue Key (e.g FIG-1)
 * @param link Link that should be added to the issue
 * @param basicAuth Basic auth created as base64 string 
 * @param companyName Atlassian domain URL of company
 * @returns JSON about success
 */
export async function postLinkToIssue(issueId, link, basicAuth, companyName) {

  var bodyData = {
    "object": {
      "url": link,
      "title": "Design Reference",
      "icon": {
        "url16x16": "https://static.figma.com/app/icon/1/favicon.png"
      }
    }
  }
  var config = {
    method: 'POST',
    body: JSON.stringify({
      basicAuth: basicAuth,
      companyName: companyName,
      issueId: issueId,
      bodyData: bodyData
    })
  };
  var response
  await fetchWithTimeout(FIREBASE_URL_POST_LINK, config)
    .then((response: Response) => {
      return response.json()
    })
    .then((data) => {
      response = data
      console.log("Data", data)
    })
    .catch((error: Error) => {
      console.log("Error", error)
      response = error
    })
  return response
}

/**
 * Test if user has entered the correct authentication details
 * @param basicAuth Basic auth created as base64 string 
 * @param companyName Atlassian domain URL of company
 * @returns JSON of information about user
 */
export async function testAuthentication(basicAuth, companyName) {
  var config = {
    method: 'POST',
    body: JSON.stringify({
      basicAuth: basicAuth,
      companyName: companyName
    })
  };
  var response
  await fetchWithTimeout(FIREBASE_URL_TEST_AUTHENTICATION, config)
    .then((response: Response) => {
      return response.json()
    })
    .then((data) => {
      response = data
    })
    .catch((error: Error) => {
      response = error
    })
  return response
}

// Adds a timeout to the fetch operation
function fetchWithTimeout(url, options, timeout = 10000) {
  return Promise.race([
    fetch(url, options),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Timeout: It took too long for the server to respond.')), timeout)
    )
  ]);
}





