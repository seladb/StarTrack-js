import { Chip } from "@mui/material";
import * as GitHubUtils from "../../utils/GitHubUtils";

interface RepoChipProps {
  user: string;
  repo: string;
  color: string;
}

export default function RepoChip({ user, repo, color }: RepoChipProps) {
  const handleClick = () => {
    const url = GitHubUtils.getRepoUrl(user, repo);
    window.open(url, "_blank", "noreferrer");
  };

  return (
    <Chip
      label={`${user} / ${repo}`}
      style={{ backgroundColor: color, color: "#ffffff" }}
      clickable={true}
      onClick={handleClick}
    />
  );
}
