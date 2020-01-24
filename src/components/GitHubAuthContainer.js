import React from 'react'
import GitHubAuthBtn from './GitHubAuthBtn'
import GitHubAuthForm from './GitHubAuthForm'
import gitHubUtils from '../utils/GitHubUtils'

class GitHubAuthContainer extends React.Component {

  state = {
    showGitHubAuthForm: false,
    accessToken: gitHubUtils.getAccessToken()
  }

  openGitHubAuthForm = () => {
    this.setState({
      showGitHubAuthForm: true
    })
  }

  hideGitHubAuthForm = () => {
    this.setState({
      showGitHubAuthForm: false,
      accessToken: gitHubUtils.getAccessToken()
    })
  }

  handleLoginSuccess = () => {
    this.setState({
      showGitHubAuthForm: false,
      accessToken: gitHubUtils.getAccessToken()
    })
  }

  handleLogOut = () => {
    gitHubUtils.removeAccessToken();
    this.setState({
      accessToken: gitHubUtils.getAccessToken()
    })
  }  

  render() {
    return (
      <div>
        <GitHubAuthBtn onLoginClick={this.openGitHubAuthForm} onLogoutClick={this.handleLogOut} accessToken={this.state.accessToken}/>
        <GitHubAuthForm show={this.state.showGitHubAuthForm} handleClose={this.hideGitHubAuthForm} handleLoginSuccess={this.handleLoginSuccess}/>
      </div>
    )
  }
}

export default GitHubAuthContainer