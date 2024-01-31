import { render, screen, fireEvent } from "@testing-library/react";
import * as StargazerStats from "../../utils/StargazerStats";
import RepoInfo from "../../utils/RepoInfo";
import RepoStats from "./RepoStats";
import { createMatchMedia } from "../../utils/test";

const mockStatsGridLargeScreen = jest.fn();
jest.mock("./StatsGridLargeScreen", () => ({
  __esModule: true,
  default: (props: unknown[]) => {
    mockStatsGridLargeScreen(props);
    return <div data-testid="StatsGridLargeScreen" />;
  },
}));

const mockStatsGridSmallScreen = jest.fn();
jest.mock("./StatsGridSmallScreen", () => ({
  __esModule: true,
  default: (props: unknown[]) => {
    mockStatsGridSmallScreen(props);
    return <div data-testid="StatsGridSmallScreen" />;
  },
}));

describe(RepoStats, () => {
  const repoInfos: Array<RepoInfo> = [
    {
      username: "user1",
      repo: "repo1",
      color: {
        hex: "hexColor1",
        hsl: "stlColor1",
      },
      stargazerData: {
        timestamps: ["ts1", "ts2"],
        starCounts: [1, 2],
      },
    },
    {
      username: "user2",
      repo: "repo2",
      color: {
        hex: "hexColor2",
        hsl: "stlColor2",
      },
      stargazerData: {
        timestamps: ["ts1", "ts2"],
        starCounts: [1, 2],
      },
    },
  ];

  const stats = {
    "Stat 1": 1,
    "Stat 2": "2",
  };

  const expectedStatsInfos = [
    {
      ...repoInfos[0],
      stats: stats,
    },
    {
      ...repoInfos[1],
      stats: stats,
    },
  ];

  it("render on a small screen", () => {
    jest.spyOn(StargazerStats, "calcStats").mockReturnValue(stats);

    window.matchMedia = createMatchMedia(200);

    render(<RepoStats repoInfos={repoInfos} />);

    expect(mockStatsGridSmallScreen).toHaveBeenCalledWith({ statInfos: expectedStatsInfos });
    expect(mockStatsGridLargeScreen).not.toHaveBeenCalled();
  });

  it("render on a large screen", () => {
    jest.spyOn(StargazerStats, "calcStats").mockReturnValue(stats);

    window.matchMedia = createMatchMedia(1000);

    render(<RepoStats repoInfos={repoInfos} />);

    expect(mockStatsGridSmallScreen).not.toHaveBeenCalled();
    expect(mockStatsGridLargeScreen).toHaveBeenCalledWith({ statInfos: expectedStatsInfos });
  });

  it("calcs stats with date range", () => {
    const mockCalcStats = jest.spyOn(StargazerStats, "calcStats").mockReturnValue(stats);

    const minDate = new Date();
    minDate.setDate(new Date().getDate() - 30);
    const maxDate = new Date();
    maxDate.setDate(new Date().getDate() - 2);
    const dateRange = {
      min: minDate.toISOString(),
      max: maxDate.toISOString(),
    };

    render(<RepoStats repoInfos={repoInfos} dateRange={dateRange} />);

    expect(mockCalcStats.mock.calls).toEqual([
      [repoInfos[0].stargazerData, undefined],
      [repoInfos[1].stargazerData, undefined],
    ]);

    expect(screen.queryByText("Date range:")).not.toBeInTheDocument();

    mockCalcStats.mockReset();
    mockCalcStats.mockReturnValue(stats);

    const checkBox = screen.getByLabelText("Sync stats to chart zoom level");
    fireEvent.click(checkBox);

    expect(mockCalcStats.mock.calls).toEqual([
      [repoInfos[0].stargazerData, dateRange],
      [repoInfos[1].stargazerData, dateRange],
    ]);

    const dateRangeElement = screen.getByText("Date range", { exact: false });
    expect(dateRangeElement.parentNode?.textContent).toEqual(
      `Date range: ${minDate.toLocaleDateString()} → ${maxDate.toLocaleDateString()}`,
    );
  });

  it("renders correctly when date range is undefined", () => {
    const mockCalcStats = jest.spyOn(StargazerStats, "calcStats").mockReturnValue(stats);

    render(<RepoStats repoInfos={repoInfos} dateRange={undefined} />);

    mockCalcStats.mockReset();
    mockCalcStats.mockReturnValue(stats);

    const checkBox = screen.getByLabelText("Sync stats to chart zoom level");
    fireEvent.click(checkBox);

    expect(mockCalcStats.mock.calls).toEqual([
      [repoInfos[0].stargazerData, undefined],
      [repoInfos[1].stargazerData, undefined],
    ]);

    expect(screen.queryByText("Date range:")).not.toBeInTheDocument();
  });
});
