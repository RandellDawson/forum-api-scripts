const { delay } = require('./utils/delay');
const { unlistTopic } = require('./unlist-topic');
const { updateLog } = require('./utils/update-log');
const { getChallengeData } = require('./utils/getChallengeData');

const logFile = './data/topics-unlisted-log.json';

const topicsToUnlist = getChallengeData().map(({ forumTopicId }) => forumTopicId);

const scriptResults = [];

console.log('Starting to unlist ' + topicsToUnlist.length + ' topics...');

(async () => {
  let count = 0;
  for (let forumTopicId of topicsToUnlist) {
    const result = await unlistTopic(forumTopicId);
    toLog = { ...toLog, status: result.status };
    if (result.status !== 'success') {
      toLog = { ...toLog, errors: result.errors };
    }
    scriptResults.push(toLog);
    updateLog(logFile, scriptResults);
    count++;
    if (count % 100 === 0 && count < topicsToAdd.length - 1) {
      console.log('processed ' + count + ' topics');
      console.log('pausing for 20 seconds before unlisting more topics...');
      await delay(20000);
      console.log('starting to unlist topics again...');
    } else {
      await delay(1000);
    }
  }

  //count the number of successful unlistings
  const successfulUnlistings = scriptResults.filter(({ status }) => status === 'success');
  console.log('topicsToUnlist: ' + topicsToUnlist.length);
  console.log('sucessful unlistings: ' + successfulUnlistings.length);
})();
