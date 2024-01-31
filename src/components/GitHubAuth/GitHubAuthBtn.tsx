import { useTheme } from "@mui/material/styles";
import { Button, IconButton, SvgIconTypeMap, useMediaQuery } from "@mui/material";
import { OverridableComponent } from "@mui/material/OverridableComponent";

interface GitHubAuthBtnProps {
  text: string;
  Icon: OverridableComponent<SvgIconTypeMap>;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

export default function GitHubAuthBtn({ text, Icon, onClick }: GitHubAuthBtnProps) {
  const theme = useTheme();
  const smallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return smallScreen ? (
    <IconButton color="inherit" onClick={onClick}>
      <Icon />
    </IconButton>
  ) : (
    <Button color="inherit" variant="outlined" startIcon={<Icon />} onClick={onClick}>
      {text}
    </Button>
  );
}
