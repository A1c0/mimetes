import process from 'node:process';

import { memoize } from './memoize.js';

const log = message => {
  process.stdout.write(message + '\n');
};

const error = message => {
  process.stderr.write(message + '\n');
};

// https://talyian.github.io/ansicolors/
export const color = {
  red: string_ => `\u001B[31m${string_}\u001B[0m`,
  yellow: string_ => `\u001B[33m${string_}\u001B[0m`,
  green: string_ => `\u001B[32m${string_}\u001B[0m`,
  blue: string_ => `\u001B[34m${string_}\u001B[0m`,
  gray: string_ => `\u001B[90m${string_}\u001B[0m`,
};

export const logger = {
  success: string_ => log(color.green(string_)),
  error: string_ => error(color.red(string_)),
  warning: string_ => log(color.yellow(string_)),
  trace: string_ => log(color.gray(string_)),
  log,
};

export const hexColor = memoize(hex => {
  const r = Number.parseInt(hex.slice(1, 3), 16);
  const g = Number.parseInt(hex.slice(3, 5), 16);
  const b = Number.parseInt(hex.slice(5, 7), 16);
  return text => {
    return `\u001B[38;2;${r};${g};${b}m${text}\u001B[0m`;
  };
});
