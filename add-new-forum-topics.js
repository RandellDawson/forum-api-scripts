const fs = require('fs');
const { delay } = require('./utils/delay');
const { getGuideArticleContent } = require('./get-guide-article-content');
const { addTopic } = require('./add-topic');
const { addForumTopicIdToFrontmatter } = require('./add-forumtopicid-to-frontmatter');
const { updateLog } = require('./utils/update-log');
const { getchallengesToNotAdd } = require('./utils/get-complete-added-topics');

let stubInfo = 'This is a stub. Help the community by replying below with your hints and solutions.'
stubInfo += ' We can use those to create a guide article for this.';

const logFile = './data/forum-topics-add-log.json';

const consoleLog = (title, errors) => {
  console.log('challenge named "' + title + '" had issues while trying to add');
  console.log(errors);
  console.log();
};

// used to prevent duplicating additions of forum topics previously added in runs of this script
const challengesToNotAdd = getchallengesToNotAdd();

// main list of topics to consider adding
const data = fs.readFileSync('D:/Coding/search-files/data/forum-topics-and-challenge-files-matrix.json', 'utf8');

// lookup to prevent adding topics for challenges which have existing topics
const doNotAddLookup = JSON.parse(data).matches.reduce((obj, { challengeFilePath }) => {
  obj[challengeFilePath] = true;
  return obj;
}, {});

// main list of topics to consider adding
const challengeData = fs.readFileSync('D:/Coding/search-files/data/challenge-files.json', 'utf8');

// exclude topics which have already been added successfully or where updated instead
const topicsToAdd = JSON.parse(challengeData).articles.filter(({ challengeFilePath }) => {
  return !doNotAddLookup.hasOwnProperty(challengeFilePath) && !challengesToNotAdd.hasOwnProperty(challengeFilePath);
});

const scriptResults = [];

console.log('Starting to add ' + topicsToAdd.length + ' topics...');

(async () => {
  let count = 0;
  for (let { challengeFilePath, guideFilePath, title, isStub } of topicsToAdd) {
    let guideArticleContent = `# ${title}\n\n${stubInfo}`;
    if (!isStub) {
      guideArticleContent = getGuideArticleContent(guideFilePath);
    }
    let toLog = { title, challengeFilePath, guideFilePath };
    if (guideArticleContent) {
      const result = await addTopic(title, guideArticleContent);
      toLog = { ...toLog, status: result.status };
      if (result.status !== 'success') {
        toLog = { ...toLog, errors: result.errors };
        consoleLog(title, result.errors);
      } else {
        const { forumTopicId } = result;
        toLog = { ...toLog, forumTopicId };
        addForumTopicIdToFrontmatter(challengeFilePath, forumTopicId);
      }
      // no guide content
    } else {
      const errMsg = 'no guide content found to add forum topic';
      toLog = { ...toLog, errors: [errMsg] };
      consoleLog(errMsg);
    }
    scriptResults.push(toLog);
    updateLog(logFile, scriptResults);
    count++;
    if (count % 50 === 0 && count < topicsToAdd.length - 1) {
      console.log('attempted ' + count + ' additions');
      console.log('pausing for 20 seconds before adding new topics...');
      await delay(20000);
      console.log('starting to add topics again...');
    } else {
      await delay(1000);
    }
  }

  //count the number of successful additons
  const successfulAdditions = scriptResults.filter(({ status }) => status);
  console.log('topicsToAdd: ' + topicsToAdd.length);
  console.log('sucessful additions: ' + successfulAdditions.length);
})();
