import { Chip, darken } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import * as GitHubUtils from "../../utils/GitHubUtils";

interface RepoChipProps {
  user: string;
  repo: string;
  color: string;
  onDelete?: (user: string, repo: string) => void;
}

export default function RepoChip({ user, repo, color, onDelete }: RepoChipProps) {
  const theme = useTheme();
  const handleClick = () => {
    const url = GitHubUtils.getRepoUrl(user, repo);
    window.open(url, "_blank", "noreferrer");
  };

  const handleDelete = () => {
    onDelete && onDelete(user, repo);
  };

  const fontColor = theme.palette.common.white;
  const hoverColor = darken(fontColor, 0.07);

  return (
    <Chip
      label={`${user} / ${repo}`}
      style={{ backgroundColor: color, color: fontColor }}
      onClick={handleClick}
      onDelete={handleDelete}
      sx={{
        "& .MuiChip-deleteIcon": {
          color: fontColor,
          ":hover": {
            color: hoverColor,
          },
        },
      }}
    />
  );
}
