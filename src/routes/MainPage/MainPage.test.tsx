import { render } from "@testing-library/react";
import { vi } from "vitest";
import MainPage from "./MainPage";

const mockMainContainer = vi.fn();

vi.mock("../../components/MainContainer/MainContainer", () => ({
  __esModule: true,
  default: () => {
    mockMainContainer();
    return <></>;
  },
}));

const mockTopNav = vi.fn();

vi.mock("../../components/TopNav/TopNav", () => ({
  __esModule: true,
  default: () => {
    mockTopNav();
    return <></>;
  },
}));

const mockFooter = vi.fn();

vi.mock("../../components/Footer/Footer", () => ({
  __esModule: true,
  default: () => {
    mockFooter();
    return <></>;
  },
}));

describe(MainPage, () => {
  it("render all components", () => {
    render(<MainPage />);

    expect(mockTopNav).toHaveBeenCalled();
    expect(mockMainContainer).toHaveBeenCalled();
    expect(mockFooter).toHaveBeenCalled();
  });
});
