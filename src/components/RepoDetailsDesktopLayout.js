import React from "react";
import PropTypes from "prop-types";
import "./RepoDetailsDesktopLayout.css";
import "./RepoDetails.css";
import {
  Row,
  InputGroup,
  FormControl,
  Button,
  Spinner,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap/";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStopCircle } from "@fortawesome/free-solid-svg-icons";

const RepoDetailsDesktopLayout = (props) => {
  return (
    <Row>
      <InputGroup>
        <InputGroup.Prepend>
          <OverlayTrigger
            placement="bottom"
            delay={{ show: 100 }}
            overlay={
              <Tooltip>
                Tip: you can paste any GitHub URL or string in the format of
                &quot;username/repo&quot;
              </Tooltip>
            }
          >
            <InputGroup.Text>Repo Details</InputGroup.Text>
          </OverlayTrigger>
        </InputGroup.Prepend>
        <FormControl
          ref={props.userName}
          placeholder="Username"
          aria-label="Username"
          onKeyPress={props.handleKeyPress}
          onPaste={props.handlePaste}
        />
        <InputGroup.Prepend>
          <InputGroup.Text>/</InputGroup.Text>
        </InputGroup.Prepend>
        <FormControl
          ref={props.repoName}
          placeholder="Repo name"
          aria-label="Repo name"
          onKeyPress={props.handleKeyPress}
          onPaste={props.handlePaste}
        />
        {!props.loadInProgress ? (
          <Button
            className="RepoDetailsDesktopLayout-goButton"
            type="button"
            onClick={props.onGoClick}
          >
            Go!
          </Button>
        ) : (
          <div>
            <Button
              className="RepoDetailsDesktopLayout-loadingButton"
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
            <Button
              className="RepoDetails-stopButton"
              onClick={props.onStopClick}
            >
              <FontAwesomeIcon icon={faStopCircle} />
            </Button>
          </div>
        )}
      </InputGroup>
    </Row>
  );
};
RepoDetailsDesktopLayout.propTypes = {
  userName: PropTypes.string,
  repoName: PropTypes.string,
  loadInProgress: PropTypes.bool,
  handleKeyPress: PropTypes.func,
  handlePaste: PropTypes.func,
  onStopClick: PropTypes.func,
  onGoClick: PropTypes.func,
};

export default RepoDetailsDesktopLayout;
