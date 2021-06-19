import React, { useRef } from "react";
import PropTypes from "prop-types";
import "./RepoDetails.css";
import RepoDetailsDesktopLayout from "./RepoDetailsDesktopLayout";
import RepoDetailsMobileLayout from "./RepoDetailsMobileLayout";
import { useMediaQuery } from "react-responsive";
import { Container } from "react-bootstrap/";
import gh from "parse-github-url";

const RepoDetails = (props) => {
  const repoName = useRef();
  const userName = useRef();

  const onGoClick = () => {
    props.onRepoDetails(
      userName.current.value.trim(),
      repoName.current.value.trim()
    );
  };

  const handleKeyPress = (target) => {
    if (target.charCode === 13 && !props.loadInProgress) {
      onGoClick();
    }

    if (target.charCode === 47) {
      target.preventDefault();
      repoName.current.focus();
    }
  };

  const handlePaste = (event) => {
    const clipData = gh(event.clipboardData.getData("Text"));
    if (!clipData) {
      return;
    }

    if (
      (clipData.protocol === "https:" &&
        clipData.hostname === "github.com" &&
        clipData.name !== null &&
        clipData.owner !== null) ||
      (clipData.protocol === null &&
        clipData.hostname === null &&
        clipData.name !== null &&
        clipData.owner !== null)
    ) {
      event.preventDefault();
      userName.current.value = clipData.owner;
      repoName.current.value = clipData.name;
    }
  };

  const smallScreen = useMediaQuery({ query: "(max-width: 520px)" });

  return (
    <Container className="RepoDetails-container">
      {smallScreen ? (
        <RepoDetailsMobileLayout
          userName={userName}
          repoName={repoName}
          onGoClick={onGoClick}
          handleKeyPress={handleKeyPress}
          handlePaste={handlePaste}
          loadInProgress={props.loadInProgress}
          onStopClick={props.onStopClick}
        />
      ) : (
        <RepoDetailsDesktopLayout
          userName={userName}
          repoName={repoName}
          onGoClick={onGoClick}
          handleKeyPress={handleKeyPress}
          handlePaste={handlePaste}
          loadInProgress={props.loadInProgress}
          onStopClick={props.onStopClick}
        />
      )}
    </Container>
  );
};
RepoDetails.propTypes = {
  loadInProgress: PropTypes.bool,
  onStopClick: PropTypes.func,
  onRepoDetails: PropTypes.func,
};

export default RepoDetails;
