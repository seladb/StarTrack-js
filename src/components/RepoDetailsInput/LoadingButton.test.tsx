import { render, screen, fireEvent } from "@testing-library/react";
import LoadingButton from "./LoadingButton";

describe(LoadingButton, () => {
  const mockHandleGoClick = jest.fn();
  const mockHandleCancelClick = jest.fn();

  it("render when not loading", () => {
    render(
      <LoadingButton
        loading={false}
        onGoClick={mockHandleGoClick}
        onCancelClick={mockHandleCancelClick}
      />,
    );

    expect(screen.queryByText("Loading...")).not.toBeInTheDocument();

    const goButton = screen.getByRole("button", { name: "Go!" });

    fireEvent.click(goButton);

    expect(mockHandleGoClick).toHaveBeenCalled();
    expect(mockHandleCancelClick).not.toHaveBeenCalled();
  });

  it("render when loading", () => {
    render(
      <LoadingButton
        loading={true}
        onGoClick={mockHandleGoClick}
        onCancelClick={mockHandleCancelClick}
      />,
    );

    expect(screen.queryByText("Loading...")).toBeInTheDocument();

    const cancelButton = screen.getByTestId("StopCircleIcon");

    fireEvent.click(cancelButton);

    expect(mockHandleCancelClick).toHaveBeenCalled();
    expect(mockHandleGoClick).not.toHaveBeenCalled();
  });
});
