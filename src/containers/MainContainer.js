import React from 'react'
import RepoDetails from './RepoDetails'
import ChartContainer from './ChartContainer'

class MainContainer extends React.Component {

  state = {
    repos: []
  }

  getRepoStars(username, repo) {
    this.setState(prevState => ({
      repos: [...prevState.repos, 
        {
          username: username,
          repo: repo
        }]
    }))

    console.log(this.state.repos)
  }

  render() {
    return (
    <div>
      <RepoDetails onRepoDetails={this.getRepoStars.bind(this)}/>
      <ChartContainer />
    </div>
    )
  }
}

export default MainContainer