import { Container } from "@mui/system";
import React from "react";
import RepoDetailsInput from "../RepoDetailsInput";
import RepoChipContainer from "../RepoChips";
import { loadStargazers } from "../../utils/StargazerLoader";
import RepoInfo from "../../utils/RepoInfo";
import { useAlertDialog } from "../../shared/AlertContext";
import { useProgress } from "../../shared/ProgressContext";
import Chart from "../Chart";
import RepoStats from "../RepoStats";
import URLBox from "../URLBox";
import { Box, Stack } from "@mui/material";
import Forecast from "../Forecast";
import { ForecastProps, NotEnoughDataError, calcForecast } from "../../utils/StargazerStats";
import { useLocation } from "react-router-dom";

type DateRange = {
  min: string;
  max: string;
};

export default function MainContainer() {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [repoInfos, setRepoInfos] = React.useState<Array<RepoInfo>>([]);
  const [statsDateRange, setStatsDateRange] = React.useState<DateRange | undefined>(undefined);
  const [forecastProps, setForecastProps] = React.useState<ForecastProps | null | undefined>(
    undefined,
  );

  const requestStopLoading = React.useRef<boolean>(false);

  const { showAlert } = useAlertDialog();

  const { startProgress, setProgress, endProgress } = useProgress();

  const { state } = useLocation();

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
        forecastProps || undefined,
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

  const handleForecastPropsChange = (forecastProps: ForecastProps | null) => {
    setForecastProps(forecastProps);
  };

  React.useEffect(() => {
    try {
      const updatedRepoInfos = repoInfos.map((repoInfo) => ({
        ...repoInfo,
        forecast: forecastProps ? calcForecast(repoInfo.stargazerData, forecastProps) : undefined,
      }));

      setRepoInfos(updatedRepoInfos);
    } catch (error) {
      if (error instanceof NotEnoughDataError) {
        showAlert(
          `There were not enough stars in the last ${forecastProps?.daysBackwards} days to calculate the forecast`,
        );
      } else {
        showAlert("Something went wrong, please try again");
      }

      const updatedRepoInfos = repoInfos.map((repoInfo) => ({
        ...repoInfo,
        forecast: undefined,
      }));

      setRepoInfos(updatedRepoInfos);
    }
  }, [forecastProps]);

  React.useEffect(() => {
    if (repoInfos.length === 0) {
      setForecastProps(null);
    }
  }, [repoInfos]);

  React.useEffect(() => {
    if (state) {
      setRepoInfos(state);
    }
  }, state);

  return (
    <Container sx={{ marginTop: "3rem", marginBottom: "3rem" }}>
      <Stack spacing={6}>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <RepoDetailsInput
            loading={loading}
            onGoClick={handleLoadRepo}
            onCancelClick={handleCancelLoading}
          />
        </Box>
        {repoInfos.length > 0 && (
          <>
            <RepoChipContainer
              reposDetails={repoInfos.map((repoInfo) => {
                return { user: repoInfo.username, repo: repoInfo.repo, color: repoInfo.color.hex };
              })}
              onDelete={handleRemoveRepo}
            />
            <Chart repoInfos={repoInfos} onZoomChanged={handleChartZoomChange} />
            <Forecast onForecastChange={handleForecastPropsChange}></Forecast>
            <RepoStats repoInfos={repoInfos} dateRange={statsDateRange} />
            <URLBox repoInfos={repoInfos}></URLBox>
          </>
        )}
      </Stack>
    </Container>
  );
}
