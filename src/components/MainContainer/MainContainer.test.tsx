import { render, screen, act, waitFor } from "@testing-library/react";
import MainContainer, { allowStarCountAndStarDataMismatch } from "./MainContainer";
import { getLastCallArguments } from "../../utils/test";
import * as StargazerLoader from "../../utils/StargazerLoader";
import * as StargazerStats from "../../utils/StargazerStats";
import { getRepoStargazerCount } from "../../utils/GitHubUtils";
import { ForecastInfo } from "../Forecast";

const mockLocation = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useLocation: () => {
    return mockLocation() ?? { state: null };
  },
}));

const mockStartProgress = jest.fn();
const mockSetProgress = jest.fn();
const mockEndProgress = jest.fn();

jest.mock("../../shared/ProgressContext", () => ({
  useProgress: () => ({
    startProgress: mockStartProgress,
    setProgress: mockSetProgress,
    endProgress: mockEndProgress,
  }),
}));

const mockShowAlert = jest.fn();

jest.mock("../../shared/AlertContext", () => ({
  useAlertDialog: () => ({
    showAlert: mockShowAlert,
  }),
}));

const mockRepoDetailsInput = jest.fn();

jest.mock("../RepoDetailsInput", () => ({
  __esModule: true,
  default: (props: unknown[]) => {
    mockRepoDetailsInput(props);
    return <div data-testid="RepoDetailsInput" />;
  },
}));

const mockRepoChipContainer = jest.fn();

jest.mock("../RepoChips", () => ({
  __esModule: true,
  default: (props: unknown[]) => {
    mockRepoChipContainer(props);
    return <div data-testid="RepoChipContainer" />;
  },
}));

const mockChart = jest.fn();

jest.mock("../Chart", () => ({
  __esModule: true,
  default: (props: unknown[]) => {
    mockChart(props);
    return <div data-testid="Chart" />;
  },
}));

const mockForecast = jest.fn();

jest.mock("../Forecast", () => ({
  __esModule: true,
  ...jest.requireActual("../Forecast"),
  Forecast: (props: unknown[]) => {
    mockForecast(props);
    return <div data-testid="Forecast" />;
  },
}));

const mockRepoStats = jest.fn();

jest.mock("../RepoStats", () => ({
  __esModule: true,
  default: (props: unknown[]) => {
    mockRepoStats(props);
    return <div data-testid="RepoStats" />;
  },
}));

const mockURLBox = jest.fn();

jest.mock("../URLBox", () => ({
  __esModule: true,
  default: (props: unknown[]) => {
    mockURLBox(props);
    return <div data-testid="URLBox" />;
  },
}));

jest.mock("../../utils/GitHubUtils");

