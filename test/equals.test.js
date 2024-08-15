import test from 'oletus';

import { deepEqual } from '../lib/equals.js';

test('test is object are deep equal', t => {
  const diff = deepEqual(
    { foo: 'bar', baz: ['qux'] },
    { foo: 'bar', baz: ['qux'] },
  );
  t.deepEqual(diff, undefined);
});

test('test is object are not deep equal', t => {
  const diff = deepEqual(
    { foo: 'bar', baz: ['qux'] },
    { foo: 'bar', baz: ['quux'] },
  );
  t.deepEqual(diff.length > 0, true);
});

test('test is object are equal with ignored props', t => {
  const actual = {
    foo: 'bar',
    ignored: 'qux',
    bob: {
      ignored: 'diff',
      baz: ['qux'],
    },
  };
  const expected = {
    foo: 'bar',
    ignored: 'bob',
    bob: {
      ignored: 'different',
      baz: ['qux'],
    },
  };
  t.deepEqual(deepEqual(actual, expected).length > 0, true);
  t.deepEqual(deepEqual(actual, expected, ['ignored']), undefined);
});
