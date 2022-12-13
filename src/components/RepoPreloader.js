import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { Container, ProgressBar, Button } from "react-bootstrap/";
import "./RepoPreloader.css";
import MainPage from "./MainPage";

export default function RepoPreloader({ location }) {
  const parseUrlParams = () => {
    const searchParams = new URLSearchParams(location.search);
    const result = [];
    searchParams.forEach((value, key) => {
      if (key === "r") {
        const repo = value.split(",");
        if (
          repo.length === 2 &&
          result.find(
            (iter) => iter.username === repo[0] && iter.repo === repo[1]
          ) === undefined
        ) {
          result.push({
            username: repo[0],
            repo: repo[1],
          });
        }
      }
    });
    return result;
  };

  const reposToPreload = useRef();
  const currentlyLoadingIndex = useRef();

  const [loadProgress, setLoadProgress] = useState(0);
  const [finishedLoading, setFinishedLoading] = useState(false);
  const [reposLoaded, setReposLoaded] = useState([]);
  const [errors, setErrors] = useState([]);

  const handleButtonClick = () => {
    setErrors([]);
  };

  const getProgressBarVariant = () => {
    if (finishedLoading && errors.length > 0) {
      return "warning";
    }

    return "success";
  };

  const getSecondaryHeaderMessage = () => {
    if (finishedLoading && errors.length > 0) {
      return "Error loading repos";
    }

    if (reposToPreload.current === undefined) {
      return "";
    }

    return (
      reposToPreload.current[currentlyLoadingIndex.current].username +
      "/" +
      reposToPreload.current[currentlyLoadingIndex.current].repo
    );
  };

  const loadStargazers = async () => {
    const repoToPreload = reposToPreload.current[currentlyLoadingIndex.current];

    try {
      const stargazerData = await stargazerLoader.loadStargazers(
        repoToPreload.username,
        repoToPreload.repo,
        null,
        (progress) => setLoadProgress(progress),
        () => false
      );

      setReposLoaded([...reposLoaded, stargazerData]);
    } catch (error) {
      setErrors([
        ...errors,
        { repoDetails: repoToPreload, message: error.message },
      ]);
    }

    currentlyLoadingIndex.current = currentlyLoadingIndex.current + 1;
  };

  useEffect(() => {
    reposToPreload.current = parseUrlParams();
    if (reposToPreload.current.length > 0) {
      currentlyLoadingIndex.current = 0;
      loadStargazers();
    } else {
      setFinishedLoading(true);
      setLoadProgress(100);
    }
  }, []);

  useEffect(() => {
    if (reposLoaded.length > 0 || errors.length > 0) {
      if (currentlyLoadingIndex.current < reposToPreload.current.length) {
        loadStargazers();
      } else {
        setFinishedLoading(true);
        setLoadProgress(100);
      }
    }
  }, [reposLoaded, errors]);

  return (
    <div>
      {finishedLoading === false || errors.length > 0 ? (
        <Container className="RepoPreloader-topContainer">
          <h3>Loading Repos Data...</h3>
          <h5>{getSecondaryHeaderMessage()}</h5>
          <ProgressBar
            className="RepoPreloader-ProgressBar-Reseting"
            now={loadProgress}
            variant={getProgressBarVariant()}
            animated
          />
          {errors.length > 0 ? (
            <Container className="RepoPreloader-errorContainer">
              {errors.map((error, i) => (
                <h6 key={i}>
                  <b>
                    Error loading {error.repoDetails.username}/
                    {error.repoDetails.repo}:
                  </b>{" "}
                  {error.message}
                </h6>
              ))}
              {finishedLoading ? (
                <Button onClick={handleButtonClick}>Continue</Button>
              ) : null}
            </Container>
          ) : null}
        </Container>
      ) : (
        <MainPage preloadedRepos={reposLoaded} />
      )}
    </div>
  );
}
RepoPreloader.propTypes = {
  location: PropTypes.string,
};
