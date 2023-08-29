/**
 * Parse JSON from buffer or return the string
 *
 * @param buffer {Buffer} - the buffer to parse
 * @return {undefined|any|string} - the parsed JSON
 */
export const parseJson = buffer => {
  if (buffer.length === 0) {
    return undefined;
  }

  const string_ = buffer.toString();
  try {
    return JSON.parse(string_);
  } catch {
    return string_;
  }
};
