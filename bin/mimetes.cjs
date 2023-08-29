#!/usr/bin/env node
import process from 'node:process';

module.exports.promise = import('../app/cli/_index.js').then(module =>
  module.default(process.argv.slice(2)),
);
