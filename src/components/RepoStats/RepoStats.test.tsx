import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import * as StargazerStats from "../../utils/StargazerStats";
import RepoInfo from "../../utils/RepoInfo";
import RepoStats from "./RepoStats";
import { createMatchMedia } from "../../utils/test";

const mockStatsGridLargeScreen = vi.fn();
vi.mock("./StatsGridLargeScreen", () => ({
  __esModule: true,
  default: (props: unknown[]) => {
    mockStatsGridLargeScreen(props);
    return <div data-testid="StatsGridLargeScreen" />;
  },
}));

const mockStatsGridSmallScreen = vi.fn();
vi.mock("./StatsGridSmallScreen", () => ({
  __esModule: true,
  default: (props: unknown[]) => {
    mockStatsGridSmallScreen(props);
    return <div data-testid="StatsGridSmallScreen" />;
  },
}));

const mockDownloadData = vi.fn();
vi.mock("./DownloadData", () => ({
  __esModule: true,
  default: (props: unknown[]) => {
    mockDownloadData(props);
    return <div />;
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
    vi.spyOn(StargazerStats, "calcStats").mockReturnValue(stats);

    window.matchMedia = createMatchMedia(200);

    render(<RepoStats repoInfos={repoInfos} />);

    expect(mockStatsGridSmallScreen).toHaveBeenCalledWith({ statInfos: expectedStatsInfos });
    expect(mockStatsGridLargeScreen).not.toHaveBeenCalled();
  });

  it("render on a large screen", () => {
    vi.spyOn(StargazerStats, "calcStats").mockReturnValue(stats);

    window.matchMedia = createMatchMedia(1000);

    render(<RepoStats repoInfos={repoInfos} />);

    expect(mockStatsGridSmallScreen).not.toHaveBeenCalled();
    expect(mockStatsGridLargeScreen).toHaveBeenCalledWith({ statInfos: expectedStatsInfos });
  });

  it("calcs stats with date range", () => {
    const mockCalcStats = vi.spyOn(StargazerStats, "calcStats").mockReturnValue(stats);

    const minDate1 = new Date();
    minDate1.setDate(new Date().getDate() - 30);
    const minDate2 = new Date();
    minDate2.setDate(new Date().getDate() - 40);
    const maxDate1 = new Date();
    maxDate1.setDate(new Date().getDate() - 2);
    const maxDate2 = new Date();
    maxDate2.setDate(new Date().getDate() - 5);

    const dateRanges = [
      {
        username: "user1",
        repo: "repo1",
        start: minDate1.toISOString(),
        end: maxDate1.toISOString(),
      },
      {
        username: "user2",
        repo: "repo2",
        start: minDate2.toISOString(),
        end: maxDate2.toISOString(),
      },
    ];

    render(<RepoStats repoInfos={repoInfos} dateRanges={dateRanges} />);

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
      [repoInfos[0].stargazerData, { min: dateRanges[0].start, max: dateRanges[0].end }],
      [repoInfos[1].stargazerData, { min: dateRanges[1].start, max: dateRanges[1].end }],
    ]);

    const dateRangeElement = screen.getByText("Date range", { exact: false });
    expect(dateRangeElement.parentNode?.textContent).toEqual(
      `Date range: ${minDate2.toLocaleDateString()} → ${maxDate1.toLocaleDateString()}`,
    );
  });

  it("renders correctly when date range is undefined", () => {
    const mockCalcStats = vi.spyOn(StargazerStats, "calcStats").mockReturnValue(stats);

    render(<RepoStats repoInfos={repoInfos} dateRanges={undefined} />);

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

  it("render download data", () => {
    render(<RepoStats repoInfos={repoInfos} />);

    expect(mockDownloadData).toHaveBeenCalledWith({ repoInfos: repoInfos });
  });
});
