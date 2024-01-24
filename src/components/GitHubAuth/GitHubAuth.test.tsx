import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import GitHubAuth from "./GitHubAuth";
import * as GitHubUtils from "../../utils/GitHubUtils";
import { getLastCallArguments } from "../../utils/test";

const mockGitHubAuthForm = jest.fn();

jest.mock("./GitHubAuthForm", () => ({
  __esModule: true,
  default: (props: unknown[]) => {
    mockGitHubAuthForm(props);
    return <>GitHubAuthForm</>;
  },
}));

const mockLoggedIn = jest.fn();

jest.mock("./LoggedIn", () => ({
  __esModule: true,
  default: (props: unknown[]) => {
    mockLoggedIn(props);
    return <>LoggedIn</>;
  },
}));

describe(GitHubAuth, () => {
  it("render on logged out", () => {
    render(<GitHubAuth />);

    expect(screen.getByRole("button", { name: "GitHub Authentication" })).toBeInTheDocument();
    expect(mockGitHubAuthForm).toHaveBeenCalled();
    expect(mockLoggedIn).not.toHaveBeenCalled();
  });

  it("render on logged in", () => {
    jest.spyOn(GitHubUtils, "getAccessToken").mockReturnValueOnce("token");

    render(<GitHubAuth />);

    expect(mockLoggedIn).toHaveBeenCalled();
    expect(mockGitHubAuthForm).not.toHaveBeenCalled();
  });

  it("log in", async () => {
    render(<GitHubAuth />);

    expect(mockLoggedIn).not.toHaveBeenCalled();

    const loginButton = screen.getByRole("button", { name: "GitHub Authentication" });

    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(mockGitHubAuthForm).toHaveBeenCalledWith(expect.objectContaining({ open: true }));
    });

    act(() => getLastCallArguments(mockGitHubAuthForm)[0].onClose("token"));

    expect(mockLoggedIn).toHaveBeenCalledWith(expect.objectContaining({ accessToken: "token" }));
  });

  it("log out", () => {
    jest.spyOn(GitHubUtils, "getAccessToken").mockReturnValueOnce("token");

    render(<GitHubAuth />);

    act(() => getLastCallArguments(mockLoggedIn)[0].onLogOut());

    expect(screen.getByRole("button", { name: "GitHub Authentication" })).toBeInTheDocument();
  });
});
