import React from 'react'
import { Nav, Navbar, Button } from 'react-bootstrap/'
import GitHubAuth from './GitHubAuth'

class TopNav extends React.Component {
  
  state = {
    showGitHubAuthForm: false,
  }

  openGitHubAuthForm = () => {
    this.setState({
      showGitHubAuthForm: true
    })
  }

  hideGitHubAuthForm = () => {
    this.setState({
      showGitHubAuthForm: false
    })
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
        <Button onClick={this.openGitHubAuthForm}>GitHub Authentication</Button>
        <GitHubAuth show={this.state.showGitHubAuthForm} handleClose={this.hideGitHubAuthForm}/>
      </Navbar>
    )
  }
}

export default TopNav;