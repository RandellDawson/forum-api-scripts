const fs = require('fs');
const { delay } = require('./utils/delay');
const { getGuideArticleContent } = require('./get-guide-article-content');
const { updateTopic } = require('./update-topic');
const { updateLog } = require('./utils/update-log');
const { getTopicsToNotUpdate } = require('./utils/get-complete-updated-topics');

const logFile = './data/forum-topics-update-log.json';

const consoleLog = (forumTopicId, errors) => {
  console.log('topic_id ' + forumTopicId + ' had issues while trying to update');
  console.log(errors);
  console.log();
};

// prevents duplicating updates of forum topics previously updated in runs of this script
const topicsToNotUpdate = getTopicsToNotUpdate();

// main list of topics to consider updating
const data = fs.readFileSync('D:/Coding/search-files/data/forum-topics-and-challenge-files-matrix.json', 'utf8');

// exclude topics which have already been updated successfully
const matchedForumTopics = JSON.parse(data).matches
  .filter(({ forumTopicId }) => !topicsToNotUpdate[forumTopicId]);

const scriptResults = [];

console.log('Starting to update ' + matchedForumTopics.length + ' topics...');

(async () => {
  let count = 0;
  for (let { challengeFilePath, guideFilePath, title, forumTopicId } of matchedForumTopics) {
    const guideArticleContent = getGuideArticleContent(guideFilePath);
    let toLog = { forumTopicId, title, challengeFilePath, guideFilePath };
    if (guideArticleContent) {
      const result = await updateTopic(forumTopicId, title, guideArticleContent);
      toLog = { ...toLog, status: result.status };
      if (result.status !== 'success') {
        toLog = { ...toLog, errors: result.errors };
        consoleLog(forumTopicId, result.errors);
      }
      // no guide content
    } else {
      const errMsg = 'no guide content found to update forum topic';
      toLog = { ...toLog, errors: [errMsg] };
      consoleLog(errMsg);
    }
    scriptResults.push(toLog);
    updateLog(logFile, scriptResults);
    count++;
    if (count % 25 === 0 && count < matchedForumTopics.length - 1) {
      console.log('attempted ' + count + ' updates');
      console.log('pausing for 30 seconds before updating more topics...');
      await delay(30000);
      console.log('starting to update topics again...');
    } else {
      await delay(3000);
    }
  }

  //count the number of successful updates
  const successfulUpdates = scriptResults.filter(({ status }) => status);
  console.log('matchedForumTopics: ' + matchedForumTopics.length);
  console.log('sucessful updates: ' + successfulUpdates.length);
})();
