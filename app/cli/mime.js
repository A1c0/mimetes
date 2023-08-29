import fs from 'node:fs';
import path from 'node:path';

import { groupOptions } from '../../lib/argv-parsing.js';
import { isValidUrl } from '../../lib/url.js';
import { startMimetesServer } from '../record-http-server.js';
import { exitLog, parseInt, showUsage } from './common.js';

/**
 * The mime command.
 * It starts a server that records HTTP requests and responses and
 * generates a JSON report file.
 *
 * @param args {object} The parsed arguments
 */
export const mime = args => {
  const scoopedArgs = groupOptions(
    [
      { short: 'p', long: 'port' },
      { short: 'n', long: 'name' },
      { short: 'd', long: 'report-dir' },
      { short: 'h', long: 'help' },
    ],
    args,
  );
  if (scoopedArgs?.options?.help) {
    showUsage('mime');
    return;
  }

  const host = scoopedArgs?.params?.[0];
  if (!host) {
    exitLog('No host specified. Use --help for more information.');
  }

  if (!isValidUrl(host)) {
    exitLog(`Invalid host '${host}'. Use --help for more information.`);
  }

  const port = parseInt('port', scoopedArgs?.options?.port) ?? 8080;
  const name = scoopedArgs?.options?.name ?? 'mimetes-' + Date.now();
  const outputDir = scoopedArgs?.options?.['report-dir'] ?? '.';
  const outputDirPath = path.resolve(process.cwd(), outputDir);
  try {
    fs.accessSync(outputDirPath, fs.constants.W_OK);
  } catch {
    exitLog(
      `Cannot write to directory '${outputDirPath}'. Use --help for more information.`,
    );
  }

  const excludeMethods = scoopedArgs?.options?.['exclude-methods']?.split(',');
  const excludePaths = scoopedArgs?.options?.['exclude-paths']?.split(',');
  const includeMethods = scoopedArgs?.options?.['include-methods']?.split(',');
  const includePaths = scoopedArgs?.options?.['include-paths']?.split(',');
  const stop = startMimetesServer(
    host,
    port,
    {
      name,
      outputDir: outputDirPath,
    },
    {
      excludeMethods,
      excludePaths,
      includeMethods,
      includePaths,
    },
  );

  process.on('SIGINT', () => {
    stop();
    process.exit(0);
  });
};
