import { RouterProvider, createBrowserRouter } from "react-router-dom";
import MainPage from "./routes/MainPage";
import Preload from "./routes/Preload";
import ErrorPage from "./routes/ErrorPage";

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
  return <RouterProvider router={router} />;
}
