import React from 'react'
import { Container, Row, InputGroup, FormControl, Dropdown, DropdownButton, Button } from 'react-bootstrap/'

class RepoDetails extends React.Component {

  constructor() {
    super();
    this.repoName = React.createRef();
    this.userName = React.createRef();
  }

  state = {
    addOrReplacePlot: "replace",
  }

  onAddOrReplaceDropdownSelect(eventKey) {
    this.setState({
      addOrReplacePlot: eventKey
    })
  }

  getDropdownTitle() {
    switch(this.state.addOrReplacePlot) {
      case "replace":
        return "Replace Current Plot";
      case "add":
        return "Add Another Plot"
      default:
        return "Replace Current Plot";
    }
  }

  onGoClick() {
    this.props.onRepoDetails(this.userName.current.value, this.repoName.current.value)
  }

  bla(event) {
    console.log(event)
  }

  render() {
    return (
      <Container className="mt-5 mb-5">
        <Row>
          <InputGroup>
            <InputGroup.Prepend>
              <InputGroup.Text>Repo Details:</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl
              ref={this.userName}
              placeholder="Username"
              aria-label="Username"
            />
            <InputGroup.Prepend>
              <InputGroup.Text>/</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl
              ref={this.repoName}
              placeholder="Repo name"
              aria-label="Repo name"
            />
            <DropdownButton
              as={InputGroup.Append}
              variant="outline-secondary"
              id="add-or-replace-repo"
              title={this.getDropdownTitle()}
              onSelect={this.onAddOrReplaceDropdownSelect.bind(this)}
            >
              <Dropdown.Item eventKey="replace" href="#">Replace Current Plot</Dropdown.Item>
              <Dropdown.Item eventKey="add" href="#">Add Another Plot</Dropdown.Item>
            </DropdownButton>
            <Button type="button" onClick={this.onGoClick.bind(this)}>Go</Button>
          </InputGroup>
        </Row>
      </Container>
    )
  }
  
}

export default RepoDetails