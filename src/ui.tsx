import * as React from 'react'
import { useState, useRef } from 'react'
import * as ReactDOM from 'react-dom'
import './ui.css'

import { Icon, Text, Title, Label, Button, Checkbox, Tip } from "react-figma-plugin-ds"
import "react-figma-plugin-ds/figma-plugin-ds.css";
import { getTicketDataFromJira, postLinkToIssue, testAuthentication } from './fetch-data'

import { Buffer } from 'buffer';
import { auth } from 'firebase'

declare function require(path: string): any

const COMPANY_NAME_KEY = "COMPANY_NAME"
const PROJECT_ID_KEY = "PROJECT_ID"
const USERNAME_KEY = "USERNAME"
const PASSWORD_KEY = "PASSWORD"
const ISSUE_ID_KEY = "ISSUE_ID"
const CREATE_LINK_KEY = "CREATE_LINK"

function App() {
  const [companyName, setCompanyName] = useState("")
  const [projectId, setProjectId] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [issueId, setIssueId] = useState("")

  const [companyNameError, setCompanyNameError] = useState("")
  const [usernameError, setUsernameError] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [issueIdError, setIssueIdError] = useState("")
  const [generalError, setGeneralError] = useState("")

  const [showAuth, setShowAuth] = useState(true)
  const [showAuthForOnboarding, setShowAuthForOnboarding] = useState(true)
  const [showInput, setShowInput] = useState(false)
  const [createLink, setCreateLink] = useState(true)

  const companyNameInput = useRef(null)
  const projectIdInput = useRef(null)
  const usernameInput = useRef(null)
  const passwordInput = useRef(null)

  window.onmessage = async (event) => {

    // Fetches tickeet data and sends it to sandbox
    if (event.data.pluginMessage.type === 'getTicketData') {
      var issueIds = event.data.pluginMessage.issueIds
      var nodeIds = event.data.pluginMessage.nodeIds

      let basicAuth: string = Buffer.from(username + ':' + password).toString('base64')
      var ticketDataArray = await getTicketDataFromJira(issueIds, basicAuth, companyName)
      parent.postMessage({ pluginMessage: { issueIds: issueIds, nodeIds: nodeIds, data: ticketDataArray, type: 'ticketDataSent' } }, '*')
    }

    // Fills the authorization variables with the data stored in the sandbox (clientStorage)
    if (event.data.pluginMessage.type === 'setAuthorizationVariables') {
      let companyName = event.data.pluginMessage.company_name
      let projectId = event.data.pluginMessage.project_id
      let username = event.data.pluginMessage.username
      let password = event.data.pluginMessage.password
      let issueId = event.data.pluginMessage.issueId
      let createLink = event.data.pluginMessage.createLink

      setCompanyName(companyName)
      setProjectId(projectId)
      setUsername(username)
      setPassword(password)
      setIssueId(issueId.replace(/[1-9]*$/, ""))
      setCreateLink(createLink)

      var notAllAuthDataEntered = companyName === "" || username === "" || password === ""
      setShowAuth(notAllAuthDataEntered)
      setShowAuthForOnboarding(notAllAuthDataEntered)
      parent.postMessage({ pluginMessage: { type: 'resize-ui', big_size: notAllAuthDataEntered } }, '*')

    }

    // Posts a link of the Jira header component into the Jira issue
    if (event.data.pluginMessage.type === 'post-link-to-jira-issue') {
      let link = event.data.pluginMessage.link
      let issueId = event.data.pluginMessage.issueId
      let basicAuth: string = Buffer.from(username + ':' + password).toString('base64')
      let response = await postLinkToIssue(issueId, link, basicAuth, companyName)
      if (!response.self) parent.postMessage({ pluginMessage: { type: 'create-visual-bell', message: "Could not add component link to Jira ticket." } }, '*')
    }
  }

  // Fetches ticket data and calls sandbox to add a new ticket with that data
  const onCreateTicket = async () => {
    if (issueId === "") {
      setIssueIdError("Please enter a ticket ID.")
    } else {
      setIssueIdError("")
      const basicAuth = Buffer.from(username + ':' + password).toString('base64')
      var ticketDataArray = await getTicketDataFromJira([issueId], basicAuth, companyName)
      parent.postMessage({ pluginMessage: { type: 'create-new-ticket', data: ticketDataArray, issueIds: [issueId], createLink: createLink } }, '*')
      setIssueId(issueId.replace(/[1-9]*$/, ""))
    }
  }

  // Start the process to update all selected ticket headers
  const onUpdateSelected = () => {
    parent.postMessage({ pluginMessage: { type: 'update-selected' } }, '*')
  }

  // Start the process to update all ticket headers on page
  const onUpdateAll = () => {
    parent.postMessage({ pluginMessage: { type: 'update-all' } }, '*')
  }

  // Creates a new main component (used for development purposes)
  const onCreateComponent = () => {
    parent.postMessage({ pluginMessage: { type: 'create-component' } }, '*')
  }

  // Change the view beetween the main view and the authorization view
  const switchView = () => {
    setShowAuth(!showAuth)
    parent.postMessage({ pluginMessage: { type: 'resize-ui', big_size: !showAuth } }, '*')
    setCompanyNameError("")
    setUsernameError("")
    setPasswordError("")
  }

  // Toggle between wether a link should be created in the Jira ticket
  const toggleCreateLink = () => {
    setCreateLink(!createLink)
    parent.postMessage({ pluginMessage: { type: 'authorization-detail-changed', key: CREATE_LINK_KEY, data: !createLink, save_public: false } }, '*')
  }

  // Toggles the password field between show/hide password
  const switchShowInput = () => {
    setShowInput(!showInput)
  }

  // Saves the current field input in the sandbox
  const onInputFieldChanged = (value, key) => {
    if (key === ISSUE_ID_KEY) setIssueId(value)
    // else if (key === COMPANY_NAME_KEY) setCompanyName(value)
    // else if (key === USERNAME_KEY) setUsername(value)
    // else if (key === PASSWORD_KEY) setPassword(value)
    parent.postMessage({ pluginMessage: { type: 'authorization-detail-changed', key: key, data: value, save_public: false } }, '*')
  }

  // Saves the authorization details in the sandbox
  const onSaveAuthDetails = () => {
    var companyName = companyNameInput.current.value
    var projectId = projectIdInput.current.value
    var username = usernameInput.current.value
    var password = passwordInput.current.value

    setCompanyNameError("")
    setUsernameError("")
    setPasswordError("")
    setGeneralError("")

    var allCredentialsProvided = true
    if (companyName === "") {
      setCompanyNameError("Please enter a company domain name.")
      allCredentialsProvided = false
    }
    if (username === "") {
      setUsernameError("Please enter a username.")
      allCredentialsProvided = false
    }
    if (password === "") {
      setPasswordError("Please enter an API token.")
      allCredentialsProvided = false
    }

    if (allCredentialsProvided) checkAuthenticationAndSaveData(username, password, companyName, projectId)
  }

  // Hit enter to create a new ticket
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      onCreateTicket()
    }
  }


  // Checks if user has entered the correct credentials
  async function checkAuthenticationAndSaveData(username, password, companyName, projectId) {
    const basicAuth = Buffer.from(username + ':' + password).toString('base64')
    let authData = await testAuthentication(basicAuth, companyName)

    var isSuccess = false
    // Can this even happen?
    if (!authData) {
      setGeneralError("Authentication failed.")
      throw new Error("Something went wrong, no data received.")
    }
    // If it has self, it was successfull
    else if (authData.self) {
      isSuccess = true
    }
    else if (authData.message) {
      // Wrong credentials
      if (authData.message === "Request failed with status code 401") {
        setUsernameError("E-mail or API token invalid.")
        setPasswordError("E-mail or API token invalid.")
      } else if (authData.message === "Request failed with status code 404") {
        setCompanyNameError("Company domain name does not exist.")
      } 
      // No internet
      else if (authData.message === "Failed to fetch") {
        setGeneralError("Authentication failed. There seems to be no connection to the server.")
        throw new Error(authData.message)
      } else {
        setGeneralError("Authentication failed. There seems to be no connection to Jira.")
        throw new Error(authData.message)
      }
    }
    else {
      setGeneralError("Authentication failed.")
      throw new Error("Something went wrong. " + JSON.stringify(authData))
    }

    // Save data is authentication successfull
    if (isSuccess) {
      setCompanyName(companyName)
      setProjectId(projectId)
      setUsername(username)
      setPassword(password)

      parent.postMessage({ pluginMessage: { type: 'authorization-detail-changed', key: COMPANY_NAME_KEY, data: companyName, save_public: true } }, '*')
      parent.postMessage({ pluginMessage: { type: 'authorization-detail-changed', key: PROJECT_ID_KEY, data: projectId, save_public: true } }, '*')
      parent.postMessage({ pluginMessage: { type: 'authorization-detail-changed', key: USERNAME_KEY, data: username, save_public: false } }, '*')
      parent.postMessage({ pluginMessage: { type: 'authorization-detail-changed', key: PASSWORD_KEY, data: password, save_public: false } }, '*')
      parent.postMessage({ pluginMessage: { type: 'create-visual-bell', message: "Saved." } }, '*')

      setShowAuthForOnboarding(false)
      switchView()
    }
  }



  // UI - changes between authorisation view and main view
  return <>
    {showAuth ?
      // Authorization view
      <>
        <div className='vertical padding-small divider'>
          {showAuthForOnboarding && <Title level="h1" size="" weight="bold">Welcome to Jira Ticket Sync!</Title>}
          <div className='tip'>
            {showAuthForOnboarding && <Tip>Before you start, please enter the following information.</Tip>}
          </div>
          <div className='section-title-with-icon'>
            <Title level="h2" size="" weight="bold">Jira Authentication</Title>
          </div>
          {/* <Label>Stored privately.</Label> */}
          <div className='row'>
            <div>
              <Text>E-Mail</Text>
              <div className="input">
                <input ref={usernameInput} type="input" className="input__field" defaultValue={username} placeholder="e.g. jeff@google.com" />
              </div>
              {usernameError.length > 0 &&
                <Text className="error-text">{usernameError}</Text>
              }
            </div>
          </div>
          <div className='row'>
            <div>
              <Text>API Token</Text>
              <div className='horizontal'>
                <div className="input" style={{ width: 178 }}>
                  <input ref={passwordInput} type={showInput ? 'text' : 'password'} className="input__field stretch" defaultValue={password} placeholder="e.g. A90SjdsS8MKLASsa9767" />
                </div>
                {showInput ?
                  <Icon color="black8" name="visible" onClick={switchShowInput} />
                  : <Icon color="black8" name="hidden" onClick={switchShowInput} />}
              </div>
              {passwordError.length > 0 &&
                <Text className="error-text">{passwordError}</Text>
              }
              <Button isTertiary onClick={function _() { window.open("https://id.atlassian.com/manage-profile/security/api-tokens", "_blank") }}>Create API token here.</Button>
            </div>
          </div>
        </div>
        <div className='vertical padding-small'>
          <div className='section-title-with-icon'>
            <Title level="h2" size="" weight="bold">Project Settings</Title>
          </div>
          <Label>This information is stored across all members of this project.</Label>
          <div className='row'>
            <div>
              <div>
                <Text>Company Domain Name </Text>
              </div>
              <div className="input">
                <input ref={companyNameInput} type="input" className="input__field" defaultValue={companyName} placeholder="e.g. parkside-interactive" />
              </div>
              {companyNameError.length > 0 &&
                <Text className="error-text">{companyNameError}</Text>
              }
              <div className='type black3'>www.<b>company-name</b>.atlassian.net</div>
            </div>
          </div>
          <div className='row'>
            <div>
              <div>
                <Text>Project ID <i>(optional)</i></Text>
              </div>
              <div className="input">
                <input ref={projectIdInput} type="input" className="input__field" defaultValue={projectId} placeholder="e.g. dKmrEsaDQNNKeXHISLF6l7E" />
              </div>
              <Text></Text>
              <div className='type black3'>
                Allows you to link new Figma components in the respective Jira tickets.
                <ol style={{ paddingLeft: 20 }}>
                  <li>Create a shareable project link.</li>
                  <li>The ID is part of the link. <br />figma.com/file/<b>--ID--</b>/project-name</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
        <div className='sticky'>
          {generalError.length > 0 &&
            <Text className="error-text padding-lr-8">{generalError}</Text>
          }
          <div className='horizontal align-right padding-small'>
            {showAuthForOnboarding && <Button className="" id="create-component" onClick={function _() { onSaveAuthDetails() }}>Save</Button>}
            {!showAuthForOnboarding && <Button className="" isSecondary id="create-component" onClick={function _() { switchView() }}>Back</Button>}
            {!showAuthForOnboarding && <Button className="" id="create-component" onClick={function _() { onSaveAuthDetails() }}>Save Changes</Button>}
          </div>
        </div>
      </>
      :
      // Main view
      <div>
        <div className='vertical padding-small divider'>
          <div className='section-title-with-icon'>
            <Title level="h2" size="" weight="bold">Add</Title>
            <Icon color="black8" name="adjust" onClick={function _() { switchView() }} />
          </div>
          <div className='horizontal padding-small'>
            <div>
              <div className="input">
                <input type="input" autoFocus className="input__field" value={issueId} placeholder="Ticket ID (e.g. PR-3)"
                  onKeyDown={handleKeyDown} onChange={(event) => { onInputFieldChanged(event.target.value, ISSUE_ID_KEY) }} />
              </div>
              {issueIdError.length > 0 &&
                <Text className="error-text">{issueIdError}</Text>
              }
            </div>
            <Button className="" id="create-new-ticket" onClick={onCreateTicket}>Add Ticket</Button>
          </div>
          <div className="checkbox">
            <input id="createLinkCheckbox" type="checkbox" className="checkbox__box" onChange={toggleCreateLink} checked={createLink && projectId != ""} disabled={projectId == ""} />
            <label htmlFor="createLinkCheckbox" className="checkbox__label">Link new component in Jira ticket</label>
          </div>
        </div>
        <div className='vertical padding-small'>
          <Title level="h2" size="" weight="bold">Update</Title>
          <div className='padding-small'>
            <Button className="margin-small" isSecondary id="update-selected" onClick={onUpdateSelected}>Update Selected</Button>
            <Button className="margin-small" isSecondary id="update-page" onClick={onUpdateAll}>Update Page</Button>
            <Button className="margin-small" isSecondary id="update-all" onClick={onUpdateAll}>Update All in Document</Button>
            {/* <Button className="margin-small" isSecondary id="create-component" onClick={onCreateComponent}>Create new</Button> */}
          </div>
        </div>
      </div>
    }
  </>
}


ReactDOM.render(<App />, document.getElementById('react-page'))

