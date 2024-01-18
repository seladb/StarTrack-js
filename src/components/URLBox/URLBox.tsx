import { Box, IconButton, Paper, TextField } from "@mui/material";
import StarTrackTooltip from "../../shared/Tooltip";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import LinkIcon from "@mui/icons-material/Link";
import React from "react";

const repoUrlParam = "r={user},{repo}";
const baseUrl = `${window.location.origin}${window.location.pathname}#/preload?`;

type RepoDetails = {
  username: string;
  repo: string;
};

interface URLBoxProps {
  repoInfos: Array<RepoDetails>;
}

export default function URLBox({ repoInfos }: URLBoxProps) {
  const [showTooltip, setShowTooltip] = React.useState<boolean>(false);
  const [url, setUrl] = React.useState<string>("");

  React.useEffect(() => {
    setUrl(calcUrl());
  }, [repoInfos]);

  const calcUrl = () => {
    return repoInfos.length === 0
      ? ""
      : baseUrl +
          repoInfos
            .map((repoInfo) =>
              repoUrlParam.replace("{user}", repoInfo.username).replace("{repo}", repoInfo.repo),
            )
            .join("&");
  };

  const copyToClipboard = async () => {
    await global.navigator.clipboard.writeText(url);
    setShowTooltip(true);
  };

  return (
    <Paper>
      <TextField
        value={url}
        disabled
        fullWidth
        InputProps={{
          startAdornment: (
            <Box display="flex" justifyContent="center" sx={{ p: 1 }}>
              <LinkIcon />
            </Box>
          ),
          endAdornment: (
            <StarTrackTooltip
              title="Copied"
              open={showTooltip}
              onClose={() => setShowTooltip(false)}
            >
              <IconButton color="primary" aria-label="directions" onClick={copyToClipboard}>
                <ContentCopyIcon />
              </IconButton>
            </StarTrackTooltip>
          ),
        }}
      ></TextField>
    </Paper>
  );
}
