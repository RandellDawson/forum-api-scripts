const { makeRequest } = require('./make-request');

const updateTopicCategory = async (forumTopicId, newCategoryId) => {
  let topicUpdateStatuses = {};
  let body = {
    category_id: newCategoryId
  };

  const categoryResult = await makeRequest(
    { method: 'put', endPoint: `t/-/${forumTopicId}`, body }
  );
  // update status of current request
  topicUpdateStatuses = !categoryResult.errors
    ? { updateCategory: true }
    : { updateCategory: false, errors: categoryResult.errors };

  const { updateCategory, errors } = topicUpdateStatuses;
  return updateCategory ? { status: 'success' } : { status: 'failed', errors };
}

module.exports = { updateTopicCategory }
