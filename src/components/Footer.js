import React from 'react'
import { Navbar, Nav } from 'react-bootstrap/'
import GitHubButton from 'react-github-btn'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub, faTwitter } from '@fortawesome/free-brands-svg-icons'
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';


const starTrackGitHubRepo = "https://github.com/seladb/startrack-js"
const seladbGitHubUser = "https://github.com/seladb"
const seladbTwitter = "https://twitter.com/seladb"
const seladbEmail = "mailto:pcapplusplus@gmail.com"

class Footer extends React.Component {

  render() {
    let footerPosition = this.props.pageEmpty ? "fixed-bottom" : "";
    return (
      <Navbar bg="light" sticky="bottom" className={footerPosition}>
        <Navbar.Text className="mr-2">Created by</Navbar.Text>
        <GitHubButton href={seladbGitHubUser} data-size="large" aria-label="@seladb">@seladb</GitHubButton>
        <Navbar.Text className="ml-2 mr-2">Give us a star:</Navbar.Text>
        <GitHubButton 
          href={starTrackGitHubRepo} 
          data-icon="octicon-star" 
          data-size="large" 
          data-show-count="true" 
          aria-label="Star StarTrack on GitHub"
        >Star</GitHubButton>
        <Nav className="mr-auto"/>
        <Nav>
          <Nav.Link href={seladbGitHubUser} target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faGithub} className="mr-1"/>
          </Nav.Link>
          <Nav.Link href={seladbTwitter} target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faTwitter} className="mr-1"/>
          </Nav.Link>
          <Nav.Link href={seladbEmail} target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faEnvelope} className="mr-1"/>
          </Nav.Link>
        </Nav>
      </Navbar>
    )
  }
}

export default Footer