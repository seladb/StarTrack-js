import { PaletteMode, createTheme } from "@mui/material";
import { blue, indigo, grey, red } from "@mui/material/colors";

declare module "@mui/material/styles" {
  interface Theme {
    custom: {
      additionalBackgroundColor: string;
      borderColor: string;
      stopButton: {
        backgroundColor: string;
        hoverBackgroundColor: string;
      };
    };
  }

  interface ThemeOptions {
    custom?: {
      additionalBackgroundColor?: string;
      borderColor?: string;
      stopButton?: {
        backgroundColor?: string;
        hoverBackgroundColor?: string;
      };
    };
  }
}

export const createStarTrackTheme = (mode?: PaletteMode) => {
  return createTheme({
    palette: {
      primary: {
        main: mode === "light" ? blue[500] : blue[900],
      },
      secondary: {
        main: mode === "light" ? indigo[500] : indigo[900],
      },
      mode: mode,
    },
    typography: {
      fontFamily: ["Inter", "sans-serif"].join(","),
    },
    custom: {
      additionalBackgroundColor: mode === "light" ? grey[200] : grey[900],
      borderColor: mode === "light" ? grey[400] : grey[600],
      stopButton: {
        backgroundColor: mode === "light" ? red[500] : red[900],
        hoverBackgroundColor: mode === "light" ? red[700] : red[700],
      },
    },
  });
};
