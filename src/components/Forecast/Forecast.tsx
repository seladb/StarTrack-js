import React from "react";
import { Box, IconButton } from "@mui/material";
import ForecastForm from "./ForecastForm";
import { ForecastInfo } from "./ForecastInfo";
import ForecastRow from "./ForecastRow";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";

export default function Forecast() {
  const [forecastFormOpen, setForecastFormOpen] = React.useState<boolean>(false);
  const [forecastInfo, setForecastInfo] = React.useState<ForecastInfo | null>(null);

  const handleForecastFormClosed = (forecastRequestedInfo: ForecastInfo | null) => {
    forecastRequestedInfo && setForecastInfo(forecastRequestedInfo);
    setForecastFormOpen(false);
  };

  return (
    <Box>
      <h1>Forecast</h1>
      <ForecastRow
        info={forecastInfo}
        onClick={() => {
          console.log(forecastInfo);
          setForecastFormOpen(true);
        }}
      />
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
