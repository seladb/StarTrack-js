import React from "react";
// import logo from "./logo.svg"
import "./App.css";
import MainContainer from "./components/MainContainer";
import TopNav from "./components/TopNav";
import { AlertContextProvider } from "./shared/AlertContext";

export default function App() {
  return (
    <div className="App">
      <AlertContextProvider>
        <TopNav></TopNav>
        <MainContainer></MainContainer>
        {/* <header className='App-header'>
          <img src={logo} className='App-logo' alt='logo' />
          <p>
            Edit <code>src/App.tsx</code> and save to reload.
          </p>
          <a
            className='App-link'
            href='https://reactjs.org'
            target='_blank'
            rel='noopener noreferrer'
          >
            Learn React
          </a>
        </header> */}
      </AlertContextProvider>
    </div>
  );
}
