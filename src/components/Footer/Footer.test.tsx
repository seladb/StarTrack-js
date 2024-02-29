import { screen } from "@testing-library/react";
import Footer from "./Footer";
import {
  starTrackGitHubMaintainer,
  starTrackGitHubRepo,
  twitter,
  email,
} from "../../utils/Constants";
import { renderWithTheme } from "../../utils/test";

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
});
