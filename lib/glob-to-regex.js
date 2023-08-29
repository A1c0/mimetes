/**
 * Converts a glob pattern to a regular expression.
 *
 * @param {string} glob - The glob pattern to convert.
 * @returns {RegExp} - The regular expression.
 */
export const globToRegex = glob =>
  new RegExp(
    `^${glob
      .replaceAll(/(?<!\*)\*(?!\*)/g, '[^/]*')
      .replaceAll(/\*{2}/g, '.*')
      .replaceAll('?', '[^/]')}$`,
  );
