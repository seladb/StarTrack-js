import * as stargazerLoader from "./StargazerLoader";
import * as gitHubUtils from "./GitHubUtils";
import * as stargazerStats from "./StargazerStats";
import StarData from "./StarData";

describe(stargazerLoader.makeColor, () => {
  it("generate a color", () => {
    expect(stargazerLoader.makeColor()).toBe(`hsl(${0},50%,50%)`);
    expect(stargazerLoader.makeColor()).toBe(`hsl(${137.508},50%,50%)`);
  });
});

describe(stargazerLoader.loadStargazers, () => {
  const stargazerData: StarData = {
    timestamps: ["ts1", "ts2"],
    starCounts: [1, 2],
  };

  const forecastData: StarData = {
    timestamps: ["ts3"],
    starCounts: [2],
  };

  const stats = {
    "Number of stars": 1,
    "Number of days": 1,
    "Average stars per day": "1.0",
    "Days with stars": 1,
    "Max stars in one day": 1,
    "Day with most stars": "1",
  };

  const user = "user";
  const repo = "repo";
  const handleProgressCallback = jest.fn();
  const shouldStop = jest.fn();

  const setup = () => {
    return {
      loadStargazersMock: jest
        .spyOn(gitHubUtils, "loadStargazers")
        .mockReturnValue(Promise.resolve(stargazerData)),
      makeColorMock: jest.spyOn(stargazerLoader, "makeColor").mockReturnValue("color"),
      calcStatsMock: jest.spyOn(stargazerStats, "calcStats").mockReturnValue(stats),
      calcForecastMock: jest.spyOn(stargazerStats, "calcForecast").mockReturnValue(forecastData),
    };
  };

  it("returns null if no star data", async () => {
    jest.spyOn(gitHubUtils, "loadStargazers").mockReturnValue(Promise.resolve(null));
    const result = await stargazerLoader.loadStargazers(
      user,
      repo,
      handleProgressCallback,
      shouldStop,
    );
    expect(result).toBeNull();
  });

  it("loads star data without forecast", async () => {
    const { loadStargazersMock, makeColorMock, calcStatsMock, calcForecastMock } = setup();

    const result = await stargazerLoader.loadStargazers(
      user,
      repo,
      handleProgressCallback,
      shouldStop,
    );
    expect(result).toStrictEqual({
      username: user,
      repo: repo,
      color: "color",
      stargazerData: stargazerData,
      stats: stats,
      forecast: undefined,
    });

    expect(loadStargazersMock).toHaveBeenCalledWith(user, repo, handleProgressCallback, shouldStop);
    expect(makeColorMock).toHaveBeenCalled();
    expect(calcStatsMock).toHaveBeenCalledWith(stargazerData);
    expect(calcForecastMock).not.toHaveBeenCalled();
  });

  it("loads star data with forecast", async () => {
    const { loadStargazersMock, makeColorMock, calcStatsMock, calcForecastMock } = setup();

    const forecastProps = {
      daysBackwards: 1,
      daysForward: 1,
      numValues: 1,
    };

    const result = await stargazerLoader.loadStargazers(
      user,
      repo,
      handleProgressCallback,
      shouldStop,
      forecastProps,
    );
    expect(result).toStrictEqual({
      username: user,
      repo: repo,
      color: "color",
      stargazerData: stargazerData,
      stats: stats,
      forecast: forecastData,
    });

    expect(loadStargazersMock).toHaveBeenCalledWith(user, repo, handleProgressCallback, shouldStop);
    expect(makeColorMock).toHaveBeenCalled();
    expect(calcStatsMock).toHaveBeenCalledWith(stargazerData);
    expect(calcForecastMock).toHaveBeenCalledWith(stargazerData, forecastProps);
  });
});
