import RepoChip from "./RepoChip";
import * as GitHubUtils from "../../utils/GitHubUtils";
import { render, screen, fireEvent } from "@testing-library/react";

describe(RepoChip, () => {
  let windowOpenMock: jest.SpyInstance;

  beforeEach(() => {
    windowOpenMock = jest.spyOn(window, "open").mockImplementation(() => null);
  });

  afterEach(() => {
    windowOpenMock.mockRestore();
  });

  it("render the chip correctly", () => {
    const user = "user";
    const repo = "repo";
    const color = "red";

    const repoUrl = "https://repo.org";

    const getRepoUrlMock = jest.spyOn(GitHubUtils, "getRepoUrl").mockReturnValue(repoUrl);

    render(<RepoChip user={user} repo={repo} color={color} />);

    const chip = screen.getByText(`${user} / ${repo}`);
    expect(chip).toBeInTheDocument();

    expect(chip.parentElement?.style.backgroundColor).toBe(color);
    expect(chip.parentElement?.style.color).toBe("rgb(255, 255, 255)");

    fireEvent.click(chip);
    expect(getRepoUrlMock).toHaveBeenCalledWith(user, repo);
    expect(windowOpenMock).toHaveBeenCalledWith(repoUrl, "_blank", "noreferrer");
  });
});
