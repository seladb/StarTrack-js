import { Container } from "@mui/system";
import React from "react";
import RepoDetailsInput from "./RepoDetailsInput";
import RepoChipContainer from "./RepoChips";
import { loadStargazers } from "../utils/StargazerLoader";
import RepoInfo from "../utils/RepoInfo";
import { useAlertDialog } from "../shared/AlertContext";
import { useProgress } from "../shared/ProgressContext";

export default function MainContainer() {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [repoInfos, setRepoInfos] = React.useState<Array<RepoInfo>>([]);
  const requestStopLoading = React.useRef<boolean>(false);

  const { showAlert } = useAlertDialog();

  const { startProgress, setProgress, endProgress } = useProgress();

  const handleRemoveRepo = (user: string, repo: string) => {
    setRepoInfos(
      repoInfos.filter((repoInfo) => {
        return repoInfo.repo !== repo || repoInfo.username !== user;
      }),
    );
  };

  const handleProgress = (value: number) => {
    setProgress(value);
  };

  const handleLoadRepo = async (user: string, repo: string) => {
    if (!user || !repo) {
      showAlert("Please provide both Username and Repo name");
      return;
    }

    if (
      repoInfos.find(
        (repoInfo) =>
          repoInfo.repo.toLowerCase() === repo.toLowerCase() &&
          repoInfo.username.toLowerCase() === user.toLowerCase(),
      )
    ) {
      showAlert("Repo already exists");
      return;
    }

    startProgress();
    setLoading(true);
    requestStopLoading.current = false;
    try {
      const newRepoInfo = await loadStargazers(
        user,
        repo,
        handleProgress,
        () => requestStopLoading.current,
      );

      newRepoInfo && setRepoInfos([...repoInfos, newRepoInfo]);
    } catch (error) {
      showAlert(String(error));
    } finally {
      setLoading(false);
      endProgress();
    }
  };

  const handleCancelLoading = () => {
    requestStopLoading.current = true;
  };

  return (
    <Container>
      <Container sx={{ marginTop: "3rem", marginBottom: "3rem", textAlign: "center" }}>
        <RepoDetailsInput
          loading={loading}
          onGoClick={handleLoadRepo}
          onCancelClick={handleCancelLoading}
        />
      </Container>
      <Container sx={{ marginTop: "3rem", marginBottom: "3rem", textAlign: "center" }}>
        <RepoChipContainer
          reposDetails={repoInfos.map((repoInfo) => {
            return { user: repoInfo.username, repo: repoInfo.repo, color: repoInfo.color };
          })}
          onDelete={handleRemoveRepo}
        />
      </Container>
    </Container>
  );
}
