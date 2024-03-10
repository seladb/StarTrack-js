import React from "react";
import { Stack, Typography } from "@mui/material";
import ForecastForm from "./ForecastForm";
import { ForecastInfo } from "./ForecastInfo";
import ForecastRow from "./ForecastRow";

interface ForecastProps {
  forecastInfo: ForecastInfo | null;
  onForecastInfoChange: (forecastInfo: ForecastInfo | null) => void;
}

export default function Forecast({ forecastInfo, onForecastInfoChange }: ForecastProps) {
  const [forecastFormOpen, setForecastFormOpen] = React.useState<boolean>(false);

  const handleForecastFormClosed = (forecastRequestedInfo: ForecastInfo | null) => {
    forecastRequestedInfo && onForecastInfoChange(forecastRequestedInfo);
    setForecastFormOpen(false);
  };

  return (
    <Stack spacing={3}>
      <Typography variant="h4" sx={{ fontWeight: 600 }}>
        Forecast
      </Typography>
      <ForecastRow
        info={forecastInfo}
        onClick={() => setForecastFormOpen(true)}
        onDelete={() => onForecastInfoChange(null)}
      />
      <ForecastForm
        open={forecastFormOpen}
        onClose={handleForecastFormClosed}
        initialValues={forecastInfo}
      />
    </Stack>
  );
}
