import React from "react";
import { RenderOptions, render } from "@testing-library/react";
import mediaQuery from "css-mediaquery";
import { ThemeProvider } from "../shared/ThemeProvider";

export const createMatchMedia = (width: number) => (query: string) => ({
  matches: mediaQuery.match(query, { width }),
  media: query,
  onchange: null,
  addListener: vi.fn(),
  removeListener: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
});

export const getLastCallArguments = (Component: vi.Mock) => {
  const length = Component.mock.calls.length;
  return Component.mock.calls[length - 1];
};

export const expectMuiMenuVisibility = (menu: HTMLElement, expectVisible: boolean) => {
  expect(menu.children[0]).toHaveStyle({ opacity: expectVisible ? 1 : 0 });
};

const themeWrapper = (props: { children: React.ReactElement }) => {
  return <ThemeProvider {...props} />;
};

export const renderWithTheme = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, "queries">,
) => {
  return render(ui, { wrapper: themeWrapper, ...options });
};
