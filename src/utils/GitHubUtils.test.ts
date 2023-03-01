import * as utils from "./GitHubUtils";
import axios from "axios";

describe("Test range", () => {
  it("Returns a range starting from zero", () => {
    expect(utils.range(5)).toStrictEqual([0, 1, 2, 3, 4]);
  });

  it("Returns a range not starting from zero", () => {
    expect(utils.range(4, 2)).toStrictEqual([2, 3, 4, 5]);
  });
});

describe("Test getRepoUrl", () => {
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

describe("Test getStorage", () => {
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

describe("Test getStorageType", () => {
  it("Get sessionStorage type", () => {
    expect(utils.getStorageType()).toStrictEqual(utils.StorageType.SessionStorage);
  });
});

describe("Test setStorageType", () => {
  it("Set the correct type", () => {
    expect(utils.setStorageType(utils.StorageType.LocalStorage)).toStrictEqual(window.localStorage);
    expect(utils.setStorageType(utils.StorageType.SessionStorage)).toStrictEqual(
      window.sessionStorage,
    );
  });
});

describe("Test getAccessToken", () => {
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

describe("Test removeAccessToken", () => {
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

describe("Test prepareRequestHeaders", () => {
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

describe("Test validateAndStoreAccessToken", () => {
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

describe("Test loadStarGazerPage", () => {
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

describe("Test addStarData", () => {
  it("Adds stars data correctly", () => {
    const curStarCount = 1;
    const starData = [
      {
        x: "100",
        y: curStarCount,
      },
    ];

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
    expect(starData).toStrictEqual([
      {
        x: "100",
        y: curStarCount,
      },
      {
        x: "200",
        y: curStarCount + 1,
      },
      {
        x: "300",
        y: curStarCount + 2,
      },
    ]);
  });
});

describe("Test getLastStargazerPage", () => {
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

describe("Test parseGitHubUrl", () => {
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
