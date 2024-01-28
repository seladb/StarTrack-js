import * as utils from "./GitHubUtils";
import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import StarData from "./StarData";
import moment from "moment";

describe(utils.range, () => {
  it("Returns a range starting from zero", () => {
    expect(utils.range(5)).toStrictEqual([0, 1, 2, 3, 4]);
  });

  it("Returns a range not starting from zero", () => {
    expect(utils.range(4, 2)).toStrictEqual([2, 3, 4, 5]);
  });
});

describe(utils.getRepoUrl, () => {
  it("Get the right repo URL", () => {
    expect(utils.getRepoUrl("seladb", "startrack-js")).toBe(
      "https://github.com/seladb/startrack-js",
    );
  });
});

class StorageMock implements Storage {
  private _storage;
  public length;

  constructor() {
    this._storage = new Map<string, string>();
    this.length = 0;
  }

  getItem(key: string): string | null {
    const val = this._storage.get(key);
    return val ? val : null;
  }

  setItem(key: string, value: string) {
    this._storage.set(key, value);
    this.length = this._storage.size;
  }

  removeItem(key: string): void {
    this._storage.delete(key);
  }

  clear(): void {
    this._storage.clear();
    this.length = 0;
  }

  key(): string | null {
    return null;
  }
}

describe(utils.getStorage, () => {
  it("Get from session storage if no token is stored", () => {
    expect(utils.getStorage()).toStrictEqual(window.sessionStorage);
  });

  it("Get from session storage if token is stored in both", () => {
    jest.spyOn(window.localStorage, "getItem");
    window.localStorage.getItem = () => {
      return "localStorage";
    };

    jest.spyOn(window.sessionStorage, "getItem");
    window.sessionStorage.getItem = () => {
      return "sessionStorage";
    };

    expect(utils.getStorage()).toStrictEqual(window.sessionStorage);
  });

  it("Get from local storage if token is stored in localStorage", () => {
    jest.spyOn(window.localStorage, "getItem");
    window.localStorage.getItem = () => {
      return "localStorage";
    };

    expect(utils.getStorage()).toStrictEqual(window.localStorage);
  });
});

describe(utils.getStorageType, () => {
  it("Get sessionStorage type", () => {
    expect(utils.getStorageType()).toStrictEqual(utils.StorageType.SessionStorage);
  });
});

describe(utils.setStorageType, () => {
  it("Set the correct type", () => {
    expect(utils.setStorageType(utils.StorageType.LocalStorage)).toStrictEqual(window.localStorage);
    expect(utils.setStorageType(utils.StorageType.SessionStorage)).toStrictEqual(
      window.sessionStorage,
    );
  });
});

describe(utils.getAccessToken, () => {
  const storage = new StorageMock();

  beforeEach(() => {
    jest.spyOn(utils, "getStorage").mockReturnValue(storage);
  });

  it("No access token", () => {
    expect(utils.getAccessToken()).toBeNull();
  });

  it("Get the correct access token", () => {
    storage.setItem(utils.storageKey, "accessToken");
    expect(utils.getAccessToken()).toStrictEqual("accessToken");
  });
});

describe(utils.removeAccessToken, () => {
  const storage = new StorageMock();

  beforeEach(() => {
    jest.spyOn(utils, "getStorage").mockReturnValue(storage);
  });

  it("Remove access token when exists", () => {
    storage.setItem(utils.storageKey, "accessToken");
    utils.removeAccessToken();
    expect(storage.getItem(utils.storageKey)).toBeNull();
  });

  it("Does nothing when access token doesn't exist", () => {
    utils.removeAccessToken();
    expect(storage.getItem(utils.storageKey)).toBeNull();
  });
});

