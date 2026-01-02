import { render } from "@testing-library/react";
import { vi } from "vitest";
import MainPage from "./MainPage";

const mockMainContainer = jest.fn();

vi.mock("../../components/MainContainer/MainContainer", () => ({
  __esModule: true,
  default: () => {
    mockMainContainer();
    return <></>;
  },
}));

const mockTopNav = jest.fn();

vi.mock("../../components/TopNav/TopNav", () => ({
  __esModule: true,
  default: () => {
    mockTopNav();
    return <></>;
  },
}));

const mockFooter = jest.fn();

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
