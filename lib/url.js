const urlRegex =
  /((?<protocol>https?):\/\/)(?<host>[\da-zA-Z.-_]+)(:(?<port>\d+))?(?<endpoint>(\/[\da-zA-Z.-_]+)+)?/;

/**
 * Check if the url is valid
 *
 * @param url {string} The url to check
 * @return {boolean} True if the url is valid, false otherwise
 */
export const isValidUrl = url => {
  return urlRegex.test(url);
};

/**
 * Parse the url into its components
 *
 * @param url {string} The url to parse
 * @return {{protocol: string, host: string, port: (number|undefined), endpoint: (string|undefined)}} The parsed url
 */
export const parseUrl = url => {
  if (!isValidUrl(url)) {
    throw new Error(`Invalid url '${url}'`);
  }

  const match = urlRegex.exec(url);
  const groups = match.groups;
  return {
    protocol: groups.protocol,
    host: groups.host,
    port: Number(groups.port),
    endpoint: groups.endpoint,
  };
};
