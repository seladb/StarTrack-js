import { render, screen, fireEvent } from "@testing-library/react";
import { useProgress, ProgressProvider } from "./ProgressContext";
import { Button } from "@mui/material";

const TestComponent = () => {
  const { startProgress, advanceProgress, setProgress, endProgress } = useProgress();

  const handleStart = () => {
    startProgress();
  };

  const handleAdvance = () => {
    advanceProgress(20);
  };

  const handleSet = (value: number) => {
    setProgress(value);
  };

  const handleEnd = () => {
    endProgress();
  };

  return (
    <div>
      <Button onClick={handleStart} data-testid="Start"></Button>;
      <Button onClick={handleAdvance} data-testid="Advance"></Button>;
      <Button onClick={() => handleSet(10)} data-testid="Set"></Button>;
      <Button onClick={() => handleSet(200)} data-testid="SetHigh"></Button>;
      <Button onClick={handleEnd} data-testid="End"></Button>;
    </div>
  );
};
describe("Progress context", () => {
  it("start, advance, set and end progress", () => {
    render(
      <ProgressProvider>
        <TestComponent />
      </ProgressProvider>,
    );

    const progressBar = screen.getByRole("progressbar");

    expect(progressBar).toHaveStyle({ opacity: 0 });

    const startButton = screen.getByTestId("Start");
    fireEvent.click(startButton);

    expect(progressBar).toHaveStyle({ opacity: 1 });

    expect(progressBar.getAttribute("aria-valuenow")).toStrictEqual("0");

    const advanceButton = screen.getByTestId("Advance");

    for (const expectedValue of [20, 40, 60, 80, 100, 100]) {
      fireEvent.click(advanceButton);
      expect(progressBar.getAttribute("aria-valuenow")).toStrictEqual(expectedValue.toString());
    }

    const setButton = screen.getByTestId("Set");
    fireEvent.click(setButton);
    expect(progressBar.getAttribute("aria-valuenow")).toStrictEqual("10");

    const setHighButton = screen.getByTestId("SetHigh");
    fireEvent.click(setHighButton);
    expect(progressBar.getAttribute("aria-valuenow")).toStrictEqual("100");

    const endButton = screen.getByTestId("End");
    fireEvent.click(endButton);

    expect(progressBar).toHaveStyle({ opacity: 0 });
  });

  it("throws an error if ProgressProvider doesn't exist", () => {
    // prevent `render` from logging the error to console
    jest.spyOn(console, "error").mockImplementation(jest.fn());
    expect(() => render(<TestComponent />)).toThrow(
      "useProgress must be used within an ProgressProvider",
    );
  });
});
