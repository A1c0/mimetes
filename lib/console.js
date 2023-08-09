import { memoize } from './memoize.js';

// https://talyian.github.io/ansicolors/
export const color = {
  red: str => `\x1b[31m${str}\x1b[0m`,
  green: str => `\x1b[32m${str}\x1b[0m`,
  yellow: str => `\x1b[33m${str}\x1b[0m`,
  gray: str => `\x1b[90m${str}\x1b[0m`,
};

export const logger = {
  success: str => console.log(color.green(str)),
  error: str => console.log(color.red(str)),
  warning: str => console.log(color.yellow(str)),
  info: str => console.log(color.gray(str)),
};

export const HexColor = memoize(hex => {
  const r = parseInt(hex.substring(1, 3), 16);
  const g = parseInt(hex.substring(3, 5), 16);
  const b = parseInt(hex.substring(5, 7), 16);
  return text => {
    return `\x1b[38;2;${r};${g};${b}m${text}\x1b[0m`;
  };
});
