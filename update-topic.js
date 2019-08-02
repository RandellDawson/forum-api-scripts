const { makeRequest } = require('./make-request');
const { delay } = require('./utils/delay');

const updateTopic = async (forumTopicId, title, articleContent) => {
  let topicUpdateStatuses = {};

  let body = {
    title: `freeCodeCamp Challenge Guide: ${title}`,
    category_id: 497
  };

  const titleResult = await makeRequest(
    { method: 'put', endPoint: `t/-/${forumTopicId}`, body }
  );
  // update status of current request
  topicUpdateStatuses = !titleResult.errors
    ? { updateTitle: true }
    : { updateTitle: false, errors: titleResult.errors }

  // make sure the update worked
  if (topicUpdateStatuses.updateTitle) {
    const getResult = await makeRequest(
      { method: 'get', endPoint: `t/${forumTopicId}/posts` }
    );
    await delay(1000);
    // make sure get request for post worked
    if (!getResult.errors) {
      // prepare to update first post's content
      const [{ id: firstPostId }] = getResult.post_stream.posts;
      body = { raw: articleContent };
      const postResult = await makeRequest(
        { method: 'put', endPoint: `posts/${firstPostId}`, body });

      topicUpdateStatuses = !(postResult.errors)
        ? { ...topicUpdateStatuses, updateContent: true }
        : { ...topicUpdateStatuses, updateContent: false, errors: postResult.errors };

      await delay(1000);

      // lock post
      body = { locked: true };
      const lockResult = await makeRequest({
        method: 'put',
        endPoint: `posts/${firstPostId}/locked`,
        contentType: 'application/x-www-form-urlencoded',
        body
      });
      
      topicUpdateStatuses = !(lockResult.errors)
        ? { ...topicUpdateStatuses, updateLock: true }
        : { ...topicUpdateStatuses, updateLock: false, errors: lockResult.errors };

    } else {
      // get request for post failed
      topicUpdateStatuses = { ...topicUpdateStatuses, updateContent: false, errors: getResult.errors };
    }
  }

  const { updateTitle, updateContent, errors } = topicUpdateStatuses;

  return updateTitle && updateContent
    ? { status: 'success' }
    : { status: 'failed', errors };
}

module.exports = { updateTopic }