describe(MainContainer, () => {
  beforeEach(() => {
    jest.resetAllMocks();
    (getRepoStargazerCount as jest.Mock).mockImplementation(() => Promise.resolve(1));
  });

  const username = "username";
  const repo = "repo";

  const stargazerData = {
    timestamps: ["ts1", "ts2"],
    starCounts: [1, 2],
  };

  const forecastData = {
    starCounts: [5, 6],
    timestamps: ["ts3", "ts4"],
  };

  const forecastInfo = new ForecastInfo(
    { count: 1, unit: "weeks" },
    { count: 1, unit: "weeks" },
    50,
  );

  const setupLoadStargazers = () => {
    jest.spyOn(StargazerLoader, "loadStargazers").mockImplementationOnce(
      (
        username: string,
        repo: string,
        handleProgress: (val: number) => void,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        _shouldStop: () => boolean,
      ) => {
        handleProgress(50);
        handleProgress(100);
        const repoInfo = {
          username: username,
          repo: repo,
          color: { hsl: `${username}#${repo}#hsl`, hex: `${username}#${repo}#hex` },
          stargazerData: stargazerData,
        };
        return Promise.resolve(repoInfo);
      },
    );
  };

  const expectDataWasNotLoaded = () => {
    expect(mockRepoChipContainer).not.toHaveBeenCalled();
    expect(mockChart).not.toHaveBeenCalled();
    expect(mockForecast).not.toHaveBeenCalled();
    expect(mockRepoStats).not.toHaveBeenCalled();
    expect(mockURLBox).not.toHaveBeenCalled();
  };

  it("starts with the repo detail input", () => {
    render(<MainContainer />);

    expect(mockRepoDetailsInput).toHaveBeenCalled();

    expectDataWasNotLoaded();
  });

  it("try to load a repo without a username or a repo name", async () => {
    render(<MainContainer />);

    for (const [username, repo] of [
      ["username", ""],
      ["", "repo"],
      ["", ""],
    ]) {
      await act(() => getLastCallArguments(mockRepoDetailsInput)[0].onGoClick(username, repo));
      expect(mockShowAlert).toHaveBeenCalledWith("Please provide both Username and Repo name");
    }

    expectDataWasNotLoaded();
  });

  it("load a repo", async () => {
    setupLoadStargazers();

    render(<MainContainer />);

    await act(() => getLastCallArguments(mockRepoDetailsInput)[0].onGoClick(username, repo));

    expect(mockStartProgress).toHaveBeenCalled();
    expect(mockSetProgress.mock.calls).toEqual([[50], [100]]);
    expect(mockEndProgress).toHaveBeenCalled();

    expect(mockShowAlert).not.toHaveBeenCalled();

    expect(mockRepoChipContainer).toHaveBeenCalledWith(
      expect.objectContaining({
        reposDetails: [{ user: username, repo: repo, color: `${username}#${repo}#hex` }],
      }),
    );

    const expectedRepoInfos = [
      {
        username: username,
        repo: repo,
        color: { hsl: `${username}#${repo}#hsl`, hex: `${username}#${repo}#hex` },
        stargazerData: stargazerData,
      },
    ];

    expect(mockChart).toHaveBeenCalledWith(
      expect.objectContaining({ repoInfos: expectedRepoInfos }),
    );

    expect(mockForecast).toHaveBeenCalled();

    expect(mockRepoStats).toHaveBeenCalledWith({
      repoInfos: expectedRepoInfos,
      dateRange: undefined,
    });

    expect(mockURLBox).toHaveBeenCalledWith({ repoInfos: expectedRepoInfos });
  });

  it("load a repo with too many stars", async () => {
    (getRepoStargazerCount as jest.Mock).mockImplementation(() =>
      Promise.resolve(stargazerData.starCounts.length + 100000),
    );

    setupLoadStargazers();

    render(<MainContainer />);

    await act(() => getLastCallArguments(mockRepoDetailsInput)[0].onGoClick(username, repo));

    expect(mockShowAlert).toHaveBeenCalledWith(
      `This repo has too many stars (100K), GitHub API only allows fetching the first ${stargazerData.starCounts.length} stars`,
      "warning",
    );
  });

  it("small mismatch between star count and star data", async () => {
    (getRepoStargazerCount as jest.Mock).mockImplementation(() =>
      Promise.resolve(stargazerData.starCounts.length + allowStarCountAndStarDataMismatch),
    );

    setupLoadStargazers();

    render(<MainContainer />);

    await act(() => getLastCallArguments(mockRepoDetailsInput)[0].onGoClick(username, repo));

    expect(mockShowAlert).not.toHaveBeenCalled();
  });

  it("handle error fetching star count", async () => {
    const errorMessage = "something went wrong";
    (getRepoStargazerCount as jest.Mock).mockImplementation(() => Promise.reject(errorMessage));

    render(<MainContainer />);

    await act(() => getLastCallArguments(mockRepoDetailsInput)[0].onGoClick("username", "repo"));

    expect(mockShowAlert).toHaveBeenCalledWith(errorMessage);
    expectDataWasNotLoaded();
  });

  it("handle error loading repo data", async () => {
    const errorMessage = "something went wrong";
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    jest
      .spyOn(StargazerLoader, "loadStargazers")
      .mockImplementationOnce(() => Promise.reject(errorMessage));

    render(<MainContainer />);

    await act(() => getLastCallArguments(mockRepoDetailsInput)[0].onGoClick("username", "repo"));

    expect(mockShowAlert).toHaveBeenCalledWith(errorMessage);
    expectDataWasNotLoaded();
  });

  it("handle repo already exists", async () => {
    setupLoadStargazers();

    render(<MainContainer />);

    await act(() => getLastCallArguments(mockRepoDetailsInput)[0].onGoClick(username, repo));

    await act(() => getLastCallArguments(mockRepoDetailsInput)[0].onGoClick(username, repo));

    expect(mockShowAlert).toHaveBeenCalledWith("Repo already exists");

    expect(mockRepoChipContainer).toHaveBeenCalledTimes(1);
    expect(mockChart).toHaveBeenCalledTimes(1);
    expect(mockForecast).toHaveBeenCalledTimes(1);
    expect(mockRepoStats).toHaveBeenCalledTimes(1);
    expect(mockURLBox).toHaveBeenCalledTimes(1);
  });

  it("preload a repo", () => {
    const repoInfo = {
      username: username,
      repo: repo,
      color: { hsl: `${username}#${repo}#hsl`, hex: `${username}#${repo}#hex` },
      stargazerData: stargazerData,
    };

    mockLocation.mockReturnValue({ state: [repoInfo] });

    render(<MainContainer />);

    expect(mockRepoChipContainer).toHaveBeenCalledWith(
      expect.objectContaining({
        reposDetails: [{ user: username, repo: repo, color: `${username}#${repo}#hex` }],
      }),
    );

    expect(mockChart).toHaveBeenCalledWith(expect.objectContaining({ repoInfos: [repoInfo] }));

    expect(mockForecast).toHaveBeenCalled();

    expect(mockRepoStats).toHaveBeenCalledWith({
      repoInfos: [repoInfo],
      dateRange: undefined,
    });

    expect(mockURLBox).toHaveBeenCalledWith({ repoInfos: [repoInfo] });

    expect(mockStartProgress).not.toHaveBeenCalled();
    expect(mockSetProgress).not.toHaveBeenCalled();
    expect(mockEndProgress).not.toHaveBeenCalled();
    expect(mockShowAlert).not.toHaveBeenCalled();
  });

  it("remove a repo", async () => {
    setupLoadStargazers();

    render(<MainContainer />);

    await act(() => getLastCallArguments(mockRepoDetailsInput)[0].onGoClick(username, repo));

    expect(screen.getByTestId("Chart")).toBeInTheDocument();

    await act(() => getLastCallArguments(mockRepoChipContainer)[0].onDelete(username, repo));

    expect(screen.queryByTestId("Chart")).not.toBeInTheDocument();
  });

  it("handle chart zoom change", async () => {
    setupLoadStargazers();

    render(<MainContainer />);

    await act(() => getLastCallArguments(mockRepoDetailsInput)[0].onGoClick(username, repo));

    await act(() => getLastCallArguments(mockChart)[0].onZoomChanged("fromDate", "toDate"));

    expect(getLastCallArguments(mockRepoStats)[0]).toEqual(
      expect.objectContaining({ dateRange: { min: "fromDate", max: "toDate" } }),
    );
  });

  it("set and remove forecast", async () => {
    setupLoadStargazers();

    const mockCalcForecast = jest
      .spyOn(StargazerStats, "calcForecast")
      .mockReturnValueOnce(forecastData);

    render(<MainContainer />);

    await act(() => getLastCallArguments(mockRepoDetailsInput)[0].onGoClick(username, repo));

    await act(() => getLastCallArguments(mockForecast)[0].onForecastInfoChange(forecastInfo));

    await waitFor(() => {
      expect(mockCalcForecast).toHaveBeenCalledWith(stargazerData, forecastInfo.toForecastProps());
      expect(getLastCallArguments(mockForecast)[0]).toEqual(
        expect.objectContaining({ forecastInfo: forecastInfo }),
      );
    });

    await act(() => getLastCallArguments(mockForecast)[0].onForecastInfoChange(null));

    expect(getLastCallArguments(mockForecast)[0]).toEqual(
      expect.objectContaining({ forecastInfo: null }),
    );

    await waitFor(() => {
      expect(getLastCallArguments(mockChart)[0]).toEqual(
        expect.not.objectContaining({ forecast: undefined }),
      );
    });
  });

  it("error calculating forecast", async () => {
    setupLoadStargazers();

    jest.spyOn(StargazerStats, "calcForecast").mockImplementationOnce(() => {
      throw new Error("some error");
    });

    render(<MainContainer />);

    await act(() => getLastCallArguments(mockRepoDetailsInput)[0].onGoClick(username, repo));

    await act(() => getLastCallArguments(mockForecast)[0].onForecastInfoChange(forecastInfo));

    expect(mockShowAlert).toHaveBeenCalledWith("Something went wrong, please try again");

    waitFor(() => {
      expect(getLastCallArguments(mockChart)[0]).toEqual(
        expect.objectContaining({ forecast: undefined }),
      );
    });
  });

  it("not enough data to calculate forecast", async () => {
    setupLoadStargazers();

    jest.spyOn(StargazerStats, "calcForecast").mockImplementationOnce(() => {
      throw new StargazerStats.NotEnoughDataError();
    });

    render(<MainContainer />);

    await act(() => getLastCallArguments(mockRepoDetailsInput)[0].onGoClick(username, repo));

    await act(() => getLastCallArguments(mockForecast)[0].onForecastInfoChange(forecastInfo));

    expect(mockShowAlert).toHaveBeenCalledWith(
      "username/repo: there were not enough stars in the last 7 days to calculate the forecast",
    );

    waitFor(() => {
      expect(getLastCallArguments(mockChart)[0]).toEqual(
        expect.objectContaining({ forecast: undefined }),
      );
    });
  });

  it("try to load a repo with not enough data to calculate forecast", async () => {
    const repoInfo = {
      username: username,
      repo: repo,
      color: { hsl: `${username}#${repo}#hsl`, hex: `${username}#${repo}#hex` },
      stargazerData: stargazerData,
    };

    mockLocation.mockReturnValue({ state: [repoInfo] });

    jest
      .spyOn(StargazerLoader, "loadStargazers")
      .mockImplementationOnce(() => Promise.reject(new StargazerStats.NotEnoughDataError()));

    render(<MainContainer />);

    await act(() => getLastCallArguments(mockForecast)[0].onForecastInfoChange(forecastInfo));

    await act(() => getLastCallArguments(mockRepoDetailsInput)[0].onGoClick("username2", "repo2"));

    await waitFor(() => {
      expect(mockShowAlert).toHaveBeenCalledWith(
        "username2/repo2: not enough stars in the last 7 days to calculate forecast. Please turn off forecast to display this repo's info",
      );
    });
  });
});
