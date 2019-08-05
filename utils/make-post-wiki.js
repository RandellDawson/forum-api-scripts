const { makeRequest } = require('./make-request');

const makePostWiki = async postId => {
  let postStatus = {};
  const body = { wiki: true };
  // change post to wiki
  const wikiResult = await makeRequest({
    method: 'put',
    endPoint: `posts/${postId}/wiki`,
    accept: 'text/plain; charset=utf-8',
    body
  });

  postStatus = !wikiResult
    ? { ...postStatus, madeWiki: true }
    : { ...postStatus, madeWiki: false, errors: ['could not change post to wiki'] };

  const { madeWiki, errors } = postStatus;
  return madeWiki ? { status: 'success' } : { status: 'failed', errors };
};

module.exports = { makePostWiki };
