import React, { useState, useRef } from "react";
import PropTypes from "prop-types";
import { Button, Modal, ProgressBar, Container } from "react-bootstrap/";
import "./MainContainer.css";
import RepoDetails from "./RepoDetails";
import ForecastChooser from "./ForecastChooser";
import ChartContainer, { LINEAR } from "./ChartContainer";
import StatsTable from "./StatsTable";
import UrlDisplay from "./UrlDisplay";
import ClosableBadge from "../shared/ClosableBadge";
import Footer from "./Footer";
import stargazerLoader from "../utils/StargazerLoader";
import stargazerStats from "./../utils/StargazerStats";
import gitHubUtils from "../utils/GitHubUtils";

export default function MainContainer({ preloadedRepos }) {
  const [repos, setRepos] = useState(preloadedRepos || []);

  const [alert, setAlert] = useState({
    show: false,
    title: "",
    message: "",
  });

  const [loadingStatus, setLoadingStatus] = useState({
    isLoading: false,
    loadProgress: 0,
  });

  const [chartType, setChartType] = useState(LINEAR);

  const [forecastProps, setForecastProps] = useState(null);

  const onLoadInProgress = (progress) => {
    setLoadingStatus({
      isLoading: true,
      loadProgress: progress,
    });
  };

  const requestStopLoading = useRef();
  const syncChartTimeRangeWithStats = useRef(false);
  const currentChartTimeRange = useRef(null);

  const showAlert = (title, message) => {
    setAlert({
      show: true,
      title: title,
      message: message,
    });
  };

  const closeAlert = () => {
    setAlert({
      show: false,
      title: "",
      message: "",
    });
  };

  const getRepoStargazers = async (username, repo) => {
    if (!username || username === "" || !repo || repo === "") {
      showAlert(
        "Missing details",
        "Please provide both Username and Repo name"
      );
      return;
    }

    if (
      repos.find(
        (repoIter) => repoIter.username === username && repoIter.repo === repo
      ) !== undefined
    ) {
      showAlert("Repo exists", "Repo already exists");
      return;
    }

    requestStopLoading.current = false;

    try {
      const stargazerData = await stargazerLoader.loadStargazers(
        username,
        repo,
        forecastProps,
        onLoadInProgress,
        () => requestStopLoading.current
      );

      if (stargazerData !== null) {
        setRepos([...repos, stargazerData]);
      }

      setLoadingStatus({
        isLoading: false,
        loadProgress: 0,
      });
    } catch (error) {
      showAlert("Error loading stargazers", error.message);
      setLoadingStatus({
        isLoading: false,
        loadProgress: 0,
      });
    }

    requestStopLoading.current = false;
  };

  const handleStopLoading = () => {
    requestStopLoading.current = true;
  };

  const handleRemoveRepo = (repoDetails) => {
    // if this is the last repo, cleanup forecast
    if (repos.length === 1) {
      setForecastProps(null);
    }

    setRepos(
      repos.filter((repo) => {
        return (
          repo.username !== repoDetails.username ||
          repo.repo !== repoDetails.repo
        );
      })
    );
  };

  const handleChartTimeRangeChange = (newTimeRange) => {
    currentChartTimeRange.current = newTimeRange;
    if (syncChartTimeRangeWithStats.current) {
      const reposWithUpdatedStats = repos.slice();
      for (let index = 0; index < reposWithUpdatedStats.length; index++) {
        reposWithUpdatedStats[index].stats = stargazerStats.calcStats(
          reposWithUpdatedStats[index].stargazerData,
          syncChartTimeRangeWithStats.current
            ? currentChartTimeRange.current
            : null
        );
      }

      setRepos(reposWithUpdatedStats);
    }
  };

  const handleRequestToSyncChartTimeRange = (flag) => {
    syncChartTimeRangeWithStats.current = flag;
    const reposWithUpdatedStats = repos.slice();
    for (let index = 0; index < reposWithUpdatedStats.length; index++) {
      reposWithUpdatedStats[index].stats = stargazerStats.calcStats(
        reposWithUpdatedStats[index].stargazerData,
        flag ? currentChartTimeRange.current : null
      );
    }

    setRepos(reposWithUpdatedStats);
  };

  const handleForecastProps = (forecastProps) => {
    const reposWithForecast = repos.slice();
    for (let index = 0; index < reposWithForecast.length; index++) {
      reposWithForecast[index].forecast =
        forecastProps === null
          ? null
          : stargazerStats.calcForecast(
              reposWithForecast[index].stargazerData,
              forecastProps.daysBackwards,
              forecastProps.daysForward,
              forecastProps.numValues
            );
    }

    setRepos(reposWithForecast);
    setForecastProps(forecastProps);
  };

  return (
    <div>
      {loadingStatus.isLoading ? (
        <ProgressBar
          now={loadingStatus.loadProgress}
          variant="success"
          animated
        />
      ) : (
        <div className="progress MainContainer-progressBarPlaceholder" />
      )}
      <RepoDetails
        onRepoDetails={getRepoStargazers}
        loadInProgress={loadingStatus.isLoading}
        onStopClick={handleStopLoading}
      />
      <Container>
        <div className="MainContainer-closableBadgesWrapper">
          {repos.map((repoData) => (
            <div
              className="MainContainer-closableBadgeContainer"
              key={repoData.username + "/" + repoData.repo}
            >
              <ClosableBadge
                text={repoData.username + "/" + repoData.repo}
                badgeCookieData={{
                  username: repoData.username,
                  repo: repoData.repo,
                }}
                onBadgeClose={handleRemoveRepo}
                color={repoData.color}
                href={gitHubUtils.getRepoUrl(repoData.username, repoData.repo)}
              />
            </div>
          ))}
        </div>
      </Container>
      {repos.length > 0 ? (
        <ChartContainer
          repos={repos}
          onTimeRangeChange={handleChartTimeRangeChange}
          chartType={chartType}
          onChartTypeChange={setChartType}
        />
      ) : null}
      {repos.length > 0 ? (
        <ForecastChooser onForecastProps={handleForecastProps} />
      ) : null}
      {repos.length > 0 ? (
        <Container>
          <StatsTable
            repos={repos}
            requestToSyncChartTimeRange={handleRequestToSyncChartTimeRange}
          />
        </Container>
      ) : null}
      {repos.length > 0 ? (
        <Container>
          <UrlDisplay repos={repos} />
        </Container>
      ) : null}
      <Footer pageEmpty={repos.length === 0} />
      <Modal show={alert.show} onHide={closeAlert}>
        <Modal.Header closeButton>
          <Modal.Title>{alert.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{alert.message}</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={closeAlert}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
MainContainer.propTypes = {
  preloadedRepos: PropTypes.object,
};
