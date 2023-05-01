import { Divider, IconButton, InputBase, Paper, Tooltip } from "@mui/material";
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
  const [showTooltip, setShowTooltip] = React.useState(false);

  const url =
    repoInfos.length === 0
      ? ""
      : baseUrl +
        repoInfos
          .map((repoInfo) =>
            repoUrlParam.replace("{user}", repoInfo.username).replace("{repo}", repoInfo.repo),
          )
          .join("&");

  const copyToClipboard = async () => {
    await global.navigator.clipboard.writeText(url);
    setShowTooltip(true);
  };

  return (
    <Paper
      component="form"
      sx={{ display: "flex", alignItems: "center", width: "100%" }}
      elevation={3}
    >
      <LinkIcon sx={{ p: "10px" }} />
      <InputBase fullWidth sx={{ m: 1 }} disabled value={url} defaultValue={url} />
      <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
      <Tooltip title="Copied" open={showTooltip} onClose={() => setShowTooltip(false)}>
        <IconButton
          color="primary"
          sx={{ p: "10px" }}
          aria-label="directions"
          onClick={copyToClipboard}
        >
          <ContentCopyIcon />
        </IconButton>
      </Tooltip>
    </Paper>
  );
}
