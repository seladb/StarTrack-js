import { AppBar, Box, IconButton, Toolbar, Typography } from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import packageJson from "../../../package.json";
import { GitHubAuth } from "../GitHubAuth";
import { starTrackGitHubRepo } from "../../utils/Constants";

export default function TopNav() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Box
          component="img"
          src="star-icon.png"
          alt="logo"
          sx={{
            width: 32,
            height: 32,
          }}
          className="d-inline-block align-top"
        />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, m: 1 }}>
          StarTrack v{packageJson.version}
        </Typography>
        <GitHubAuth />
        <IconButton
          rel="noopener noreferrer"
          href={starTrackGitHubRepo}
          target="_blank"
          color="inherit"
        >
          <GitHubIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}
