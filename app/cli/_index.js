import fs from 'node:fs';
import path from 'node:path';
import * as url from 'node:url';

import { logger } from '../../lib/console.js';
import { cliCmd } from './common.js';
import { mime } from './mime.js';
import { test } from './test.js';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

/**
 * The global command
 * @param argv {string[]} The command line arguments
 */
const global = cliCmd('global', (args, argv) => {
  if (!args?.cmd && args?.options?.version) {
    logger.log(
      JSON.parse(
        fs.readFileSync(path.resolve(__dirname, '../../package.json'), 'utf8'),
      ).version,
    );
    return true;
  }

  if (args?.cmd === 'mime') {
    mime(argv);
    return true;
  }

  if (args?.cmd === 'test') {
    test(argv);
    return true;
  }

  return false;
});

export default global;
