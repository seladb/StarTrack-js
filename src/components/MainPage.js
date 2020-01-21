import React from 'react'
import TopNav from './TopNav'
import MainContainer from './MainContainer'

class MainPage extends React.Component {
  render() {
    return (
      <div>
        <TopNav />
        <MainContainer preloadedRepos={this.props.preloadedRepos} />
      </div>
    )
  }
}

export default MainPage