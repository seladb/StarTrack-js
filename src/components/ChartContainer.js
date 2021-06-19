import React from "react";
import PropTypes from "prop-types";
import { Container } from "react-bootstrap/";
import ReactApexChart from "react-apexcharts";
import { icon } from "@fortawesome/fontawesome-svg-core";
import { faChartLine, faSuperscript } from "@fortawesome/free-solid-svg-icons";

export const LINEAR = "linear";
export const LOGSCALE = "logscale";

const ChartContainer = (props) => {
  const chartSeries = props.repos.flatMap(
    ({ username, repo, stargazerData, forecast }) => {
      const series = [
        {
          name: username + "/" + repo,
          data: stargazerData,
        },
      ];
      if (forecast !== null) {
        series.push({
          name: username + "/" + repo + " (forecast)",
          data: forecast,
        });
      }
      return series;
    }
  );

  const onZoom = (chartContext, { xaxis, yaxis }) => {
    if (props.onTimeRangeChange) {
      props.onTimeRangeChange(xaxis);
    }
  };

  const chartOptions = {
    chart: {
      id: "stargazers",
      zoom: {
        autoScaleYaxis: props.repos.length <= 1,
      },
      events: {
        zoomed: onZoom,
      },
      toolbar: {
        tools: {
          // disable zoom and pan tools in log mode, see
          // https://github.com/seladb/StarTrack-js/issues/15#issuecomment-646945288
          ...["zoom", "zoomin", "zoomout", "pan", "reset"].reduce((a, k) => {
            a[k] = props.chartType === LINEAR;
            return a;
          }, {}),
          customIcons: [
            {
              icon: icon(faChartLine).html,
              index: -2,
              class: `chart-fa-icon mr-1 ml-3 ${
                props.chartType === LINEAR ? "text-primary" : ""
              }`,
              title: "Use linear scale",
              click() {
                props.onChartTypeChange(LINEAR);
              },
            },
            {
              icon: icon(faSuperscript).html,
              index: -1,
              class: `chart-fa-icon mr-2 ${
                props.chartType === LOGSCALE ? "text-primary" : ""
              }`,
              title: "Use logarithmic scale",
              click() {
                props.onChartTypeChange(LOGSCALE);
              },
            },
          ],
        },
      },
    },
    yaxis: {
      logarithmic: props.chartType === LOGSCALE,
    },
    xaxis: {
      type: "datetime",
    },
    tooltip: {
      x: {
        format: "dd MMM yyyy",
      },
    },
    stroke: {
      curve: "straight",
      dashArray: props.repos.flatMap(({ forecast }) => {
        return forecast !== null ? [0, 5] : [0];
      }),
    },
    colors: props.repos.flatMap(({ color, forecast }) => {
      return forecast !== null ? [color, color] : [color];
    }),
  };

  return (
    <Container className="mt-5">
      <ReactApexChart options={chartOptions} series={chartSeries} type="line" />
    </Container>
  );
};
ChartContainer.propTypes = {
  repos: PropTypes.array,
  onTimeRangeChange: PropTypes.func,
  onChartTypeChange: PropTypes.func,
  chartType: PropTypes.string,
};

export default ChartContainer;
