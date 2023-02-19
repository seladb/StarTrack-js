import { render } from "@testing-library/react";
import { createMatchMedia } from "../../utils/test";
import RepoDetailsInput from "./RepoDetailsInput";

const mockRepoDetailsInputDesktop = jest.fn();
jest.mock("./RepoDetailsInputDesktop", () => ({
  __esModule: true,
  default: (props: unknown[]) => {
    mockRepoDetailsInputDesktop(props);
    return <></>;
  },
}));

const mockRepoDetailsInputMobile = jest.fn();
jest.mock("./RepoDetailsInputMobile", () => ({
  __esModule: true,
  default: (props: unknown[]) => {
    mockRepoDetailsInputMobile(props);
    return <></>;
  },
}));

describe(RepoDetailsInput, () => {
  it("Display on a large scree", () => {
    window.matchMedia = createMatchMedia(1000);

    render(<RepoDetailsInput loading={false} onGoClick={jest.fn()} onCancelClick={jest.fn()} />);

    expect(mockRepoDetailsInputDesktop).toBeCalled();
    expect(mockRepoDetailsInputMobile).not.toBeCalled();
  });

  it("Display on a large scree", () => {
    window.matchMedia = createMatchMedia(200);

    render(<RepoDetailsInput loading={false} onGoClick={jest.fn()} onCancelClick={jest.fn()} />);

    expect(mockRepoDetailsInputDesktop).not.toBeCalled();
    expect(mockRepoDetailsInputMobile).toBeCalled();
  });
});
