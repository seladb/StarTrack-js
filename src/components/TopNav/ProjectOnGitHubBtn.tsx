import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Box, Button, IconButton } from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import { starTrackGitHubRepo } from "../../utils/Constants";

export default function ProjectOnGitHubBtn() {
  const theme = useTheme();
  const smallScreen = useMediaQuery(theme.breakpoints.down(750));

  return smallScreen ? (
    <Box>
      <IconButton
        rel="noopener noreferrer"
        href={starTrackGitHubRepo}
        target="_blank"
        color="inherit"
      >
        <GitHubIcon />
      </IconButton>
    </Box>
  ) : (
    <Box>
      <Button
        rel="noopener noreferrer"
        href={starTrackGitHubRepo}
        target="_blank"
        color="inherit"
        variant="outlined"
        startIcon={<GitHubIcon />}
      >
        Project On GitHub
      </Button>
    </Box>
  );
}
