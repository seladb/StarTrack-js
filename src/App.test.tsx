import { render } from "@testing-library/react";
import App from "./App";

jest.mock("./routes/MainPage/MainPage", () => ({
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
});
