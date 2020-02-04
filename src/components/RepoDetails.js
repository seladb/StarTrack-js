import React, { useRef } from 'react'
import './RepoDetails.css'
import { Container, Row, InputGroup, FormControl, Button, Spinner } from 'react-bootstrap/'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStopCircle } from '@fortawesome/free-solid-svg-icons';

const RepoDetails = (props) => {

  const repoName = useRef();
  const userName = useRef();

  const onGoClick = () => {
    props.onRepoDetails(userName.current.value, repoName.current.value)
  }

  const handleKeyPress = (target) => {
    if(target.charCode === 13 && !props.loadInProgress){
      onGoClick();
    } 
  }

  return (
    <Container className="RepoDetails-container">
      <Row>
        <InputGroup>
          <InputGroup.Prepend>
            <InputGroup.Text>Repo Details</InputGroup.Text>
          </InputGroup.Prepend>
          <FormControl
            ref={userName}
            placeholder="Username"
            aria-label="Username"
            onKeyPress={handleKeyPress}
          />
          <InputGroup.Prepend>
            <InputGroup.Text>/</InputGroup.Text>
          </InputGroup.Prepend>
          <FormControl
            ref={repoName}
            placeholder="Repo name"
            aria-label="Repo name"
            onKeyPress={handleKeyPress}
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