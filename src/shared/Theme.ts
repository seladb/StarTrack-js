import { createTheme } from "@mui/material";
import { blue, indigo } from "@mui/material/colors";

const StarTrackTheme = createTheme({
  palette: {
    primary: blue,
    secondary: indigo,
  },
  typography: {
    fontFamily: ["Inter", "sans-serif"].join(","),
  },
});

export default StarTrackTheme;
