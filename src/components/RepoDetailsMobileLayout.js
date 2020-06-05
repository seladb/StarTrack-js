import React from 'react'
import './RepoDetailsMobileLayout.css'
import './RepoDetails.css'
import { Row, FormControl, Button, Spinner, Container, Form } from 'react-bootstrap/'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStopCircle } from '@fortawesome/free-solid-svg-icons';

const RepoDetailsMobileLayout = (props) => {

  return (
    <Container>
      <Row>
        <Form.Label className="RepoDetailsMobileLayout-headline">Repo Details</Form.Label>
      </Row>
      <Row>
        <FormControl
          ref={props.userName}
          placeholder="Username"
          aria-label="Username"
          onKeyPress={props.handleKeyPress}
          onPaste={props.handlePaste}
        />
      </Row>
      <Row>
        <FormControl
          ref={props.repoName}
          placeholder="Repo name"
          aria-label="Repo name"
          onKeyPress={props.handleKeyPress}
          onPaste={props.handlePaste}
        />
      </Row>
      <Row>
        {!props.loadInProgress ?
        <Button
          className="RepoDetailsMobileLayout-goButton"
          type="button" 
          onClick={props.onGoClick}>Go!
        </Button>
        :
        <div className="RepoDetailsMobileLayout-loadingDiv">
          <Button 
            className="RepoDetailsMobileLayout-loadingButton"
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
      </Row>
    </Container>

    
    
  )
}

export default RepoDetailsMobileLayout