describe(utils.prepareRequestHeaders, () => {
  it("Returns the correct headers with access token", () => {
    expect(utils.prepareRequestHeaders("accessToken")).toStrictEqual({
      headers: {
        Accept: "application/vnd.github.v3.star+json",
        Authorization: "token accessToken",
      },
    });
  });

  it("Returns the correct headers without access token", () => {
    expect(utils.prepareRequestHeaders(null)).toStrictEqual({
      headers: {
        Accept: "application/vnd.github.v3.star+json",
        Authorization: "",
      },
    });
  });
});

const fakeHeaders = {
  headers: {
    Accept: "accept",
    Authorization: "token",
  },
};

describe(utils.validateAndStoreAccessToken, () => {
  beforeEach(() => {
    jest.spyOn(utils, "setStorageType").mockImplementation(() => {
      return new StorageMock();
    });
    jest.spyOn(utils, "prepareRequestHeaders").mockReturnValue(fakeHeaders);
  });

  it("Validates an access token successfully", async () => {
    jest.spyOn(axios, "get").mockImplementation(() => Promise.resolve());

    const result = await utils.validateAndStoreAccessToken(
      "accessToken",
      utils.StorageType.LocalStorage,
    );

    expect(result).toBeTruthy();
    expect(axios.get).toBeCalledWith("https://api.github.com/user", fakeHeaders);
    expect(utils.setStorageType).toBeCalledWith(utils.StorageType.LocalStorage);
  });

  it("Fails when access token is not valid", async () => {
    jest.spyOn(axios, "get").mockImplementation(() => Promise.reject());

    const result = await utils.validateAndStoreAccessToken(
      "accessToken",
      utils.StorageType.SessionStorage,
    );

    expect(result).toBeFalsy();
    expect(axios.get).toBeCalledWith("https://api.github.com/user", fakeHeaders);
    expect(utils.setStorageType).not.toBeCalled();
  });
});

describe(utils.loadStarGazerPage, () => {
  beforeEach(() => {
    jest.spyOn(utils, "prepareRequestHeaders").mockReturnValue(fakeHeaders);
  });

  it("Loads a page successfully", async () => {
    jest.spyOn(utils, "getAccessToken").mockReturnValue("accessToken");
    jest.spyOn(axios, "get").mockImplementation(() => Promise.resolve());

    await utils.loadStarGazerPage("user", "repo", 12);

    expect(utils.prepareRequestHeaders).toBeCalledWith("accessToken");
    expect(axios.get).toBeCalledWith(
      "https://api.github.com/repos/user/repo/stargazers?per_page=100&page=12",
      fakeHeaders,
    );
  });
});

describe(utils.addStarData, () => {
  it("Adds stars data correctly", () => {
    const curStarCount = 1;
    const starData: StarData = {
      timestamps: ["100"],
      starCounts: [curStarCount],
    };

    const githubStarData = [
      {
        // eslint-disable-next-line camelcase
        starred_at: "200",
      },
      {
        // eslint-disable-next-line camelcase
        starred_at: "300",
      },
    ];

    const result = utils.addStarData(starData, curStarCount, githubStarData);

    expect(result).toStrictEqual(curStarCount + githubStarData.length);
    expect(starData).toStrictEqual({
      timestamps: ["100", "200", "300"],
      starCounts: [curStarCount, curStarCount + 1, curStarCount + 2],
    });
  });
});

describe(utils.getLastStargazerPage, () => {
  it("Returns 1 if link header doesn't exist", () => {
    expect(utils.getLastStargazerPage()).toStrictEqual(1);
  });

  it("Throws an error if can't find 'last' value in link header", () => {
    const linkHeader =
      // eslint-disable-next-line quotes
      '<https://api.github.com/repositories/24911519/stargazers?per_page=100&page=2>; rel="next"';
    expect(() => {
      utils.getLastStargazerPage(linkHeader);
    }).toThrow("Cannot find last stargazer page");
  });

  it.each([
    ["", 1],
    [
      // eslint-disable-next-line quotes
      '<https://api.github.com/repositories/24911519/stargazers?per_page=100&page=2>; rel="next", <https://api.github.com/repositories/24911519/stargazers?per_page=100&page=22>; rel="last"',
      22,
    ],
    [
      // eslint-disable-next-line quotes
      '<https://api.github.com/repositories/24911519/stargazers?per_page=100&page=22>; rel="last"',
      22,
    ],
  ])(
    "Returns expected last page for link header",
    (linkHeader: string, expectedLastPage: number) => {
      expect(utils.getLastStargazerPage(linkHeader)).toStrictEqual(expectedLastPage);
    },
  );
});

