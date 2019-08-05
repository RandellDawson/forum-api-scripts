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

module.exports = { convertMainHeaderToLink };