import React from 'react';
import MainPage from './MainPage'
import RepoPreloader from './RepoPreloader'
import { Route, HashRouter } from 'react-router-dom'

function App() {
  return (
    <HashRouter>
      <Route exact path="/" component={MainPage} />
      <Route path="/preload" component={RepoPreloader} />
    </HashRouter>
  );
}

export default App;
