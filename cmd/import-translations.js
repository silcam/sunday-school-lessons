const fs = require("fs");
const util = require("./functions/util");
const db = require("./functions/db");

const translationsDir = "translations";
const importedDir = `${translationsDir}/imported`;

importTranslations();

async function importTranslations() {
  try {
    console.log("Checking for files to import...");

    const tFiles = getFilesToImport();
    if (tFiles.length == 0)
      console.log("No translations files found in the translations folder!");

    for (let i = 0; i < tFiles.length; ++i) {
      await importTranslationsFile(tFiles[i]);
    }
  } catch (err) {
    console.error(err);
    console.error(
      "\nSomething went wrong. Copy the message above and send it to Rick."
    );
  }
}

function getFilesToImport() {
  let paths = util.readDirPaths(translationsDir);
  return paths.filter(p => p.endsWith(".json"));
}

async function importTranslationsFile(filePath) {
  const filename = util.nameFromPath(filePath);
  console.log(`Reading translations from ${filename}...`);
  const params = parseFileName(filename);
  const translations = JSON.parse(fs.readFileSync(filePath));
  console.log(
    `Found ${translations.length} strings for ${params.lang} for lesson ${
      params.lesson
    }. Adding to database...`
  );
  await db.insertTranslations(params.lang, params.lesson, translations);
  moveToImported(filePath);
  console.log("...done\n\n");
}

function parseFileName(filename) {
  const dashIndex = filename.indexOf("-");
  return {
    lang: filename.slice(0, dashIndex),
    lesson: filename.slice(dashIndex + 1).replace(".json", "")
  };
}

function moveToImported(filePath) {
  util.mkdirSafe(importedDir);
  fs.renameSync(filePath, `${importedDir}/${util.nameFromPath(filePath)}`);
}
