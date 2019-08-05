const fs = require('fs');
const matter = require('gray-matter');
const walkDir = require('./utils/walk-dir');

// forum topics
const topicsJSON = fs.readFileSync('./data/freeCodeCamp-challenge-guide-topics.json', 'utf8');
const topics = JSON.parse(topicsJSON).rows;
const topicLookup = topics.reduce((lookupObj, [ forumTopicId ]) => {
  lookupObj[forumTopicId] = true;
  return lookupObj;
}, {});

const challenges = [];
const challengeLookup = {};
walkDir('D:/Coding/fcc/curriculum/challenges/english/', function (filePath) {
  if (!filePath.includes('09-certificates')) {
    const challengeFileContent = fs.readFileSync(filePath, 'utf8');
    const { data: { forumTopicId } } = matter(challengeFileContent);
    challenges.push({ forumTopicId });
    challengeLookup[forumTopicId] = filePath;
  }
});

const challengesWithoutMatchingForumTopic = challenges.filter(({ forumTopicId }) => {
  return !topicLookup[forumTopicId];
});

const topicsWithoutMatchingChallenge = topics.filter(([ forumTopicId ]) => {
  return !challengeLookup[forumTopicId];
});

console.log('challengesWithoutMatchingForumTopic');
console.log(challengesWithoutMatchingForumTopic);
console.log();
console.log('topicsWithoutMatchingChallenge');
console.log(topicsWithoutMatchingChallenge);