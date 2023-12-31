import React from "react";
import Plot from "react-plotly.js";
import RepoInfo from "../../utils/RepoInfo";
import { PlotRelayoutEvent } from "plotly.js";
import { Box } from "@mui/material";

interface ChartProps {
  repoInfos: Array<RepoInfo>;
  onZoomChanged?: (start: string, end: string) => void;
}

function Chart({ repoInfos, onZoomChanged }: ChartProps) {
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

  const [chartHeight, setChartHeight] = React.useState<number>(0);
  const plotRef = React.useRef<HTMLDivElement>();

  React.useEffect(() => {
    if (!plotRef.current) {
      return;
    }
    const { width } = plotRef.current.getBoundingClientRect();
    setChartHeight(Math.min(width * 0.8, 800));
  }, []);

  return (
    <Box ref={plotRef}>
      <Plot
        data={repoInfos.map((repoInfo) => {
          return {
            x: repoInfo.stargazerData.timestamps,
            y: repoInfo.stargazerData.starCounts,
            name: `${repoInfo.username}/${repoInfo.repo}`,
            hovertemplate: `%{x|%d %b %Y}<br>${repoInfo.username}/${repoInfo.repo}: <b>%{y}</b><extra></extra>`,
            showlegend: repoInfos.length > 1,
            line: {
              color: repoInfo.color.hex,
              width: 5,
            },
          };
        })}
        style={{ width: "100%", height: "100%" }}
        useResizeHandler
        layout={{
          modebar: {
            remove: ["zoomIn2d", "zoomOut2d"],
          },
          xaxis: {
            type: "date",
          },
          yaxis: {
            fixedrange: true,
          },
          legend: {
            orientation: "h",
          },
          margin: {
            l: 50,
            r: 5,
            t: 10,
            b: 0,
          },
          height: chartHeight,
        }}
        onRelayout={handleChartEvent}
      />
    </Box>
  );
}

export default React.memo(Chart);
