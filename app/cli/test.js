import { groupOptions } from '../../lib/argv-parsing.js';
import { showUsage } from './common.js';

/**
 * The mime command.
 * It starts a server that records HTTP requests and responses and
 * generates a JSON report file.
 *
 * @param args {object} The parsed arguments
 */
export const test = args => {
  const scoopedArgs = groupOptions([{ short: 'h', long: 'help' }], args);
  if (scoopedArgs?.options?.help) {
    showUsage('test');
    return;
  }

  // TODO: implement
  throw new Error('Not implemented');
  // Test is file exists
  // test is file is a json file
  // test is file is a valid json file
  // test is file is a valid mimetes test file
};
