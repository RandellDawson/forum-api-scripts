const fs = require('fs');

const updateLog = (file, scriptResults) => {
  fs.writeFileSync(file,JSON.stringify(scriptResults, null, '  '),'utf8');
};

module.exports = { updateLog };