import React from "react";
import { createStyles, makeStyles } from "@mui/styles";
import { useNavigate } from "react-router-dom";
import { ProgressProvider } from "../../shared/ProgressContext";
import RepoLoader from "./RepoLoader";
import { RepoMetadata } from "./PreloadTypes";
import RepoInfo from "../../utils/RepoInfo";
import { Theme } from "@mui/material/styles";
import { Button } from "@mui/material";

export const parseUrlParams = (urlParams: string): RepoMetadata[] => {
  const reposMetadata = new URLSearchParams(urlParams)
    .getAll("r")
    .map((value) => {
      const userAndRepoName = value && value.split(",");
      return userAndRepoName.length === 2
        ? { username: userAndRepoName[0], repo: userAndRepoName[1] }
        : null;
    })
    .filter((v) => v) as RepoMetadata[];

  // remove duplicates
  return [...new Set(reposMetadata.map((val) => JSON.stringify(val)))].map((val) =>
    JSON.parse(val),
  );
};

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    root: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "100vh",
    },
    contentArea: {
      textAlign: "center",
      margin: "2rem",
    },
    subTitle: {
      margin: 0,
    },
    progress: {
      margin: "1rem",
    },
    errorContainer: {
      textAlign: "left",
      color: theme.palette.error.main,
    },
    buttonContainer: {
      textAlign: "center",
    },
  });
});

type RepoLoadError = {
  repoMetadata: RepoMetadata;
  error: string;
};

export function Preload() {
  const classes = useStyles();
  const navigate = useNavigate();

  const [currentlyLoadingIndex, setCurrentlyLoadingIndex] = React.useState<number>(0);
  const [repoDataLoaded, setRepoDataLoaded] = React.useState<RepoInfo[]>([]);
  const [repoLoadErrors, setRepoLoadErrors] = React.useState<RepoLoadError[]>([]);

  React.useEffect(() => {
    if (currentlyLoadingIndex >= dataToLoad.length && repoLoadErrors.length === 0) {
      navigate("/", { state: repoDataLoaded });
    }
  }, [currentlyLoadingIndex]);

  const dataToLoad = parseUrlParams(location.search);

  const getSubTitle = () => {
    return currentlyLoadingIndex < dataToLoad.length
      ? `${dataToLoad[currentlyLoadingIndex].username} / ${dataToLoad[currentlyLoadingIndex].repo}`
      : repoLoadErrors.length > 0
      ? "Error loading repo data"
      : "Done!";
  };

  const handleLoadDone = (repoInfo: RepoInfo | null) => {
    if (repoInfo !== null) {
      setRepoDataLoaded([...repoDataLoaded, repoInfo]);
    }
    setCurrentlyLoadingIndex(currentlyLoadingIndex + 1);
  };

  const handleLoadError = (error: string) => {
    setRepoLoadErrors([
      ...repoLoadErrors,
      { repoMetadata: dataToLoad[currentlyLoadingIndex], error: error },
    ]);
    setCurrentlyLoadingIndex(currentlyLoadingIndex + 1);
  };

  const continueButtonClick = () => {
    navigate("/", { state: repoDataLoaded });
  };

  return (
    <div className={classes.root}>
      <div className={classes.contentArea}>
        <h1>Loading repo data...</h1>
        <h3 className={classes.subTitle}>{getSubTitle()}</h3>
        <div className={classes.progress}>
          <ProgressProvider>
            <RepoLoader
              repoDataToLoad={
                currentlyLoadingIndex < dataToLoad.length ? dataToLoad[currentlyLoadingIndex] : null
              }
              onLoadDone={handleLoadDone}
              onLoadError={handleLoadError}
            />
          </ProgressProvider>
        </div>
        {repoLoadErrors.length > 0 && (
          <div className={classes.errorContainer}>
            {repoLoadErrors.map((repoLoadError, i) => {
              return (
                <h4 key={i}>
                  <strong>
                    Error loading {repoLoadError.repoMetadata.username}/
                    {repoLoadError.repoMetadata.repo}:
                  </strong>{" "}
                  {repoLoadError.error}
                </h4>
              );
            })}
            <div className={classes.buttonContainer}>
              <Button variant="contained" onClick={continueButtonClick}>
                Continue
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
