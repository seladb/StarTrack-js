import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { ThemeProvider } from "@mui/styles";
import { createTheme } from "@mui/material";
import { createMatchMedia } from "../../utils/test";
import GitHubAuthBtn from "./GitHubAuthBtn";

describe(GitHubAuthBtn, () => {
  const text = "Text";
  const Icon = jest.fn();
  const onBtnClick = jest.fn();

  const setup = (onClick?: React.MouseEventHandler<HTMLButtonElement>) => {
    const theme = createTheme();

    render(
      <ThemeProvider theme={theme}>
        <GitHubAuthBtn text={text} Icon={Icon} onClick={onClick} />
      </ThemeProvider>,
    );
  };

  it("Display on large screen", () => {
    window.matchMedia = createMatchMedia(1000);

    setup();

    expect(screen.getByText(text)).toBeInTheDocument();
    expect(Icon).toBeCalled();
  });

  it("Display on small screen", () => {
    window.matchMedia = createMatchMedia(200);

    setup();

    expect(screen.queryByText(text)).not.toBeInTheDocument();
    expect(Icon).toBeCalled();
  });

  it("Responds to a click event", () => {
    setup(onBtnClick);

    const button = screen.getByRole("button");
    fireEvent.click(button);
    expect(onBtnClick).toBeCalled();
  });
});
