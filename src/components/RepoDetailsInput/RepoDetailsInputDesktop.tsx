import { Button, FormGroup, styled, TextField, TextFieldProps, Tooltip } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import React from "react";
import StopCircleIcon from "@mui/icons-material/StopCircle";
import { cancelBtnWidth, CancelButton } from "../../shared/CancelButton";
import RepoDetailsInputProps from "./RepoDetailsInputProps";
import { InputGroupText } from "../../shared/InputGroupText";
import SaveIcon from "@mui/icons-material/Save";
import { parseGitHubUrl } from "../../utils/GitHubUtils";

const StyledTextField = styled(TextField)<TextFieldProps>(() => ({
  flex: "1 1",
}));

export default function RepoDetailsInputDesktop({
  loading,
  onGoClick,
  onCancelClick,
}: RepoDetailsInputProps) {
  const [username, setUsername] = React.useState<string>("");
  const [repo, setRepo] = React.useState<string>("");

  const handleClick = () => {
    onGoClick(username.trim(), repo.trim());
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

  const goBtnWidth = 155 - (loading ? cancelBtnWidth : 0);

  return (
    <FormGroup sx={{ flexDirection: "row", maxWidth: "800px", margin: "auto" }}>
      <Tooltip title='Tip: you can paste any GitHub URL or string in the format of "username/repo"'>
        <InputGroupText>Repo details</InputGroupText>
      </Tooltip>
      <StyledTextField
        variant="outlined"
        size="small"
        placeholder="Username"
        value={username}
        onChange={(e) => {
          setUsername(e.target.value);
        }}
        onPaste={handlePaste}
      />
      <InputGroupText>/</InputGroupText>
      <StyledTextField
        variant="outlined"
        size="small"
        placeholder="Repo name"
        value={repo}
        onChange={(e) => {
          setRepo(e.target.value);
        }}
        onPaste={handlePaste}
      />
      {loading ? (
        <>
          <LoadingButton
            loading
            loadingPosition="start"
            startIcon={<SaveIcon />}
            variant="contained"
            sx={{ width: goBtnWidth }}
          >
            Loading...
          </LoadingButton>
          <CancelButton
            variant="contained"
            size="small"
            onClick={onCancelClick}
            startIcon={<StopCircleIcon />}
          />
        </>
      ) : (
        <Button variant="contained" size="small" sx={{ width: goBtnWidth }} onClick={handleClick}>
          Go!
        </Button>
      )}
    </FormGroup>
  );
}
