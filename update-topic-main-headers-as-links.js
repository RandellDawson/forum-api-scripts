const { delay } = require('./utils/delay');
const { makeRequest } = require('./utils/make-request');
const { getChallengeData } = require('./utils/get-challenge-data');
const { updateLog } = require('./utils/update-log');

const createHeaderLink = (title, challengeUrlPath) => {
  return `# [${title}](https://www.freecodecamp.org/learn/${challengeUrlPath})`;
};

const replaceContent = (challengeFilePath, content) => {
  const regex = /(\s*)(?<mainHeader># .+)(\r?\n)/;
  const match = content.match(regex);
  const { mainHeader } = match.groups;
  const title = mainHeader.replace(/^\s*# /, '').trim();
  const challengeUrlPath = challengeFilePath
    .replace('.english.md', '')
    .replace(/curriculum\/challenges\/english\/\d+-/, '');
  if (!/\[/.test(title)) {
    const newMainHeaderLink = createHeaderLink(title, challengeUrlPath);
    return { mainHeader: newMainHeaderLink, newContent: content.replace(mainHeader, newMainHeaderLink) };
  } else {
    return { mainHeader, newContent: content };
  } 
   
};

const logFile = './data/forum-topics-update-main-header-as-link-log.json';
const scriptResults = [];
const challenges = getChallengeData();

(async () => {
  let count = 0;
  for (let { forumTopicId, title, filePath: challengeFilePath } of challenges) {
    let toLog = { forumTopicId, title, challengeFilePath };
    const getTopicResult = await makeRequest(
      { method: 'get', endPoint: `t/${forumTopicId}/posts` }
    );
    if (!getTopicResult.errors) {
      await delay(1000);
      const [{ id: firstPostId }] = getTopicResult.post_stream.posts;
      const getPostResult = await makeRequest(
        { method: 'get', endPoint: `posts/${firstPostId}`}
      );
      toLog = { ...toLog, status: getPostResult.status };
      if (!getPostResult.errors) {
        const articleContent = getPostResult.raw;
        const { mainHeader, newContent } = replaceContent(challengeFilePath, articleContent);
        if (newContent !== articleContent) {
          await delay(1000);
          body = { raw: newContent };
          const postResult = await makeRequest(
            { method: 'put', endPoint: `posts/${firstPostId}`, body });

          if (!postResult.errors) {
            toLog = { ...toLog, mainHeader, status: 'success' };
          } else {
            toLog = { ...toLog, status: 'failed', errors: postResult.errors };
          }
        } else {
          console.log(`topic# ${forumTopicId}'s main header already contained markdown link`);
          toLog = { ...toLog, status: 'failed', errors: 'topic title already contained markdown link' };
        }
      } else {
        toLog = { ...toLog, errors: getPostResult.errors };
      }

    } else {
      // get request for post failed
      toLog = { ...toLog, status: 'failed', errors: getTopicResult.errors };
    }
    scriptResults.push(toLog);
    updateLog(logFile, scriptResults);
    count++;
    if (count % 20 === 0 && count < challenges.length - 1) {
      console.log('stopped after ' + count + ' attempted updates');
      console.log('attempted ' + count + ' updates');
      console.log('pausing for 20 seconds before updating more topics...');
      await delay(20000);
      console.log('starting to update topics again...');
    } else {
      await delay(1000);
    }
  }
  //count the number of successful updates
  //const successfulUpdates = scriptResults.filter(({ status }) => status === 'sucess');
  const successfulUpdates = count;
  console.log('challenges: ' + challenges.length);
  console.log('sucessful updates: ' + successfulUpdates.length);
})();