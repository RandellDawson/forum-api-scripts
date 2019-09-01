const fs = require('fs');
var path = require('path');
const walkDir = require('./walk-dir');

const getArticlesToNotAdd = () => {
  const topicsToNotAdd = {};
  walkDir('./data/completedAdditions/', function (filePath) {
    const fileExt = path.extname(filePath);
    if (fileExt === '.json') {
      const completedData = fs.readFileSync(filePath, 'utf8');
      const completed = JSON.parse(completedData)
        .filter(({ status }) => status === 'success')
        .map(({ guideFilePath }) => guideFilePath);
      completed.forEach(guideFilePath => topicsToNotAdd[guideFilePath] = true);
    }
  });
  return topicsToNotAdd;
};

module.exports = { getArticlesToNotAdd };