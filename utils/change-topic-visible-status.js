const { makeRequest } = require('./make-request');

const changeTopicVisibleStatus = async (forumTopicId, visibleStatus) => {
  
  const body = {
    status: 'visible',
    enabled: visibleStatus // has to be a string of "true" or "false" to work
  };

  const changeResult = await makeRequest(
    { method: 'put', endPoint: `t/${forumTopicId}/status`, body }
  );

  const changeStatus = !changeResult.errors
    ? { change: true }
    : { change: false, errors: changeResult.errors };

  const { change, errors } = changeStatus;
  return change ? { status: 'success' } : { status: 'failed', errors };
};

module.exports = { changeTopicVisibleStatus };
