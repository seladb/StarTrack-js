import React from 'react'
import { Button, Modal } from 'react-bootstrap/'
import RepoDetails from './RepoDetails'
import ChartContainer from './ChartContainer'
import gitHubUtils from './GitHubUtils'

class MainContainer extends React.Component {

  state = {
    repos: [],
    alert: {
      show: false,
      title: "",
      message: ""
    }
  }

  getRepoStars(username, repo) {
    this.setState(prevState => ({
      repos: [...prevState.repos, 
        {
          username: username,
          repo: repo
        }]
    }), () => {
      gitHubUtils.loadStargazers(username, repo)
      .then( (starData) => {
        console.log(starData)
      })
      .catch((error) => {
        this.showAlert("Error loading stargazers", error.message)
      })
    })
  }

  showAlert(title, message) {
    this.setState({
      alert: {
        show: true,
        title: title,
        message: message
      }
    })
  }

  closeAlert() {
    this.setState({
      alert: {
        show: false,
        title: "",
        message: ""
      }
    })
  }

  render() {
    return (
    <div>
      <RepoDetails onRepoDetails={this.getRepoStars.bind(this)}/>
      <ChartContainer />
      <Modal show={this.state.alert.show} onHide={this.closeAlert}>
        <Modal.Header closeButton>
          <Modal.Title>{this.state.alert.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{this.state.alert.message}</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={this.closeAlert.bind(this)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
    )
  }
}

export default MainContainer