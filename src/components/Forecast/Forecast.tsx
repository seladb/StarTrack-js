import React from "react";
import { Box, IconButton } from "@mui/material";
import ForecastForm from "./ForecastForm";
import { ForecastInfo } from "./ForecastInfo";
import ForecastRow from "./ForecastRow";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { ForecastProps as StargazerForecastProps } from "../../utils/StargazerStats";
import moment from "moment";

interface ForecastProps {
  onForecastChange: (props: StargazerForecastProps | null) => void;
}

export default function Forecast({ onForecastChange }: ForecastProps) {
  const [forecastFormOpen, setForecastFormOpen] = React.useState<boolean>(false);
  const [forecastInfo, setForecastInfo] = React.useState<ForecastInfo | null>(null);

  const handleForecastFormClosed = (forecastRequestedInfo: ForecastInfo | null) => {
    forecastRequestedInfo && setForecastInfo(forecastRequestedInfo);
    setForecastFormOpen(false);
  };

  const forecastInfoToProps = () => {
    if (!forecastInfo) {
      return null;
    }

    const currentDate = moment();
    const dateBackward = moment(currentDate).subtract(
      forecastInfo.timeBackward.count,
      forecastInfo.timeBackward.unit,
    );
    const daysBackward = moment(currentDate).diff(dateBackward, "days");

    const dateForward = moment(currentDate).add(
      forecastInfo.timeForward.count,
      forecastInfo.timeForward.unit,
    );
    const daysForward = moment(dateForward).diff(currentDate, "days");

    return {
      daysBackwards: daysBackward,
      daysForward: daysForward,
      numValues: forecastInfo.pointCount,
    };
  };

  React.useEffect(() => {
    onForecastChange(forecastInfoToProps());
  }, [forecastInfo]);

  return (
    <Box>
      <h1>Forecast</h1>
      <ForecastRow info={forecastInfo} onClick={() => setForecastFormOpen(true)} />
      {forecastInfo && (
        <IconButton aria-label="delete" onClick={() => setForecastInfo(null)}>
          <HighlightOffIcon />
        </IconButton>
      )}
      <ForecastForm
        open={forecastFormOpen}
        onClose={handleForecastFormClosed}
        initialValues={forecastInfo}
      />
    </Box>
  );
}
