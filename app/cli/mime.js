import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

import { isValidUrl } from '../../lib/url.js';
import { startMimetesServer } from '../record-http-server.js';
import { cliCmd, exitLog, parseInt, parseString } from './common.js';

/**
 * The mime command.
 * It starts a server that records HTTP requests and responses and
 * generates a JSON report file.
 *
 * @param args {object} The parsed arguments
 */
export const mime = cliCmd('mime', args => {
  if (args?.options?.help) {
    return false;
  }

  const host = args?.params?.[0];
  if (!host) {
    exitLog('No host specified. Use --help for more information.');
  }

  if (!isValidUrl(host)) {
    exitLog(`Invalid host '${host}'. Use --help for more information.`);
  }

  const port = parseInt('port', args?.options?.port) ?? 8080;
  const name = parseString('name', args?.options?.name) ?? 'custom';
  const outputDir = args?.options?.['report-dir'] ?? '.';
  const outputDirPath = path.resolve(process.cwd(), outputDir);
  try {
    fs.accessSync(outputDirPath, fs.constants.W_OK);
  } catch {
    exitLog(
      `Cannot write to directory '${outputDirPath}'. Use --help for more information.`,
    );
  }

  const excludeMethods = args?.options?.['exclude-methods']?.split(',');
  const excludePaths = args?.options?.['exclude-paths']?.split(',');
  const includeMethods = args?.options?.['include-methods']?.split(',');
  const includePaths = args?.options?.['include-paths']?.split(',');
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
  return true;
});
