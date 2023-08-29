/**
 * Sort an object recursively
 * @param object {{}} - the object to sort
 * @return {{}|*} - the sorted object
 */
export const sortObject = object => {
  if (typeof object !== 'object') {
    return object;
  }

  if (object === null) {
    return object;
  }

  if (Array.isArray(object)) {
    return object.map(x => sortObject(x));
  }

  return Object.keys(object)
    .sort()
    .reduce((acc, curr) => {
      acc[curr] = sortObject(object[curr]);
      return acc;
    }, {});
};

// TODO add Longest Common Subsequence (LCS) algorithm

/**
 * Compare two objects deeply
 *
 * @param a {*} - the first object
 * @param b {*} - the second object
 * @return {boolean} - true if the objects are equal, false otherwise
 */
export const deepEqual = (a, b) => {
  const sortA = sortObject(a);
  const sortB = sortObject(b);
  return JSON.stringify(sortA) === JSON.stringify(sortB);
};
