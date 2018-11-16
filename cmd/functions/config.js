const fs = require("fs");

const configJson = "config.json";

function getParam(param, defaultValue) {
  return getParams()[param] || defaultValue;
}

function setParam(param, value) {
  let params = getParams();
  params[param] = value;
  writeParams(params);
}

function getParams() {
  if (!fs.existsSync(configJson)) return {};
  return JSON.parse(fs.readFileSync(configJson));
}

function writeParams(params) {
  fs.writeFileSync(configJson, JSON.stringify(params));
}

module.exports = {
  getParam: getParam,
  setParam: setParam
};
