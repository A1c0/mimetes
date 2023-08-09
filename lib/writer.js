import fs from 'fs';
import path from 'path';

const padding = n => '  '.repeat(n);

export class Writer {
  terminate() {
    this.writeStream.write(`\n${padding(1)}]\n}`);
    this.writeStream.end();
  }

  get filename() {
    return `${this.timestamp}-${this.name}.json`;
  }

  /**
   * @param name {string} The name of the file
   * @param outputDir {string} The output directory where the file will be stored
   */
  constructor(name, outputDir) {
    this.timestamp = Date.now();
    this.name = name;
    this.first = true;
    this.writeStream = fs.createWriteStream(
      path.resolve(outputDir, this.filename),
    );
    this.writeStream.write(`{\n${padding(1)}"timestamp": "${this.timestamp}",`);
    this.writeStream.write(`\n${padding(1)}"requests": [`);
  }

  /**
   * Writes a JSON object to the file
   * @param obj {object} - the object to write
   * @returns {void}
   */
  writeJson(obj) {
    if (!this.first) {
      this.writeStream.write(',');
    }
    if (this.first) {
      this.first = false;
    }
    this.writeStream.write('\n');
    this.writeStream.write(padding(2) + JSON.stringify(obj));
  }
}
