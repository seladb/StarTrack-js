import { Container, Box } from "@mui/system";
import RepoChip from "./RepoChip";

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
    <Container sx={{ marginTop: "3rem", marginBottom: "3rem" }}>
      {reposDetails.map(({ user, repo, color }) => {
        return (
          <Box key={`${user}/${repo}`} sx={{ display: "inline-flex", margin: "0.4em" }}>
            <RepoChip user={user} repo={repo} color={color} onDelete={handleDelete} />
          </Box>
        );
      })}
    </Container>
  );
}
