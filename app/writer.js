import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

import { kebabCase } from '../lib/case.js';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

const padding = n => '  '.repeat(n);

export class Writer {
  /**
   * Terminates the writer
   *
   * @returns {void}
   */
  terminate() {
    this.writeStream.write(`\n${padding(1)}]\n}`);
    this.writeStream.end();
    fs.renameSync(this.tmpFilePath, this.finalFilePath);
  }

  /**
   * Returns the filename
   *
   * @readonly
   * @return {string}
   */
  get filename() {
    return `${kebabCase(this.name)}.json`;
  }

  get tmpDirPath() {
    return path.resolve(__dirname, '../tmp');
  }

  get tmpFilePath() {
    return path.resolve(this.tmpDirPath, `${this.timestamp}-${this.name}.json`);
  }

  get finalFilePath() {
    return path.resolve(this.outputDir, this.filename);
  }

  /**
   * Creates a new Writer
   *
   * @constructor
   * @param name {string} The name of the file
   * @param outputDir {string} The output directory where the file will be stored
   * @param baseUrl {string} The base url of the server
   */
  constructor(name, outputDir, baseUrl) {
    this.timestamp = Date.now();
    this.name = name;
    this.first = true;
    this.outputDir = outputDir;
    // Auto clean the tmp directory
    for (const file of fs.readdirSync(this.tmpDirPath)) {
      if (file.endsWith('.json')) {
        fs.unlinkSync(path.resolve(this.tmpDirPath, `${file}`));
      }
    }

    this.writeStream = fs.createWriteStream(this.tmpFilePath);
    this.writeStream.write(`{\n${padding(1)}"timestamp": "${this.timestamp}",`);
    this.writeStream.write(`\n${padding(1)}"baseUrl": "${baseUrl}",`);
    this.writeStream.write(`\n${padding(1)}"requests": [`);
  }

  /**
   * Writes a JSON object to the file
   *
   * @param object {object} The object to write
   * @returns {void}
   */
  writeJson(object) {
    if (!this.first) {
      this.writeStream.write(',');
    }

    if (this.first) {
      this.first = false;
    }

    this.writeStream.write('\n');
    this.writeStream.write(padding(2) + JSON.stringify(object));
  }
}
