import React from "react";
// import logo from "./logo.svg"
import "./App.css";
import MainContainer from "./components/MainContainer";
import TopNav from "./components/TopNav";
import { AlertContextProvider } from "./shared/AlertContext";
import { ProgressProvider } from "./shared/ProgressContext";

export default function App() {
  return (
    <div className="App">
      <AlertContextProvider>
        <TopNav />
        <ProgressProvider>
          <MainContainer />
        </ProgressProvider>
      </AlertContextProvider>
    </div>
  );
}
