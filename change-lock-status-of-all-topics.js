const { delay } = require('./utils/delay');
const { changeTopicLockStatus } = require('./utils/change-topic-lock-status');
const { updateLog } = require('./utils/update-log');
const { getChallengeData } = require('./utils/get-challenge-data');

let [ lockStatus ] = process.argv.slice(2);
if (lockStatus !== 'lock' && lockStatus !== 'unlock') {
  console.log('Please specify argument value of "lock" or "unlock" when running this script.');
  process.exit();
}
lockStatus = lockStatus === 'unlock' ? 'false' : 'true';

const logFile = './data/topics-lock-status-log.json';

const topicsToChangeLockStatus = getChallengeData().map(({ forumTopicId }) => forumTopicId);

const scriptResults = [];

console.log('Starting to change status to ' + lockStatus + ' for ' + topicsToChangeLockStatus.length + ' topics...');

(async () => {
  let count = 0;
  for (let forumTopicId of topicsToChangeLockStatus) {
    let toLog = { forumTopicId, changeTo: lockStatus };
    const result = await changeTopicLockStatus(forumTopicId, lockStatus);
    toLog = { ...toLog, status: result.status };
    if (result.status !== 'success') {
      toLog = { ...toLog, errors: result.errors };
    }
    scriptResults.push(toLog);
    updateLog(logFile, scriptResults);
    count++;
    if (count % 100 === 0 && count < topicsToChangeLockStatus.length - 1) {
      console.log('processed ' + count + ' topics');
      console.log('pausing for 20 seconds before changing lock status of more topics...');
      await delay(20000);
      console.log('starting to change lock status of topics again...');
    } else {
      await delay(1000);
    }
  }

  //count the number of successful topic lock status changes
  const successfulChanges = scriptResults.filter(({ status }) => status === 'success');
  console.log('topicsTochange: ' + topicsToChangeLockStatus.length);
  console.log('sucessful changes: ' + successfulChanges.length);
})();
