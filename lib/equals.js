/**
 * Sort an object recursively
 * @param obj {{}|*} - the object to sort
 * @return {{}|*} - the sorted object
 */
export const sortObject = obj => {
  if (typeof obj !== 'object') {
    return obj;
  }
  if (obj === null) {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map(sortObject);
  }
  return Object.keys(obj)
    .sort()
    .reduce((acc, curr) => {
      acc[curr] = sortObject(obj[curr]);
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
