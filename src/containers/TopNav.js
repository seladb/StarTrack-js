import React from 'react'
import { Nav, Navbar, Button } from 'react-bootstrap/'

function TopNav() {
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
      <Button>GitHub Authentication</Button>
    </Navbar>
  )
}

export default TopNav;