import { render } from "@testing-library/react";
import { vi } from "vitest";
import { createMatchMedia } from "../../utils/test";
import RepoDetailsInput from "./RepoDetailsInput";

const mockRepoDetailsInputDesktop = vi.fn();
vi.mock("./RepoDetailsInputDesktop", () => ({
  __esModule: true,
  default: (props: unknown[]) => {
    mockRepoDetailsInputDesktop(props);
    return <></>;
  },
}));

const mockRepoDetailsInputMobile = vi.fn();
vi.mock("./RepoDetailsInputMobile", () => ({
  __esModule: true,
  default: (props: unknown[]) => {
    mockRepoDetailsInputMobile(props);
    return <></>;
  },
}));

describe(RepoDetailsInput, () => {
  it("Display on a large scree", () => {
    window.matchMedia = createMatchMedia(1000);

    render(<RepoDetailsInput loading={false} onGoClick={vi.fn()} onCancelClick={vi.fn()} />);

    expect(mockRepoDetailsInputDesktop).toBeCalled();
    expect(mockRepoDetailsInputMobile).not.toBeCalled();
  });

  it("Display on a large scree", () => {
    window.matchMedia = createMatchMedia(200);

    render(<RepoDetailsInput loading={false} onGoClick={vi.fn()} onCancelClick={vi.fn()} />);

    expect(mockRepoDetailsInputDesktop).not.toBeCalled();
    expect(mockRepoDetailsInputMobile).toBeCalled();
  });
});
