require('dotenv').config();
const fs = require('fs');
const { delay } = require('./utils/delay');
const { getGuideArticleContent } = require('./get-guide-article-content');
const { addGuideTopic } = require('./add-guide-topic');
const { updateLog } = require('./utils/update-log');
const { getArticlesToNotAdd } = require('./utils/get-complete-added-guide-topics');

const logFile = './data/forum-guide-topics-added-log.json';

const consoleLog = (title, errors) => {
  console.log('guide article named "' + title + '" had issues while trying to add');
  console.log(errors);
  console.log();
};

const isStub = content => content
  .match(/This is a stub[\s\S]+Help our community expand it/) ? true : false;

// used to prevent duplicating additions of forum topics previously added in runs of this script
const artilcesToNotAdd = getArticlesToNotAdd();

// exclude topics which have already been added successfully
const topicsToAdd = JSON.parse(guideData).articles.filter(({ guideFilePath }) => {
  return !artilcesToNotAdd.hasOwnProperty(guideFilePath);
});

const filesToNotImport = {};
fs.readFileSync(
  process.env.GUIDE_ARTICLES_TO_IGNORE,
  'utf-8'
).split(/\r?\n/).forEach(function(filePath) {
  filesToNotImport[filePath] = 1;
});

const scriptResults = [];

console.log('Starting to add topics...');

(async () => {
  let count = 0;
  walkDir(process.env.GUIDE_DIR, function (guideFilePath) {
    const relativeGuidePath = guideFilePath.replace(/(.+)(guide.+)/,'$2');
    if (!isStub(guideArticleContent) && !filesToNotImport[relativeGuidePath]) {
      const guideArticleContent = getGuideArticleContent(guideFilePath);
      const { data: { title } } = matter(guideArticleContent);
      let toLog = { title, guideFilePath };
      if (guideArticleContent) {
        const result = await addGuideTopic(title, guideArticleContent);
        toLog = { ...toLog, status: result.status };
        if (result.status !== 'success') {
          toLog = { ...toLog, errors: result.errors };
          consoleLog(title, result.errors);
        } else {
          const { forumTopicId } = result;
          toLog = { ...toLog, forumTopicId };
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
  });

  //count the number of successful additons
  const successfulAdditions = scriptResults.filter(({ status }) => status);
  console.log('topicsToAdd: ' + topicsToAdd.length);
  console.log('sucessful additions: ' + successfulAdditions.length);
})();
