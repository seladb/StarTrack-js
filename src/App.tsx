import React from "react";
import ReactGA from "react-ga";
import { RouterProvider, createHashRouter } from "react-router-dom";
import MainPage from "./routes/MainPage";
import Preload from "./routes/Preload";
import ErrorPage from "./routes/ErrorPage";
import { ThemeProvider } from "@mui/material/styles";
import StarTrackTheme from "./shared/Theme";
import { CssBaseline } from "@mui/material";

const trackingID = "UA-104097715-1";
ReactGA.initialize(trackingID);

const router = createHashRouter([
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
  React.useEffect(() => {
    if (!window.location.hash) {
      const url = window.location.href;
      const urlWithTrailingSlash = url.endsWith("/") ? url : url + "/";
      window.location.href = `${urlWithTrailingSlash}#/`;
    }

    ReactGA.pageview(window.location.pathname + window.location.search);
  }, []);

  return (
    <ThemeProvider theme={StarTrackTheme}>
      <CssBaseline>
        <RouterProvider router={router} />
      </CssBaseline>
    </ThemeProvider>
  );
}
