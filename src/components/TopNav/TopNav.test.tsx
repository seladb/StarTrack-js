import { fireEvent, screen } from "@testing-library/react";
import TopNav from "./TopNav";
import packageJson from "../../../package.json";
import { starTrackGitHubRepo } from "../../utils/Constants";
import { renderWithTheme } from "../../utils/test";

describe(TopNav, () => {
  it("display correct version", () => {
    renderWithTheme(<TopNav />);

    expect(screen.getByText(`StarTrack v${packageJson.version}`)).toBeInTheDocument();
  });

  it("show GitHub link", () => {
    renderWithTheme(<TopNav />);

    expect(screen.getByTestId("GitHubIcon").parentElement).toHaveAttribute(
      "href",
      starTrackGitHubRepo,
    );
  });

  it("show project icon", () => {
    renderWithTheme(<TopNav />);

    expect(screen.getByAltText("logo")).toHaveAttribute("src", "star-icon.png");
  });

  it("switch theme mode", () => {
    renderWithTheme(<TopNav />);

    expect(screen.queryByTestId("DarkModeOutlinedIcon")).not.toBeInTheDocument();

    let modeButton = screen.getByTestId("LightModeOutlinedIcon");

    fireEvent.click(modeButton);

    expect(screen.queryByTestId("LightModeOutlinedIcon")).not.toBeInTheDocument();

    modeButton = screen.getByTestId("DarkModeOutlinedIcon");
    fireEvent.click(modeButton);

    expect(screen.queryByTestId("LightModeOutlinedIcon")).toBeInTheDocument();
    expect(screen.queryByTestId("DarkModeOutlinedIcon")).not.toBeInTheDocument();
  });
});
