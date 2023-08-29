// https://www.digitalocean.com/community/tools/glob
// TODO: add support for :
//  [x] Examples:Zero or More Chars *
//  [x] One Char ?
//  [x] Recursive (globstar) **
//  [ ] List {a,b,c}
//  [ ] Range [abc]
//  [ ] Not in Range [!abc]
//  [ ] Not Patterns !(a|b)
//  [ ] Zero or One Pattern ?(a|b)
//  [ ] Zero or More Patterns *(a|b)
//  [ ] One or More Patterns +(a|b)
//  [ ] Exactly One Pattern @(a|b)

/**
 * Converts a glob pattern to a regular expression.
 *
 * @param {string} glob - The glob pattern to convert.
 * @returns {string} - The regular expression.
 */
export const globToRegex = glob =>
  glob
    .replaceAll(/(?<!\*)\*(?!\*)/g, '[^/]*')
    .replaceAll(/\*{2}\/?/g, '.*')
    .replaceAll('?', '[^/]');
