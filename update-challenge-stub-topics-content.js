const fs = require("fs");
const { delay } = require("./utils/delay");
const { makeRequest } = require("./utils/make-request");
const { updateLog } = require("./utils/update-log");

const stubMessage = `
This is a stub. Help the community by creating a new topic in the [Contributors](https://forum.freecodecamp.org/c/contributors/3) category with your suggested hints and/or solutions. We may use your suggestions to update this stub.
`;

const stubTopics = fs.readFileSync("./data/stub-topics.json", "utf8");
const topicIDsToUpdate = JSON.parse(stubTopics).rows;

const getHeadingLink = (content) => {
  const headLinkRegex = /\s*(?<mainHeaderLink>#\s+.+\))\n+/;
  const match = content.match(headLinkRegex);
  const { mainHeaderLink } = match.groups;
  return mainHeaderLink;
};

const logFile = "./data/forum-stub-topics-updated-log.json";
const scriptResults = [];

(async () => {
  let count = 0;
  for (let [forumTopicId, content] of topicIDsToUpdate) {
    const headingLink = getHeadingLink(content);
    const newContent = `${headingLink}\n${stubMessage}`;
    let toLog = { forumTopicId, headingLink };
    const getTopicResult = await makeRequest({
      method: "get",
      endPoint: `t/${forumTopicId}/posts`,
    });
    if (!getTopicResult.errors) {
      await delay(1000);
      const [{ id: firstPostId }] = getTopicResult.post_stream.posts;
      const getPostResult = await makeRequest({
        method: "get",
        endPoint: `posts/${firstPostId}`,
      });
      toLog = { ...toLog, status: getPostResult.status };
      if (!getPostResult.errors) {
        body = { raw: newContent };
        await delay(5000);
        const postResult = await makeRequest({
          method: "put",
          endPoint: `posts/${firstPostId}`,
          body,
        });

        if (!postResult.errors) {
          toLog = { ...toLog, headingLink, status: "success" };
        } else {
          toLog = { ...toLog, status: "failed", errors: postResult.errors };
        }
      } else {
        toLog = { ...toLog, errors: getPostResult.errors };
      }
    } else {
      // get request for post failed
      toLog = {
        ...toLog,
        status: "failed",
        errors: getTopicResult.errors,
      };
    }
    scriptResults.push(toLog);
    updateLog(logFile, scriptResults);
    count++;
    if (count % 50 === 0 && count < topicIDsToUpdate.length - 1) {
      console.log("stopped after " + count + " total attempted updates");
      console.log("attempted " + count + " updates");
      console.log("pausing for 20 seconds before updating more topics...");
      await delay(20000);
      console.log("starting to update topics again...");
    } else {
      await delay(1000);
    }
  }
  //count the number of successful updates
  const successfulUpdates = scriptResults.filter(({ status }) => status === 'success');
  console.log("topics to update: " + count);
  console.log("sucessful updates: " + successfulUpdates.length);
})();