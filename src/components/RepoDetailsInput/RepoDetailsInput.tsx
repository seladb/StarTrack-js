import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import RepoDetailsInputDesktop from "./RepoDetailsInputDesktop";
import RepoDetailsInputMobile from "./RepoDetailsInputMobile";
import RepoDetailsInputProps from "./RepoDetailsInputProps";

export default function RepoDetailsInput(props: RepoDetailsInputProps) {
  const theme = useTheme();
  const smallScreen = useMediaQuery(theme.breakpoints.down(550));

  return smallScreen ? (
    <RepoDetailsInputMobile {...props} />
  ) : (
    <RepoDetailsInputDesktop {...props} />
  );
}
