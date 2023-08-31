import { memoize } from '../lib/memoize.js';
import { globToRegex } from '../lib/regex.js';

/**
 * Bundles a predicate depending on including and excluding methods
 * @param includeMethods {string[]|undefined} - the methods to include
 * @param excludeMethods {string[]|undefined} - the methods to exclude
 * @returns {function(string): boolean} - the method predicate
 */
export const bundleMethodPredicate = (includeMethods, excludeMethods) => {
  if (!includeMethods && !excludeMethods) {
    return () => true;
  }

  const excludeRegex = excludeMethods
    ? `(?:(?!${excludeMethods.join('|')}))`
    : '';
  const includeRegex = includeMethods ? `${includeMethods.join('|')}` : '.*';
  const methodRegex = new RegExp(`^${excludeRegex}${includeRegex}$`);

  // Memoize the method predicate to avoid testing twice the same value
  return memoize(method => methodRegex.test(method));
};

/**
 * Bundles a predicate depending on including and excluding paths using glob
 *
 * @param includeGlob {string[]|undefined} - the paths to include
 * @param excludeGlob {string[]|undefined} - the paths to exclude
 * @return {(function(): boolean)|(function(...[*]): *)|*} - the path predicate function
 */
export const bundleGlobPathPredicate = (includeGlob, excludeGlob) => {
  if (!includeGlob && !excludeGlob) {
    return () => true;
  }

  const excludeRegex = excludeGlob
    ? `(?:(?!${excludeGlob.map(s => `(${globToRegex(s)})`).join('|')}))`
    : '';

  const includeRegex = includeGlob
    ? `${includeGlob.map(s => `(${globToRegex(s)})`).join('|')}`
    : '.*';

  const regExp = new RegExp(`^${excludeRegex}${includeRegex}$`);

  // Memoize the predicate to avoid testing twice the same value
  return memoize(method => regExp.test(method));
};
