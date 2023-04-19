import Plot from "react-plotly.js";
import RepoInfo from "../../utils/RepoInfo";

interface ChartProps {
  repoInfos: Array<RepoInfo>;
}

export default function Chart({ repoInfos }: ChartProps) {
  return (
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
      style={{ width: "100%" }}
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
        height: 800,
        margin: {
          l: 50,
          r: 5,
          t: 10,
        },
      }}
    />
  );
}
