import { IconButton, Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
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
  const theme = useTheme();

  return (
    <Stack
      color={theme.palette.text.secondary}
      sx={{
        backgroundColor: (theme) => theme.palette.grey[200],
      }}
      padding={1}
      display="flex"
      alignItems="center"
      component="footer"
    >
      <Stack direction={{ xs: "column", sm: "row" }} alignItems="center" spacing={1}>
        <Stack direction="row" spacing={1}>
          <Typography variant="subtitle1">Created by</Typography>
          <GitHubButton
            href="https://github.com/seladb"
            data-color-scheme="no-preference: light; light: light; dark: light;"
            data-size="large"
            aria-label="Follow @seladb on GitHub"
          >
            @{starTrackGitHubMaintainer}
          </GitHubButton>
          <Typography variant="subtitle1">{new Date().getFullYear()}</Typography>
        </Stack>
        <Stack direction="row" spacing={1}>
          <Typography variant="subtitle1">Give us a </Typography>
          <GitHubButton
            href={starTrackGitHubRepo}
            data-color-scheme="no-preference: light; light: light; dark: light;"
            data-icon="octicon-star"
            data-size="large"
            aria-label="Star seladb/startrack-js on GitHub"
          >
            Star
          </GitHubButton>
        </Stack>
      </Stack>
      <Stack direction="row" spacing={1}>
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
      </Stack>
    </Stack>
  );
}
