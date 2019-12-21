import React from 'react'
import { Container, Row, InputGroup, FormControl, Button } from 'react-bootstrap/'

class RepoDetails extends React.Component {

  render() {
    return (
      <Container className="mt-5 mb-5">
        <Row>
          <InputGroup>
            <InputGroup.Prepend>
              <InputGroup.Text id="basic-addon1">Repo Details:</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl
              placeholder="Username"
              aria-label="Username"
            />
            <InputGroup.Prepend>
              <InputGroup.Text id="basic-addon1">/</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl
              placeholder="Repo name"
              aria-label="Repo name"
            />
            <Button type="button">Go</Button>
          </InputGroup>
        </Row>
      </Container>
    )
  }
  
}

export default RepoDetails