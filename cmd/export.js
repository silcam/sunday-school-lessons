const process = require("process");
const db = require("./functions/db");
const fs = require("fs");
const util = require("./functions/util");

const exportPath = "translate-lessons-distrib/app/strings/";
const paramsFilePath = "translate-lessons-distrib/app/params.json";

exportStringsToDistrib();

async function exportStringsToDistrib() {
  try {
    const languages = langFromArgs();
    const rows = await db.getStrings(languages.srcLang);
    if (rows.length == 0)
      console.log(`No strings found for language: ${languages.srcLang}.`);
    else {
      console.log("Writing...");
      writeParamsFile(languages);
      writeStringsToJson(rows);
      console.log("Done");
    }
  } catch (error) {
    console.error(error);
  }
}

function writeParamsFile(languages) {
  fs.writeFileSync(paramsFilePath, JSON.stringify(languages));
}

function writeStringsToJson(rows) {
  prepareExportDir();
  const lessons = rows.reduce((accum, row) => {
    if (!accum[row.lesson]) accum[row.lesson] = [];
    accum[row.lesson].push(row);
    return accum;
  }, {});
  Object.keys(lessons).forEach(lesson => {
    const path = `${exportPath}/${lesson}.json`;
    console.log(path);
    fs.writeFileSync(path, JSON.stringify(lessons[lesson]));
  });
}

function prepareExportDir() {
  util.recursiveUnlink(exportPath);
  fs.mkdirSync(exportPath);
}

function langFromArgs() {
  try {
    return {
      srcLang: process.argv[2],
      targetLang: process.argv[3]
    };
  } catch (error) {
    throw "Usage: npm run export [language]\nEx: npm run export English Bulu";
  }
}
