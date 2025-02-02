// cspell: ignore aren

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  // TextField,
} from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import React from "react";
import { StorageType, validateAndStoreAccessToken } from "../../utils/GitHubUtils";
import { Visibility, VisibilityOff } from "@mui/icons-material";

enum TokenValidationStatus {
  Init = "init",
  Valid = "valid",
  Invalid = "invalid",
}

interface GitHubAuthFormProps {
  open: boolean;
  onClose: (accessToken: string | null) => void;
}

export default function GitHubAuthForm({ open, onClose }: GitHubAuthFormProps) {
  const [accessTokenValue, setAccessTokenValue] = React.useState<string | null>(null);
  const [accessTokenValid, setAccessTokenValid] = React.useState<TokenValidationStatus>(
    TokenValidationStatus.Init,
  );
  const [storageType, setStorageType] = React.useState<StorageType>(StorageType.SessionStorage);
  const [showAccessToken, setShowAccessToken] = React.useState(false);

  const handleStorageTypeCheckChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStorageType(event.target.checked ? StorageType.LocalStorage : StorageType.SessionStorage);
  };

  const handleLoginClick = async () => {
    if (accessTokenValue) {
      const isValid = await validateAndStoreAccessToken(accessTokenValue, storageType);
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      isValid
        ? setAccessTokenValid(TokenValidationStatus.Valid)
        : setAccessTokenValid(TokenValidationStatus.Invalid);
    } else {
      setAccessTokenValid(TokenValidationStatus.Invalid);
    }
  };

  const handleClose = () => {
    const accessToken = accessTokenValid === TokenValidationStatus.Valid ? accessTokenValue : null;
    setAccessTokenValid(TokenValidationStatus.Init);
    setAccessTokenValue(null);
    onClose(accessToken);
  };

  const textFieldHelperText = () => {
    return accessTokenValid === TokenValidationStatus.Invalid
      ? "Access token is empty or invalid."
      : "These credentials aren't stored in any server.";
  };

  const handleClickShowAccessToken = () => setShowAccessToken((show) => !show);

  React.useEffect(() => {
    if (accessTokenValid === TokenValidationStatus.Valid) {
      handleClose();
    }
  }, [accessTokenValid]);

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>GitHub Authentication</DialogTitle>
      <DialogContent>
        <DialogContentText>
          GitHub API{" "}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://developer.github.com/v3/#rate-limiting"
          >
            rate limiter
          </a>{" "}
          makes it impossible to collect stargazer data on repos with more than 3000 stars without
          GitHub authentication.
        </DialogContentText>
        <DialogContentText>
          If you&apos;d like to view stargazer data for this repo, please provide your GitHub auth
          details.
        </DialogContentText>
        <DialogContentText>
          Please note these credentials aren&apos;t stored in any server. This application is based
          on pure javascript so the credentials are only used to send authenticated requests to
          GitHub API.
        </DialogContentText>
        <DialogContentText>
          You can generate an access token{" "}
          <a target="_blank" rel="noopener noreferrer" href="https://github.com/settings/tokens">
            here
          </a>
          .
        </DialogContentText>
        <FormControl sx={{ marginTop: 2 }} fullWidth required variant="outlined">
          <InputLabel htmlFor="access-token-input">GitHub Access Token</InputLabel>
          <OutlinedInput
            autoFocus
            margin="dense"
            id="access-token-input"
            data-testid="access-token-input"
            label="GitHub Access Token"
            type={showAccessToken ? "text" : "password"}
            value={accessTokenValue || ""}
            error={accessTokenValid === TokenValidationStatus.Invalid}
            onChange={(e) => {
              setAccessTokenValue(e.target.value);
            }}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  onClick={handleClickShowAccessToken}
                  aria-label={showAccessToken ? "Access token shown" : "Access token hidden"}
                  edge="end"
                >
                  {showAccessToken ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />
          <FormHelperText id="access-token-input">{textFieldHelperText()}</FormHelperText>
        </FormControl>
        <FormControlLabel
          control={<Checkbox onChange={handleStorageTypeCheckChanged} />}
          label="Save access token in local storage"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} variant="contained">
          Close
        </Button>
        <Button onClick={handleLoginClick} variant="contained" autoFocus>
          Login
        </Button>
      </DialogActions>
    </Dialog>
  );
}
