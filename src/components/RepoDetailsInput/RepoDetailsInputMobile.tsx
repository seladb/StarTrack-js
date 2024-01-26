import { Container, Stack, styled, TextField, TextFieldProps } from "@mui/material";
import Typography from "@mui/material/Typography";
import React from "react";
import RepoDetailsInputProps from "./RepoDetailsInputProps";
import LoadingButton from "./LoadingButton";
import { parseGitHubUrl } from "../../utils/GitHubUtils";

const StyledTextField = styled(TextField)<TextFieldProps>(() => ({
  marginTop: "2px",
  marginBottom: "2px",
}));

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
      <Stack>
        <Typography variant="body1" sx={{ margin: "auto", fontWeight: "bold" }}>
          Repo Details
        </Typography>
        <StyledTextField
          value={username}
          size="small"
          placeholder="Username"
          onChange={(e) => {
            setUsername(e.target.value);
          }}
          onPaste={handlePaste}
        />
        <StyledTextField
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
