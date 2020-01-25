import React from 'react'
import { Nav, Navbar } from 'react-bootstrap/'
import GitHubAuthContainer from './GitHubAuthContainer'

class TopNav extends React.Component {
  
  render() {
    return (
      <Navbar bg="primary" variant="dark">
        <Navbar.Brand href="/">
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
        <GitHubAuthContainer />
      </Navbar>
    )
  }
}

export default TopNav;