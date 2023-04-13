import { render, screen, fireEvent } from "@testing-library/react";
import RepoChip from "./RepoChip";
import * as GitHubUtils from "../../utils/GitHubUtils";

describe(RepoChip, () => {
  let windowOpenMock: jest.SpyInstance;

  beforeEach(() => {
    windowOpenMock = jest.spyOn(window, "open").mockImplementation(() => null);
  });

  afterEach(() => {
    windowOpenMock.mockRestore();
  });

  it("renders a chip", () => {
    const user = "user";
    const repo = "repo";
    const color = "red";
    const onDelete = jest.fn();
    const repoUrl = "https://repo.org";

    const getRepoUrlMock = jest.spyOn(GitHubUtils, "getRepoUrl").mockReturnValue(repoUrl);
    render(<RepoChip user={user} repo={repo} color={color} onDelete={onDelete} />);

    const chip = screen.getByText(`${user} / ${repo}`);
    expect(chip).toBeInTheDocument();

    fireEvent.click(chip);
    expect(getRepoUrlMock).toHaveBeenCalledWith(user, repo);
    expect(windowOpenMock).toHaveBeenCalledWith(repoUrl, "_blank", "noreferrer");

    const deleteIcon = screen.getByTestId("CancelIcon");
    fireEvent.click(deleteIcon);
    expect(onDelete).toHaveBeenCalledWith(user, repo);
  });
});
