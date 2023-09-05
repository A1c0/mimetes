import fs from 'node:fs';
import path from 'node:path';

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
  }

  /**
   * Returns the filename
   *
   * @readonly
   * @return {string}
   */
  get filename() {
    return `${this.timestamp}-${this.name}.json`;
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
    this.writeStream = fs.createWriteStream(
      path.resolve(outputDir, this.filename),
    );
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
