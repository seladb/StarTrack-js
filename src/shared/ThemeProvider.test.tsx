import { Button, useTheme } from "@mui/material";
import { useThemeActions, ThemeProvider } from "./ThemeProvider";
import { render, screen, fireEvent } from "@testing-library/react";

const TestComponent = () => {
  const theme = useTheme();
  const { switchColorMode } = useThemeActions();

  const handleClick = () => {
    switchColorMode();
  };

  return <Button onClick={handleClick}>{theme.palette.mode}</Button>;
};

describe(ThemeProvider, () => {
  it("switch mode", () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>,
    );

    expect(localStorage.getItem("theme")).toBeNull();

    const button = screen.getByRole("button");

    expect(button.textContent).toBe("light");

    fireEvent.click(button);

    expect(button.textContent).toBe("dark");
    expect(localStorage.getItem("theme")).toEqual("dark");
  });

  it("load mode from localStorage", () => {
    localStorage.setItem("theme", "dark");

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>,
    );

    const button = screen.getByRole("button");
    expect(button.textContent).toBe("dark");
  });

  it("throw an error if ThemeProvider doesn't exist", () => {
    // prevent `render` from logging the error to console
    vi.spyOn(console, "error").mockImplementation(vi.fn());
    expect(() => render(<TestComponent />)).toThrow(
      "useThemeActions must be used within an ThemeProvider",
    );
  });
});
