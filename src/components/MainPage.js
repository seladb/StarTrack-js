import React from 'react'
import TopNav from './TopNav'
import MainContainer from './MainContainer'

const MainPage = (props) => {
  return (
    <div>
      <TopNav />
      <MainContainer preloadedRepos={props.preloadedRepos} />
    </div>
  )
}

export default MainPage