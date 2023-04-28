import { fireEvent, render, screen } from "@testing-library/react";
import URLBox from "./URLBox";

const writeTextMock = jest.fn();

describe(URLBox, () => {
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

  const expectedURL = `${window.location.origin}${window.location.pathname}#/preload?r=user1,repo1&r=user2,repo2`;

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

  it("copies the URL", () => {
    render(<URLBox repoInfos={repoInfos} />);

    const copyButton = screen.getByRole("button");

    fireEvent.click(copyButton);

    expect(writeTextMock).toHaveBeenCalledWith(expectedURL);
  });
});
