const fs = require('fs');
const { delay } = require('./utils/delay');
const { updateTopicCategory } = require('./utils/update-topic-category');
const { updateLog } = require('./utils/update-log');
const { getTopicsToNotUpdate } = require('./utils/get-complete-updated-topics');

const logFile = './data/forum-topics-update-categories-log.json';

const consoleLog = (forumTopicId, errors) => {
  console.log('topic_id ' + forumTopicId + ' had issues while trying to update');
  console.log(errors);
  console.log();
};

const GENERAL_CATEGORY_ID = 1;

// prevents duplicating updates of forum topics previously updated in runs of this script
const topicsToNotUpdate = getTopicsToNotUpdate();

// main list of topics to consider updating
const data = fs.readFileSync('./data/forum-topics-backend-help.json', 'utf8');

// exclude topics which have already been updated successfully
const matchedForumTopics = JSON.parse(data).rows
  .filter(([ forumTopicId ]) => !topicsToNotUpdate[forumTopicId]);

const scriptResults = [];

console.log('Starting to update ' + matchedForumTopics.length + ' topics...');

(async () => {
  let count = 0;
  for (let [ forumTopicId ] of matchedForumTopics) {
    let toLog = { forumTopicId };
        // const result = { status: 'success'};
        const result = await updateTopicCategory(forumTopicId, GENERAL_CATEGORY_ID);
        // toLog = { ...toLog, status: 'test' };
        toLog = { ...toLog, status: result.status };
        if (result.status !== 'success') {
          toLog = { ...toLog, errors: result.errors };
          consoleLog(forumTopicId, result.errors);
        }
        scriptResults.push(toLog);
        updateLog(logFile, scriptResults);
        count++;

        if (count % 50 === 0 && count < matchedForumTopics.length - 1) {
          console.log('attempted ' + count + ' updates');
          console.log('pausing for 3 seconds before updating more topics...');
          await delay(3000);
          console.log('starting to update topics again...');
        } else {
          await delay(1500);
        }

    }


  //count the number of successful updates
  const successfulUpdates = scriptResults.filter(({ status }) => status);
  console.log('matchedForumTopics: ' + count);
  console.log('sucessful updates: ' + successfulUpdates.length);
})();
