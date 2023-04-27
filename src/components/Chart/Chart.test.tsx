import { fireEvent, render, screen } from "@testing-library/react";
import Chart from "./Chart";
import RepoInfo from "../../utils/RepoInfo";
import { PlotParams } from "react-plotly.js";

const mockPlot = jest.fn();
const mockOnRelayoutEvent = jest.fn();
jest.mock("react-plotly.js", () => ({
  __esModule: true,
  default: (props: PlotParams) => {
    mockPlot(props);

    const onZoomChanged = () => {
      props.onRelayout && props.onRelayout(mockOnRelayoutEvent());
    }
    return <button data-testid="plot-zoom-change" onClick={onZoomChanged}></button>;
  },
}));

describe("Chart", () => {
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

  it("fires event on zoom change", () => {
    const zoomChangedCallback = jest.fn();
    render(<Chart repoInfos={repoInfos} onZoomChanged={zoomChangedCallback}/>);

    const zoomMinTS = "zoomMinTS";
    const zoomMaxTS = "zoomMaxTS"
    mockOnRelayoutEvent.mockReturnValue({"xaxis.range[0]": zoomMinTS, "xaxis.range[1]": zoomMaxTS});

    const mockZoomChange = screen.getByTestId("plot-zoom-change");
    fireEvent.click(mockZoomChange);

    expect(zoomChangedCallback).toHaveBeenCalledWith(zoomMinTS, zoomMaxTS);
  });

  it("fires zoom changed on autorange event", () => {
    const minDate = new Date("01/01/2015");
    const maxDate = new Date("02/01/2023");
    const repoInfos2: Array<RepoInfo> = [
      {
        username: "user1",
        repo: "repo1",
        color: { hsl: "hslColor1", hex: "hexColor1" },
        stargazerData: {
          timestamps: [minDate.toISOString(), new Date("01/01/2023").toISOString()],
          starCounts: [1, 2],
        },
      },
      {
        username: "user2",
        repo: "repo2",
        color: { hsl: "hslColor2", hex: "hexColor2" },
        stargazerData: {
          timestamps: [new Date("02/01/2015").toISOString(), maxDate.toISOString()],
          starCounts: [3, 4],
        },
      },
    ];

    const zoomChangedCallback = jest.fn();
    render(<Chart repoInfos={repoInfos2} onZoomChanged={zoomChangedCallback}/>);

    mockOnRelayoutEvent.mockReturnValue({"xaxis.autorange": true});

    const mockZoomChange = screen.getByTestId("plot-zoom-change");
    fireEvent.click(mockZoomChange);

    expect(zoomChangedCallback).toHaveBeenCalledWith(minDate.toISOString(), maxDate.toISOString());

    zoomChangedCallback.mockReset();

    mockOnRelayoutEvent.mockReturnValue({"xaxis.autorange": false});

    fireEvent.click(mockZoomChange);

    expect(zoomChangedCallback).not.toHaveBeenCalled();
  });

  it("does not fire zoom changed on to other events", () => {
    const zoomChangedCallback = jest.fn();
    render(<Chart repoInfos={repoInfos} onZoomChanged={zoomChangedCallback}/>);

    mockOnRelayoutEvent.mockReturnValue({"some_event": "value"});

    const mockZoomChange = screen.getByTestId("plot-zoom-change");
    fireEvent.click(mockZoomChange);

    expect(zoomChangedCallback).not.toHaveBeenCalled();
  });
});
