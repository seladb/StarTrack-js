import React from 'react'
import { Container, Row, InputGroup, FormControl, Button, Spinner } from 'react-bootstrap/'

class RepoDetails extends React.Component {

  constructor() {
    super();
    this.repoName = React.createRef();
    this.userName = React.createRef();
  }

  // state = {
  //   addOrReplacePlot: "replace",
  // }

  // onAddOrReplaceDropdownSelect(eventKey) {
  //   this.setState({
  //     addOrReplacePlot: eventKey
  //   })
  // }

  // getDropdownTitle() {
  //   switch(this.state.addOrReplacePlot) {
  //     case "replace":
  //       return "Replace Current Plot";
  //     case "add":
  //       return "Add Another Plot"
  //     default:
  //       return "Replace Current Plot";
  //   }
  // }

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
      <Container className="mt-5 mb-5">
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
            {/* <DropdownButton
              as={InputGroup.Append}
              variant="outline-secondary"
              id="add-or-replace-repo"
              title={this.getDropdownTitle()}
              onSelect={this.onAddOrReplaceDropdownSelect.bind(this)}
            >
              <Dropdown.Item eventKey="replace" href="#">Replace Current Plot</Dropdown.Item>
              <Dropdown.Item eventKey="add" href="#">Add Another Plot</Dropdown.Item>
            </DropdownButton> */}
            { !this.props.loadInProgress ?
            <Button 
              type="button" 
              onClick={this.onGoClick.bind(this)}>Go
            </Button>
            :
            <Button 
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