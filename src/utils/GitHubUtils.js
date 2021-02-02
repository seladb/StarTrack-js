import axios from 'axios'

const stargazersURL = "https://api.github.com/repos/{user}/{repo}/stargazers?per_page=100&page={page}"
const validateAccessTokenURL = "https://api.github.com/user"
const repoUrlTemplate = "https://github.com/{user}/{repo}"

const storageKey = "statrack_js_access_token"

const maxSupportedPagesWithoutAccessToken = 30

const batchSize = 5

export const StorageTypes = {
  LocalStorage: 'local storage',
  SessionStorage: 'session storage'
}

class GitHubUtils {

  static _range(size, startAt = 0) {
    return [...Array(size).keys()].map(i => i + startAt);
  }

  static _getStorageDefault() {
    if (sessionStorage.getItem(storageKey) !== null && sessionStorage.getItem(storageKey) !== undefined && sessionStorage.getItem(storageKey) !== "") {
      return sessionStorage
    }
    else if (localStorage.getItem(storageKey) !== null && localStorage.getItem(storageKey) !== undefined && localStorage.getItem(storageKey) !== "") {
      return localStorage
    }
    else {
      return sessionStorage
    }
  }

  static _storage = GitHubUtils._getStorageDefault();

  async validateAndStoreAccessToken(accessToken, storageType) {
    try {
      await axios.get(validateAccessTokenURL, this._prepareRequestHeaders(accessToken));
      this._setStorageType(storageType).setItem(storageKey, accessToken);
    }
    catch (error) {
      throw error;
    }
  }

  removeAccessToken() {
    this._getStorage().removeItem(storageKey)
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async _loadStarGazerPage(partialUrl, pageNum) {
    return await axios.get(partialUrl.replace('{page}', pageNum), this._prepareRequestHeaders(this.getAccessToken()));
  }

  _addStarData(starData, starCount, page) {
    for (let i = 0; i < page.data.length; i++) {
      starData.push({
        x: page.data[i].starred_at,
        y: starCount++
      })
    }

    return starCount;
  }

  async loadStargazers(user, repo, handleProgress, shouldStop) {
    try {
      let starData = [];
      let starCount = 1;
      let partialUrl = stargazersURL.replace('{user}', user).replace('{repo}', repo);

      handleProgress(0);

      let page = await this._loadStarGazerPage(partialUrl, 1);
      let numOfPages = this._getLastStargazerPage(page.headers['link']);
      if (numOfPages > maxSupportedPagesWithoutAccessToken && !this.isLoggedIn()) {
        throw Error("Cannot load a repo with more than " + 100 * maxSupportedPagesWithoutAccessToken + " stars without GitHub access token. Please click \"GitHub Authentication\" and provide one")
      }

      starCount = this._addStarData(starData, starCount, page);
      
      handleProgress((1/numOfPages)*100);
      let pageNum = 2;
      while (pageNum <= numOfPages) {
        if (shouldStop()) {
          return null;
        }

        let currentBatchSize = Math.min(pageNum + batchSize, numOfPages + 1) - pageNum;
        let pages = await Promise.all(
          GitHubUtils._range(currentBatchSize, pageNum).map(
            num => this._loadStarGazerPage(partialUrl, num)
            ));
        for (var i = 0; i < currentBatchSize; i++) {
          starCount = this._addStarData(starData, starCount, pages[i]);
        }

        pageNum += currentBatchSize;
        handleProgress(((pageNum-1)/numOfPages)*100);
      }

      return starData;
    }
    catch(error) {
      if (error.response === undefined) {
        throw error
      }
      if (error.response.status === 404) {
        throw Error("Repo " + user + "/" + repo + " Not found")
      } else if (error.response.status === 403) {
        throw Error("API rate limit exceeded!" + (this.isLoggedIn() ? "" : " Please click \"GitHub Authentication\" and provide GitHub access token to increase rate limit"));
      } else {
        throw Error("Couldn't fetch stargazers data, error code " + error.response.status + " returned" + 
          (error.response.data.message && error.response.data.message !== "" ? ": " + error.response.data.message : ""))
      }
    }
  }

  getAccessToken() {
    return this._getStorage().getItem(storageKey);
  }

  isLoggedIn() {
    let accessToken = this.getAccessToken();
    return (accessToken !== null && accessToken !== undefined && accessToken !== "");
  }

  getRepoUrl(user, repo) {
    return repoUrlTemplate.replace('{user}', user).replace('{repo}', repo);
  }

  getStorageType() {
    switch (this._getStorage()) {
      case sessionStorage:
        return StorageTypes.SessionStorage;
      case localStorage:
        return StorageTypes.LocalStorage;
      default:
        return null;
    }
  }

  _getStorage() {
    return GitHubUtils._storage
  }

  _setStorageType(storageType) {
    this.removeAccessToken();

    switch (storageType) {
      case StorageTypes.LocalStorage:
        GitHubUtils._storage = localStorage;
        break;
      case StorageTypes.SessionStorage:
        GitHubUtils._storage = sessionStorage
        break;
      default:
        GitHubUtils._storage = sessionStorage
    }

    return GitHubUtils._storage
  }

  _prepareRequestHeaders(accessToken) {
    return {
      headers: {
        'Accept': 'application/vnd.github.v3.star+json',
        ...accessToken !== undefined && accessToken !== null && accessToken !== "" && {'Authorization': 'token ' + accessToken},
      }
    };

  }

  _getLastStargazerPage(linkHeader) {
    if (linkHeader === undefined || linkHeader.length === 0) {
      return 1;
    }
  
    // Split parts by comma
    var parts = linkHeader.split(',');
  
    // Parse each part into a named link
    for (let i in parts) {
      var section = parts[i].split(';');
      if (section.length !== 2) {
        continue;
      }
  
      var url = section[0].replace(/<(.*)>/, '$1').trim();
      var name = section[1].replace(/rel="(.*)"/, '$1').trim();
  
      // if name is 'last' then extract page and return it
      if (name === 'last') {
        return url.replace(/(.*)&page=(.*)/, '$2').trim();
      }
    }
  }

}

const gitHubUtils = new GitHubUtils();
Object.freeze(gitHubUtils);

export default gitHubUtils;