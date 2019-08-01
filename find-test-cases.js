const fs = require('fs');
const { getGuideArticleContent } = require('./get-guide-article-content');


const data = fs.readFileSync('D:/Coding/search-files/data/forum-topics-and-challenge-files-matrix.json', 'utf8');
const doNotAddLookup = JSON.parse(data).matches.reduce((obj, { challengeFilePath }) => {
  obj[challengeFilePath] = true;
  return obj;
}, {});

const challengeData = fs.readFileSync('D:/Coding/search-files/data/challenge-files.json', 'utf8');
const topicsToAdd = JSON.parse(challengeData).articles.filter(({ challengeFilePath }) => {
  return !doNotAddLookup.hasOwnProperty(challengeFilePath);
});

console.log(topicsToAdd.length)
const scriptResults = [];

const sampleStubs = topicsToAdd.filter(({ isStub }) => isStub);
const sampleNonStubs = topicsToAdd.filter(({ isStub }) => !isStub);

let i = 0;
while (i++ < 3) {
  const { isStub, challengeFilePath, title, guideFilePath } = sampleStubs[i];
  let toLog = { isStub, title, challengeFilePath, guideFilePath };
  scriptResults.push(toLog);
}
i = 0;
while (i++ < 3) {
  const { isStub, challengeFilePath, guideFilePath, title } = sampleNonStubs[i];
  let toLog = { isStub, title, challengeFilePath, guideFilePath };
  scriptResults.push(toLog);
 }

fs.writeFileSync(
  './data/test-cases-for-forum-topics-to-add-log.json',
  JSON.stringify(scriptResults, null, '  '),
  'utf8'
);

