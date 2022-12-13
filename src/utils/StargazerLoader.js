import gitHubUtils from "./GitHubUtils";
import stargazerStats from "./StargazerStats";

function getColor(){ 
  return "hsl(" + 360 * Math.random() + ',' +
             (25 + 70 * Math.random()) + '%,' + 
             (85 + 10 * Math.random()) + '%)'
}

class StargazerLoader {

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
    return {
      username: username,
      repo: repo,
      color: getColor(),
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
