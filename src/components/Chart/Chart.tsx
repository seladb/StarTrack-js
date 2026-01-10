import React from "react";
import Plot from "react-plotly.js";
import RepoInfo from "../../utils/RepoInfo";
import Plotly, { ModeBarButton, PlotRelayoutEvent } from "plotly.js";
import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";

interface ZoomProps {
  username: string;
  repo: string;
  start: string;
  end: string;
}

interface ChartProps {
  repoInfos: Array<RepoInfo>;
  onZoomChanged?: (repoTimeRange: Array<ZoomProps>) => void;
}

function Chart({ repoInfos, onZoomChanged }: ChartProps) {
  const theme = useTheme();

  const [chartHeight, setChartHeight] = React.useState<number>(800);
  const [yaxisType, setYaxisType] = React.useState<Plotly.AxisType>("linear");
  const [timeline, setTimeline] = React.useState<"absolute" | "relative">("absolute");

  const timelineRef = React.useRef<"absolute" | "relative">("absolute");

  const plotRef = React.useRef<HTMLDivElement>();

  const getDefaultZoomProps = React.useCallback((): Array<ZoomProps> => {
    return repoInfos.map(({ username, repo, stargazerData }) => ({
      username,
      repo,
      start: new Date(stargazerData.timestamps[0]).toISOString(),
      end: new Date(stargazerData.timestamps[stargazerData.timestamps.length - 1]).toISOString(),
    }));
  }, [repoInfos]);

  const handleResize = () => {
    if (!plotRef.current) {
      return;
    }

    const { width } = plotRef.current.getBoundingClientRect();
    setChartHeight(Math.min(width * 0.8, 800));
  };

  React.useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  React.useEffect(() => {
    if (onZoomChanged && timelineRef.current !== timeline) {
      onZoomChanged(getDefaultZoomProps());
      timelineRef.current = timeline;
    }
  }, [timeline, onZoomChanged, getDefaultZoomProps]);

  const handleChartEvent = (event: Readonly<PlotRelayoutEvent>) => {
    if (!onZoomChanged) {
      return;
    }

    if (event["xaxis.range[0]"] && event["xaxis.range[1]"]) {
      const startRange = event["xaxis.range[0]"];
      const endRange = event["xaxis.range[1]"];
      const zoomProps = repoInfos.map(({ username, repo, stargazerData }) => {
        const startDate = new Date(stargazerData.timestamps[0]).getTime();
        return {
          username,
          repo,
          start:
            timeline === "absolute"
              ? startRange.toString().replace(/ /g, "T")
              : new Date(startDate + startRange * 24 * 3600 * 1000).toISOString(),
          end:
            timeline === "absolute"
              ? endRange.toString().replace(/ /g, "T")
              : new Date(startDate + endRange * 24 * 3600 * 1000).toISOString(),
        };
      });
      onZoomChanged(zoomProps);
    } else if (event["xaxis.autorange"]) {
      onZoomChanged(getDefaultZoomProps());
    }
  };

  const LogButton: ModeBarButton = {
    name: "log-scale",
    title: "Use logarithmic scale",
    icon: {
      width: 512,
      height: 512,
      path: "M480 32c0-11.1-5.7-21.4-15.2-27.2s-21.2-6.4-31.1-1.4l-32 16c-15.8 7.9-22.2 27.1-14.3 42.9C393 73.5 404.3 80 416 80v80c-17.7 0-32 14.3-32 32s14.3 32 32 32h32 32c17.7 0 32-14.3 32-32s-14.3-32-32-32V32zM32 64C14.3 64 0 78.3 0 96s14.3 32 32 32H47.3l89.6 128L47.3 384H32c-17.7 0-32 14.3-32 32s14.3 32 32 32H64c10.4 0 20.2-5.1 26.2-13.6L176 311.8l85.8 122.6c6 8.6 15.8 13.6 26.2 13.6h32c17.7 0 32-14.3 32-32s-14.3-32-32-32H304.7L215.1 256l89.6-128H320c17.7 0 32-14.3 32-32s-14.3-32-32-32H288c-10.4 0-20.2 5.1-26.2 13.6L176 200.2 90.2 77.6C84.2 69.1 74.4 64 64 64H32z",
    },
    click: () => setYaxisType("log"),
  };

  const LinearButton: ModeBarButton = {
    name: "linear-scale",
    title: "Use linear scale",
    icon: {
      width: 512,
      height: 512,
      path: "M64 64c0-17.7-14.3-32-32-32S0 46.3 0 64V400c0 44.2 35.8 80 80 80H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H80c-8.8 0-16-7.2-16-16V64zm406.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L320 210.7l-57.4-57.4c-12.5-12.5-32.8-12.5-45.3 0l-112 112c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L240 221.3l57.4 57.4c12.5 12.5 32.8 12.5 45.3 0l128-128z",
    },
    click: () => setYaxisType("linear"),
  };

  const AbsoluteButton: ModeBarButton = {
    name: "absolute-timeline",
    title: "Use absolute dates",
    icon: {
      width: 512,
      height: 512,
      path: "M120 0c13.3 0 24 10.7 24 24l0 40 160 0 0-40c0-13.3 10.7-24 24-24s24 10.7 24 24l0 40 32 0c35.3 0 64 28.7 64 64l0 288c0 35.3-28.7 64-64 64L64 480c-35.3 0-64-28.7-64-64L0 128C0 92.7 28.7 64 64 64l32 0 0-40c0-13.3 10.7-24 24-24zm0 112l-56 0c-8.8 0-16 7.2-16 16l0 48 352 0 0-48c0-8.8-7.2-16-16-16l-264 0zM48 224l0 192c0 8.8 7.2 16 16 16l320 0c8.8 0 16-7.2 16-16l0-192-352 0z",
    },
    click: () => {
      setTimeline("absolute");
      onZoomChanged?.(getDefaultZoomProps());
    },
  };

  const RelativeButton: ModeBarButton = {
    name: "relative-timeline",
    title: "Use dates relative to the first star",
    icon: {
      width: 512,
      height: 512,
      path: "M168.5 0c-13.3 0-24 10.7-24 24s10.7 24 24 24l32 0 0 25.3c-108 11.9-192 103.5-192 214.7 0 119.3 96.7 216 216 216s216-96.7 216-216c0-39.8-10.8-77.1-29.6-109.2l28.2-28.2c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-23.4 23.4c-32.9-30.2-75.2-50.3-122-55.5l0-25.3 32 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-112 0zm80 184l0 104c0 13.3-10.7 24-24 24s-24-10.7-24-24l0-104c0-13.3 10.7-24 24-24s24 10.7 24 24z",
    },
    click: () => {
      setTimeline("relative");
      onZoomChanged?.(getDefaultZoomProps());
    },
  };

  return (
    <Box ref={plotRef}>
      <Plot
        data={repoInfos.flatMap(({ stargazerData, username, repo, color, forecast }) => {
          const startDate = new Date(stargazerData.timestamps[0]).getTime();

          const series = [
            {
              x:
                timeline === "absolute"
                  ? stargazerData.timestamps
                  : stargazerData.timestamps.map(
                      (it) => (new Date(it).getTime() - startDate) / (1000 * 3600 * 24),
                    ),
              y: stargazerData.starCounts,
              name: `${username}/${repo}`,
              hovertemplate:
                timeline === "absolute"
                  ? `%{x|%d %b %Y}<br>${username}/${repo}: <b>%{y}</b><extra></extra>`
                  : `%{x:d} days<br>${username}/${repo}: <b>%{y}</b><extra></extra>`,
              line: {
                color: color.hex,
                width: 5,
                dash: "solid",
              },
            },
          ];

          if (forecast) {
            series.push({
              x:
                timeline === "absolute"
                  ? forecast.timestamps
                  : forecast.timestamps.map(
                      (it) => (new Date(it).getTime() - startDate) / (1000 * 3600 * 24),
                    ),
              y: forecast.starCounts,
              name: `${username}/${repo} (forecast)`,
              hovertemplate:
                timeline === "absolute"
                  ? `%{x|%d %b %Y}<br>${username}/${repo} (forecast): <b>%{y}</b><extra></extra>`
                  : `%{x:d} days<br>${username}/${repo} (forecast): <b>%{y}</b><extra></extra>`,
              line: {
                color: color.hex,
                width: 5,
                dash: "dot",
              },
            });
          }

          return series;
        })}
        style={{ width: "100%", height: "100%" }}
        useResizeHandler
        config={{
          modeBarButtonsToAdd: [
            yaxisType === "linear" ? LogButton : LinearButton,
            timeline === "absolute" ? RelativeButton : AbsoluteButton,
          ],
        }}
        layout={{
          font: {
            family: theme.typography.fontFamily,
            size: theme.typography.fontSize,
            color: theme.palette.text.primary,
          },
          // eslint-disable-next-line camelcase
          plot_bgcolor: theme.palette.background.default,
          // eslint-disable-next-line camelcase
          paper_bgcolor: theme.palette.background.default,
          hoverlabel: {
            font: {
              family: theme.typography.fontFamily,
            },
          },
          showlegend: repoInfos.length > 1 || repoInfos[0].forecast !== undefined,
          modebar: {
            remove: ["zoomIn2d"],
          },
          xaxis: {
            type: timeline === "absolute" ? "date" : "linear",
          },
          yaxis: {
            fixedrange: true,
            type: yaxisType,
          },
          legend: {
            orientation: "h",
          },
          margin: {
            l: 50,
            r: 5,
            t: 10,
            b: 15,
          },
          height: chartHeight,
        }}
        onRelayout={handleChartEvent}
      />
    </Box>
  );
}

export default React.memo(Chart);
