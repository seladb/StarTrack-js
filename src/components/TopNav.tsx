import { AppBar, Box, Toolbar, Typography } from "@mui/material"
import packageJson from "../../package.json"
import GitHubAuthBtn from "./GitHubAuthBtn"
import GitHubToken from "./GitHubToken"
import ProjectOnGitHubBtn from "./ProjectOnGitHubBtn"
import LoginIcon from "@mui/icons-material/Login"
import LogoutIcon from "@mui/icons-material/Logout"
import { StorageType } from "../utils/GitHubUtils"

export default function TopNav() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position='static'>
        <Toolbar>
          <img
            src='star-icon.png'
            alt='logo'
            width='30'
            height='30'
            className='d-inline-block align-top'
          />
          <Typography variant='h6' component='div' sx={{ flexGrow: 1, m: 1 }}>
            StarTrack v{packageJson.version}
          </Typography>
          <ProjectOnGitHubBtn />
          <GitHubToken accessToken='ec5193' storageType={StorageType.LocalStorage} />
          <GitHubAuthBtn text='GitHub Authentication' Icon={LoginIcon} />
          <GitHubAuthBtn
            text='Log Out'
            Icon={LogoutIcon}
            onClick={() => {
              alert("bye")
            }}
          />
        </Toolbar>
      </AppBar>
    </Box>
  )
}
