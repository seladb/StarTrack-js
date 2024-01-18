import React from "react";
import Plot from "react-plotly.js";
import RepoInfo from "../../utils/RepoInfo";
import { PlotRelayoutEvent } from "plotly.js";
import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";

interface ChartProps {
  repoInfos: Array<RepoInfo>;
  onZoomChanged?: (start: string, end: string) => void;
}

function Chart({ repoInfos, onZoomChanged }: ChartProps) {
  const theme = useTheme();

  const [chartHeight, setChartHeight] = React.useState<number>(800);
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
