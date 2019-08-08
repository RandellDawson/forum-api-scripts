const { delay } = require('./utils/delay');
const { changeTopicVisibleStatus } = require('./utils/change-topic-visible-status');
const { updateLog } = require('./utils/update-log');
const { getChallengeData } = require('./utils/get-challenge-data');

let [ visibleStatus ] = process.argv.slice(2);
if (visibleStatus !== 'list' && visibleStatus !== 'unlist') {
  console.log('Please specify argument value of "list" or "unlist" when running this script.');
  process.exit();
}
visibleStatus = visibleStatus === 'list' ? "true" : "false";

const logFile = './data/topics-visible-status-log.json';

const topicsToChangeVisibleStatus = getChallengeData().map(({ forumTopicId }) => forumTopicId);

const scriptResults = [];

console.log('Starting to change status to ' + visibleStatus + ' for ' + topicsToChangeVisibleStatus.length + ' topics...');

(async () => {
  let count = 0;
  for (let forumTopicId of topicsToChangeVisibleStatus) {
    let toLog = { forumTopicId, changeTo: visibleStatus };
    const result = await changeTopicVisibleStatus(forumTopicId, visibleStatus);
    toLog = { ...toLog, status: result.status };
    if (result.status !== 'success') {
      toLog = { ...toLog, errors: result.errors };
    }
    scriptResults.push(toLog);
    updateLog(logFile, scriptResults);
    count++;
    if (count % 100 === 0 && count < topicsToChangeVisibleStatus.length - 1) {
      console.log('processed ' + count + ' topics');
      console.log('pausing for 20 seconds before changing visible status of more topics...');
      await delay(20000);
      console.log('starting to change visible status of topics again...');
    } else {
      await delay(1000);
    }
  }

  //count the number of successful topic visible status changes
  const successfulChanges = scriptResults.filter(({ status }) => status === 'success');
  console.log('topicsToChangeVisibleStatus: ' + topicsToChangeVisibleStatus.length);
  console.log('sucessful changes: ' + successfulChanges.length);
})();
