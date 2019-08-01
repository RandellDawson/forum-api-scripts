const fs = require('fs');
const { addForumTopicIdToFrontmatter } = require('./add-forumtopicid-to-frontmatter');

const data = fs.readFileSync('D:/Coding/search-files/data/forum-topics-and-challenge-files-matrix.json', 'utf8');
const matchedForumTopics = JSON.parse(data).matches;

for (let { challengeFilePath, forumTopicId } of matchedForumTopics) {
  addForumTopicIdToFrontmatter(challengeFilePath, forumTopicId);
};

console.log(matchedForumTopics.length);
