import { AppBar, Box, IconButton, Stack, Toolbar, Typography, useTheme } from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import LightModeIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeIcon from "@mui/icons-material/DarkModeOutlined";
import packageJson from "../../../package.json";
import { GitHubAuth } from "../GitHubAuth";
import { starTrackGitHubRepo } from "../../utils/Constants";
import { useThemeActions } from "../../shared/ThemeProvider";

export default function TopNav() {
  const theme = useTheme();
  const { switchColorMode } = useThemeActions();

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
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          StarTrack v{packageJson.version}
        </Typography>
        <Stack direction="row" spacing={1}>
          <GitHubAuth />
          <IconButton onClick={switchColorMode}>
            {theme.palette.mode === "light" ? (
              <LightModeIcon sx={{ color: theme.palette.common.white }} />
            ) : (
              <DarkModeIcon color="inherit" />
            )}
          </IconButton>
          <IconButton
            rel="noopener noreferrer"
            href={starTrackGitHubRepo}
            target="_blank"
            color="inherit"
          >
            <GitHubIcon />
          </IconButton>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
