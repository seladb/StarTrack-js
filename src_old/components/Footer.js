import React from "react";
import PropTypes from "prop-types";
import { Navbar, Nav } from "react-bootstrap/";
import GitHubButton from "react-github-btn";
import { useMediaQuery } from "react-responsive";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faTwitter } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";

const starTrackGitHubRepo = "https://github.com/seladb/startrack-js";
const seladbGitHubUser = "https://github.com/seladb";
const seladbTwitter = "https://twitter.com/seladb";
const seladbEmail = "mailto:pcapplusplus@gmail.com";

export default function Footer({ pageEmpty }) {
  const footerPosition = pageEmpty ? "fixed-bottom" : "";

  const smallScreen = useMediaQuery({ query: "(max-width: 530px)" });

  return (
    <Navbar bg="light" sticky="bottom" className={footerPosition}>
      {!smallScreen ? (
        <Navbar.Text className="mr-2">Created by</Navbar.Text>
      ) : (
        ""
      )}
      <GitHubButton
        href={seladbGitHubUser}
        data-size="large"
        aria-label="@seladb"
      >
        @seladb
      </GitHubButton>
      {!smallScreen ? (
        <Navbar.Text className="ml-2 mr-2">Give us a star:</Navbar.Text>
      ) : (
        <Navbar.Text className="ml-2 mr-2"></Navbar.Text>
      )}
      <GitHubButton
        href={starTrackGitHubRepo}
        data-icon="octicon-star"
        data-size="large"
        data-show-count="true"
        aria-label="Star StarTrack on GitHub"
      >
        Star
      </GitHubButton>
      <Nav className="mr-auto" />
      <Nav>
        <Nav.Link
          href={seladbGitHubUser}
          target="_blank"
          rel="noopener noreferrer"
        >
          <FontAwesomeIcon icon={faGithub} className="mr-1" />
        </Nav.Link>
        <Nav.Link
          href={seladbTwitter}
          target="_blank"
          rel="noopener noreferrer"
        >
          <FontAwesomeIcon icon={faTwitter} className="mr-1" />
        </Nav.Link>
        <Nav.Link href={seladbEmail} target="_blank" rel="noopener noreferrer">
          <FontAwesomeIcon icon={faEnvelope} className="mr-1" />
        </Nav.Link>
      </Nav>
    </Navbar>
  );
}
Footer.propTypes = {
  pageEmpty: PropTypes.bool,
};
