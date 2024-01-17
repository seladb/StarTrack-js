import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ErrorPage from "./ErrorPage";
import { RouterProvider, createMemoryRouter } from "react-router-dom";
import { createTheme } from "@mui/material";
import { ThemeProvider } from "@mui/styles";

describe(ErrorPage, () => {
  it("click the button redirects back to the main page", async () => {
    const theme = createTheme();

    const routes = [
      {
        path: "/",
        errorElement: <ErrorPage />,
      },
    ];

    const router = createMemoryRouter(routes, {
      initialEntries: ["/error"],
      initialIndex: 1,
    });

    render(
      <ThemeProvider theme={theme}>
        <RouterProvider router={router} />
      </ThemeProvider>,
    );

    expect(router.state.location.pathname).toEqual("/error");
    expect(screen.getByText("Nothing to see here")).toBeInTheDocument();

    const button = screen.getByRole("link");
    fireEvent.click(button);

    await waitFor(() => {
      expect(router.state.location.pathname).toEqual("/");
    });
  });
});
