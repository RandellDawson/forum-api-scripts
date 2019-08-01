const fs = require('fs');
const { delay } = require('./delay');
const { getGuideArticleContent } = require('./get-guide-article-content');
const { updateTopic } = require('./update-topic');

const consoleLog = (forumTopicId, errors) => {
  console.log('topic_id ' + forumTopicId + ' had issues while trying to update');
  console.log(errors);
  console.log();
};

const matchedForumTopics = [
  {
    "sectionName": "Coding Interview Prep",
    "challengeFilePath": "curriculum/challenges/english/08-coding-interview-prep/algorithms/no-repeats-please.english.md",
    "guideFilePath": "D:/Coding/fcc/guide/english/certifications/coding-interview-prep/algorithms/no-repeats-please/index.md",
    "title": "No Repeats Please",
    "forumName": "no-repeats-please",
    "isStub": false,
    "forumArticleUrl": "https://www.freecodecamp.org/forum/t/freecodecamp-algorithm-challenge-guide-no-repeats-please/16037",
    "forumTopicId": "297904"
  }
];
const scriptResults = [];

(async () => {
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
      toLog = { ...toLog, errors: [ errMsg ] };
      consoleLog(errMsg);
    }
    scriptResults.push(toLog);
    await delay(3000);
  }

  fs.writeFileSync(
    './data/forum-topics-update-log.json',
    JSON.stringify(scriptResults, null, '  '),
    'utf8'
  );

  //count the number of successful updates
  const successfulUpdates = scriptResults.filter(({ status }) => status);
  console.log('matchedForumTopics: ' + matchedForumTopics.length);
  console.log('sucessful updates: ' + successfulUpdates.length);
})();
