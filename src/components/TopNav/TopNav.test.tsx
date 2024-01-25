import { render, screen } from "@testing-library/react";
import TopNav from "./TopNav";
import packageJson from "../../../package.json";
import { starTrackGitHubRepo } from "../../utils/Constants";

describe(TopNav, () => {
  it("display correct version", () => {
    render(<TopNav />);

    expect(screen.getByText(`StarTrack v${packageJson.version}`)).toBeInTheDocument();
  });

  it("show GitHub link", () => {
    render(<TopNav />);

    expect(screen.getByTestId("GitHubIcon").parentElement).toHaveAttribute(
      "href",
      starTrackGitHubRepo,
    );
  });

  it("show project icon", () => {
    render(<TopNav />);

    expect(screen.getByAltText("logo")).toHaveAttribute("src", "star-icon.png");
  });
});
