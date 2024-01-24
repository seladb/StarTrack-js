import { render, screen, fireEvent } from "@testing-library/react";
import LoggedIn from "./LoggedIn";
import { createMatchMedia, expectMuiMenuVisibility } from "../../utils/test";
import { ThemeProvider } from "@mui/styles";
import { createTheme } from "@mui/material";
import * as GitHubUtils from "../../utils/GitHubUtils";

describe(LoggedIn, () => {
  const accessToken = "access-token";
  const accessTokenDisplayText = "-token";

  const handleLogOut = jest.fn();

  const setup = () => {
    const theme = createTheme();

    render(
      <ThemeProvider theme={theme}>
        <LoggedIn accessToken={accessToken} onLogOut={handleLogOut} />
      </ThemeProvider>,
    );
  };

  it("render on small screen", () => {
    window.matchMedia = createMatchMedia(200);

    setup();

    const button = screen.getByRole("button");

    expect(button.textContent).toHaveLength(0);

    const menu = screen.getByTestId("menu-navbar");
    expectMuiMenuVisibility(menu, false);

    fireEvent.click(button);

    expectMuiMenuVisibility(menu, true);

    const menuItems = screen.getAllByRole("menuitem");
    expect(menuItems).toHaveLength(3);

    expect(menuItems[0].textContent).toEqual(accessTokenDisplayText);
    expect(menuItems[0]).toHaveAttribute("aria-disabled", "true");
    expect(menuItems[1].textContent).toEqual("Stored in session storage");
    expect(menuItems[1]).toHaveAttribute("aria-disabled", "true");
    expect(menuItems[2].textContent).toEqual("Log out");
    expect(menuItems[2]).not.toHaveAttribute("aria-disabled");

    fireEvent.click(menuItems[2]);

    expect(handleLogOut).toHaveBeenCalled();

    expectMuiMenuVisibility(menu, false);
  });

  it("render on large screen", () => {
    const mockRemoveAccessToken = jest.spyOn(GitHubUtils, "removeAccessToken");

    window.matchMedia = createMatchMedia(800);

    setup();

    const button = screen.getByRole("button", { name: accessTokenDisplayText });

    const menu = screen.getByTestId("menu-navbar");
    expectMuiMenuVisibility(menu, false);

    fireEvent.click(button);

    expectMuiMenuVisibility(menu, true);

    const menuItems = screen.getAllByRole("menuitem");
    expect(menuItems).toHaveLength(2);

    expect(menuItems[0].textContent).toEqual("Stored in session storage");
    expect(menuItems[0]).toHaveAttribute("aria-disabled", "true");
    expect(menuItems[1].textContent).toEqual("Log out");
    expect(menuItems[1]).not.toHaveAttribute("aria-disabled");

    fireEvent.click(menuItems[1]);

    expect(handleLogOut).toHaveBeenCalled();
    expect(mockRemoveAccessToken).toHaveBeenCalled();

    expectMuiMenuVisibility(menu, false);
  });

  it.each([[GitHubUtils.StorageType.LocalStorage], [GitHubUtils.StorageType.SessionStorage]])(
    "display the correct storage type",
    (storageType) => {
      setup();

      jest.spyOn(GitHubUtils, "getStorageType").mockReturnValueOnce(storageType);

      const button = screen.getByRole("button", { name: accessTokenDisplayText });
      fireEvent.click(button);

      const menuItems = screen.getAllByRole("menuitem");

      expect(
        menuItems.some((element) => element.textContent === `Stored in ${storageType}`),
      ).toBeTruthy();
    },
  );
});
