import React from 'react'
import { Modal, Button, Form } from 'react-bootstrap/'
import axios from 'axios'

class GitHubAuth extends React.Component {

  state = {
    formValidated: false
  }

  constructor(props) {
    super(props);
    this.inputToken = React.createRef(); 
 }

  handleLogin = event => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
    }
    else {
      this.setState({
        formValidated: true
      });
      console.log(this.inputToken.current.value);
      axios.get(`https://api.github.com`, { headers: { 'Authorization': 'token ' + this.inputToken.current.value} })
        .then(response => {
          window.sessionStorage.setItem('access_token', this.inputToken.current.value);
          this.props.handleLoginSuccess();
        })
        .catch(error => {
          console.log(error.response)
      });
    }
  }

  render() {
    return (
      <Modal show={this.props.show} onHide={this.props.handleClose}>
        <Form noValidate validated={this.state.formValidated} onSubmit={this.handleLogin}>
          <Modal.Header closeButton>
            <Modal.Title>GitHub Authentication</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>GitHub API <a href="https://developer.github.com/v3/#rate-limiting">rate limiter</a> makes it 
              impossible to collect stargazer data on repos with more than 3000 stars without GitHub authentication.
            </p>
            <p>If you'd like to view stargazer data for this repo, please provide your GitHub auth details.</p>
            <p>Please note these credentials aren't stored in any server. This application is based on pure javascript 
              so the credentials are only used to send authenticated requests to GitHub API.
            </p>
            <Form.Group controlId="githubAuthenticationForm">
              <Form.Label>GitHub access token (generate one <a href="https://github.com/settings/tokens">here</a>)</Form.Label>
              <Form.Control ref={this.inputToken} type="text" placeholder="fc516773214acf13d10f856c6b80037999da4fd3" required/>
              <Form.Control.Feedback type="invalid">
                Please choose a username.
              </Form.Control.Feedback>
              <Form.Text className="text-muted">
                These credentials aren't stored in any server.
              </Form.Text>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.props.handleClose}>
              Close
            </Button>
            <Button variant="primary" type="submit">
              Login
            </Button>
          </Modal.Footer>
          </Form>
      </Modal>    
    )
  }
}

export default GitHubAuth