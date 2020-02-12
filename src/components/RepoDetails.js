import React, { useRef } from 'react'
import './RepoDetails.css'
import { Container, Row, InputGroup, FormControl, Button, Spinner, OverlayTrigger, Tooltip } from 'react-bootstrap/'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStopCircle } from '@fortawesome/free-solid-svg-icons';
import gh from 'parse-github-url'

const RepoDetails = (props) => {

  const repoName = useRef();
  const userName = useRef();

  const onGoClick = () => {
    props.onRepoDetails(userName.current.value.trim(), repoName.current.value.trim())
  }

  const handleKeyPress = (target) => {
    if(target.charCode === 13 && !props.loadInProgress){
      onGoClick();
    } 
  }

  const handlePaste = (event) => {
    let clipData = gh(event.clipboardData.getData('Text'));
    if ((clipData.protocol === "https:" && clipData.hostname === "github.com" && clipData.name !== null && clipData.owner !== null) ||
          (clipData.protocol === null && clipData.hostname === null && clipData.name !== null && clipData.owner !== null )) {
      event.preventDefault();
      userName.current.value = clipData.owner;
      repoName.current.value = clipData.name
    }
  }

  return (
    <Container className="RepoDetails-container">
      <Row>
        <InputGroup>
          <InputGroup.Prepend>
            <OverlayTrigger
              placement="bottom"
              delay={{ show: 100 }}
              overlay={<Tooltip>Tip: you can paste any GitHub URL or string in the format of "username/repo"</Tooltip>}
            >
              <InputGroup.Text>Repo Details</InputGroup.Text>
            </OverlayTrigger>
          </InputGroup.Prepend>
          <FormControl
            ref={userName}
            placeholder="Username"
            aria-label="Username"
            onKeyPress={handleKeyPress}
            onPaste={handlePaste}
          />
          <InputGroup.Prepend>
            <InputGroup.Text>/</InputGroup.Text>
          </InputGroup.Prepend>
          <FormControl
            ref={repoName}
            placeholder="Repo name"
            aria-label="Repo name"
            onKeyPress={handleKeyPress}
            onPaste={handlePaste}
          />
          { !props.loadInProgress ?
          <Button
            className="RepoDetails-goButton"
            type="button" 
            onClick={onGoClick}>Go!
          </Button>
          :
          <div>
            <Button 
              className="RepoDetails-loadingButton"
              type="button" 
              disabled>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
              /> Loading...
            </Button>
            <Button className="RepoDetails-stopButton" onClick={props.onStopClick}>
              <FontAwesomeIcon icon={faStopCircle} />
            </Button>
            </div>
          }
        </InputGroup>
      </Row>
    </Container>
  )
}

export default RepoDetails
