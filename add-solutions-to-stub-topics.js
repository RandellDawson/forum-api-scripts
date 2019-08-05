const fs = require('fs');
const { delay } = require('./utils/delay');
const { getChallengeData } = require('./utils/getChallengeData');
const { updateLog } = require('./utils/update-log');


const logFile = './data/topics-with-stubs-replaced-with-solutions-log.json';

const data = fs.readFileSync('D:/Coding/search-files/data/forum-topics-and-challenge-files-matrix.json', 'utf8');
const topicIdsToMakeWikis = JSON.parse(data).matches.map(({ forumTopicId }) => forumTopicId);

const topicsNeedingSolutions = 

  getChallengeData().map(({ forumTopicId, filePath }) => forumTopicId);
const scriptResults = [];

console.log('Starting to unlist ' + topicsToUnlist.length + ' topics...');