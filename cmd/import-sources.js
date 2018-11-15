const fs = require("fs");
const child_process = require("child_process");
const parse = require("./functions/parse");

const configJson = "config.json";
const sourceDir = "sources";
const tmpDir = ".tmp";
const contentXml = "content.xml";

console.log("Checking for files to import...");

const filePaths = getFilesToImport();

for (let i = 0; i < filePaths.length; ++i) {
  console.log(`Unzipping ${filePaths[i]}...`);
  let workingDir = unzip(filePaths[i]);
  let contentXmlPath = workingDir + "/" + contentXml;
  let strings = parse(contentXmlPath);
  console.log(strings);
  rmdirRecursive(workingDir);
}

// ================== The End ================================

function getFilesToImport() {
  const lastRunDate = getLastRunDate();
  const langDirs = readDirPaths(sourceDir);
  let files = [];
  for (let i = 0; i < langDirs.length; ++i) {
    files = files.concat(getFilesToImportFromDir(langDirs[i], lastRunDate));
  }
  return files;
}

function getFilesToImportFromDir(dir, lastRunDate) {
  const allFiles = readDirPaths(dir);
  return lastRunDate
    ? allFiles.filter(filepath => shouldImport(filepath, lastRunDate))
    : allFiles;
}

function shouldImport(filepath, lastRunDate) {
  return fs.statSync(filepath).mtimeMs > lastRunDate;
}

function getLastRunDate() {
  if (!fs.existsSync(configJson)) return undefined;
  const config = JSON.parse(fs.readFileSync(configJson));
  return config.lastSourceImportDate;
}

function unzip(filepath) {
  const workingDir = `${tmpDir}/${nameFromPath(filepath)}`;
  child_process.execSync(`unzip "${filepath}" -d "${workingDir}"`);
  return workingDir;
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

function readDirPaths(dir) {
  return fs.readdirSync(dir).map(name => `${dir}/${name}`);
}

function nameFromPath(path) {
  return path.slice(path.lastIndexOf("/") + 1);
}
