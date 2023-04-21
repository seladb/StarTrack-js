import { render } from "@testing-library/react";
import Chart from "./Chart";
import RepoInfo from "../../utils/RepoInfo";

const mockPlot = jest.fn();
jest.mock("react-plotly.js", () => ({
  __esModule: true,
  default: (props: unknown[]) => {
    mockPlot(props);
    return <></>;
  },
}));

describe(Chart, () => {
  const repoInfos: Array<RepoInfo> = [
    {
      username: "user1",
      repo: "repo1",
      color: { hsl: "hslColor1", hex: "hexColor1" },
      stargazerData: {
        timestamps: ["ts1", "ts2"],
        starCounts: [1, 2],
      },
    },
    {
      username: "user2",
      repo: "repo2",
      color: { hsl: "hslColor2", hex: "hexColor2" },
      stargazerData: {
        timestamps: ["ts3", "ts4"],
        starCounts: [3, 4],
      },
    },
  ];

  it("renders a plotly chart with single repo", () => {
    render(<Chart repoInfos={repoInfos.filter((_, index) => index === 0)} />);

    expect(mockPlot).toHaveBeenCalledWith(
      expect.objectContaining({
        data: [
          {
            x: ["ts1", "ts2"],
            y: [1, 2],
            name: "user1/repo1",
            hovertemplate: "%{x|%d %b %Y}<br>user1/repo1: <b>%{y}</b><extra></extra>",
            showlegend: false,
            line: {
              color: "hexColor1",
              width: 5,
            },
          },
        ],
      }),
    );
  });

  it("renders a plotly chart with multiple repos", () => {
    render(<Chart repoInfos={repoInfos} />);

    expect(mockPlot).toHaveBeenCalledWith(
      expect.objectContaining({
        data: [
          {
            x: ["ts1", "ts2"],
            y: [1, 2],
            name: "user1/repo1",
            hovertemplate: "%{x|%d %b %Y}<br>user1/repo1: <b>%{y}</b><extra></extra>",
            showlegend: true,
            line: {
              color: "hexColor1",
              width: 5,
            },
          },
          {
            x: ["ts3", "ts4"],
            y: [3, 4],
            name: "user2/repo2",
            hovertemplate: "%{x|%d %b %Y}<br>user2/repo2: <b>%{y}</b><extra></extra>",
            showlegend: true,
            line: {
              color: "hexColor2",
              width: 5,
            },
          },
        ],
      }),
    );
  });
});
