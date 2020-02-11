import React from 'react';
import { render } from '@testing-library/react';
import UrlDisplay from './UrlDisplay'

const baseUrl = window.location.origin + window.location.pathname + "#/preload?";

test("UrlDisplay basic test", () => {
  const repos = [
    { 
      username: "seladb",
      repo: "pcapplusplus"
    },
    {
      username: "seladb",
      repo: "startrack-js"
    },
    {
      username: "react-bootstrap",
      repo: "react-bootstrap"
    }
  ]

  const { getByLabelText } = render(<UrlDisplay repos={repos}/>);
  const inputElement = getByLabelText("URL");
  expect(inputElement.getAttribute("value")).toBe(baseUrl + "r=seladb,pcapplusplus&r=seladb,startrack-js&r=react-bootstrap,react-bootstrap");
});

test("UrlDisplay empty repos", () => {
  const repos = [];

  const { debug, getByLabelText } = render(<UrlDisplay repos={repos}/>);
  const inputElement = getByLabelText("URL");
  expect(inputElement.getAttribute("value")).toBe("");
});