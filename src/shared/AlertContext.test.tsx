import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { AlertContextProvider, useAlertDialog } from "./AlertContext";
import { Button } from "@mui/material";

const TestComponent = () => {
  const { showAlert } = useAlertDialog();

  const handleClick = () => {
    showAlert("Error occurred!");
  };

  return <Button onClick={handleClick}></Button>;
};

describe("Alert context", () => {
  it("shows an alert", async () => {
    render(
      <AlertContextProvider>
        <TestComponent />
      </AlertContextProvider>,
    );

    const button = screen.getByRole("button");
    fireEvent.click(button);

    expect(screen.getByText("Error occurred!")).toBeInTheDocument();

    const closeIcon = screen.getByTestId("CloseIcon");
    fireEvent.click(closeIcon);

    await waitFor(() => {
      expect(screen.queryByText("Error occurred!")).not.toBeInTheDocument();
    });
  });

  it("throws an error if AlertContextProvider doesn't exist", () => {
    // prevent `render` from logging the error to console
    jest.spyOn(console, "error").mockImplementation(jest.fn());
    expect(() => render(<TestComponent />)).toThrow(
      "useAlertDialog must be used within an AlertContextProvider",
    );
  });
});
