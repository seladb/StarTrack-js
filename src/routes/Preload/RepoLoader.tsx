import React from "react";
import { useProgress } from "../../shared/ProgressContext";
import { RepoMetadata } from "./PreloadTypes";
import { loadStargazers } from "../../utils/StargazerLoader";
// import moment from "moment";
import RepoInfo from "../../utils/RepoInfo";

// const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

// const fakeLoad = async (username: string, repo: string, onProgress: (n: number) => void) : Promise<RepoInfo> => {
//   const numPoints = 5;
//   const starCounts: number[] = [];
//   const timestamps: string[] = [];
//   const firstDay = moment().subtract(numPoints + 1, "days");
//   for (let i = 1; i < numPoints + 1; i++) {
//     console.log(`Waiting 1 second ${i}...`);
//     await sleep(1000);
//     starCounts.push(i);
//     timestamps.push(firstDay.add(i, "days").toISOString())
//     onProgress(i * 20);
//   }

//   return {
//     username: username,
//     repo: repo,
//     color: { hsl: "hsl(0, 25%, 50%)", hex: "#9f6060" },
//     stargazerData: {
//       starCounts: starCounts,
//       timestamps: timestamps
//     },
//   }
// }

interface RepoLoaderProps {
  repoDataToLoad: RepoMetadata | null;
  onLoadDone: (repoInfo: RepoInfo | null) => void;
  onLoadError: (error: string) => void;
}

export default function RepoLoader({ repoDataToLoad, onLoadDone, onLoadError }: RepoLoaderProps) {
  const { startProgress, setProgress, endProgress } = useProgress();

  React.useEffect(() => {
    if (repoDataToLoad) {
      startProgress();
      loadData();
    }
  }, [repoDataToLoad]);

  const handleProgress = (value: number) => {
    setProgress(value);
  };

  const loadData = async () => {
    // if (!repoDataToLoad) {
    //   return null;
    // }

    // const repoData = await fakeLoad(repoDataToLoad.username, repoDataToLoad.repo, handleProgress);
    // onLoadDone(repoData);
    // endProgress();
    // return;

    if (!repoDataToLoad) {
      return;
    }

    try {
      const repoInfo = await loadStargazers(
        repoDataToLoad.username,
        repoDataToLoad.repo,
        handleProgress,
        () => false,
      );

      onLoadDone(repoInfo);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      onLoadError(errorMessage);
    } finally {
      endProgress();
    }
  };

  return <></>;
}
