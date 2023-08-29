import { memoize } from './memoize.js';

// https://talyian.github.io/ansicolors/
export const color = {
  red: string_ => `\u001B[31m${string_}\u001B[0m`,
  green: string_ => `\u001B[32m${string_}\u001B[0m`,
  yellow: string_ => `\u001B[33m${string_}\u001B[0m`,
  gray: string_ => `\u001B[90m${string_}\u001B[0m`,
};

export const logger = {
  success: string_ => console.log(color.green(string_)),
  error: string_ => console.log(color.red(string_)),
  warning: string_ => console.log(color.yellow(string_)),
  info: string_ => console.log(color.gray(string_)),
};

export const hexColor = memoize(hex => {
  const r = Number.parseInt(hex.slice(1, 3), 16);
  const g = Number.parseInt(hex.slice(3, 5), 16);
  const b = Number.parseInt(hex.slice(5, 7), 16);
  return text => {
    return `\u001B[38;2;${r};${g};${b}m${text}\u001B[0m`;
  };
});
