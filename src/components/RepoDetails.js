import React from 'react'
import './RepoDetails.css'
import { Container, Row, InputGroup, FormControl, Button, Spinner } from 'react-bootstrap/'

class RepoDetails extends React.Component {

  constructor() {
    super();
    this.repoName = React.createRef();
    this.userName = React.createRef();
  }

  onGoClick() {
    this.props.onRepoDetails(this.userName.current.value, this.repoName.current.value)
  }

  handleKeyPress(target) {
    if(target.charCode === 13 && !this.props.loadInProgress){
      this.onGoClick();
    } 
  }

  render() {
    return (
      <Container className="RepoDetails-container">
        <Row>
          <InputGroup>
            <InputGroup.Prepend>
              <InputGroup.Text>Repo Details</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl
              ref={this.userName}
              placeholder="Username"
              aria-label="Username"
              onKeyPress={this.handleKeyPress.bind(this)}
            />
            <InputGroup.Prepend>
              <InputGroup.Text>/</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl
              ref={this.repoName}
              placeholder="Repo name"
              aria-label="Repo name"
              onKeyPress={this.handleKeyPress.bind(this)}
            />
            { !this.props.loadInProgress ?
            <Button
              className="RepoDetails-button"
              type="button" 
              onClick={this.onGoClick.bind(this)}>Go!
            </Button>
            :
            <Button 
              className="RepoDetails-button"
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
            }
          </InputGroup>
        </Row>
      </Container>
    )
  }
  
}

export default RepoDetails