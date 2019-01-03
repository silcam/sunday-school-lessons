const process = require("process");
const db = require("./functions/db");
const fs = require("fs");
const util = require("./functions/util");

const exportPath = "translate-lessons-distrib/app/strings/";

exportStringsToDistrib();

async function exportStringsToDistrib() {
  try {
    const langPattern = langFromArgs();
    const rows = await db.getStrings(langPattern);
    if (rows.length == 0)
      console.log(`No strings found for language: ${langPattern}.`);
    else {
      console.log("Writing...");
      writeStringsToJson(rows);
      console.log("Done");
    }
  } catch (error) {
    console.error(error);
  }
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
    return process.argv[2];
  } catch (error) {
    throw "Usage: npm run export [language]\nEx: npm run export english";
  }
}
