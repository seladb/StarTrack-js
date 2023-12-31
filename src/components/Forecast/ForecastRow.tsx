import { Button } from "@mui/material";
import { ForecastInfo } from "./ForecastInfo";

interface ForecastRowProps {
  info: ForecastInfo | null;
  onClick: () => void;
}

export default function ForecastRow({ info, onClick }: ForecastRowProps) {
  const timeForward = info && `${info.timeForward.count} ${info.timeForward.unit}`;
  const timeBackward = info && `${info.timeBackward.count} ${info.timeBackward.unit}`;

  const content = info ? (
    <div>
      <strong>{timeForward}</strong> forecast based on the last <strong>{timeBackward}</strong>
    </div>
  ) : (
    <div>Do not show forecast</div>
  );

  return (
    <Button
      color="inherit"
      sx={{
        fontFamily: "inherit",
        textTransform: "inherit",
        letterSpacing: "inherit",
        fontSize: "inherit",
      }}
      onClick={onClick}
    >
      {content}
    </Button>
  );
}
