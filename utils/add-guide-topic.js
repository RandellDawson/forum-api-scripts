const { makeRequest } = require('./make-request');
const { delay } = require('./delay');

const addGuideTopic = async (title, articleContent) => {
  let topicAddStatuses = {};

  let body = {
    title: `${title}`,
    category: 497,
    raw: articleContent
  };

  const addResult = await makeRequest(
    { method: 'post', endPoint: 'posts', body }
  );
  // update status of current request
  topicAddStatuses = !addResult.errors
    ? { addTopic: true }
    : { addTopic: false, errors: addResult.errors }

  // make sure the add worked
  if (topicAddStatuses.addTopic) {
    const { topic_id: forumTopicId } = addResult;
    topicAddStatuses.forumTopicId = forumTopicId;

    const getResult = await makeRequest(
      { method: 'get', endPoint: `t/${forumTopicId}/posts` }
    );
    await delay(1000);
    // make sure get request for post worked
    if (!getResult.errors) {
      const [{ id: firstPostId }] = getResult.post_stream.posts;
      await delay(1000);
      // lock post
      body = { locked: true };
      const lockResult = await makeRequest({
        method: 'put',
        endPoint: `posts/${firstPostId}/locked`,
        contentType: 'application/x-www-form-urlencoded',
        body
      });

      topicAddStatuses = !(lockResult.errors)
        ? { ...topicAddStatuses, updateLock: true }
        : { ...topicAddStatuses, updateLock: false, errors: lockResult.errors };

    } else {
      // get request for post failed
      console.log('failed getting added topic with forumTopicId of ' + forumTopicId);
      topicAddStatuses = { ...topicAddStatuses, updateLock: false, errors: getResult.errors };
    }
  }

  const { addTopic, updateLock, errors, forumTopicId } = topicAddStatuses;

  return addTopic && updateLock
    ? { status: 'success', forumTopicId }
    : { status: 'failed', errors };
}

module.exports = { addGuideTopic }
