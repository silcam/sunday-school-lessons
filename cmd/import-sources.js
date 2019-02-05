const fs = require("fs");
const parse = require("./functions/parse");
const db = require("./functions/db");
const config = require("./functions/config");
const util = require("./functions/util");

const sourceDir = "sources";
const contentXml = "content.xml";
const lastImportDateParam = "lastImportDate";

importSources();

async function importSources() {
  try {
    console.log("Checking for files to import...");

    const langsFiles = getFilesToImport();

    if (langsFiles.length == 0)
      console.log("No new or updated source files found.");

    for (let i = 0; i < langsFiles.length; ++i) {
      let langFiles = langsFiles[i];
      for (let j = 0; j < langFiles.files.length; ++j) {
        await importSource(langFiles.language, langFiles.files[j]);
      }
    }
    config.setParam(lastImportDateParam, new Date().valueOf());
  } catch (error) {
    console.error(error);
    console.error(
      "\nSomething went wrong. Copy the message above and send it to Rick."
    );
  }
}

async function importSource(language, filepath) {
  console.log(`Unzipping ${filepath}...`);
  const workingDir = util.unzip(filepath);
  const contentXmlPath = workingDir + "/" + contentXml;
  const lesson = lessonFromFilepath(filepath);
  console.log(`Extracting strings for ${language} lesson ${lesson}...`);
  const strings = parse(contentXmlPath);
  console.log(`Got ${strings.length} strings. Adding to database...`);
  const dbRVar = await db.insertStrings(language, lesson, strings);
  if (dbRVar.error) throw dbRVar.error;
  console.log(`...done\n\n`);
  util.rmdirRecursive(workingDir);
}

function lessonFromFilepath(filepath) {
  const filename = util.nameFromPath(filepath);
  const pattern = /Q\d+-L\d+/;
  return pattern.exec(filename)[0];
}

function getFilesToImport() {
  const lastImportDate = config.getParam(lastImportDateParam, 0);
  const langDirs = util.readDirPaths(sourceDir);
  let langsFiles = [];
  for (let i = 0; i < langDirs.length; ++i) {
    let files = getFilesToImportFromDir(langDirs[i], lastImportDate);
    if (files.length > 0)
      langsFiles.push({
        language: util.nameFromPath(langDirs[i]),
        files: files
      });
  }
  return langsFiles;
}

function getFilesToImportFromDir(dir, lastRunDate) {
  const allFiles = util.readDirPaths(dir);
  return allFiles.filter(filepath => shouldImport(filepath, lastRunDate));
}

function shouldImport(filepath, lastRunDate) {
  return (
    filepath.endsWith(".odt") && fs.statSync(filepath).mtimeMs > lastRunDate
  );
}
