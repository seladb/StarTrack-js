import React from 'react'
import { Button, Modal, ProgressBar, Container, Row } from 'react-bootstrap/'
import RepoDetails from './RepoDetails'
import ChartContainer from './ChartContainer'
import ClosableBadge from './ClosableBadge'
import gitHubUtils from './GitHubUtils'

class MainContainer extends React.Component {

  state = {
    repos: [],
    alert: {
      show: false,
      title: "",
      message: ""
    },
    loading: {
      isLoading: false,
      loadProgress: 0
    }
  }

  getRepoStargazers(username, repo) {
    if (this.state.repos.find(repoIter => repoIter.username === username && repoIter.repo === repo) !== undefined) {
      this.showAlert("Repo exists", "Repo already exists");
      return;
    }

    gitHubUtils.loadStargazers(username, repo, this.onLoadInProgress.bind(this))
    .then((stargazerData) => {
      this.setState(prevState => ({
        repos: [...prevState.repos, {
          username: username,
          repo: repo,
          stargazerData: stargazerData
        }],
        loading: {
          isLoading: false,
          loadProgress: 0
        }
      }))
    })
    .catch((error) => {
      this.showAlert("Error loading stargazers", error.message)
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

  onLoadInProgress(progress) {
    this.setState({
      loading: {
        isLoading: true,
        loadProgress: progress
      }
    })
  }

  handleRemoveRepo(repoDetails) {
    this.setState({
      repos: this.state.repos.filter( repo => {
        return repo.username !== repoDetails.username || repo.repo !== repoDetails.repo
      })
    })
  }

  render() {
     return (
    <div>
      { this.state.loading.isLoading ? <ProgressBar now={this.state.loading.loadProgress} variant="success" animated /> : null }
      <RepoDetails 
        onRepoDetails={this.getRepoStargazers.bind(this)}
        loadInProgress={this.state.loading.isLoading}
      />
      <Container>
        <Row>
          { this.state.repos.map( repoData => 
            <div style={{marginRight: '0.8em'}}>
              <ClosableBadge 
                text={repoData.username + "/" + repoData.repo} 
                badgeCookieData={{username: repoData.username, repo: repoData.repo}}
                onBadgeClose={this.handleRemoveRepo.bind(this)}
              />
            </div>
          )}
        </Row>
      </Container>
      { this.state.repos.length > 0 ? <ChartContainer repos={this.state.repos}/> : null }
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