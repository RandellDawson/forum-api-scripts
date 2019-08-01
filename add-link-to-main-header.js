const convertMainHeaderToLink = ({ guideArticleContent, challengeFilePath }) => {
  const regex = /(\s*)(?<mainHeader># .+)(\r?\n)/;
  const match = guideArticleContent.match(regex);
  const { mainHeader } = match.groups;
  const title = mainHeader.replace(/^\s*# /, '');
  const challengeUrl = challengeFilePath
    .replace('.english.md', '')
    .replace(/curriculum\/challenges\/english\/\d+-/, '');
  return `[${title}](https://www.freecodecamp.org/learn/${challengeUrl})`;

};

const guideArticleContent = `
# Match Non-Whitespace Characters


---
## Hints

### Hint 1

* A global flag will help you get through this challenge.

### Hint 2

* Try using a shorthand character for S non-whitespace.


`;
const challengeFilePath = "curriculum/challenges/english/02-javascript-algorithms-and-data-structures/regular-expressions/match-non-whitespace-characters.english.md";

console.log(convertMainHeaderToLink({ guideArticleContent, challengeFilePath }));

module.exports = { convertMainHeaderToLink };