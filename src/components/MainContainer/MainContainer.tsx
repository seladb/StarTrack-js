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
import { ForecastProps, NotEnoughDataError, calcForecast } from "../../utils/StargazerStats";
import { useLocation } from "react-router-dom";
import { getRepoStargazerCount } from "../../utils/GitHubUtils";
import { Forecast, ForecastInfo } from "../Forecast";

type DateRange = {
  min: string;
  max: string;
};

export default function MainContainer() {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [repoInfos, setRepoInfos] = React.useState<Array<RepoInfo>>([]);
  const [statsDateRange, setStatsDateRange] = React.useState<DateRange | undefined>(undefined);
  const [forecastInfo, setForecastInfo] = React.useState<ForecastInfo | null>(null);

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
      const stargazerCount = await getRepoStargazerCount(user, repo);

      const newRepoInfo = await loadStargazers(
        user,
        repo,
        handleProgress,
        () => requestStopLoading.current,
        forecastInfo?.toForecastProps() || undefined,
      );

      newRepoInfo && setRepoInfos([...repoInfos, newRepoInfo]);

      if (newRepoInfo && stargazerCount > newRepoInfo.stargazerData.starCounts.length) {
        const stargazerCountShort = Intl.NumberFormat("en-US", { notation: "compact" }).format(
          stargazerCount,
        );
        const repoInfoStarCountShort = Intl.NumberFormat("en-US", { notation: "compact" }).format(
          newRepoInfo.stargazerData.starCounts.length,
        );
        showAlert(
          `This repo has too many stars (${stargazerCountShort}), GitHub API only allows fetching the first ${repoInfoStarCountShort} stars`,
          "warning",
        );
      }
    } catch (error) {
      let errorMessage = String(error);
      if (error instanceof NotEnoughDataError) {
        errorMessage = `${user}/${repo}: not enough stars in the last ${forecastInfo?.toForecastProps().daysBackwards} days to calculate forecast. Please turn off forecast to display this repo's info`;
      }
      showAlert(errorMessage);
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

  const handleForecastInfoChange = (forecastInfo: ForecastInfo | null) => {
    setForecastInfo(forecastInfo);
  };

  const calcForecastAndThrowErrorIfNeeded = (repoInfo: RepoInfo, forecastProps: ForecastProps) => {
    try {
      return calcForecast(repoInfo.stargazerData, forecastProps);
    } catch (error) {
      if (error instanceof NotEnoughDataError) {
        throw new NotEnoughDataError(
          `${repoInfo.username}/${repoInfo.repo}: there were not enough stars in the last ${forecastProps.daysBackwards} days to calculate the forecast`,
        );
      } else {
        throw error;
      }
    }
  };

  React.useEffect(() => {
    try {
      const updatedRepoInfos = repoInfos.map((repoInfo) => ({
        ...repoInfo,
        forecast: forecastInfo
          ? calcForecastAndThrowErrorIfNeeded(repoInfo, forecastInfo.toForecastProps())
          : undefined,
      }));

      setRepoInfos(updatedRepoInfos);
    } catch (error) {
      if (error instanceof NotEnoughDataError) {
        showAlert(error.message);
      } else {
        showAlert("Something went wrong, please try again");
      }

      const updatedRepoInfos = repoInfos.map((repoInfo) => ({
        ...repoInfo,
        forecast: undefined,
      }));

      setRepoInfos(updatedRepoInfos);
      setForecastInfo(null);
    }
  }, [forecastInfo]);

  React.useEffect(() => {
    if (repoInfos.length === 0) {
      setForecastInfo(null);
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
            <Forecast
              forecastInfo={forecastInfo}
              onForecastInfoChange={handleForecastInfoChange}
            ></Forecast>
            <RepoStats repoInfos={repoInfos} dateRange={statsDateRange} />
            <URLBox repoInfos={repoInfos}></URLBox>
          </>
        )}
      </Stack>
    </Container>
  );
}
