const fs = require('fs');
var path = require('path');
const walkDir = require('./walk-dir');

const getTopicsToNotUpdate = () => {
  const topicsToNotUpdate = {};
  walkDir('./data/completedUpdates/', function (filePath) {
    const fileExt = path.extname(filePath);
    if (fileExt === '.json') {
      const completedData = fs.readFileSync(filePath, 'utf8');
      const completed = JSON.parse(completedData)
        .filter(({ status }) => status === 'success')
        .map(({ forumTopicId }) => forumTopicId);
      completed.forEach(forumTopicId => topicsToNotUpdate[forumTopicId] = true);
    }
  });
  return topicsToNotUpdate;
};

getTopicsToNotUpdate();
module.exports = { getTopicsToNotUpdate };