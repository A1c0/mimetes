/**
 * Execute a Regex until no result will found
 *
 * @param regex {RegExp} The matching regex
 * @param string {string} The
 * @return {(RegExpExecArray|null)[]}
 */
const regexMultiExec = (regex, string) => {
  const result = [];
  let z;
  while (null != (z = regex.exec(string))) {
    result.push(z);
  }
  return result;
};

/**
 * Parses the arguments
 *
 * @param argv {string[]} - the arguments
 * @returns {*} - the parsed arguments
 */
export const parsedArgs = argv => {
  const textCmd = argv.join(' ');
  const cmd = /^[^\s-]+/.exec(textCmd)?.[0];
  const params = textCmd.match(/(?<= )((?<!.*--.*)([^\s-]+))/g) ?? undefined;
  const options = regexMultiExec(
    /(?<=--?)(?<key>[^\s=-]+(-[^\s=-]+)*)([ =](?<value>[^\s=-]+(-[^\s=-]+)*))?/g,
    textCmd,
  )
    .map(x => x?.groups)
    .reduce((acc, curr) => {
      acc[curr.key] = curr.value ?? true;
      return acc;
    }, {});
  return JSON.parse(
    JSON.stringify({
      cmd,
      params,
      options: Object.keys(options).length === 0 ? undefined : options,
    }), // remove undefined values
  );
};

/**
 * Group the options by their rules
 *
 * @typedef {Object} OptionRule
 * @property {string} short - The short name of the option.
 * @property {boolean} long - The long name of the option.
 *
 * @param optionRules {OptionRule[]} - The rules to group the options
 * @param args {object} - The parsed arguments containing the options
 * @returns {object} - The parsed arguments containing the options grouped
 *
 */
export const groupOptions = (optionRules, args) => {
  const options = args.options ?? {};
  const groupedOptions = Object.entries(options).reduce((acc, [key, value]) => {
    const rule = optionRules.find(x => x.short === key || x.long === key);
    if (rule) {
      acc[rule.long] = value;
    } else if (!rule) {
      acc[key] = value;
    }
    return acc;
  }, {});

  return {
    ...args,
    options: groupedOptions,
  };
};
