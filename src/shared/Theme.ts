import { PaletteMode, createTheme } from "@mui/material";
import { blue, indigo } from "@mui/material/colors";

export const createStarTrackTheme = (mode?: PaletteMode) => {
  return createTheme({
    palette: {
      primary: blue,
      secondary: indigo,
      mode: mode,
    },
    typography: {
      fontFamily: ["Inter", "sans-serif"].join(","),
    },
  });
};
