import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import ForecastForm from "./ForecastForm";
import { ForecastInfo, TimeUnit } from "./ForecastInfo";

describe(ForecastForm, () => {
  const onClose = jest.fn();

  const setup = (initialValues: ForecastInfo | null) => {
    render(<ForecastForm open={true} onClose={onClose} initialValues={initialValues} />);

    const backwardCountTextBox = screen.getByTestId<HTMLInputElement>("backwardCount");
    const backwardUnitTextBox = screen.getByTestId<HTMLInputElement>("backwardUnit");
    const forwardCountTextBox = screen.getByTestId<HTMLInputElement>("forwardCount");
    const forwardUnitTextBox = screen.getByTestId<HTMLInputElement>("forwardUnit");
    const pointCountTextBox = screen.getByTestId<HTMLInputElement>("pointCount");
    const okBtn = screen.getByRole("button", { name: "Ok" });
    const cancelBtn = screen.getByRole("button", { name: "Cancel" });

    return {
      backwardCountTextBox: backwardCountTextBox,
      backwardUnitTextBox: backwardUnitTextBox,
      forwardCountTextBox: forwardCountTextBox,
      forwardUnitTextBox: forwardUnitTextBox,
      pointCountTextBox: pointCountTextBox,
      okBtn: okBtn,
      cancelBtn: cancelBtn,
    };
  };

  it("renders the form without initial values", () => {
    const {
      backwardCountTextBox,
      backwardUnitTextBox,
      forwardCountTextBox,
      forwardUnitTextBox,
      pointCountTextBox,
    } = setup(null);

    expect(backwardCountTextBox.value).toBe("3");
    expect(backwardUnitTextBox.value).toBe("months");
    expect(forwardCountTextBox.value).toBe("3");
    expect(forwardUnitTextBox.value).toBe("months");
    expect(pointCountTextBox.value).toBe("100");
  });

  it("renders the form with initial values", () => {
    const initialValues = {
      timeBackward: {
        count: 10,
        unit: "years" as TimeUnit,
      },
      timeForward: {
        count: 10,
        unit: "weeks" as TimeUnit,
      },
      pointCount: 150,
    };

    const {
      backwardCountTextBox,
      backwardUnitTextBox,
      forwardCountTextBox,
      forwardUnitTextBox,
      pointCountTextBox,
    } = setup(initialValues);

    expect(backwardCountTextBox.value).toBe("10");
    expect(backwardUnitTextBox.value).toBe("years");
    expect(forwardCountTextBox.value).toBe("10");
    expect(forwardUnitTextBox.value).toBe("weeks");
    expect(pointCountTextBox.value).toBe("150");
  });

  it("submit form", async () => {
    const {
      backwardCountTextBox,
      backwardUnitTextBox,
      forwardCountTextBox,
      forwardUnitTextBox,
      pointCountTextBox,
      okBtn,
    } = setup(null);

    fireEvent.change(backwardCountTextBox, { target: { value: "5" } });
    fireEvent.change(backwardUnitTextBox, { target: { value: "weeks" } });
    fireEvent.change(forwardCountTextBox, { target: { value: "10" } });
    fireEvent.change(forwardUnitTextBox, { target: { value: "years" } });
    fireEvent.change(pointCountTextBox, { target: { value: "123" } });

    fireEvent.click(okBtn);

    const expectedValues = {
      timeBackward: {
        count: 5,
        unit: "weeks" as TimeUnit,
      },
      timeForward: {
        count: 10,
        unit: "years" as TimeUnit,
      },
      pointCount: 123,
    };

    await waitFor(() => {
      expect(onClose).toBeCalledWith(expectedValues);
    });
  });

  it("cancel submit form", async () => {
    const {
      backwardCountTextBox,
      backwardUnitTextBox,
      forwardCountTextBox,
      forwardUnitTextBox,
      pointCountTextBox,
      cancelBtn,
    } = setup(null);

    fireEvent.change(backwardCountTextBox, { target: { value: "5" } });
    fireEvent.change(backwardUnitTextBox, { target: { value: "weeks" } });
    fireEvent.change(forwardCountTextBox, { target: { value: "10" } });
    fireEvent.change(forwardUnitTextBox, { target: { value: "years" } });
    fireEvent.change(pointCountTextBox, { target: { value: "123" } });

    await act(async () => {
      fireEvent.click(cancelBtn);
    });

    expect(onClose).toBeCalledWith(null);
  });

  it("checks backward count text box validations", async () => {
    const { backwardCountTextBox, okBtn } = setup(null);

    fireEvent.change(backwardCountTextBox, { target: { value: "0" } });
    fireEvent.click(okBtn);

    await waitFor(() => {
      expect(screen.getByText("Must be greater than 0")).toBeInTheDocument();
    });

    fireEvent.change(backwardCountTextBox, { target: { value: "101" } });
    fireEvent.click(okBtn);

    await waitFor(() => {
      expect(screen.getByText("Must be 100 or less")).toBeInTheDocument();
    });

    fireEvent.change(backwardCountTextBox, { target: { value: "" } });
    fireEvent.click(okBtn);

    await waitFor(() => {
      expect(screen.getByText("Value required")).toBeInTheDocument();
    });

    expect(onClose).not.toBeCalled();
  });

  it("checks forward count text box validations", async () => {
    const { forwardCountTextBox, okBtn } = setup(null);

    fireEvent.change(forwardCountTextBox, { target: { value: "0" } });
    fireEvent.click(okBtn);

    await waitFor(() => {
      expect(screen.getByText("Must be greater than 0")).toBeInTheDocument();
    });

    fireEvent.change(forwardCountTextBox, { target: { value: "101" } });
    fireEvent.click(okBtn);

    await waitFor(() => {
      expect(screen.getByText("Must be 100 or less")).toBeInTheDocument();
    });

    fireEvent.change(forwardCountTextBox, { target: { value: "" } });
    fireEvent.click(okBtn);

    await waitFor(() => {
      expect(screen.getByText("Value required")).toBeInTheDocument();
    });

    expect(onClose).not.toBeCalled();
  });

  it("checks point count text box validations", async () => {
    const { pointCountTextBox, okBtn } = setup(null);

    fireEvent.change(pointCountTextBox, { target: { value: "0" } });
    fireEvent.click(okBtn);

    await waitFor(() => {
      expect(screen.getByText("Must be greater than 0")).toBeInTheDocument();
    });

    fireEvent.change(pointCountTextBox, { target: { value: "501" } });
    fireEvent.click(okBtn);

    await waitFor(() => {
      expect(screen.getByText("Must be 500 or less")).toBeInTheDocument();
    });

    fireEvent.change(pointCountTextBox, { target: { value: "" } });
    fireEvent.click(okBtn);

    await waitFor(() => {
      expect(screen.getByText("Value required")).toBeInTheDocument();
    });

    expect(onClose).not.toBeCalled();
  });
});
