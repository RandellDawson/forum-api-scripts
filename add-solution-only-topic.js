const fs = require('fs');
const { addTopic } = require('./utils/add-topic');
const { updateLog } = require('./utils/update-log');

const logFile = './data/add-solution-only-to-single-topic-log.json';

const consoleLog = (title, errors) => {
  console.log('challenge named "' + title + '" had issues while trying to add');
  console.log(errors);
  console.log();
};

let toLog = {};

let content;
try {
  content = fs.readFileSync(process.argv[2], 'utf8');
}
catch {
  console.log('Can not find file ' + process.argv[2]);
  const errMsg = 'Can not find file ' + process.argv[2];
  toLog = { ...toLog, errors: [errMsg] };
  process.exit();
}

const scriptResults = [];
const regex = /[\s\S]*?# (?<title>[\s\S]+?)\r?\n/
const match = content.match(regex);

if (!match) {
  console.log('Can not find main header or content');
  const errMsg = 'no main header found to add forum topic';
  toLog = { ...toLog, errors: [errMsg] };
  process.exit();
}
const { title } = match.groups;
toLog = { ...toLog, title };
(async () => {
  if (title) {
    const result = await addTopic(title, content);
    toLog = { ...toLog, status: result.status };
    if (result.status !== 'success') {
      toLog = { ...toLog, errors: result.errors };
      consoleLog(title, result.errors);
    } else {
      const { forumTopicId } = result;
      toLog = { ...toLog, forumTopicId };
    }
  } else {
    const errMsg = 'no main header found to add forum topic';
    toLog = { ...toLog, errors: [errMsg] };
  }
  scriptResults.push(toLog);
  updateLog(logFile, scriptResults);
  console.log('complete');
})();
