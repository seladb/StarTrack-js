import { useTheme } from "@mui/material/styles";
import { makeStyles, createStyles } from "@mui/styles";
import LinearProgress from "@mui/material/LinearProgress";
import React, { createContext, useContext } from "react";

type ProgressContextActions = {
  startProgress: () => void;
  advanceProgress: (value: number) => void;
  setProgress: (value: number) => void;
  endProgress: () => void;
};

const ProgressContext = createContext({} as ProgressContextActions);

interface ProgressProviderProps {
  children: React.ReactNode;
}

export const useProgressBarStyles = makeStyles(() =>
  createStyles({
    progressBar: {
      // Disable the transition animation from 100 to 0 inside the progress bar
      // eslint-disable-next-line quotes
      '&[aria-valuenow="0"]': {
        "& > $progressBarInner": {
          transition: "none",
        },
      },
    },
    progressBarInner: {},
  }),
);

const ProgressProvider: React.FC<ProgressProviderProps> = ({ children }) => {
  const [show, setShow] = React.useState<boolean>(false);
  const [curProgress, setCurProgress] = React.useState<number>(0);

  const classes = useProgressBarStyles();
  const theme = useTheme();

  const startProgress = () => {
    setShow(true);
    setCurProgress(0);
  };

  const endProgress = () => {
    setShow(false);
  };

  const advanceProgress = (value: number) => {
    const newProgress = curProgress + value > 100 ? 100 : curProgress + value;
    setCurProgress(newProgress);
  };

  const setProgress = (value: number) => {
    const newProgress = value > 100 ? 100 : value;
    setCurProgress(newProgress);
  };

  return (
    <ProgressContext.Provider value={{ startProgress, advanceProgress, setProgress, endProgress }}>
      <LinearProgress
        color="secondary"
        variant="determinate"
        value={curProgress}
        className={classes.progressBar}
        classes={{ bar: classes.progressBarInner }}
        sx={{
          opacity: show ? 1 : 0,
          backgroundColor: theme.palette.background.default,
          height: 10,
        }}
      />
      {children}
    </ProgressContext.Provider>
  );
};

const useProgress = (): ProgressContextActions => {
  const context = useContext(ProgressContext);

  if (!context || Object.keys(context).length === 0) {
    throw new Error("useProgress must be used within an ProgressProvider");
  }

  return context;
};

export { useProgress, ProgressProvider };
