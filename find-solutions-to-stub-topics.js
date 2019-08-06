const fs = require('fs');
const { getChallengeData } = require('./utils/get-challenge-data');
const { findChallengeSolution } = require('./utils/find-challenge-solution');

const data = fs.readFileSync('./data/stub-topics.json', 'utf8');
const topicsNeedingSolutions = JSON.parse(data).rows.map(([ forumTopicId ]) => forumTopicId);

const challengeLookup = getChallengeData()
  .reduce((lookupObj, { forumTopicId, filePath }) => (
    { ...lookupObj, [forumTopicId]: filePath }
  ), {});


let count = 0;
topicsNeedingSolutions.forEach(forumTopicId => {
  const challengeFilePath = challengeLookup[forumTopicId];
  const solution = findChallengeSolution(challengeFilePath);
  if (solution) {
    console.log(challengeFilePath);
    console.log(solution);
    console.log();
    count++;
  } 
});  
console.log('Total solutions found: ' + count);
