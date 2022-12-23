import gitHubUtils from "./GitHubUtils";
import stargazerStats from "./StargazerStats";

// Refer to post https://stackoverflow.com/questions/10014271/generate-random-color-distinguishable-to-humans
const Colors = [
  "#00ffff", // aqua
  "#f0ffff", // azure
  "#f5f5dc", // beige
  "#000000", // black
  "#0000ff", // blue
  "#a52a2a", // brown
  "#00ffff", // cyan
  "#00008b", // darkblue
  "#008b8b", // darkcyan
  "#a9a9a9", // darkgrey
  "#006400", // darkgreen
  "#bdb76b", // darkkhaki
  "#8b008b", // darkmagenta
  "#556b2f", // darkolivegreen
  "#ff8c00", // darkorange
  "#9932cc", // darkorchid
  "#8b0000", // darkred
  "#e9967a", // darksalmon
  "#9400d3", // darkviolet
  "#ff00ff", // fuchsia
  "#ffd700", // gold
  "#008000", // green
  "#4b0082", // indigo
  "#f0e68c", // khaki
  "#add8e6", // lightblue
  "#e0ffff", // lightcyan
  "#90ee90", // lightgreen
  "#d3d3d3", // lightgrey
  "#ffb6c1", // lightpink
  "#ffffe0", // lightyellow
  "#00ff00", // lime
  "#ff00ff", // magenta
  "#800000", // maroon
  "#000080", // navy
  "#808000", // olive
  "#ffa500", // orange
  "#ffc0cb", // pink
  "#800080", // purple
  "#800080", // violet
  "#ff0000", // red
  "#c0c0c0", // silver
  "#ffffff", // white
  "#ffff00"  // yellow
];

export const maxReposAllowed = Colors.length;

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
    StargazerLoader.colorIndex =
      StargazerLoader.colorIndex + 1 === colors.length
        ? 0
        : StargazerLoader.colorIndex + 1;
    return {
      username: username,
      repo: repo,
      color: Colors[StargazerLoader.colorIndex],
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
