import RepoLoader from "./RepoLoader";
import * as StargazerLoader from "../../utils/StargazerLoader";
import { render, waitFor } from "@testing-library/react";

const mockStartProgress = jest.fn();
const mockSetProgress = jest.fn();
const mockEndProgress = jest.fn();

jest.mock("../../shared/ProgressContext", () => ({
  useProgress: () => ({
    startProgress: mockStartProgress,
    setProgress: mockSetProgress,
    endProgress: mockEndProgress,
  }),
}));

describe(RepoLoader, () => {
  const handleLoadDone = jest.fn();
  const handleLoadError = jest.fn();

  const repoMetadata = { username: "username", repo: "repo" };

  const repoInfo = {
    username: "username",
    repo: "repo",
    color: { hsl: "hsl", hex: "hex" },
    stargazerData: {
      timestamps: ["ts1", "ts2"],
      starCounts: [1, 2],
    },
  };

  it("loads repo data", async () => {
    jest.resetAllMocks();

    const mockLoadStargazers = jest.spyOn(StargazerLoader, "loadStargazers").mockImplementation(
      (
        _username: string,
        _repo: string,
        handleProgress: (val: number) => void,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        _shouldStop: () => boolean,
      ) => {
        handleProgress(50);
        handleProgress(100);
        return Promise.resolve(repoInfo || null);
      },
    );

    render(
      <RepoLoader
        repoDataToLoad={repoMetadata}
        onLoadDone={handleLoadDone}
        onLoadError={handleLoadError}
      />,
    );

    await waitFor(() => {
      expect(mockStartProgress).toHaveBeenCalled();
      expect(mockSetProgress.mock.calls).toEqual([[50], [100]]);
      expect(mockEndProgress).toHaveBeenCalled();

      expect(mockLoadStargazers).toHaveBeenCalledWith(
        repoMetadata.username,
        repoMetadata.repo,
        expect.anything(),
        expect.anything(),
      );

      expect(handleLoadDone).toHaveBeenCalledWith(repoInfo);
      expect(handleLoadError).not.toHaveBeenCalled();
    });
  });

  it.each([[new Error("error")], ["error"]])("load repo data error", async (error) => {
    jest.spyOn(StargazerLoader, "loadStargazers").mockImplementation(() => {
      return Promise.reject(error);
    });

    render(
      <RepoLoader
        repoDataToLoad={repoMetadata}
        onLoadDone={handleLoadDone}
        onLoadError={handleLoadError}
      />,
    );

    await waitFor(() => {
      expect(mockStartProgress).toHaveBeenCalled();
      expect(mockSetProgress).not.toHaveBeenCalled();
      expect(mockEndProgress).toHaveBeenCalled();

      expect(handleLoadDone).not.toHaveBeenCalled();
      expect(handleLoadError).toHaveBeenCalledWith("error");
    });
  });

  it("load multiple repo data", async () => {
    const mockLoadStargazers = jest.spyOn(StargazerLoader, "loadStargazers").mockImplementation(
      (
        _username: string,
        _repo: string,
        handleProgress: (val: number) => void,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        _shouldStop: () => boolean,
      ) => {
        handleProgress(100);
        return Promise.resolve(repoInfo || null);
      },
    );

    const { rerender } = render(
      <RepoLoader
        repoDataToLoad={repoMetadata}
        onLoadDone={handleLoadDone}
        onLoadError={handleLoadError}
      />,
    );

    const repoMetadata2 = { username: "username2", repo: "repo2" };
    rerender(
      <RepoLoader
        repoDataToLoad={repoMetadata2}
        onLoadDone={handleLoadDone}
        onLoadError={handleLoadError}
      />,
    );

    await waitFor(() => {
      expect(mockStartProgress.mock.calls.length).toEqual(2);
      expect(mockSetProgress.mock.calls).toEqual([[100], [100]]);
      expect(mockEndProgress.mock.calls.length).toEqual(2);

      expect(mockLoadStargazers.mock.calls).toEqual([
        [repoMetadata.username, repoMetadata.repo, expect.anything(), expect.anything()],
        [repoMetadata2.username, repoMetadata2.repo, expect.anything(), expect.anything()],
      ]);

      expect(handleLoadDone.mock.calls).toEqual([[repoInfo], [repoInfo]]);
      expect(handleLoadError).not.toHaveBeenCalled();
    });
  });
});
