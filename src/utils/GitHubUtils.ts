import axios, { AxiosResponse } from "axios";
import * as GitHubUtils from "./GitHubUtils";
import StarData from "./StarData";

const stargazersURL =
  "https://api.github.com/repos/{user}/{repo}/stargazers?per_page=100&page={page}";
const validateAccessTokenURL = "https://api.github.com/user";
const repoUrlTemplate = "https://github.com/{user}/{repo}";

export const storageKey = "startrack_js_access_token";

const maxSupportedPagesWithoutAccessToken = 30;

const batchSize = 5;

export enum StorageType {
  LocalStorage = "local storage",
  SessionStorage = "session storage",
}

interface GitHubStarData {
  starred_at: string;
}

type HandleProgressCallback = (progress: number) => void;
type ShouldStopCallback = () => boolean;

export const range = (size: number, startAt = 0) => {
  return Array.from({ length: size }, (_, key) => key + startAt);
};

export const getRepoUrl = (user: string, repo: string) => {
  return repoUrlTemplate.replace("{user}", user).replace("{repo}", repo);
};

export const parseGitHubUrl = (url: string): [string, string] | null => {
  try {
    const urlObj = new URL(url);

    if (urlObj.protocol !== "https:" || urlObj.host !== "github.com") {
      return null;
    }

    const userAndRepo = urlObj.pathname.split("/", 3);
    if (userAndRepo.length < 3) {
      return null;
    }

    if (!(userAndRepo[1] && userAndRepo[2])) {
      return null;
    }

    return [userAndRepo[1], userAndRepo[2]];
  } catch {
    return null;
  }
};

export const getStorage = (): Storage => {
  if (sessionStorage.getItem(storageKey)) {
    return sessionStorage;
  } else if (localStorage.getItem(storageKey)) {
    return localStorage;
  } else {
    return sessionStorage;
  }
};

export const getStorageType = () => {
  switch (GitHubUtils.getStorage()) {
    case sessionStorage:
      return StorageType.SessionStorage;
    case localStorage:
      return StorageType.LocalStorage;
    default:
      return null;
  }
};

export const setStorageType = (storageType: StorageType) => {
  removeAccessToken();

  return storageType == StorageType.LocalStorage ? localStorage : sessionStorage;
};

export const getAccessToken = (): string | null => {
  return GitHubUtils.getStorage().getItem(storageKey);
};

export const removeAccessToken = () => {
  GitHubUtils.getStorage().removeItem(storageKey);
};

export const isLoggedIn = () => {
  return getAccessToken() !== null;
};

export const prepareRequestHeaders = (accessToken: string | null) => {
  return {
    headers: {
      Accept: "application/vnd.github.v3.star+json",
      Authorization: accessToken ? "token " + accessToken : "",
    },
  };
};

export const validateAndStoreAccessToken = async (
  accessToken: string,
  storageType: StorageType,
) => {
  try {
    await axios.get(validateAccessTokenURL, GitHubUtils.prepareRequestHeaders(accessToken));
    GitHubUtils.setStorageType(storageType).setItem(storageKey, accessToken);
    return true;
  } catch {
    return false;
  }
};

export const loadStarGazerPage = async (
  user: string,
  repo: string,
  pageNum: number,
): Promise<AxiosResponse> => {
  const accessToken = GitHubUtils.getAccessToken();
  return await axios.get(
    stargazersURL
      .replace("{user}", user)
      .replace("{repo}", repo)
      .replace("{page}", pageNum.toString()),
    GitHubUtils.prepareRequestHeaders(accessToken),
  );
};

export const addStarData = (
  starData: StarData,
  starCount: number,
  pageData: Array<GitHubStarData>,
) => {
  for (let i = 0; i < pageData.length; i++) {
    starData.timestamps.push(pageData[i].starred_at);
    starData.starCounts.push(++starCount);
  }

  return starCount;
};

export const getLastStargazerPage = (linkHeader?: string) => {
  if (!linkHeader || linkHeader.length === 0) {
    return 1;
  }

  // Split parts by comma
  const parts = linkHeader.split(",");

  // Parse each part into a named link
  for (const i in parts) {
    const section = parts[i].split(";");
    if (section.length !== 2) {
      continue;
    }

    const url = section[0].replace(/<(.*)>/, "$1").trim();
    const name = section[1].replace(/rel="(.*)"/, "$1").trim();

    // if name is 'last' then extract page and return it
    if (name === "last") {
      return parseInt(url.replace(/(.*)&page=(.*)/, "$2").trim());
    }
  }
  throw new Error("Cannot find last stargazer page");
};

export const loadStargazers = async (
  user: string,
  repo: string,
  handleProgress: HandleProgressCallback,
  shouldStop: ShouldStopCallback,
) => {
  try {
    const starData: StarData = { timestamps: [], starCounts: [] };
    let starCount = 0;

    handleProgress(0);

    const page = await GitHubUtils.loadStarGazerPage(user, repo, 1);
    const numOfPages = GitHubUtils.getLastStargazerPage(page.headers.link);
    if (numOfPages > maxSupportedPagesWithoutAccessToken && !GitHubUtils.isLoggedIn()) {
      throw Error(
        "Cannot load a repo with more than " +
          100 * maxSupportedPagesWithoutAccessToken +
          // eslint-disable-next-line quotes
          ' stars without GitHub access token. Please click "GitHub Authentication" and provide one',
      );
    }

    starCount = GitHubUtils.addStarData(starData, starCount, page.data);

    handleProgress((1 / numOfPages) * 100);
    let pageNum = 2;
    while (pageNum <= numOfPages) {
      if (shouldStop()) {
        return null;
      }

      const currentBatchSize = Math.min(pageNum + batchSize, numOfPages + 1) - pageNum;
      const pages = await Promise.all(
        range(currentBatchSize, pageNum).map((num) =>
          GitHubUtils.loadStarGazerPage(user, repo, num),
        ),
      );
      for (let i = 0; i < currentBatchSize; i++) {
        starCount = GitHubUtils.addStarData(starData, starCount, pages[i].data);
      }

      pageNum += currentBatchSize;
      handleProgress(((pageNum - 1) / numOfPages) * 100);
    }

    return starData;
  } catch (error) {
    if (!axios.isAxiosError(error)) {
      throw error;
    }
    if (!error.response) {
      throw error;
    }
    switch (error.response.status) {
      case 404: {
        throw Error("Repo not found");
      }
      case 429:
      case 403: {
        throw Error(
          "API rate limit exceeded!" +
            (GitHubUtils.isLoggedIn()
              ? ""
              : // eslint-disable-next-line quotes
                ' Please click "GitHub Authentication" and provide GitHub access token to increase rate limit'),
        );
      }
      default: {
        throw Error(
          "Couldn't fetch stargazers data, error code " +
            error.response.status +
            " returned" +
            (error.response.data?.message ? `. Error: ${error.response.data.message}` : ""),
        );
      }
    }
  }
};
