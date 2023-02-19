import {
  getAccessToken,
  removeAccessToken,
  getStorageType,
  StorageType,
} from "../../utils/GitHubUtils"
import GitHubAuthBtn from "./GitHubAuthBtn"
import LoginIcon from "@mui/icons-material/Login"
import LogoutIcon from "@mui/icons-material/Logout"
import GitHubAuthForm from "./GitHubAuthForm"
import React from "react"
import GitHubToken from "./GitHubToken"

export default function GitHubAuthContainer() {
  const [authFormOpen, setAuthFormOpen] = React.useState<boolean>(false)
  const [accessToken, setAccessToken] = React.useState<string | null>(getAccessToken())

  const handleAuthFormClose = (newAccessTokenValue: string | null) => {
    setAuthFormOpen(false)
    setAccessToken(newAccessTokenValue)
  }

  const handleLogout = () => {
    removeAccessToken()
    setAccessToken(null)
  }

  const LoginBtn = (
    <GitHubAuthBtn
      text='GitHub Authentication'
      Icon={LoginIcon}
      onClick={() => {
        setAuthFormOpen(true)
      }}
    />
  )

  const LogoutBtn = <GitHubAuthBtn text='Log Out' Icon={LogoutIcon} onClick={handleLogout} />

  const LoginContainer = (
    <>
      {LoginBtn}
      <GitHubAuthForm open={authFormOpen} onClose={handleAuthFormClose} />
    </>
  )

  const LoggedInContainer = (accessTokenValue: string) => {
    return (
      <>
        <GitHubToken
          accessToken={accessTokenValue}
          storageType={getStorageType() || StorageType.SessionStorage}
        />
        {LogoutBtn}
      </>
    )
  }

  return accessToken ? LoggedInContainer(accessToken) : LoginContainer
}
