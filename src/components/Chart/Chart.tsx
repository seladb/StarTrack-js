import React from "react";
import Plot from "react-plotly.js";
import RepoInfo from "../../utils/RepoInfo";
import Plotly, { ModeBarButton, PlotRelayoutEvent } from "plotly.js";
import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";

interface ChartProps {
  repoInfos: Array<RepoInfo>;
  onZoomChanged?: (start: string, end: string) => void;
}

function Chart({ repoInfos, onZoomChanged }: ChartProps) {
  const theme = useTheme();

  const [chartHeight, setChartHeight] = React.useState<number>(800);
  const [yaxisType, setYaxisType] = React.useState<Plotly.AxisType>("linear");

  const plotRef = React.useRef<HTMLDivElement>();

  React.useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleResize = () => {
    if (!plotRef.current) {
      return;
    }

    const { width } = plotRef.current.getBoundingClientRect();
    setChartHeight(Math.min(width * 0.8, 800));
  };

  const handleChartEvent = (event: Readonly<PlotRelayoutEvent>) => {
    if (!onZoomChanged) {
      return;
    }

    if (event["xaxis.range[0]"] && event["xaxis.range[1]"]) {
      onZoomChanged(
        event["xaxis.range[0]"].toString().replace(/ /g, "T"),
        event["xaxis.range[1]"].toString().replace(/ /g, "T"),
      );
    } else if (event["xaxis.autorange"]) {
      const minDates = repoInfos.map((repoInfo) => repoInfo.stargazerData.timestamps[0]);
      const maxDates = repoInfos.map(
        (repoInfo) =>
          repoInfo.stargazerData.timestamps[repoInfo.stargazerData.timestamps.length - 1],
      );
      const minTimestamps = minDates.map((dateAsString) => new Date(dateAsString).getTime());
      const maxTimestamps = maxDates.map((dateAsString) => new Date(dateAsString).getTime());
      onZoomChanged(
        minDates[minTimestamps.indexOf(Math.min(...minTimestamps))].replace(/ /g, "T"),
        maxDates[maxTimestamps.indexOf(Math.max(...maxTimestamps))].replace(/ /g, "T"),
      );
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

  return (
    <Box ref={plotRef}>
      <Plot
        data={repoInfos.flatMap(({ stargazerData, username, repo, color, forecast }) => {
          const series = [
            {
              x: stargazerData.timestamps,
              y: stargazerData.starCounts,
              name: `${username}/${repo}`,
              hovertemplate: `%{x|%d %b %Y}<br>${username}/${repo}: <b>%{y}</b><extra></extra>`,
              line: {
                color: color.hex,
                width: 5,
                dash: "solid",
              },
            },
          ];

          if (forecast) {
            series.push({
              x: forecast.timestamps,
              y: forecast.starCounts,
              name: `${username}/${repo} (forecast)`,
              hovertemplate: `%{x|%d %b %Y}<br>${username}/${repo} (forecast): <b>%{y}</b><extra></extra>`,
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
          modeBarButtonsToAdd: [yaxisType === "linear" ? LogButton : LinearButton],
        }}
        layout={{
          font: {
            family: theme.typography.fontFamily,
            size: theme.typography.fontSize,
          },
          hoverlabel: {
            font: {
              family: theme.typography.fontFamily,
            },
          },
          showlegend: repoInfos.length > 1 || repoInfos[0].forecast !== undefined,
          modebar: {
            remove: ["zoomIn2d", "zoomOut2d"],
          },
          xaxis: {
            type: "date",
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
