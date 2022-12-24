import gitHubUtils from "./GitHubUtils";
import stargazerStats from "./StargazerStats";

// Refer to post https://stackoverflow.com/questions/10014271/generate-random-color-distinguishable-to-humans
function makeColor(number) {
  const hue = number * 137.508; // use golden angle approximation
  return `hsl(${hue},50%,50%)`;
}

class StargazerLoader {
  static colorIndex = -1;

  async loadStargazers(
    username,
    repo,
    forecastProps,
    handleProgress,
    shouldStop
  ) {
    const stargazerData = await gitHubUtils.loadStargazers(
      username,
      repo,
      handleProgress,
      shouldStop
    );
    if (stargazerData === null) {
      return null;
    }
    StargazerLoader.colorIndex = StargazerLoader.colorIndex + 1;
    return {
      username: username,
      repo: repo,
      color: makeColor(StargazerLoader.colorIndex),
      stargazerData: stargazerData,
      stats: stargazerStats.calcStats(stargazerData),
      forecast:
        forecastProps !== null
          ? stargazerStats.calcForecast(
              stargazerData,
              forecastProps.daysBackwards,
              forecastProps.daysForward,
              forecastProps.numValues
            )
          : null,
    };
  }
}

const stargazerLoader = new StargazerLoader();
Object.freeze(stargazerLoader);

export default stargazerLoader;
