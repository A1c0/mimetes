import test from 'ava';

import { groupOptions, parsedArgs } from '../lib/argv-parsing.js';

test('could parse command with one params', t => {
  t.deepEqual(parsedArgs(['foo', 'bar']), { cmd: 'foo', params: ['bar'] });
});

test('could parse command with multiple params', t => {
  t.deepEqual(parsedArgs(['foo', 'bar', 'baz']), {
    cmd: 'foo',
    params: ['bar', 'baz'],
  });

  t.deepEqual(parsedArgs(['foo', 'bar', 'baz', 'qux']), {
    cmd: 'foo',
    params: ['bar', 'baz', 'qux'],
  });
});

test('could parse command with params and options', t => {
  t.deepEqual(parsedArgs(['foo', 'bar', '--baz', 'bab']), {
    cmd: 'foo',
    params: ['bar'],
    options: { baz: 'bab' },
  });

  t.deepEqual(parsedArgs(['foo', 'bar', '--baz', 'bab', '--qux', 'quux']), {
    cmd: 'foo',
    params: ['bar'],
    options: { baz: 'bab', qux: 'quux' },
  });

  t.deepEqual(parsedArgs(['foo', 'bar', '--baz', 'bab', '--qux=quux']), {
    cmd: 'foo',
    params: ['bar'],
    options: { baz: 'bab', qux: 'quux' },
  });
});

test('could parse command with params and boolean options', t => {
  t.deepEqual(parsedArgs(['foo', '--help']), {
    cmd: 'foo',
    options: { help: true },
  });

  t.deepEqual(
    parsedArgs(['foo', 'bar', '--baz', 'bab', '--joe', '--qux', 'qu-ux']),
    {
      cmd: 'foo',
      params: ['bar'],
      options: { baz: 'bab', qux: 'qu-ux', joe: true },
    },
  );

  t.deepEqual(parsedArgs(['foo', 'bar', '--baz', 'bab', '--qux=quux']), {
    cmd: 'foo',
    params: ['bar'],
    options: { baz: 'bab', qux: 'quux' },
  });
});

test('could parse command with params and options with "-" in values', t => {
  t.deepEqual(parsedArgs(['cmd', 'param', 'param-2', '--baz', '1', '--boo']), {
    cmd: 'cmd',
    params: ['param', 'param-2'],
    options: { baz: '1', boo: true },
  });
});

test('could parse command with only options', t => {
  t.deepEqual(parsedArgs(['--help']), { options: { help: true } });
  t.deepEqual(parsedArgs(['--help', '--foo=2']), {
    options: { help: true, foo: '2' },
  });
});

test('could group options', t => {
  const optionRules = [
    { short: 'h', long: 'help' },
    { short: 'v', long: 'version' },
    { short: 'f', long: 'foo' },
  ];

  t.deepEqual(groupOptions(optionRules, { options: { help: true, h: true } }), {
    options: { help: true },
  });

  t.deepEqual(groupOptions(optionRules, { options: { h: true, v: true } }), {
    options: { help: true, version: true },
  });

  t.deepEqual(
    groupOptions(optionRules, {
      options: { help: true, v: true, f: '2', toot: 23 },
    }),
    {
      options: { help: true, version: true, foo: '2', toot: 23 },
    },
  );
});
