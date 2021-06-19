import React from "react";
import PropTypes from "prop-types";
import "./RepoDetailsMobileLayout.css";
import "./RepoDetails.css";
import {
  Row,
  FormControl,
  Button,
  Spinner,
  Container,
  Form,
} from "react-bootstrap/";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStopCircle } from "@fortawesome/free-solid-svg-icons";

export default function RepoDetailsMobileLayout({
  userName,
  repoName,
  loadInProgress,
  handleKeyPress,
  handlePaste,
  onStopClick,
  onGoClick,
}) {
  return (
    <Container>
      <Row>
        <Form.Label className="RepoDetailsMobileLayout-headline">
          Repo Details
        </Form.Label>
      </Row>
      <Row>
        <FormControl
          ref={userName}
          placeholder="Username"
          aria-label="Username"
          onKeyPress={handleKeyPress}
          onPaste={handlePaste}
        />
      </Row>
      <Row>
        <FormControl
          ref={repoName}
          placeholder="Repo name"
          aria-label="Repo name"
          onKeyPress={handleKeyPress}
          onPaste={handlePaste}
        />
      </Row>
      <Row>
        {!loadInProgress ? (
          <Button
            className="RepoDetailsMobileLayout-goButton"
            type="button"
            onClick={onGoClick}
          >
            Go!
          </Button>
        ) : (
          <div className="RepoDetailsMobileLayout-loadingDiv">
            <Button
              className="RepoDetailsMobileLayout-loadingButton"
              type="button"
              disabled
            >
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />{" "}
              Loading...
            </Button>
            <Button className="RepoDetails-stopButton" onClick={onStopClick}>
              <FontAwesomeIcon icon={faStopCircle} />
            </Button>
          </div>
        )}
      </Row>
    </Container>
  );
}
RepoDetailsMobileLayout.propTypes = {
  userName: PropTypes.string,
  repoName: PropTypes.string,
  loadInProgress: PropTypes.bool,
  handleKeyPress: PropTypes.func,
  handlePaste: PropTypes.func,
  onStopClick: PropTypes.func,
  onGoClick: PropTypes.func,
};
