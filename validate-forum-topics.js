const fs = require('fs');
const { getChallengeData } = require('./utils/get-challenge-data');

// forum topics
const topicsJSON = fs.readFileSync('./data/freeCodeCamp-challenge-guide-topics.json', 'utf8');
const topics = JSON.parse(topicsJSON).rows;
const topicLookup = topics.reduce((lookupObj, [forumTopicId]) => {
  lookupObj[forumTopicId] = true;
  return lookupObj;
}, {});

// challenge
const challenges = getChallengeData();
const challengeLookup = challenges.reduce((lookupObj, { forumTopicId, filePath }) => {
  lookupObj[forumTopicId] = filePath;
  return lookupObj;
}, {});

const challengesWithoutMatchingForumTopic = challenges.filter(({ forumTopicId }) => {
  return !topicLookup[forumTopicId];
});

const topicsWithoutMatchingChallenge = topics.filter(([forumTopicId]) => {
  return !challengeLookup[forumTopicId];
});

if (challengesWithoutMatchingForumTopic.length || topicsWithoutMatchingChallenge.length) {
  if (challengesWithoutMatchingForumTopic.length) {
    console.log('Challenges without a matching forum topic:');
    console.log(challengesWithoutMatchingForumTopic);
  }
  if (topicsWithoutMatchingChallenge.length) {
    console.log('Challenge Guide Forum topics without a matching challenge:');
    console.log(topicsWithoutMatchingChallenge);
  }
} else {
  console.log('All challenges have a corresponding forum topic and there are no forum topics which have a topic_id that is not part of a challenge\'s frontmatter.');
}