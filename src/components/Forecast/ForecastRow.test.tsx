import { fireEvent, render, screen } from "@testing-library/react";
import ForecastRow from "./ForecastRow";
import { TimeUnit } from "./ForecastInfo";

describe(ForecastRow, () => {
  const onRowClick = jest.fn();

  it("renders the row with null info", () => {
    render(<ForecastRow info={null} onClick={onRowClick} />);
    expect(screen.getByText("Do not show forecast")).toBeInTheDocument();
    const row = screen.getByRole("button");
    fireEvent.click(row);
    expect(onRowClick).toBeCalled();
  });

  it("renders the row with info", () => {
    const info = {
      timeBackward: {
        count: 3,
        unit: "months" as TimeUnit,
      },
      timeForward: {
        count: 10,
        unit: "weeks" as TimeUnit,
      },
      pointCount: 100,
    };

    render(<ForecastRow info={info} onClick={onRowClick} />);
    const element = screen.getByText("forecast based on the last", { exact: false });
    expect(element.textContent).toEqual("10 weeks forecast based on the last 3 months");
    const row = screen.getByRole("button");
    fireEvent.click(row);
    expect(onRowClick).toBeCalled();
  });
});
