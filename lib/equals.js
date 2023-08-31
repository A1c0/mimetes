import { strict as assert } from 'node:assert';

/**
 * Remove keys recursively from an object.
 *
 * @param object {*} - the object to remove keys from
 * @param keys {string[]} - the keys to remove
 * @return {{}|*} - the object without the keys
 */
const removeKeysRecursively = (object, keys) => {
  if (Array.isArray(object)) {
    return object.map(x => removeKeysRecursively(x, keys));
  }

  if (typeof object === 'object' && object !== null) {
    return Object.entries(object).reduce((acc, [key, value]) => {
      if (!keys.includes(key)) {
        acc[key] = removeKeysRecursively(value, keys);
      }

      return acc;
    }, {});
  }

  return object;
};

/**
 * Deep equal assertion.
 *
 * @param actual {*} - the actual value
 * @param expected {*} - the expected value
 * @param ignoreProps {string[]|undefined} - the properties to ignore
 * @return {string|undefined} - the error message if the assertion fails, anything else otherwise
 */
export const deepEqual = (actual, expected, ignoreProps = undefined) => {
  const actualWithoutIgnoredProps = ignoreProps
    ? removeKeysRecursively(actual, ignoreProps)
    : actual;
  const expectedWithoutIgnoredProps = ignoreProps
    ? removeKeysRecursively(expected, ignoreProps)
    : expected;
  try {
    assert.deepEqual(actualWithoutIgnoredProps, expectedWithoutIgnoredProps);
  } catch (error) {
    return error.message
      .split('\n')
      .slice(1)
      .filter(line => line !== '')
      .map(line =>
        // eslint-disable-next-line no-control-regex
        line.replace(/^(\u001B\[\d+m[+-])(\u001B\[39m)(.*)$/, '$1$3$2'),
      )
      .join('\n');
  }
};
