import { Box, IconButton, Typography } from "@mui/material";
import GitHubButton from "react-github-btn";
import GitHubIcon from "@mui/icons-material/GitHub";
import TwitterIcon from "@mui/icons-material/Twitter";
import EmailIcon from "@mui/icons-material/Email";
import {
  starTrackGitHubMaintainer,
  starTrackGitHubRepo,
  twitter,
  email,
} from "../../utils/Constants";

export default function Footer() {
  return (
    <Box
      sx={{
        backgroundColor: (theme) => theme.palette.grey[200],
        color: (theme) => theme.palette.text.secondary,
        flexShrink: 0,
      }}
      component="footer"
    >
      <Box sx={{ justifyContent: "center", alignItems: "center", display: "flex", padding: 1 }}>
        <Typography variant="subtitle1" sx={{ paddingRight: "5px" }}>
          {"Created by "}
        </Typography>
        <GitHubButton
          href="https://github.com/seladb"
          data-color-scheme="no-preference: light; light: light; dark: light;"
          data-size="large"
          aria-label="Follow @seladb on GitHub"
        >
          @{starTrackGitHubMaintainer}
        </GitHubButton>
        <Typography variant="subtitle1" sx={{ paddingLeft: "5px", paddingRight: "5px" }}>
          {new Date().getFullYear()}. Give us a{" "}
        </Typography>
        <GitHubButton
          href={starTrackGitHubRepo}
          data-color-scheme="no-preference: light; light: light; dark: light;"
          data-icon="octicon-star"
          data-size="large"
          aria-label="Star seladb/startrack-js on GitHub"
        >
          Star
        </GitHubButton>
      </Box>
      <Box sx={{ justifyContent: "center", alignItems: "center", display: "flex" }}>
        <IconButton
          rel="noopener noreferrer"
          href={starTrackGitHubRepo}
          target="_blank"
          color="inherit"
        >
          <GitHubIcon />
        </IconButton>
        <IconButton rel="noopener noreferrer" href={twitter} target="_blank" color="inherit">
          <TwitterIcon />
        </IconButton>
        <IconButton
          rel="noopener noreferrer"
          href={`mailto:${email}`}
          target="_blank"
          color="inherit"
        >
          <EmailIcon />
        </IconButton>
      </Box>
    </Box>
  );
}
