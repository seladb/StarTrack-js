import React from "react";
// import logo from "./logo.svg"
import "./App.css";
import MainContainer from "./components/MainContainer";
import TopNav from "./components/TopNav";
import { AlertContextProvider } from "./shared/AlertContext";
import { ProgressProvider } from "./shared/ProgressContext";
import Footer from "./components/Footer";

export default function App() {
  return (
    <div className="App">
      <div className="Content">
        <AlertContextProvider>
          <TopNav />
          <ProgressProvider>
            <MainContainer />
          </ProgressProvider>
        </AlertContextProvider>
      </div>
      <Footer />
    </div>
  );
}
