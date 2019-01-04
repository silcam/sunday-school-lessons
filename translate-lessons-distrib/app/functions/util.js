const fs = require("fs");

function safeMkDir(filepath) {
  if (!fs.existsSync(filepath)) fs.mkdirSync(filepath);
}

module.exports = {
  safeMkDir: safeMkDir
};
