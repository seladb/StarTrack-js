import { render } from "@testing-library/react";
import { vi } from "vitest";
import App from "./App";

const mockReactGAPageView = vi.hoisted(() => jest.fn());

vi.mock("react-ga", () => ({
  default: {
    initialize: jest.fn(),
    pageview: mockReactGAPageView,
  },
}));

vi.mock("./routes/MainPage/MainPage", () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe(App, () => {
  it("change location to hash", () => {
    expect(window.location.hash).toEqual("");
    const locationHref = window.location.href;

    render(<App />);

    expect(window.location.href).toEqual(`${locationHref}#/`);
  });

  it("call google analytics", () => {
    render(<App />);

    expect(mockReactGAPageView).toHaveBeenCalledWith(
      window.location.pathname + window.location.search,
    );
  });
});
