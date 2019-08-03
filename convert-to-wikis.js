const fs = require('fs');
const { makeRequest } = require('./make-request');
const { delay } = require('./utils/delay');
const { updateLog } = require('./utils/update-log');
const { makePostWiki } = require('./make-post-wiki');
const logFile = './data/forum-topics-converted-to-wikis-log.json';

// lookup to prevent adding topics for challenges which have existing topics
const data = fs.readFileSync('D:/Coding/search-files/data/forum-topics-and-challenge-files-matrix.json', 'utf8');
const topicIdsToMakeWikis = JSON.parse(data).matches.map(({ forumTopicId }) => forumTopicId);

const scriptResults = [];

(async () => {
  for (let forumTopicId of topicIdsToMakeWikis) {
    let toLog = { forumTopicId }
    const getResult = await makeRequest(
      { method: 'get', endPoint: `t/${forumTopicId}/posts` }
    );
    // make sure get request for post worked
    if (!getResult.errors) {
      const [{ id: postId, wiki }] = getResult.post_stream.posts;
      if (!wiki) {
        delay(1000);
        const result = await makePostWiki(postId);
        toLog = { ...toLog, postId, status: result.status };
        if (!result.errors) {
          toLog = { ...toLog, errors: result.errors };
        }
      } else {
        toLog = { ...toLog, status: 'already wiki' };
      }
    } else {
      // get request for topic failed
      toLog = { ...toLog, errors: getResult.errors };
    }
    scriptResults.push(toLog);
    updateLog(logFile, scriptResults);
    await delay(1500);
  }

  //count the number of successful additions
  const successfulWikis = scriptResults.filter(({ status }) => status === 'success');
  console.log('sucessful conversions: ' + successfulWikis.length);
})();
