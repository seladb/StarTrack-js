import React from 'react'
import { Nav, Navbar, Button } from 'react-bootstrap/'
import GitHubAuth from './GitHubAuth'

class TopNav extends React.Component {
  
  state = {
    showGitHubAuthForm: false,
    isLoggedIn: false,
  }

  openGitHubAuthForm = () => {
    this.setState({
      showGitHubAuthForm: true
    })
  }

  handleLogOut = () => {
    window.sessionStorage.setItem('access_token', '');
    this.setState({
      isLoggedIn: false
    })  
  }

  hideGitHubAuthForm = () => {
    this.setState({
      showGitHubAuthForm: false
    })
  }

  handleLoginSuccess = () => {
    this.setState({
      showGitHubAuthForm: false,
      isLoggedIn: true,
    })
  }

  isLoggedIn() {
    return this.state.isLoggedIn
  }

  render() {
    return (
      <Navbar bg="primary" variant="dark">
        <Navbar.Brand href="#home">
          <img
            alt=""
            src="/star-icon.png"
            width="30"
            height="30"
            className="d-inline-block align-top"
          />{' '}
          StarTrack
        </Navbar.Brand>
        <Nav className="mr-auto"/>
        { this.state.isLoggedIn === false ? <Button onClick={this.openGitHubAuthForm}>GitHub Authentication</Button> : null }
        { this.state.isLoggedIn === true ? <Navbar.Text>{`Signed in as: '${window.sessionStorage.getItem('access_token').substring(0, 6)}'` }</Navbar.Text> : null }
        { this.state.isLoggedIn === true ? <Button onClick={this.handleLogOut}>Log Out</Button> : null }
        <GitHubAuth show={this.state.showGitHubAuthForm} handleClose={this.hideGitHubAuthForm} handleLoginSuccess={this.handleLoginSuccess} />
      </Navbar>
    )
  }
}

export default TopNav;