const fetch = require('node-fetch');
let { headers } = require('../headers');

const makeRequest = async ({
  method,
  endPoint,
  contentType = 'application/json',
  accept = 'application/json',
  body
}) => {
  headers = { ...headers, 'Content-Type': contentType, 'Accept': accept };
  const apiUrl = process.env.BASE_URL + endPoint;

  if (contentType === 'application/x-www-form-urlencoded') {   
    body = Object.entries(body).reduce((formDataArr, [ key, value ]) => {
      return formDataArr.concat(`${key}=${value}`);
    }, []).join('&');
  } else if (contentType === 'application/json') {
    body = JSON.stringify(body);
  }
  
  const response = await fetch(apiUrl, { headers, method, body });
  return await accept === 'text/plain; charset=utf-8' ? response.text() : response.json();
};

module.exports = { makeRequest };