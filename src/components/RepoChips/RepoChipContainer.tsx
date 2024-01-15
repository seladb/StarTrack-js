import RepoChip from "./RepoChip";
import { Box, Stack } from "@mui/material";

interface RepoChipContainerProps {
  reposDetails: Array<{
    user: string;
    repo: string;
    color: string;
  }>;
  onDelete?: (user: string, repo: string) => void;
}

export default function RepoChipContainer({ reposDetails, onDelete }: RepoChipContainerProps) {
  const handleDelete = (user: string, repo: string) => {
    onDelete && onDelete(user, repo);
  };

  return (
    <Stack
      direction="row"
      spacing={2}
      useFlexGap
      flexWrap="wrap"
      alignContent="center"
      justifyContent="center"
    >
      {reposDetails.map(({ user, repo, color }) => {
        return (
          <Box key={`${user}/${repo}`}>
            <RepoChip user={user} repo={repo} color={color} onDelete={handleDelete} />
          </Box>
        );
      })}
    </Stack>
  );
}
