const fs = require("fs");
const child_process = require("child_process");

const tmpDir = ".tmp";

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

function zip(srcDir, outPath) {
  const tmpzip = ".tmpzip.zip";
  child_process.execSync(`cd "${srcDir}" && zip -r "${tmpzip}" ./*`);
  fs.renameSync(`${srcDir}/${tmpzip}`, outPath);
}

function unzip(filepath) {
  const workingDir = `${tmpDir}/${nameFromPath(filepath)}`;
  verifyDirClear(workingDir);
  child_process.execSync(`unzip "${filepath}" -d "${workingDir}"`);
  return workingDir;
}

function verifyDirClear(dir) {
  if (fs.existsSync(dir)) {
    rmdirRecursive(dir);
  }
}

function rmdirRecursive(dir) {
  const files = readDirPaths(dir);
  for (let i = 0; i < files.length; ++i) {
    let file = files[i];
    if (fs.statSync(file).isDirectory()) rmdirRecursive(file);
    else fs.unlinkSync(file);
  }
  fs.rmdirSync(dir);
}

function mkdirSafe(path) {
  if (!fs.existsSync(path)) fs.mkdirSync(path);
}

module.exports = {
  zeroPad: zeroPad,
  recursiveUnlink: recursiveUnlink,
  readDirPaths: readDirPaths,
  nameFromPath: nameFromPath,
  zip: zip,
  unzip: unzip,
  rmdirRecursive: rmdirRecursive,
  mkdirSafe: mkdirSafe
};
