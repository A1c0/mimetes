import fs from 'fs';
import path from 'path';
import * as url from 'url';

import { groupOptions, parsedArgs } from '../../lib/argv-parsing.js';
import { showUsage } from './common.js';
import { mime } from './mime.js';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

/**
 * The global command
 * @param argv {string[]} The command line arguments
 */
const global = argv => {
  const args = parsedArgs(argv);
  const scoopedArgs = groupOptions(
    [
      { short: 'h', long: 'help' },
      { short: 'v', long: 'version' },
    ],
    args,
  );

  if (!scoopedArgs?.cmd && scoopedArgs?.options?.version) {
    console.log(
      JSON.parse(
        fs.readFileSync(path.resolve(__dirname, '../../package.json'), 'utf-8'),
      ).version,
    );
    return;
  }

  if (scoopedArgs?.cmd === 'mime') {
    mime(args);
    return;
  }

  // TODO add 'test' commands

  showUsage('global');
};

export default global;
