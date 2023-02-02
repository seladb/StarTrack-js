import { AppBar, Box, Button, IconButton, Toolbar, Typography } from "@mui/material"
import useMediaQuery from "@mui/material/useMediaQuery"
import GitHubIcon from "@mui/icons-material/GitHub"
import packageJson from "../../package.json"

export default function TopNav() {
  const starTrackGitHubRepo = "https://github.com/seladb/startrack-js"
  const smallScreen = useMediaQuery("(max-width: 650px)", { noSsr: true })

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
          {smallScreen ? (
            <Box>
              <IconButton
                rel='noopener noreferrer'
                href={starTrackGitHubRepo}
                target='_blank'
                color='inherit'
              >
                <GitHubIcon />
              </IconButton>
            </Box>
          ) : (
            <Box>
              <Button
                rel='noopener noreferrer'
                href={starTrackGitHubRepo}
                target='_blank'
                sx={{ m: 2 }}
                color='inherit'
                variant='outlined'
                startIcon={<GitHubIcon />}
              >
                Project On GitHub
              </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  )
}
