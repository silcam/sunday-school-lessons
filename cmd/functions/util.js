const fs = require("fs");

function zeroPad(numStr, numberOfDigits) {
  if (numStr.length >= numberOfDigits) return numStr;
  const zeros = new Array(numberOfDigits - numStr.length).fill("0");
  return zeros + numStr;
}

function recursiveUnlink(path) {
  if (fs.statSync(path).isFile()) {
    fs.unlinkSync(path);
  } else {
    fs.readdirSync(path).forEach(filename => {
      recursiveUnlink(`${path}/${filename}`);
    });
    fs.rmdirSync(path);
  }
}

function readDirPaths(dir) {
  return fs.readdirSync(dir).map(name => `${dir}/${name}`);
}

function nameFromPath(path) {
  return path.slice(path.lastIndexOf("/") + 1);
}

module.exports = {
  zeroPad: zeroPad,
  recursiveUnlink: recursiveUnlink,
  readDirPaths: readDirPaths,
  nameFromPath: nameFromPath
};
