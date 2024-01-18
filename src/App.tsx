import { RouterProvider, createBrowserRouter } from "react-router-dom";
import MainPage from "./routes/MainPage";
import Preload from "./routes/Preload";
import ErrorPage from "./routes/ErrorPage";
import { ThemeProvider } from "@mui/material/styles";
import StarTrackTheme from "./shared/Theme";
import { CssBaseline } from "@mui/material";

const router = createBrowserRouter([
  {
    path: "/",
    errorElement: <ErrorPage />,
    element: <MainPage />,
  },
  {
    path: "/preload",
    element: <Preload />,
  },
]);

export default function App() {
  return (
    <ThemeProvider theme={StarTrackTheme}>
      <CssBaseline>
        <RouterProvider router={router} />
      </CssBaseline>
    </ThemeProvider>
  );
}
