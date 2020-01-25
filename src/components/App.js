import React from 'react';
import MainPage from './MainPage'
import RepoPreloader from './RepoPreloader'
import { Route, BrowserRouter } from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
      <Route exact path="/" component={MainPage} />
      <Route path="/preload" component={RepoPreloader} />
    </BrowserRouter>
  );
}

export default App;
