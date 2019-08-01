const fs = require('fs');
const { delay } = require('./delay');
const { getGuideArticleContent } = require('./get-guide-article-content');
const { updateTopic } = require('./update-topic');
const { updateLog } = require('./update-log');

const logFile = './data/forum-topics-update-log.json';

const consoleLog = (forumTopicId, errors) => {
  console.log('topic_id ' + forumTopicId + ' had issues while trying to update');
  console.log(errors);
  console.log();
};

// this code below is just for testing purposes
const data = `{
  "numMatches": 2,
  "numNonMatches": 0,
  "total": 2,
  "matches": [
    {
      "sectionName": "Coding Interview Prep",
      "challengeFilePath": "curriculum/challenges/english/08-coding-interview-prep/algorithms/no-repeats-please.english.md",
      "guideFilePath": "D:/Coding/fcc/guide/english/certifications/coding-interview-prep/algorithms/no-repeats-please/index.md",
      "title": "No Repeats Please",
      "forumName": "no-repeats-please",
      "isStub": false,
      "forumArticleUrl": "https://www.freecodecamp.org/forum/t/freecodecamp-algorithm-challenge-guide-no-repeats-please/16037",
      "forumTopicId": "300583"
    },
    {
      "sectionName": "JavaScript Algorithms and Data Structures",
      "challengeFilePath": "curriculum/challenges/english/02-javascript-algorithms-and-data-structures/debugging/use-typeof-to-check-the-type-of-a-variable.english.md",
      "guideFilePath": "D:/Coding/fcc/guide/english/certifications/javascript-algorithms-and-data-structures/debugging/use-typeof-to-check-the-type-of-a-variable/index.md",
      "title": "Use typeof to Check the Type of a Variable",
      "forumName": "use-typeof-to-check-the-type-of-a-variable",
      "isStub": false,
      "forumArticleUrl": "https://www.freecodecamp.org/forum/t/freecodecamp-challenge-guide-use-typeof-to-check-the-type-of-a-variable/18374",
      "forumTopicId": "300584"
    }
  ]
}`;

// this code above is just for testing purposes

const matchedForumTopics = JSON.parse(data).matches;
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
    updateLog(logFile, scriptResults);
    await delay(3000);
  }

  //count the number of successful updates
  const successfulUpdates = scriptResults.filter(({ status }) => status);
  console.log('matchedForumTopics: ' + matchedForumTopics.length);
  console.log('sucessful updates: ' + successfulUpdates.length);
})();
