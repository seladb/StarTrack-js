import React from "react";
import LoginIcon from "@mui/icons-material/Login";
import GitHubAuthBtn from "./GitHubAuthBtn";
import GitHubAuthForm from "./GitHubAuthForm";
import { getAccessToken } from "../../utils/GitHubUtils";
import LoggedIn from "./LoggedIn";

export default function GitHubAuth() {
  const [authFormOpen, setAuthFormOpen] = React.useState<boolean>(false);
  const [accessToken, setAccessToken] = React.useState<string | null>(getAccessToken());

  const handleAuthFormClose = (newAccessTokenValue: string | null) => {
    setAuthFormOpen(false);
    setAccessToken(newAccessTokenValue);
  };

  const handleLogOut = () => {
    setAccessToken(null);
  };

  const LoginBtn = (
    <GitHubAuthBtn
      text="GitHub Authentication"
      Icon={LoginIcon}
      onClick={() => {
        setAuthFormOpen(true);
      }}
    />
  );

  const LoginContainer = (
    <>
      {LoginBtn}
      <GitHubAuthForm open={authFormOpen} onClose={handleAuthFormClose} />
    </>
  );

  return accessToken ? (
    <LoggedIn accessToken={accessToken} onLogOut={handleLogOut} />
  ) : (
    LoginContainer
  );
}
