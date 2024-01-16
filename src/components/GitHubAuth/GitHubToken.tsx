import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { IconButton } from "@mui/material";
import KeyIcon from "@mui/icons-material/Key";
import { StorageType } from "../../utils/GitHubUtils";
import { useState } from "react";
import StarTrackTooltip from "../../shared/Tooltip";

interface GitHubTokenProps {
  accessToken: string;
  storageType: StorageType;
}
export default function GitHubToken({ accessToken, storageType }: GitHubTokenProps) {
  const theme = useTheme();
  const smallScreen = useMediaQuery(theme.breakpoints.down(750));
  const [tooltipIsOpen, setTooltipIsOpen] = useState(false);

  const accessTokenShort = accessToken.slice(-6);

  return smallScreen ? (
    <IconButton color="inherit" onClick={() => setTooltipIsOpen(!tooltipIsOpen)}>
      <StarTrackTooltip
        open={tooltipIsOpen}
        title={`Access token '${accessTokenShort}' stored in ${storageType}`}
        arrow
      >
        <KeyIcon />
      </StarTrackTooltip>
    </IconButton>
  ) : (
    <>
      <KeyIcon sx={{ m: 1 }} />
      <StarTrackTooltip title={`Access token stored in ${storageType}`} arrow>
        <p>{accessTokenShort}</p>
      </StarTrackTooltip>
    </>
  );
}
