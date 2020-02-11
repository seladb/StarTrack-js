import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import ClosableBadge from './ClosableBadge';

test("ClosableBadge basic test", () => {
  const handleBadgeClosed = jest.fn((cookie) => {
    expect(cookie).toBe("myCookie");
  });

  const { getByTestId, getByText } = render(
    <ClosableBadge 
      text="seladb*startrack-js"
      badgeCookieData="myCookie"
      onBadgeClose={handleBadgeClosed}
      color="red"
      href="https://github.com/seladb/StarTrack-js"
    />);

  const aElement = getByText("seladb*startrack-js");
  expect(aElement).toBeDefined();
  expect(aElement.parentElement).toHaveStyle("background-color: red");
  expect(aElement.getAttribute("href")).toBe("https://github.com/seladb/StarTrack-js");
  fireEvent.click(getByTestId("close-button"));
  expect(handleBadgeClosed).toHaveBeenCalled();
});

test("ClosableBadge without href", () => {
  const handleBadgeClosed = jest.fn((cookie) => {
    expect(cookie).toBe("myCookie");
  });

  const { getByTestId, getByText } = render(
    <ClosableBadge 
      text="seladb*startrack-js"
      badgeCookieData="myCookie"
      onBadgeClose={handleBadgeClosed}
      color="red"
    />);

  const spanElement = getByText("seladb*startrack-js");
  expect(spanElement).toBeDefined();
  expect(spanElement).toHaveStyle("background-color: red");
  expect(spanElement.getAttribute("href")).toBeNull();
  fireEvent.click(getByTestId("close-button"));
  expect(handleBadgeClosed).toHaveBeenCalled();
});