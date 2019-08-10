const { makeRequest } = require('./make-request');

const changeTopicLockStatus = async (forumTopicId, lockStatus) => {

  const body = {
    status: 'closed',
    enabled: lockStatus // has to be a string of "true" or "false" to work
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

module.exports = { changeTopicLockStatus };