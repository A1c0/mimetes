#!/usr/bin/env node
const process = require('node:process');

module.exports.promise = import('../app/cli/_index.js').then(module =>
  module.default(process.argv.slice(2)),
);
