import { Box, Chip } from "@mui/material";
import { ForecastInfo } from "./ForecastInfo";

interface ForecastRowProps {
  info: ForecastInfo | null;
  onClick: () => void;
  onDelete: () => void;
}

export default function ForecastRow({ info, onClick, onDelete }: ForecastRowProps) {
  const timeForward = info && `${info.timeForward.count} ${info.timeForward.unit}`;
  const timeBackward = info && `${info.timeBackward.count} ${info.timeBackward.unit}`;

  const content = info ? (
    <Box>
      <strong>{timeForward}</strong> forecast based on the last <strong>{timeBackward}</strong>
    </Box>
  ) : (
    <Box>Do not show forecast</Box>
  );

  return (
    <Box
      sx={{
        "& .MuiChip-root": {
          borderRadius: 1,
        },
        width: "100%",
      }}
    >
      <Chip label={content} onClick={onClick} onDelete={info ? onDelete : undefined} />
    </Box>
  );
}
