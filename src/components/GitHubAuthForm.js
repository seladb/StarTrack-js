import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { Modal, Button, Form } from "react-bootstrap/";
import gitHubUtils, { StorageTypes } from "../utils/GitHubUtils";

const TokenValidationStatus = {
  Init: "init",
  Valid: "valid",
  Invalid: "invalid",
  DidNotCheck: "did-not-check",
};

export default function GitHubAuthForm({
  show,
  handleLoginSuccess,
  handleClose,
}) {
  const [tokenValidationStatus, setTokenValidationStatus] = useState(
    TokenValidationStatus.Init
  );

  const inputToken = useRef();
  const storageTypeCheckbox = useRef();
  const handleCallback = useRef();

  const getStorageTypeDecision = () => {
    if (storageTypeCheckbox.current.checked) {
      return StorageTypes.LocalStorage;
    }

    return StorageTypes.SessionStorage;
  };

  const handleLoginClick = (event) => {
    event.preventDefault();

    gitHubUtils
      .validateAndStoreAccessToken(
        inputToken.current.value,
        getStorageTypeDecision()
      )
      .then(() => {
        handleCallback.current = handleLoginSuccess;
        setTokenValidationStatus(TokenValidationStatus.Valid);
      })
      .catch(() => {
        handleCallback.current = null;
        setTokenValidationStatus(TokenValidationStatus.Invalid);
      });
  };

  const handleCloseClick = () => {
    handleCallback.current = handleClose;
    setTokenValidationStatus(TokenValidationStatus.DidNotCheck);
  };

  useEffect(() => {
    if (
      handleCallback.current !== null &&
      handleCallback.current !== undefined
    ) {
      handleCallback.current();
      setTokenValidationStatus(TokenValidationStatus.Init);
    }
  }, [tokenValidationStatus]);

  return (
    <Modal show={show} onHide={handleCloseClick}>
      <Form onSubmit={handleLoginClick}>
        <Modal.Header closeButton>
          <Modal.Title>GitHub Authentication</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            GitHub API{" "}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://developer.github.com/v3/#rate-limiting"
            >
              rate limiter
            </a>{" "}
            makes it impossible to collect stargazer data on repos with more
            than 3000 stars without GitHub authentication.
          </p>
          <p>
            If you&apos;d like to view stargazer data for this repo, please
            provide your GitHub auth details.
          </p>
          <p>
            Please note these credentials aren&apos;t stored in any server. This
            application is based on pure javascript so the credentials are only
            used to send authenticated requests to GitHub API.
          </p>
          <Form.Group controlId="githubAuthenticationForm">
            <Form.Label>
              GitHub access token (generate one{" "}
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://github.com/settings/tokens"
              >
                here
              </a>
              )
            </Form.Label>
            <Form.Control
              ref={inputToken}
              type="text"
              placeholder="fc516773214acf13d10f856c6b80037999da4fd3"
              isInvalid={
                tokenValidationStatus === TokenValidationStatus.Invalid
              }
              required
            />
            <Form.Control.Feedback type="invalid">
              Access token is invalid.
            </Form.Control.Feedback>
            <Form.Text className="text-muted">
              These credentials aren&apos;t stored in any server.
            </Form.Text>
            <Form.Check
              ref={storageTypeCheckbox}
              inline
              type="checkbox"
              id="storageType"
              label="Save access token in local storage"
            />
            <Form.Label>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://stackoverflow.com/questions/5523140/html5-local-storage-vs-session-storage"
              >
                Learn more
              </a>
            </Form.Label>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseClick}>
            Close
          </Button>
          <Button variant="primary" type="submit">
            Login
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
GitHubAuthForm.propTypes = {
  show: PropTypes.bool,
  handleLoginSuccess: PropTypes.func,
  handleClose: PropTypes.func,
};
