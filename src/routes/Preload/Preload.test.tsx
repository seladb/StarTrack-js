import { render, act, screen, fireEvent } from "@testing-library/react";
import { parseUrlParams, Preload } from "./Preload";
import { getLastCallArguments } from "../../utils/test";
import { ThemeProvider } from "@mui/styles";
import { createTheme } from "@mui/material";

describe("parseUrlParams", () => {
  it("filters only the relevant QS params", () => {
    expect(parseUrlParams("r=u1,r1&rr=u2,r2&r=u3,r3&x=u4,r4")).toEqual([
      { username: "u1", repo: "r1" },
      { username: "u3", repo: "r3" },
    ]);
  });

  it("ignores wrong QS params", () => {
    expect(parseUrlParams("r=u1,r1&r&r=u2,r3,x3&r=foo&r=foo+bar")).toEqual([
      { username: "u1", repo: "r1" },
    ]);
  });

  it("removes duplicates", () => {
    expect(parseUrlParams("r=u1,r1&r&r=u2,r2&r=u1,r1&r=u3,r3&r=u3,r3&r=u1,r1")).toEqual([
      { username: "u1", repo: "r1" },
      { username: "u2", repo: "r2" },
      { username: "u3", repo: "r3" },
    ]);
  });
});

const mockRepoLoader = jest.fn();

jest.mock("./RepoLoader", () => ({
  __esModule: true,
  default: (props: unknown[]) => {
    mockRepoLoader(props);
    return <></>;
  },
}));

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe(Preload, () => {
  const username1 = "user1";
  const repo1 = "repo1";
  const repoInfo1 = "repoInfo1";
  const username2 = "user2";
  const repo2 = "repo2";
  const repoInfo2 = "repoInfo2";
  const username3 = "user3";
  const repo3 = "repo3";
  const repoInfo3 = "repoInfo3";

  const setup = () => {
    const theme = createTheme();
    render(
      <ThemeProvider theme={theme}>
        <Preload />
      </ThemeProvider>,
    );
  };

  it("loads repos data", async () => {
    Object.defineProperty(window, "location", {
      value: {
        search: `?r=${username1},${repo1}&r=${username2},${repo2}`,
      },
    });

    setup();

    expect(screen.getByText("Loading repo data...")).toBeInTheDocument();
    expect(screen.getByText(`${username1} / ${repo1}`)).toBeInTheDocument();

    await act(() => getLastCallArguments(mockRepoLoader)[0].onLoadDone(repoInfo1));

    expect(screen.getByText("Loading repo data...")).toBeInTheDocument();
    expect(screen.getByText(`${username2} / ${repo2}`)).toBeInTheDocument();

    await act(() => getLastCallArguments(mockRepoLoader)[0].onLoadDone(repoInfo2));

    expect(mockNavigate).toHaveBeenCalledWith("/", { state: [repoInfo1, repoInfo2] });
  });

  it("handles load errors", async () => {
    const errorMessage1 = "some error occurred1";
    const errorMessage2 = "some error occurred2";

    Object.defineProperty(window, "location", {
      value: {
        search: `?r=${username1},${repo1}&r=${username2},${repo2}&r=${username3},${repo3}`,
      },
    });

    setup();

    expect(screen.getByText("Loading repo data...")).toBeInTheDocument();

    expect(screen.getByText(`${username1} / ${repo1}`)).toBeInTheDocument();

    await act(() => getLastCallArguments(mockRepoLoader)[0].onLoadError(errorMessage1));

    expect(screen.getByText(`${username2} / ${repo2}`)).toBeInTheDocument();

    await act(() => getLastCallArguments(mockRepoLoader)[0].onLoadError(errorMessage2));

    await act(() => getLastCallArguments(mockRepoLoader)[0].onLoadDone(repoInfo3));

    expect(screen.getByText("Error loading repo data")).toBeInTheDocument();

    const errorElement1 = screen.getByText(errorMessage1, { exact: false });
    expect(errorElement1?.textContent).toEqual(
      `Error loading ${username1}/${repo1}: ${errorMessage1}`,
    );

    const errorElement2 = screen.getByText(errorMessage2, { exact: false });
    expect(errorElement2?.textContent).toEqual(
      `Error loading ${username2}/${repo2}: ${errorMessage2}`,
    );

    expect(mockNavigate).not.toHaveBeenCalled();

    const continueButton = screen.getByRole("button");
    fireEvent.click(continueButton);

    expect(mockNavigate).toHaveBeenCalledWith("/", { state: [repoInfo3] });
  });
});
