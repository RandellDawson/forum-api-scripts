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

const catLookup = {
  'responsive-web-design': 423,
  'javascript-algorithms-and-data-structures': 421,
  'front-end-libraries': 421,
  'data-visualization': 421,
  'apis-and-microservices': 421,
  'quality-assurance': 421,
  'information-security-and-quality-assurance': 421,
  'coding-interview-prep': 421,
  'scientific-computing-with-python': 424,
  'data-analysis-with-python': 424,
  'machine-learning-with-python': 424
}

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
  for (let [ forumTopicId, raw ] of matchedForumTopics) {
    let toLog = { forumTopicId };
    const regex = new RegExp('https:\\/\\/www\\.freecodecamp\\.org\\/learn\\/(?<section>[^/]*)\\/');
    const match = raw.match(regex);
    if (match) {
      const { section } = match.groups;
      const newCategoryId = catLookup[section];
      if (newCategoryId) {
        // const result = { status: 'success'};
        const result = await updateTopicCategory(forumTopicId, newCategoryId);
        // toLog = { ...toLog, status: 'test', section, newCategoryId };
        toLog = { ...toLog, status: result.status, section, newCategoryId };
        if (result.status !== 'success') {
          toLog = { ...toLog, errors: result.errors };
          consoleLog(forumTopicId, result.errors);
        }
        scriptResults.push(toLog);
        updateLog(logFile, scriptResults);
        count++;
        
        if (count % 25 === 0 && count < matchedForumTopics.length - 1) {
          console.log('attempted ' + count + ' updates');
          console.log('pausing for 15 seconds before updating more topics...');
          await delay(15000);
          console.log('starting to update topics again...');
        } else {
          await delay(3000);
        }
        
      }
    }
  }

  //count the number of successful updates
  const successfulUpdates = scriptResults.filter(({ status }) => status);
  console.log('matchedForumTopics: ' + count);
  console.log('sucessful updates: ' + successfulUpdates.length);
})();
