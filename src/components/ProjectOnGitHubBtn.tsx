import { useTheme } from "@mui/material/styles"
import useMediaQuery from "@mui/material/useMediaQuery"
import { Box, Button, IconButton } from "@mui/material"
import GitHubIcon from "@mui/icons-material/GitHub"

export default function ProjectOnGitHubBtn() {
  const starTrackGitHubRepo = "https://github.com/seladb/startrack-js"
  const theme = useTheme()
  const smallScreen = useMediaQuery(theme.breakpoints.down("sm"))

  return smallScreen ? (
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
        color='inherit'
        variant='outlined'
        startIcon={<GitHubIcon />}
      >
        Project On GitHub
      </Button>
    </Box>
  )
}
