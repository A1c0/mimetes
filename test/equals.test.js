import test from 'ava';

import { deepEqual } from '../lib/equals.js';

test('test is object are deep equal', t => {
  const diff = deepEqual(
    { foo: 'bar', baz: ['qux'] },
    { foo: 'bar', baz: ['qux'] },
  );
  t.is(diff, undefined);
});

test('test is object are not deep equal', t => {
  const diff = deepEqual(
    { foo: 'bar', baz: ['qux'] },
    { foo: 'bar', baz: ['quux'] },
  );
  t.true(diff.length > 0);
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
  t.true(deepEqual(actual, expected).length > 0);
  t.is(deepEqual(actual, expected, ['ignored']), undefined);
});
