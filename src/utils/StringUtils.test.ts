// cSpell:ignore capitalletters, specialchars

import { slugify } from "./StringUtils";

describe(slugify, () => {
  it.each([
    ["slugified", "slugified"],
    ["with space", "with-space"],
    ["with  multiple   spaces", "with-multiple-spaces"],
    ["CapitalLetterS", "capitalletters"],
    ["!@special*&()chars$#", "specialchars"],
    ["multiple---dashes", "multiple-dashes"],
  ])("slugify correctly", (str: string, expected: string) => {
    expect(slugify(str)).toBe(expected);
  });
});
