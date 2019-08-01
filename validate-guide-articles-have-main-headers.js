const fs = require('fs');
const { getGuideArticleContent } = require('./get-guide-article-content');

const data = fs.readFileSync('D:/Coding/search-files/data/challenge-files.json', 'utf8');
const matchedForumTopics = JSON.parse(data).articles;

let count = 0;
for (let { guideFilePath, isStub } of matchedForumTopics) {
  const guideArticleContent = getGuideArticleContent(guideFilePath);
  if (guideArticleContent) {
    const regex = /\s*(?<mainHeader># .+)\r?\n/;
    const match = guideArticleContent.match(regex);
    if (!match) {
      count++;
      console.log(guideFilePath);
      console.log('could not find main header');
    }
  } else {
    console.log(guideFilePath);
    console.log('could not retrieve guide content');
  }
}
console.log('script complete');
console.log(count);
