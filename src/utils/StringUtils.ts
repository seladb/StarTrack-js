export const slugify = (str: string) => {
  str = str
    .replace(/[^A-Za-z0-9 -]/g, "") // remove invalid chars
    .replace(/\s+/g, "-") // collapse whitespace and replace by -
    .replace(/-+/g, "-") // collapse dashes
    .toLowerCase();
  return str;
};
