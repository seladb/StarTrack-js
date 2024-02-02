import React, { KeyboardEvent } from "react";
import { TextField, TextFieldProps, Box, BoxProps, Stack } from "@mui/material";
import LoadingButton from "./LoadingButton";
import RepoDetailsInputProps from "./RepoDetailsInputProps";
import { parseGitHubUrl } from "../../utils/GitHubUtils";
import StarTrackTooltip from "../../shared/Tooltip";

interface RepoInputLabelProps extends BoxProps {
  prepend?: boolean;
}

const componentMaxWidth = 800;
const goButtonWidth = 155;

const RepoInputLabel = React.forwardRef<BoxProps, RepoInputLabelProps>(
  function RepoInputLabel(props, ref) {
    const { prepend, children, ...otherProps } = props;

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
          ...(prepend && {
            borderTopLeftRadius: 4,
            borderBottomLeftRadius: 4,
          }),
        }}
        {...otherProps}
      >
        {children}
      </Box>
    );
  },
);

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

  const repoInputRef = React.useRef<HTMLInputElement>();

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

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Enter") {
      onGoClick(username.trim(), repo.trim());
      event.preventDefault();
    }

    if (event.key === "/") {
      repoInputRef.current && repoInputRef.current.focus();
      event.preventDefault();
    }
  };

  return (
    <Stack direction="row" sx={{ maxWidth: componentMaxWidth }}>
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
        inputRef={repoInputRef}
      />
      <LoadingButton
        sx={{ width: goButtonWidth }}
        loading={loading}
        onGoClick={handleGoClick}
        onCancelClick={handleCancelClick}
      />
    </Stack>
  );
}
