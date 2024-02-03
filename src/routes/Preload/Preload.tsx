import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ProgressProvider } from "../../shared/ProgressContext";
import RepoLoader from "./RepoLoader";
import { RepoMetadata } from "./PreloadTypes";
import RepoInfo from "../../utils/RepoInfo";
import { useTheme } from "@mui/material/styles";
import { Alert, Button, Container, Grid, Stack, Typography } from "@mui/material";
import { grey, red } from "@mui/material/colors";

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

type RepoLoadError = {
  repoMetadata: RepoMetadata;
  error: string;
};

export function Preload() {
  const theme = useTheme();
  const navigate = useNavigate();

  const [currentlyLoadingIndex, setCurrentlyLoadingIndex] = React.useState<number>(0);
  const [repoDataLoaded, setRepoDataLoaded] = React.useState<RepoInfo[]>([]);
  const [repoLoadErrors, setRepoLoadErrors] = React.useState<RepoLoadError[]>([]);

  React.useEffect(() => {
    if (currentlyLoadingIndex >= dataToLoad.length && repoLoadErrors.length === 0) {
      navigate("/", { state: repoDataLoaded });
    }
  }, [currentlyLoadingIndex]);

  const { search } = useLocation();
  const dataToLoad = parseUrlParams(search);

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
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      sx={{ minHeight: "100vh" }}
    >
      <Stack
        spacing={2}
        minWidth={theme.breakpoints.values.sm}
        sx={{
          maxWidth: "sm",
          textAlign: "center",
          p: 2,
          border: 1,
          borderRadius: 4,
          borderWidth: 2,
          borderColor: grey[300],
        }}
      >
        <Typography variant="h4">Loading repo data...</Typography>
        <Typography variant="h6">{getSubTitle()}</Typography>
        <ProgressProvider>
          <RepoLoader
            repoDataToLoad={
              currentlyLoadingIndex < dataToLoad.length ? dataToLoad[currentlyLoadingIndex] : null
            }
            onLoadDone={handleLoadDone}
            onLoadError={handleLoadError}
          />
        </ProgressProvider>
        {repoLoadErrors.length > 0 && (
          <>
            <Alert
              icon={false}
              severity="error"
              sx={{ textAlign: "left", border: 1, borderRadius: 4, borderColor: red[500] }}
            >
              {repoLoadErrors.map((repoLoadError, i) => {
                return (
                  <Typography key={i}>
                    Error loading {repoLoadError.repoMetadata.username}/
                    {repoLoadError.repoMetadata.repo}: {repoLoadError.error}
                  </Typography>
                );
              })}
            </Alert>
            <Container>
              <Button variant="contained" onClick={continueButtonClick}>
                Continue
              </Button>
            </Container>
          </>
        )}
      </Stack>
    </Grid>
  );
}
