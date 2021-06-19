import React from "react";
import { Nav, Navbar } from "react-bootstrap/";
import GitHubAuthContainer from "./GitHubAuthContainer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import packageJson from "../../package.json";
import { useMediaQuery } from "react-responsive";

const starTrackGitHubRepo = "https://github.com/seladb/startrack-js";

const TopNav = () => {
  const smallScreen = useMediaQuery({ query: "(max-width: 650px)" });

  return (
    <Navbar bg="primary" variant="dark">
      <Navbar.Brand href="#/">
        <img
          alt=""
          src={window.location.pathname + "star-icon.png"}
          width="30"
          height="30"
          className="d-inline-block align-top"
        />{" "}
        StarTrack v{packageJson.version}
      </Navbar.Brand>
      <Nav className="mr-auto" />
      <Nav>
        <Nav.Link
          href={starTrackGitHubRepo}
          target="_blank"
          rel="noopener noreferrer"
        >
          <FontAwesomeIcon icon={faGithub} className="mr-1" />
          {!smallScreen ? "Project On GitHub" : ""}
        </Nav.Link>
      </Nav>
      <GitHubAuthContainer />
    </Navbar>
  );
};

export default TopNav;
