import { Chip } from "@mui/material";
import { makeStyles, createStyles } from "@mui/styles";
import { ForecastInfo } from "./ForecastInfo";

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      "& .MuiChip-root": {
        borderRadius: 1,
      },
    },
  }),
);

interface ForecastRowProps {
  info: ForecastInfo | null;
  onClick: () => void;
  onDelete: () => void;
}

export default function ForecastRow({ info, onClick, onDelete }: ForecastRowProps) {
  const classes = useStyles();

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
    <div className={classes.root}>
      <Chip
        label={content}
        onClick={onClick}
        onDelete={info ? onDelete : undefined}
      />
    </div>
  );
}
