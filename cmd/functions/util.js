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

module.exports = {
  zeroPad: zeroPad,
  recursiveUnlink: recursiveUnlink
};
