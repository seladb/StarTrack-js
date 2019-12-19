import React from 'react';
import './App.css';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { blue } from '@material-ui/core/colors';
import TopNav from './TopNav'
import RepoDetails from './RepoDetails'

const theme = createMuiTheme({
  palette: {
    primary: blue,
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <TopNav />
      <RepoDetails />
    </ThemeProvider>
  );
}

export default App;
