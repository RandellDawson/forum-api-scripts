const fs = require('fs');
const cheerio = require('cheerio');

const findChallengeSolution = filePath => {
  const content = fs.readFileSync('D:/Coding/fcc/' + filePath, 'utf8');
  if (!/<section id='solution'>\s*```(js|html|css|jsx)\s*\/\/\s*solution required\s*```\s*<\/section>/.test(content) && !filePath.includes('-projects')) {
    const regex = /<section id='solution'>\s*(?<solution>```(js|html|css|jsx)\s*\/\/\s*[\S\s]+?\s*```)\s*<\/section>/
    const solution = content.match(regex);
    return solution ? solution.groups.solution : null;
  }
  return null;
}

module.exports = { findChallengeSolution };