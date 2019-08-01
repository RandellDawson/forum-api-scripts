const fs = require('fs');
const { delay } = require('./delay');
const { getGuideArticleContent } = require('./get-guide-article-content');
const { addTopic } = require('./add-topic');
const { addForumTopicIdToFrontmatter } = require('./add-forumtopicid-to-frontmatter');
const { updateLog } = require('./update-log');

let stubInfo = 'This is a stub. Help the community by replying below with your hints and solutions.'
stubInfo += ' We can use those to create a guide article for this.';

const logFile = './data/forum-topics-add-log.json';

const consoleLog = (title, errors) => {
  console.log('challenge named "' + title + '" had issues while trying to add');
  console.log(errors);
  console.log();
};

const data = fs.readFileSync('D:/Coding/search-files/data/forum-topics-and-challenge-files-matrix.json', 'utf8');
const doNotAddLookup = JSON.parse(data).matches.reduce((obj, { challengeFilePath }) => {
  obj[challengeFilePath] = true;
  return obj;
}, {});

// this code below is just for testing purposes
const challengeData = `{
  "articles": [
    {
      "isStub": true,
      "title": "Improve Accessibility of Audio Content with the audio Element",
      "challengeFilePath": "curriculum/challenges/english/01-responsive-web-design/applied-accessibility/improve-accessibility-of-audio-content-with-the-audio-element.english.md",
      "guideFilePath": "D:/Coding/fcc/guide/english/certifications/responsive-web-design/applied-accessibility/improve-accessibility-of-audio-content-with-the-audio-element/index.md"
    },
    {
      "isStub": true,
      "title": "Improve Chart Accessibility with the figure Element",
      "challengeFilePath": "curriculum/challenges/english/01-responsive-web-design/applied-accessibility/improve-chart-accessibility-with-the-figure-element.english.md",
      "guideFilePath": "D:/Coding/fcc/guide/english/certifications/responsive-web-design/applied-accessibility/improve-chart-accessibility-with-the-figure-element/index.md"
    },
    {
      "isStub": false,
      "title": "Make Links Navigable with HTML Access Keys",
      "challengeFilePath": "curriculum/challenges/english/01-responsive-web-design/applied-accessibility/make-links-navigable-with-html-access-keys.english.md",
      "guideFilePath": "D:/Coding/fcc/guide/english/certifications/responsive-web-design/applied-accessibility/make-links-navigable-with-html-access-keys/index.md"
    },
    {
      "isStub": false,
      "title": "Use tabindex to Add Keyboard Focus to an Element",
      "challengeFilePath": "curriculum/challenges/english/01-responsive-web-design/applied-accessibility/use-tabindex-to-add-keyboard-focus-to-an-element.english.md",
      "guideFilePath": "D:/Coding/fcc/guide/english/certifications/responsive-web-design/applied-accessibility/use-tabindex-to-add-keyboard-focus-to-an-element/index.md"
    }
  ]
}`;
// this code above is just for testing purposes

const topicsToAdd = JSON.parse(challengeData).articles.filter(({ challengeFilePath }) => {
  return !doNotAddLookup.hasOwnProperty(challengeFilePath);
});

const scriptResults = [];

(async () => {
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
    await delay(3000);
  }
  
  //count the number of successful additons
  const successfulAdditions = scriptResults.filter(({ status }) => status);
  console.log('topicsToAdd: ' + topicsToAdd.length);
  console.log('sucessful additions: ' + successfulAdditions.length);
})();