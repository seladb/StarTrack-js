import { render, screen, act, fireEvent } from "@testing-library/react";
import Forecast from "./Forecast";
import { ForecastInfo } from "./ForecastInfo";

const getLastCallArguments = (Component: jest.Mock) => {
  const length = Component.mock.calls.length;
  return Component.mock.calls[length - 1];
};

const mockForecastRow = jest.fn();

jest.mock("./ForecastRow", () => ({
  __esModule: true,
  default: (props: unknown[]) => {
    mockForecastRow(props);
    return <></>;
  },
}));

interface mockForecastFormProps {
  onClose: (forecastProps: ForecastInfo | null) => void;
  forecastProps: ForecastInfo | null;
}

const mockForecastForm = jest.fn();

jest.mock("./ForecastForm", () => ({
  __esModule: true,
  default: (props: mockForecastFormProps) => {
    mockForecastForm(props);
    return <></>;
  },
}));

describe(Forecast, () => {
  const onForecastChange = jest.fn();

  it.each([
    [
      {
        timeBackward: {
          count: 3,
          unit: "weeks",
        },
        timeForward: {
          count: 5,
          unit: "weeks",
        },
        pointCount: 50,
      },
      {
        daysBackwards: 21,
        daysForward: 35,
        numValues: 50,
      },
    ],
    [
      {
        timeBackward: {
          count: 5,
          unit: "months",
        },
        timeForward: {
          count: 10,
          unit: "months",
        },
        pointCount: 100,
      },
      {
        daysBackwards: 153,
        daysForward: 305,
        numValues: 100,
      },
    ],
    [
      {
        timeBackward: {
          count: 1,
          unit: "years",
        },
        timeForward: {
          count: 2,
          unit: "years",
        },
        pointCount: 1,
      },
      {
        daysBackwards: 365,
        daysForward: 731,
        numValues: 1,
      },
    ],
  ])("calculates forecast props correctly", (forecastInfo, expectedForecastProps) => {
    jest.useFakeTimers().setSystemTime(new Date("2024-01-01"));

    render(<Forecast onForecastChange={onForecastChange} />);

    act(() => getLastCallArguments(mockForecastForm)[0].onClose(forecastInfo));

    expect(onForecastChange).toHaveBeenCalledWith(expectedForecastProps);
    expect(mockForecastRow).toHaveBeenCalledWith(expect.objectContaining({ info: forecastInfo }));
    expect(screen.getByTestId("HighlightOffIcon")).toBeInTheDocument();
  });

  it("does not change forecast props if dialog closes with cancel", () => {
    render(<Forecast onForecastChange={onForecastChange} />);

    act(() => getLastCallArguments(mockForecastForm)[0].onClose(null));

    expect(onForecastChange).toHaveBeenCalledWith(null);
    expect(getLastCallArguments(mockForecastRow)[0]).toMatchObject({ info: null });
    expect(screen.queryByTestId("HighlightOffIcon")).toBeNull();
  });

  it("clears forecast props", () => {
    render(<Forecast onForecastChange={onForecastChange} />);

    const forecastInfo = {
      timeBackward: {
        count: 1,
        unit: "weeks",
      },
      timeForward: {
        count: 1,
        unit: "weeks",
      },
      pointCount: 50,
    };

    const expectedForecastProps = {
      daysBackwards: 7,
      daysForward: 7,
      numValues: 50,
    };

    act(() => getLastCallArguments(mockForecastForm)[0].onClose(forecastInfo));

    expect(onForecastChange).toHaveBeenCalledWith(expectedForecastProps);
    expect(mockForecastRow).toHaveBeenCalledWith(expect.objectContaining({ info: forecastInfo }));

    const clearButton = screen.getByTestId("HighlightOffIcon");
    expect(clearButton).toBeInTheDocument();

    fireEvent.click(clearButton);

    expect(getLastCallArguments(onForecastChange)[0]).toEqual(null);
    expect(getLastCallArguments(mockForecastRow)[0]).toMatchObject({ info: null });
    expect(screen.queryByTestId("HighlightOffIcon")).toBeNull();
  });
});
