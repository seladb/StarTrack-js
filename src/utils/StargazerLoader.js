import gitHubUtils from './GitHubUtils'
import stargazerStats from './StargazerStats'

const colors = [ '#008FFB', '#00E396', '#FEB019', '#FF4560', '#775DD0', '#F86624', '#00B1F2', '#5A2A27' ]

export const maxReposAllowed = 8;

class StargazerLoader {
  static colorIndex = -1

  async loadStargazers(username, repo, handleProgress, shouldStop) {
    let stargazerData = await gitHubUtils.loadStargazers(username, repo, handleProgress, shouldStop);
    if (stargazerData === null) {
      return null;
    }
    StargazerLoader.colorIndex = (StargazerLoader.colorIndex + 1 === colors.length ? 0 : StargazerLoader.colorIndex + 1);
    return {
      username: username,
      repo: repo,
      color: colors[StargazerLoader.colorIndex],
      stargazerData: stargazerData,
      stats: stargazerStats.calcStats(stargazerData)
    }
  }
}

const stargazerLoader = new StargazerLoader();
Object.freeze(stargazerLoader);

export default stargazerLoader


