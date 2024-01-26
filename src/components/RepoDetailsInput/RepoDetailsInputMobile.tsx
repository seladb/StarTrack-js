import { Container, Stack, TextField } from "@mui/material";
import Typography from "@mui/material/Typography";
import React from "react";
import RepoDetailsInputProps from "./RepoDetailsInputProps";
import LoadingButton from "./LoadingButton";
import { parseGitHubUrl } from "../../utils/GitHubUtils";

export default function RepoDetailsInputMobile({
  loading,
  onGoClick,
  onCancelClick,
}: RepoDetailsInputProps) {
  const [username, setUsername] = React.useState<string>("");
  const [repo, setRepo] = React.useState<string>("");

  const handleGoClick = () => {
    onGoClick(username.trim(), repo.trim());
  };

  const handleCancelClick = () => {
    onCancelClick();
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLElement>) => {
    const url = parseGitHubUrl(event.clipboardData.getData("Text"));
    if (!url) {
      return;
    }
    event.preventDefault();
    setUsername(url[0]);
    setRepo(url[1]);
  };

  return (
    <Container maxWidth={false} disableGutters>
      <Stack spacing={1}>
        <Typography
          variant="h6"
          sx={{ fontWeight: "bold", display: "flex", justifyContent: "center" }}
        >
          Repo Details
        </Typography>
        <TextField
          value={username}
          size="small"
          placeholder="Username"
          onChange={(e) => {
            setUsername(e.target.value);
          }}
          onPaste={handlePaste}
        />
        <TextField
          value={repo}
          size="small"
          placeholder="Repo name"
          onChange={(e) => {
            setRepo(e.target.value);
          }}
          onPaste={handlePaste}
        />
        <LoadingButton
          loading={loading}
          onGoClick={handleGoClick}
          onCancelClick={handleCancelClick}
        />
      </Stack>
    </Container>
  );
}
