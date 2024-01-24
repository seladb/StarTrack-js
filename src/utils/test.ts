import mediaQuery from "css-mediaquery";

export const createMatchMedia = (width: number) => (query: string) => ({
  matches: mediaQuery.match(query, { width }),
  media: query,
  onchange: null,
  addListener: jest.fn(),
  removeListener: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  dispatchEvent: jest.fn(),
});

export const getLastCallArguments = (Component: jest.Mock) => {
  const length = Component.mock.calls.length;
  return Component.mock.calls[length - 1];
};

export const expectMuiMenuVisibility = (menu: HTMLElement, expectVisible: boolean) => {
  expect(menu.children[0]).toHaveStyle({ opacity: expectVisible ? 1 : 0 });
};
