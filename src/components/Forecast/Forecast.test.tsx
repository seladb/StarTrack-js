import { render, act } from "@testing-library/react";
import Forecast from "./Forecast";
import { ForecastInfo } from "./ForecastInfo";
import { getLastCallArguments } from "../../utils/test";

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
  const onForecastInfoChange = jest.fn();

  const setup = (forecastInfo?: ForecastInfo) => {
    const info =
      forecastInfo ||
      new ForecastInfo({ unit: "weeks", count: 1 }, { unit: "months", count: 1 }, 10);
    render(<Forecast forecastInfo={info} onForecastInfoChange={onForecastInfoChange} />);
  };

  it("render with forecast info", () => {
    const forecastInfo = new ForecastInfo(
      { count: 1, unit: "weeks" },
      { count: 1, unit: "weeks" },
      50,
    );

    setup(forecastInfo);

    expect(mockForecastRow).toHaveBeenCalledWith(expect.objectContaining({ info: forecastInfo }));
    expect(mockForecastForm).toHaveBeenCalledWith(
      expect.objectContaining({ initialValues: forecastInfo }),
    );
  });

  it("open forecast form", () => {
    setup();

    act(() => getLastCallArguments(mockForecastRow)[0].onClick());

    expect(mockForecastForm).toHaveBeenCalledWith(expect.objectContaining({ open: true }));
  });

  it("does not change call onForecastInfoChange if dialog closes with cancel", async () => {
    setup();

    await act(() => getLastCallArguments(mockForecastForm)[0].onClose(null));

    expect(onForecastInfoChange).not.toHaveBeenCalled();
  });

  it("change forecast info in form", async () => {
    setup();

    const forecastInfo = new ForecastInfo(
      { count: 1, unit: "weeks" },
      { count: 1, unit: "weeks" },
      50,
    );

    await act(() => getLastCallArguments(mockForecastForm)[0].onClose(forecastInfo));

    expect(onForecastInfoChange).toHaveBeenCalledWith(forecastInfo);
  });

  it("clear forecast info in row", async () => {
    const forecastInfo = new ForecastInfo(
      { count: 1, unit: "weeks" },
      { count: 1, unit: "weeks" },
      50,
    );

    setup(forecastInfo);

    await act(() => getLastCallArguments(mockForecastRow)[0].onDelete());

    expect(onForecastInfoChange).toHaveBeenCalledWith(null);
  });
});
