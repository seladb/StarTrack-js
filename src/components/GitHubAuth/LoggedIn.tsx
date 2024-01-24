import React from "react";
import KeyIcon from "@mui/icons-material/Key";
import {
  Button,
  Menu,
  MenuItem,
  Divider,
  IconButton,
  useMediaQuery,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { StorageType, getStorageType, removeAccessToken } from "../../utils/GitHubUtils";

interface LoggedInProps {
  accessToken: string;
  onLogOut: () => void;
}

export default function LoggedIn({ accessToken, onLogOut }: LoggedInProps) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const theme = useTheme();

  const getAccessTokenText = () => {
    return accessToken.slice(-6);
  };

  const getStorageTypeText = () => {
    return getStorageType() || StorageType.SessionStorage;
  };

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleLogoutClick = () => {
    handleCloseMenu();
    removeAccessToken();
    onLogOut();
  };

  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const ButtonSmallScreen = (
    <IconButton color="inherit" onClick={handleOpenMenu}>
      <KeyIcon />
    </IconButton>
  );

  const ButtonLargeScreen = (
    <Button variant="outlined" color="inherit" onClick={handleOpenMenu} startIcon={<KeyIcon />}>
      {getAccessTokenText()}
    </Button>
  );

  return (
    <>
      {isSmallScreen ? ButtonSmallScreen : ButtonLargeScreen}
      <Menu
        data-testid="menu-navbar"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
      >
        {isSmallScreen && (
          <MenuItem disabled>
            <ListItemIcon>
              <KeyIcon />
            </ListItemIcon>
            <ListItemText>{getAccessTokenText()}</ListItemText>
          </MenuItem>
        )}
        <MenuItem disabled>Stored in {getStorageTypeText()}</MenuItem>
        <Divider />
        <MenuItem onClick={handleLogoutClick}>Log out</MenuItem>
      </Menu>
    </>
  );
}
