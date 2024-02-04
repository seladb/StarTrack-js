import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import URLBox from "./URLBox";

describe(URLBox, () => {
  const repoInfos = [
    {
      username: "user1",
      repo: "repo1",
    },
    {
      username: "user2",
      repo: "repo2",
    },
  ];

  const expectedURL = `${window.location.href}preload?r=user1,repo1&r=user2,repo2`;

  it("shows the correct URL", () => {
    render(<URLBox repoInfos={repoInfos} />);

    const urlBox = screen.getByRole("textbox") as HTMLInputElement;

    expect(urlBox.value).toEqual(expectedURL);
  });

  it("shows empty URL if repo infos is an empty list", () => {
    render(<URLBox repoInfos={[]} />);

    const urlBox = screen.getByRole("textbox") as HTMLInputElement;
    expect(urlBox.value).toEqual("");
  });

  describe("copy URL", () => {
    const writeTextMock = jest.fn();

    const originalClipboard = { ...global.navigator.clipboard };

    beforeEach(() => {
      const mockClipboard = {
        writeText: writeTextMock,
      };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (global.navigator as any).clipboard = mockClipboard;
    });

    afterEach(() => {
      jest.resetAllMocks();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (global.navigator as any).clipboard = originalClipboard;
    });

    it("copies the URL", () => {
      render(<URLBox repoInfos={repoInfos} />);

      const copyButton = screen.getByRole("button");

      fireEvent.click(copyButton);

      expect(writeTextMock).toHaveBeenCalledWith(expectedURL);
      waitFor(() => {
        expect("Copied").toBeInTheDocument();
      });
    });
  });
});
