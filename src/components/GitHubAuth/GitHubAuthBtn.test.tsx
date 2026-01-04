import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { createMatchMedia } from "../../utils/test";
import GitHubAuthBtn from "./GitHubAuthBtn";

describe(GitHubAuthBtn, () => {
  const text = "Text";
  const Icon = vi.fn();
  const onBtnClick = vi.fn();

  const setup = (onClick?: React.MouseEventHandler<HTMLButtonElement>) => {
    render(<GitHubAuthBtn text={text} Icon={Icon} onClick={onClick} />);
  };

  it("display on large screen", () => {
    window.matchMedia = createMatchMedia(1000);

    setup();

    expect(screen.getByText(text)).toBeInTheDocument();
    expect(Icon).toHaveBeenCalled();
  });

  it("display on small screen", () => {
    window.matchMedia = createMatchMedia(200);

    setup();

    expect(screen.queryByText(text)).not.toBeInTheDocument();
    expect(Icon).toHaveBeenCalled();
  });

  it("respond to a click event", () => {
    setup(onBtnClick);

    const button = screen.getByRole("button");
    fireEvent.click(button);
    expect(onBtnClick).toHaveBeenCalled();
  });
});
