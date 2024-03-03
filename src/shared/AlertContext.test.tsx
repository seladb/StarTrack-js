import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { AlertContextProvider, useAlertDialog } from "./AlertContext";
import { AlertColor, Button } from "@mui/material";

interface TestComponentProps {
  alertType?: AlertColor;
}

const TestComponent = ({ alertType }: TestComponentProps) => {
  const { showAlert } = useAlertDialog();

  const handleClick = () => {
    showAlert("This is an alert message!", alertType);
  };

  return <Button onClick={handleClick}></Button>;
};

describe("Alert context", () => {
  it("show an alert", async () => {
    render(
      <AlertContextProvider>
        <TestComponent />
      </AlertContextProvider>,
    );

    const button = screen.getByRole("button");
    fireEvent.click(button);

    expect(screen.getByText("This is an alert message!")).toBeInTheDocument();
    expect(screen.getByTestId("ErrorOutlineIcon")).toBeInTheDocument();

    const closeIcon = screen.getByTestId("CloseIcon");
    fireEvent.click(closeIcon);

    await waitFor(() => {
      expect(screen.queryByText("This is an alert message!")).not.toBeInTheDocument();
    });
  });

  it("show an alert of non error type", () => {
    render(
      <AlertContextProvider>
        <TestComponent alertType="warning" />
      </AlertContextProvider>,
    );

    const button = screen.getByRole("button");
    fireEvent.click(button);

    expect(screen.getByText("This is an alert message!")).toBeInTheDocument();
    expect(screen.getByTestId("ReportProblemOutlinedIcon")).toBeInTheDocument();
  });

  it("throw an error if AlertContextProvider doesn't exist", () => {
    // prevent `render` from logging the error to console
    jest.spyOn(console, "error").mockImplementation(jest.fn());
    expect(() => render(<TestComponent />)).toThrow(
      "useAlertDialog must be used within an AlertContextProvider",
    );
  });
});
