import { AppBar, Box, Toolbar, Typography } from "@mui/material"
import packageJson from "../../package.json"
import ProjectOnGitHubBtn from "./ProjectOnGitHubBtn"
import React from "react"
import GitHubAuthContainer from "./GitHubAuthContainer"

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
          <GitHubAuthContainer />
        </Toolbar>
      </AppBar>
    </Box>
  )
}
