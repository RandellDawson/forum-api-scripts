require("dotenv").config();
const fs = require("fs");
const dedent = require("dedent");

const createSuggestionUri = (challengeTitle, challengeLink) => {
  let textMessage = dedent(`
  **What is your hint or solution suggestion?**\n\n\n\n
  **Challenge:** ${challengeTitle}\n\n
  **Link to the challenge:**\n
  ${challengeLink}\n\n`);
  
  const category = encodeURIComponent("Contributors");
  const userMessage = encodeURIComponent(textMessage);

  const baseURI = `${process.env.BASE_URL}new-topic?category=${category}&title=&body=`;
  const uri = `${baseURI}${userMessage}`;
  return uri;
};

module.exports = { createSuggestionUri };
