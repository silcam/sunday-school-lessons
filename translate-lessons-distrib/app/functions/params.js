const fs = require("fs");
const path = require("path");

const paramsFile = path.join("app", "params.json");

function getParams() {
  return JSON.parse(fs.readFileSync(paramsFile));
}

module.exports = {
  getParams: getParams
};
