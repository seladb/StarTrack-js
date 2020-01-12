import React from 'react'
import RepoDetails from './RepoDetails'
import Chart from './Chart'

class MainContainer extends React.Component {

  getRepoStars(username, repo) {
    console.log("username: " + username + " repo: " + repo)
  }

  render() {
    return (
    <div>
      <RepoDetails onRepoDetails={this.getRepoStars}/>
      <Chart />
    </div>
    )
  }
}

export default MainContainer