import RepoInfo from "./RepoInfo";
import StarData from "./StarData";

const exportStarDataToJson = (data: StarData) => {
  return data.starCounts.map((value, index) => {
    return { starCount: value, starredAt: data.timestamps[index] };
  });
};

export const exportRepoInfosToJson = (repoInfos: Array<RepoInfo>) => {
  const result = repoInfos.map((repoInfo) => {
    return {
      username: repoInfo.username,
      repo: repoInfo.repo,
      stargazerData: exportStarDataToJson(repoInfo.stargazerData),
      forecast: repoInfo.forecast && exportStarDataToJson(repoInfo.forecast),
    };
  });

  return result.length === 1 ? result[0] : result;
};

const exportStarDataToCsv = (data: StarData) => {
  const header = "Star Count,Starred At";
  const dataArray = data.starCounts.map((value, index) => {
    return `${value},${data.timestamps[index]}`;
  });
  return [header, ...dataArray].join("\n");
};

export const exportRepoInfosToCsv = (repoInfos: Array<RepoInfo>) => {
  return repoInfos.flatMap((repoInfo) => {
    const repoInfoAsCsv = {
      username: repoInfo.username,
      repo: repoInfo.repo,
      stargazerData: exportStarDataToCsv(repoInfo.stargazerData),
      forecast: repoInfo.forecast && exportStarDataToCsv(repoInfo.forecast),
    };

    const repoInfoFiles = [
      { name: `${repoInfo.username}-${repoInfo.repo}.csv`, content: repoInfoAsCsv.stargazerData },
    ];

    if (repoInfoAsCsv.forecast) {
      repoInfoFiles.push({
        name: `${repoInfo.username}-${repoInfo.repo}-forecast.csv`,
        content: repoInfoAsCsv.forecast,
      });
    }

    return repoInfoFiles;
  });
};
