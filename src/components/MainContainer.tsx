import { Container } from "@mui/system";
import React from "react";
import RepoDetailsInput from "./RepoDetailsInput";
import RepoChipContainer from "./RepoChips";
import { loadStargazers } from "../utils/StargazerLoader";
import RepoInfo from "../utils/RepoInfo";
import { useAlertDialog } from "../shared/AlertContext";
import { useProgress } from "../shared/ProgressContext";
import Chart from "./Chart";
import StatsGrid from "./StatsGrid";
import URLBox from "./URLBox";

type DateRange = {
  min: string;
  max: string;
};

export default function MainContainer() {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [repoInfos, setRepoInfos] = React.useState<Array<RepoInfo>>([]);
  const [statsDateRange, setStatsDateRange] = React.useState<DateRange | undefined>(undefined);

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

  const handleChartZoomChange = React.useCallback((start: string, end: string) => {
    setStatsDateRange({ min: start, max: end });
  }, []);

  return (
    <Container>
      <Container sx={{ marginTop: "3rem", marginBottom: "3rem", textAlign: "center" }}>
        <RepoDetailsInput
          loading={loading}
          onGoClick={handleLoadRepo}
          onCancelClick={handleCancelLoading}
        />
      </Container>
      {repoInfos.length > 0 && (
        <Container>
          <Container sx={{ marginTop: "3rem", marginBottom: "3rem", textAlign: "center" }}>
            <RepoChipContainer
              reposDetails={repoInfos.map((repoInfo) => {
                return { user: repoInfo.username, repo: repoInfo.repo, color: repoInfo.color.hex };
              })}
              onDelete={handleRemoveRepo}
            />
          </Container>
          <Container
            sx={{ marginTop: "3rem", marginBottom: "3rem", textAlign: "center", padding: "0" }}
          >
            <Chart repoInfos={repoInfos} onZoomChanged={handleChartZoomChange} />
          </Container>
          <Container sx={{ marginTop: "3rem", marginBottom: "3rem" }}>
            <StatsGrid repoInfos={repoInfos} dateRange={statsDateRange}></StatsGrid>
          </Container>
          <Container sx={{ marginTop: "3rem", marginBottom: "3rem" }}>
            <URLBox repoInfos={repoInfos}></URLBox>
          </Container>
        </Container>
      )}
    </Container>
  );
}
