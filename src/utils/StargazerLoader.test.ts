import * as stargazerLoader from "./StargazerLoader";
import * as gitHubUtils from "./GitHubUtils";
import * as stargazerStats from "./StargazerStats";
import StarData from "./StarData";

describe(stargazerLoader.makeColor, () => {
  it("generate a color", () => {
    expect(stargazerLoader.makeColor()).toStrictEqual({
      hsl: `hsl(${0},50%,50%)`,
      hex: "#bf4040",
    });
    expect(stargazerLoader.makeColor()).toStrictEqual({
      hsl: `hsl(${137.508},50%,50%)`,
      hex: "#40bf65",
    });
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

  const user = "user";
  const repo = "repo";
  const handleProgressCallback = jest.fn();
  const shouldStop = jest.fn();

  const setup = () => {
    return {
      loadStargazersMock: jest
        .spyOn(gitHubUtils, "loadStargazers")
        .mockReturnValue(Promise.resolve(stargazerData)),
      makeColorMock: jest
        .spyOn(stargazerLoader, "makeColor")
        .mockReturnValue({ hsl: "hslColor", hex: "hexColor" }),
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
    const { loadStargazersMock, makeColorMock, calcForecastMock } = setup();

    const result = await stargazerLoader.loadStargazers(
      user,
      repo,
      handleProgressCallback,
      shouldStop,
    );
    expect(result).toStrictEqual({
      username: user,
      repo: repo,
      color: { hsl: "hslColor", hex: "hexColor" },
      stargazerData: stargazerData,
      forecast: undefined,
    });

    expect(loadStargazersMock).toHaveBeenCalledWith(user, repo, handleProgressCallback, shouldStop);
    expect(makeColorMock).toHaveBeenCalled();
    expect(calcForecastMock).not.toHaveBeenCalled();
  });

  it("loads star data with forecast", async () => {
    const { loadStargazersMock, makeColorMock, calcForecastMock } = setup();

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
      color: { hsl: "hslColor", hex: "hexColor" },
      stargazerData: stargazerData,
      forecast: forecastData,
    });

    expect(loadStargazersMock).toHaveBeenCalledWith(user, repo, handleProgressCallback, shouldStop);
    expect(makeColorMock).toHaveBeenCalled();
    expect(calcForecastMock).toHaveBeenCalledWith(stargazerData, forecastProps);
  });
});
