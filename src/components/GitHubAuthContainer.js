import React, { useState } from "react";
import GitHubAuthBtn from "./GitHubAuthBtn";
import GitHubAuthForm from "./GitHubAuthForm";
import gitHubUtils from "../utils/GitHubUtils";

export default function GitHubAuthContainer() {
  const [showGitHubAuthForm, setShowGitHubAuthForm] = useState(false);
  const [accessToken, setAccessToken] = useState(gitHubUtils.getAccessToken());
  const [storageType, setStorageType] = useState(gitHubUtils.getStorageType());

  const openGitHubAuthForm = () => {
    setShowGitHubAuthForm(true);
  };

  const hideGitHubAuthForm = () => {
    setShowGitHubAuthForm(false);
    setAccessToken(gitHubUtils.getAccessToken());
    setStorageType(gitHubUtils.getStorageType());
  };

  const handleLoginSuccess = () => {
    setShowGitHubAuthForm(false);
    setAccessToken(gitHubUtils.getAccessToken());
    setStorageType(gitHubUtils.getStorageType());
  };

  const handleLogOut = () => {
    gitHubUtils.removeAccessToken();
    setAccessToken(gitHubUtils.getAccessToken());
    setStorageType(gitHubUtils.getStorageType());
  };

  return (
    <div>
      <GitHubAuthBtn
        onLoginClick={openGitHubAuthForm}
        onLogoutClick={handleLogOut}
        accessToken={accessToken}
        storageType={storageType}
      />
      <GitHubAuthForm
        show={showGitHubAuthForm}
        handleClose={hideGitHubAuthForm}
        handleLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}
