import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import Chart from "./Chart";
import RepoInfo from "../../utils/RepoInfo";
import { PlotParams } from "react-plotly.js";
import { getLastCallArguments } from "../../utils/test";
import { ModeBarButton, PlotlyHTMLElement } from "plotly.js";

const mockPlot = jest.fn();
const mockOnRelayoutEvent = jest.fn();
jest.mock("react-plotly.js", () => ({
  __esModule: true,
  default: (props: PlotParams) => {
    mockPlot(props);

    const onZoomChanged = () => {
      props.onRelayout && props.onRelayout(mockOnRelayoutEvent());
    };

    const onChangeScale = () => {
      props.config?.modeBarButtonsToAdd &&
        (props.config?.modeBarButtonsToAdd[0] as ModeBarButton).click(
          jest.fn() as unknown as PlotlyHTMLElement,
          jest.fn() as unknown as MouseEvent,
        );
    };

    return (
      <div>
        <button data-testid="plot-zoom-change" onClick={onZoomChanged}></button>;
        <button data-testid="plot-change-scale" onClick={onChangeScale}></button>;
      </div>
    );
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

  it("render a plotly chart with single repo", () => {
    render(<Chart repoInfos={repoInfos.filter((_, index) => index === 0)} />);

    expect(mockPlot).toHaveBeenCalledWith(
      expect.objectContaining({
        data: [
          {
            x: ["ts1", "ts2"],
            y: [1, 2],
            name: "user1/repo1",
            hovertemplate: "%{x|%d %b %Y}<br>user1/repo1: <b>%{y}</b><extra></extra>",
            line: {
              color: "hexColor1",
              width: 5,
              dash: "solid",
            },
          },
        ],
      }),
    );
  });

  it("render a plotly chart with multiple repos", () => {
    render(<Chart repoInfos={repoInfos} />);

    expect(mockPlot).toHaveBeenCalledWith(
      expect.objectContaining({
        data: [
          {
            x: ["ts1", "ts2"],
            y: [1, 2],
            name: "user1/repo1",
            hovertemplate: "%{x|%d %b %Y}<br>user1/repo1: <b>%{y}</b><extra></extra>",
            line: {
              color: "hexColor1",
              width: 5,
              dash: "solid",
            },
          },
          {
            x: ["ts3", "ts4"],
            y: [3, 4],
            name: "user2/repo2",
            hovertemplate: "%{x|%d %b %Y}<br>user2/repo2: <b>%{y}</b><extra></extra>",
            line: {
              color: "hexColor2",
              width: 5,
              dash: "solid",
            },
          },
        ],
      }),
    );
  });

  it("fire event on zoom change", () => {
    const zoomChangedCallback = jest.fn();
    render(<Chart repoInfos={repoInfos} onZoomChanged={zoomChangedCallback} />);

    const zoomMinTS = "zoomMinTS";
    const zoomMaxTS = "zoomMaxTS";
    mockOnRelayoutEvent.mockReturnValue({
      "xaxis.range[0]": zoomMinTS,
      "xaxis.range[1]": zoomMaxTS,
    });

    const mockZoomChange = screen.getByTestId("plot-zoom-change");
    fireEvent.click(mockZoomChange);

    expect(zoomChangedCallback).toHaveBeenCalledWith(zoomMinTS, zoomMaxTS);
  });

  it("fire zoom changed on autorange event", () => {
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
    render(<Chart repoInfos={repoInfos2} onZoomChanged={zoomChangedCallback} />);

    mockOnRelayoutEvent.mockReturnValue({ "xaxis.autorange": true });

    const mockZoomChange = screen.getByTestId("plot-zoom-change");
    fireEvent.click(mockZoomChange);

    expect(zoomChangedCallback).toHaveBeenCalledWith(minDate.toISOString(), maxDate.toISOString());

    zoomChangedCallback.mockReset();

    mockOnRelayoutEvent.mockReturnValue({ "xaxis.autorange": false });

    fireEvent.click(mockZoomChange);

    expect(zoomChangedCallback).not.toHaveBeenCalled();
  });

  it("do not fire zoom changed on to other events", () => {
    const zoomChangedCallback = jest.fn();
    render(<Chart repoInfos={repoInfos} onZoomChanged={zoomChangedCallback} />);

    mockOnRelayoutEvent.mockReturnValue({ someEvent: "value" });

    const mockZoomChange = screen.getByTestId("plot-zoom-change");
    fireEvent.click(mockZoomChange);

    expect(zoomChangedCallback).not.toHaveBeenCalled();
  });

  it("render height correctly when screen size changes", async () => {
    const { container } = render(<Chart repoInfos={repoInfos} />);

    const mockedPartialGetBoundingClientRect = {
      height: 0,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      x: 0,
      y: 0,
      toJSON: jest.fn(),
    };
    jest
      .spyOn(container.children[0], "getBoundingClientRect")
      .mockReturnValueOnce({
        ...mockedPartialGetBoundingClientRect,
        width: 300,
      })
      .mockReturnValueOnce({
        ...mockedPartialGetBoundingClientRect,
        width: 950,
      })
      .mockReturnValueOnce({
        ...mockedPartialGetBoundingClientRect,
        width: 1500,
      });

    fireEvent(window, new Event("resize"));

    await waitFor(() => {
      expect(getLastCallArguments(mockPlot)[0]).toEqual(
        expect.objectContaining({
          layout: expect.objectContaining({
            height: 240,
          }),
        }),
      );
    });

    fireEvent(window, new Event("resize"));

    await waitFor(() => {
      expect(getLastCallArguments(mockPlot)[0]).toEqual(
        expect.objectContaining({
          layout: expect.objectContaining({
            height: 760,
          }),
        }),
      );
    });

    fireEvent(window, new Event("resize"));

    await waitFor(() => {
      expect(getLastCallArguments(mockPlot)[0]).toEqual(
        expect.objectContaining({
          layout: expect.objectContaining({
            height: 800,
          }),
        }),
      );
    });
  });

  it("show forecast data", () => {
    const repoInfosWithForecastData = repoInfos.map((repoInfo) => ({
      ...repoInfo,
      forecast: {
        timestamps: ["ts5", "ts6"],
        starCounts: [11, 12],
      },
    }));

    render(<Chart repoInfos={repoInfosWithForecastData} />);

    expect(mockPlot).toHaveBeenCalledWith(
      expect.objectContaining({
        data: [
          {
            x: ["ts1", "ts2"],
            y: [1, 2],
            name: "user1/repo1",
            hovertemplate: "%{x|%d %b %Y}<br>user1/repo1: <b>%{y}</b><extra></extra>",
            line: {
              color: "hexColor1",
              width: 5,
              dash: "solid",
            },
          },
          {
            x: ["ts5", "ts6"],
            y: [11, 12],
            name: "user1/repo1 (forecast)",
            hovertemplate: "%{x|%d %b %Y}<br>user1/repo1 (forecast): <b>%{y}</b><extra></extra>",
            line: {
              color: "hexColor1",
              width: 5,
              dash: "dot",
            },
          },
          {
            x: ["ts3", "ts4"],
            y: [3, 4],
            name: "user2/repo2",
            hovertemplate: "%{x|%d %b %Y}<br>user2/repo2: <b>%{y}</b><extra></extra>",
            line: {
              color: "hexColor2",
              width: 5,
              dash: "solid",
            },
          },
          {
            x: ["ts5", "ts6"],
            y: [11, 12],
            name: "user2/repo2 (forecast)",
            hovertemplate: "%{x|%d %b %Y}<br>user2/repo2 (forecast): <b>%{y}</b><extra></extra>",
            line: {
              color: "hexColor2",
              width: 5,
              dash: "dot",
            },
          },
        ],
      }),
    );
  });

  it("switch scale", () => {
    render(<Chart repoInfos={repoInfos} />);

    expect(getLastCallArguments(mockPlot)[0]).toEqual(
      expect.objectContaining({
        config: {
          modeBarButtonsToAdd: [
            expect.objectContaining({
              name: "log-scale",
              title: "Use logarithmic scale",
            }),
          ],
        },
        layout: expect.objectContaining({
          yaxis: expect.objectContaining({
            type: "linear",
          }),
        }),
      }),
    );

    const mockChangeScale = screen.getByTestId("plot-change-scale");
    fireEvent.click(mockChangeScale);

    expect(getLastCallArguments(mockPlot)[0]).toEqual(
      expect.objectContaining({
        config: {
          modeBarButtonsToAdd: [
            expect.objectContaining({
              name: "linear-scale",
              title: "Use linear scale",
            }),
          ],
        },
        layout: expect.objectContaining({
          yaxis: expect.objectContaining({
            type: "log",
          }),
        }),
      }),
    );

    fireEvent.click(mockChangeScale);

    expect(getLastCallArguments(mockPlot)[0]).toEqual(
      expect.objectContaining({
        config: {
          modeBarButtonsToAdd: [
            expect.objectContaining({
              name: "log-scale",
              title: "Use logarithmic scale",
            }),
          ],
        },
        layout: expect.objectContaining({
          yaxis: expect.objectContaining({
            type: "linear",
          }),
        }),
      }),
    );
  });
});
