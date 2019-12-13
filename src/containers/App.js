import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import './App.css';
import TopNav from './TopNav'
import RepoDetails from './RepoDetails'

function App() {
  return (
    <React.Fragment>
      <CssBaseline />
      <TopNav />
      <RepoDetails />
    </React.Fragment>
  );
}

export default App;
