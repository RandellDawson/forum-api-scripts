const fetch = require('node-fetch');
let { headers } = require('./headers');

const makeRequest = async ({
  method,
  endPoint,
  contentType = 'application/json',
  body
}) => {
  headers = { ...headers, 'Content-Type': contentType };
  const apiUrl = process.env.BASE_URL + endPoint;

  if (contentType === 'application/x-www-form-urlencoded') {   
    body = Object.entries(body).reduce((formDataArr, [ key, value ]) => {
      return formDataArr.concat(`${key}=${value}`);
    }, []).join('&');
  } else if (contentType = 'application/json') {
    body = JSON.stringify(body);
  }
  const response = await fetch(apiUrl, { headers, method, body });
  return await response.json();
};

module.exports = { makeRequest };