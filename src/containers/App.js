import React from 'react';
import './App.css';
import MainPageContainer from './MainPageContainer'
import RepoPreloader from './RepoPreloader'
import { Route, BrowserRouter } from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
      <Route exact path="/" component={MainPageContainer} />
      <Route path="/preload" component={RepoPreloader} />
    </BrowserRouter>
  );
}

export default App;
