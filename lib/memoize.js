/**
 * Memoize function. Caches the result of the function call and returns the cached result if the same arguments are
 *
 * @param fn {function} The function to memoize
 * @return {(function(...[*]): (*))|*}
 */
export const memoize = fn => {
  const cache = {};
  return (...args) => {
    const key = JSON.stringify(args);
    if (cache[key]) {
      return cache[key];
    }

    const result = fn(...args);
    cache[key] = result;
    return result;
  };
};