describe(utils.parseGitHubUrl, () => {
  it.each([
    "invalid",
    "invalid/url",
    "http://github.com/seladb/PcapPlusPlus",
    "https://github1.com/seladb/PcapPlusPlus",
    "https://github.com/",
    "https://github.com/seladb",
    "https://github.com/seladb/",
    "https://github.com//seladb/pcapplusplus",
  ])("Returns null for invalid URL: '%s'", (url) => {
    expect(utils.parseGitHubUrl(url)).toBeNull();
  });

  it.each([
    "https://github.com/seladb/pcapplusplus",
    "https://github.com/seladb/pcapplusplus/",
    "https://github.com/seladb/pcapplusplus/bla/bla",
  ])("Returns repo and username for URL: '%s'", (url) => {
    expect(utils.parseGitHubUrl(url)).toStrictEqual(["seladb", "pcapplusplus"]);
  });
});

describe(utils.loadStargazers, () => {
  const username = "username";
  const repo = "repo";
  const handleProgress = jest.fn();
  const shouldStop = jest.fn();

  const createAxiosResponse = (
    responseCode: number,
    responseStatus: string,
    linkHeader?: boolean,
    data?: unknown,
  ): AxiosResponse => {
    return {
      data: data || {},
      status: responseCode,
      statusText: responseStatus,
      headers: linkHeader ? { link: "link" } : {},
      config: {} as InternalAxiosRequestConfig,
    };
  };

  const createAxiosError = (response: AxiosResponse) => {
    return new AxiosError(undefined, undefined, undefined, undefined, response);
  };

  it("load stargazer data", async () => {
    const numOfPages = 10;
    const expectedProgress = [[0], [10], [60], [100]];

    const startDate = moment();

    jest.spyOn(utils, "loadStarGazerPage").mockImplementation((_user, _repo, pageNum) => {
      const data = [
        {
          // eslint-disable-next-line camelcase
          starred_at: moment(startDate)
            .add((pageNum - 1) * 2, "days")
            .format(),
        },
        {
          // eslint-disable-next-line camelcase
          starred_at: moment(startDate)
            .add((pageNum - 1) * 2 + 1, "days")
            .format(),
        },
      ];

      return Promise.resolve(createAxiosResponse(200, "OK", true, data));
    });

    jest.spyOn(utils, "getLastStargazerPage").mockReturnValue(numOfPages);

    const expectedTimestamps = [...Array(numOfPages * 2).keys()].map((index) =>
      moment(startDate).add(index, "days").format(),
    );

    const expectedStarData: StarData = {
      timestamps: expectedTimestamps,
      starCounts: Array.from({ length: numOfPages * 2 }, (_, i) => i + 1),
    };

    await expect(utils.loadStargazers(username, repo, handleProgress, shouldStop)).resolves.toEqual(
      expectedStarData,
    );

    expect(handleProgress.mock.calls).toEqual(expectedProgress);
  });

  it("stop loading", async () => {
    jest.spyOn(utils, "loadStarGazerPage").mockImplementation(() => {
      return Promise.resolve({
        data: ["ts"],
        status: 200,
        statusText: "OK",
        headers: { link: "link" },
        config: {} as InternalAxiosRequestConfig,
      });
    });

    jest.spyOn(utils, "getLastStargazerPage").mockReturnValue(10);

    await expect(utils.loadStargazers(username, repo, handleProgress, () => true)).resolves.toEqual(
      null,
    );
    expect(handleProgress.mock.calls).toEqual([[0], [10]]);
  });

  it("cannot load a repo with too many stars if not logged in", async () => {
    const maxSupportedPagesWithoutAccessToken = 30;

    jest
      .spyOn(utils, "loadStarGazerPage")
      .mockReturnValue(Promise.resolve(createAxiosResponse(200, "OK", true)));
    jest
      .spyOn(utils, "getLastStargazerPage")
      .mockReturnValue(maxSupportedPagesWithoutAccessToken + 1);
    jest.spyOn(utils, "isLoggedIn").mockReturnValue(false);

    await expect(utils.loadStargazers(username, repo, handleProgress, shouldStop)).rejects.toThrow(
      "Cannot load a repo with more than " +
        maxSupportedPagesWithoutAccessToken * 100 +
        // eslint-disable-next-line quotes
        ' stars without GitHub access token. Please click "GitHub Authentication" and provide one',
    );
  });

  it("handles generic error", async () => {
    jest.spyOn(utils, "loadStarGazerPage").mockRejectedValueOnce(new Error("something went wrong"));

    await expect(utils.loadStargazers(username, repo, handleProgress, shouldStop)).rejects.toThrow(
      /^something went wrong$/,
    );
  });

  it("handles error no response", async () => {
    jest
      .spyOn(utils, "loadStarGazerPage")
      .mockRejectedValueOnce(new AxiosError("something went wrong"));

    await expect(utils.loadStargazers(username, repo, handleProgress, shouldStop)).rejects.toThrow(
      /^something went wrong$/,
    );
  });

  it("handles 404 error", async () => {
    jest
      .spyOn(utils, "loadStarGazerPage")
      .mockRejectedValueOnce(createAxiosError(createAxiosResponse(404, "Not Found")));

    await expect(utils.loadStargazers(username, repo, handleProgress, shouldStop)).rejects.toThrow(
      "Repo not found",
    );
  });

  it.each([
    [403, "Forbidden"],
    [429, "Too Many Requests"],
  ])("handle API limit error", async (responseCode, responseStatus) => {
    jest
      .spyOn(utils, "loadStarGazerPage")
      .mockRejectedValueOnce(createAxiosError(createAxiosResponse(responseCode, responseStatus)));

    await expect(utils.loadStargazers(username, repo, handleProgress, shouldStop)).rejects.toThrow(
      // eslint-disable-next-line quotes
      /^API rate limit exceeded! Please click "GitHub Authentication" and provide GitHub access token to increase rate limit$/,
    );
  });

  it("handle API limit error when logged in", async () => {
    jest
      .spyOn(utils, "loadStarGazerPage")
      .mockRejectedValueOnce(createAxiosError(createAxiosResponse(403, "Forbidden")));
    jest.spyOn(utils, "isLoggedIn").mockReturnValueOnce(true);

    await expect(utils.loadStargazers(username, repo, handleProgress, shouldStop)).rejects.toThrow(
      /^API rate limit exceeded!$/,
    );
  });

  it("handle other HTTP error", async () => {
    jest
      .spyOn(utils, "loadStarGazerPage")
      .mockRejectedValueOnce(createAxiosError(createAxiosResponse(500, "Internal Server Error")));

    await expect(utils.loadStargazers(username, repo, handleProgress, shouldStop)).rejects.toThrow(
      /^Couldn't fetch stargazers data, error code 500 returned$/,
    );
  });

  it("handle other HTTP error with data", async () => {
    jest.spyOn(utils, "loadStarGazerPage").mockRejectedValueOnce(
      createAxiosError(
        createAxiosResponse(500, "Internal Server Error", undefined, {
          message: "something went wrong",
        }),
      ),
    );

    await expect(utils.loadStargazers(username, repo, handleProgress, shouldStop)).rejects.toThrow(
      /^Couldn't fetch stargazers data, error code 500 returned. Error: something went wrong$/,
    );
  });
});
