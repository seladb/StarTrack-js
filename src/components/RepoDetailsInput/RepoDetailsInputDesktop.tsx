import React, { KeyboardEvent } from "react";
import { Button, TextField, TextFieldProps, Box, BoxProps, Stack } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import StopCircleIcon from "@mui/icons-material/StopCircle";
import { cancelBtnWidth, CancelButton } from "../../shared/CancelButton";
import RepoDetailsInputProps from "./RepoDetailsInputProps";
import SaveIcon from "@mui/icons-material/Save";
import { parseGitHubUrl } from "../../utils/GitHubUtils";
import StarTrackTooltip from "../../shared/Tooltip";

interface RepoInputLabelProps extends BoxProps {
  prepend?: boolean;
}

const RepoInputLabel = React.forwardRef<BoxProps, RepoInputLabelProps>(function RepoInputLabel(
  props,
  ref,
) {
  return (
    <Box
      ref={ref}
      component="div"
      sx={{
        backgroundColor: (theme) => theme.palette.grey[200],
        borderColor: (theme) => `${theme.palette.grey[400]} !important`,
        fontSize: (theme) => theme.typography.fontSize,
        border: "1px solid",
        display: "flex",
        alignItems: "center",
        paddingRight: 2,
        paddingLeft: 2,
        ...(props.prepend && {
          borderTopLeftRadius: 4,
          borderBottomLeftRadius: 4,
        }),
      }}
      {...props}
    >
      {props.children}
    </Box>
  );
});

function RepoInputTextField(props: TextFieldProps) {
  return (
    <TextField
      size="small"
      sx={{
        flex: "1 1",
        "& fieldset": {
          borderRadius: 0,
        },
      }}
      {...props}
    />
  );
}

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

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Enter") {
      onGoClick(username.trim(), repo.trim());
      event.preventDefault();
    }
  };

  const goBtnWidth = 155 - (loading ? cancelBtnWidth : 0);

  return (
    <Stack direction="row" sx={{ maxWidth: 800 }}>
      <StarTrackTooltip title='Tip: you can paste any GitHub URL or string in the format of "username/repo"'>
        <RepoInputLabel prepend>Repo details</RepoInputLabel>
      </StarTrackTooltip>
      <RepoInputTextField
        placeholder="Username"
        value={username}
        onChange={(e) => {
          setUsername(e.target.value);
        }}
        onPaste={handlePaste}
        onKeyDown={handleKeyDown}
      />
      <RepoInputLabel>/</RepoInputLabel>
      <RepoInputTextField
        placeholder="Repo name"
        value={repo}
        onChange={(e) => {
          setRepo(e.target.value);
        }}
        onPaste={handlePaste}
        onKeyDown={handleKeyDown}
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
    </Stack>
  );
}
