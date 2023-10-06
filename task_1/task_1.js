const longestCommonSubstring = (...strings) => {
  if (strings.length === 0) {
    return "";
  }
  let counter = 0
  let shortestString = strings[0];
  for (const str of strings) {
    if (str.length < shortestString.length) {
      shortestString = str;
    }
  }
  let maxLength = 0;
  let commonSubstring = "";
  for (let i = 0; i < shortestString.length; i++) {
    for (let j = i + maxLength + 1; j <= shortestString.length; j++) {
      const substring = shortestString.substring(i, j);
      if (strings.every((str) => str.includes(substring))) {
        maxLength = substring.length;
        commonSubstring = substring;
      }
      console.log(j, maxLength, substring, commonSubstring, counter++);
    }
  }
  return commonSubstring;
};
const commandLineArgs = process.argv.slice(2);
if (commandLineArgs.length === 0) {
  console.log("");
} else {
  const commonSubstring = longestCommonSubstring(...commandLineArgs);
  console.log(commonSubstring);
}
