const { makeRequest } = require('./make-request');

const unlistTopic = async forumTopicId => {
  
  const body = {
    status: 'visible',
    enabled: false
  };

  const unlistResult = await makeRequest(
    { method: 'put', endPoint: `t/${forumTopicId}/status`, body }
  );

  const unlistStatus = !unlistResult.errors
    ? { unlistTopic: true }
    : { unlistTopic: false, errors: unlistResult.errors };

  const { unlistTopic, errors } = unlistStatus;
  return unlistTopic ? { status: 'success' } : { status: 'failed', errors };
};

module.exports = { unlistTopic }
