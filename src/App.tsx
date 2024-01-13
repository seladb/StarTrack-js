import { RouterProvider, createBrowserRouter } from "react-router-dom";
import MainPage from "./routes/MainPage";
import Preload from "./routes/Preload";
import ErrorPage from "./routes/ErrorPage";
import { ThemeProvider } from "@mui/styles";
import { createTheme } from "@mui/material";

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
  const theme = createTheme();
  return (
    <ThemeProvider theme={theme}>
      <RouterProvider router={router} />;
    </ThemeProvider>
  );
}
