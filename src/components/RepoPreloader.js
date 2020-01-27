import React from 'react'
import { Container, ProgressBar, Button } from 'react-bootstrap/'
import './RepoPreloader.css'
import stargazerLoader, { maxReposAllowed } from '../utils/StargazerLoader'
import MainPage from './MainPage'

class RepoPreloader extends React.Component {

  reposToPreload = this.parseUrlParams()

  state = {   
    currentlyLoadingIndex: 0,
    loadProgress: 0,
    finishedLoading: false,
    reposLoaded: [],
    errors: []
  }

  parseUrlParams() {
    let searchParams = new URLSearchParams(this.props.location.search);
    let result = [];
    searchParams.forEach( (value, key) => {
      if (key === "r") {
        let repo = value.split(",");
        if (result.length < maxReposAllowed &&
            repo.length === 2 && 
            result.find(iter => iter.username === repo[0] && iter.repo === repo[1]) === undefined) {
          result.push({
            username: repo[0],
            repo: repo[1]
          })
        }
      }
    })
    return result;
  }

  componentDidMount() {
    this.loadStargazers();
  }

  async loadStargazers() {
    try {
      let repoDetails = this.getCurrentlyLoadingRepoDetails();
      if (Object.keys(repoDetails).length === 0) {
        this.setState({
          finishedLoading: true,
          loadProgress: 100
        });
        return
      }
      let stargazerData = await stargazerLoader.loadStargazers(repoDetails.username, repoDetails.repo, this.handleLoadProgress.bind(this), () => false);
      this.setState(prevState => ({
        currentlyLoadingIndex: this.state.currentlyLoadingIndex + 1,
        reposLoaded: [...prevState.reposLoaded, stargazerData]
      }), () => { 
        this.loadStargazers()
      })
    }
    catch(error) {
      this.setState(prevState => ({
        currentlyLoadingIndex: this.state.currentlyLoadingIndex + 1,
        errors: [...prevState.errors, { repoDetails: this.getCurrentlyLoadingRepoDetails(), message: error.message }]
      }), () => {
        this.loadStargazers();
      });
    }
  }

  handleLoadProgress(progress) {
    this.setState({
      loadProgress: progress
    })
  }

  getCurrentlyLoadingRepoDetails() {
    if (this.state.currentlyLoadingIndex >= this.reposToPreload.length) {
      return {}
    }

    return {
      username: this.reposToPreload[this.state.currentlyLoadingIndex].username,
      repo: this.reposToPreload[this.state.currentlyLoadingIndex].repo
    }
  }

  handleButtonClick() {
    this.setState({
      errors: []
    })
  }

  getProgressBarVariant() {
    if (this.state.finishedLoading && this.state.errors.length > 0) {
      return "warning"
    }
    
    return "success"
  }

  getSecondaryHeaderMessage() {
    if (this.state.finishedLoading && this.state.errors.length > 0) {
      return "Error loading repos"
    }

    let repoDetails = this.getCurrentlyLoadingRepoDetails();
    return repoDetails.username + "/" + repoDetails.repo;
  }

  render() {
    return (
      <div>
        { this.state.finishedLoading === false || this.state.errors.length > 0 ? 
          <Container className="RepoPreloader-topContainer">
            <h3 >Loading Repos Data...</h3>
            <h5>{this.getSecondaryHeaderMessage()}</h5>
            <ProgressBar now={this.state.loadProgress} variant={this.getProgressBarVariant()} animated />
            { this.state.errors.length > 0 ?
            <Container className="RepoPreloader-errorContainer">
              {this.state.errors.map(error => <h6><b>Error loading {error.repoDetails.username}/{error.repoDetails.repo}:</b> {error.message}</h6>)}
              {this.state.finishedLoading ? <Button onClick={this.handleButtonClick.bind(this)}>Continue</Button> : null }
            </Container>
            : null }
          </Container> 
        :
          <MainPage preloadedRepos={this.state.reposLoaded}/>
        }
      </div>
    )
  }
}

export default RepoPreloader