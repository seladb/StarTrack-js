import { render, screen } from "@testing-library/react";
import Footer from "./Footer";
import {
  starTrackGitHubMaintainer,
  starTrackGitHubRepo,
  twitter,
  email,
} from "../../utils/Constants";
import { renderWithTheme } from "../../utils/test";
import { ThemeProvider } from "@emotion/react";
import { PaletteMode } from "@mui/material";
import { createStarTrackTheme } from "../../shared/Theme";

describe(Footer, () => {
  it("render the footer", () => {
    renderWithTheme(<Footer />);
    expect(screen.getByText(`@${starTrackGitHubMaintainer}`)).toBeInTheDocument();
    expect(screen.getByText(`${new Date().getFullYear()}`)).toBeInTheDocument();
    expect(screen.getByTestId("GitHubIcon").parentElement).toHaveAttribute(
      "href",
      starTrackGitHubRepo,
    );
    expect(screen.getByTestId("TwitterIcon").parentElement).toHaveAttribute("href", twitter);
    expect(screen.getByTestId("EmailIcon").parentElement).toHaveAttribute(
      "href",
      `mailto:${email}`,
    );
  });

  it.each(["dark" as PaletteMode, "light" as PaletteMode])(
    "render GitHub buttons with mode",
    (mode) => {
      const theme = createStarTrackTheme(mode);

      render(
        <ThemeProvider theme={theme}>
          <Footer />
        </ThemeProvider>,
      );

      const expectedAttributeValue = `no-preference: ${mode}; light: ${mode}; dark: ${mode};`;

      screen
        .queryAllByRole("link")
        .filter((value) => value.getAttribute("data-color-scheme") !== null)
        .forEach((value) =>
          expect(value.getAttribute("data-color-scheme")).toEqual(expectedAttributeValue),
        );
    },
  );
});
