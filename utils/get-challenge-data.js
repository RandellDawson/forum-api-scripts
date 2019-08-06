const fs = require('fs');
const matter = require('gray-matter');
const walkDir = require('./walk-dir');

const getChallengeData = () => {
  const challenges = [];
  walkDir('D:/Coding/fcc/curriculum/challenges/english/', function (filePath) {
    if (!filePath.includes('09-certificates')) {
      const challengeFileContent = fs.readFileSync(filePath, 'utf8');
      filePath = filePath
        .replace('D:\\Coding\\fcc\\', '')
        .replace(/\\/g, '/');
      const { data: { title, forumTopicId } } = matter(challengeFileContent);
      challenges.push({ title, forumTopicId, filePath });
    }
  });
  return challenges;
};

module.exports = { getChallengeData };