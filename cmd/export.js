const process = require("process");
const db = require("./functions/db");
const fs = require("fs");
const util = require("./functions/util");
const mergeXml = require("./functions/mergeXml");

const exportDir = "export";
const sourceDir = "sources";
const contentXml = "content.xml";

exportDocs();

async function exportDocs() {
  try {
    const lang = exportLangFromArgs();
    console.log(`Getting translation data for ${lang}...`);

    const translationData = await getTranslationData(lang);
    const lessons = Object.keys(translationData);
    if (lessons.length == 0) {
      console.log(`No translations found for ${lang}.`);
      return;
    }
    console.log(`${lessons.length} lessons available in ${lang}.`);

    for (let i = 0; i < lessons.length; ++i) {
      console.log(`Exporting lesson ${lessons[i]}...`);
      const docPath = await exportDoc(translationData[lessons[i]]);
      console.log(`Saved ${docPath}`);
    }

    console.log(`Done.`);
  } catch (err) {
    console.error(err);
    console.error(
      "\nSomething went wrong. Copy the message above and send it to Rick."
    );
  }
}

async function getTranslationData(lang) {
  const rows = await db.getStrings(lang);
  return rows.reduce((accum, row) => {
    if (!accum[row.lesson]) accum[row.lesson] = [];
    accum[row.lesson].push(row);
    return accum;
  }, {});
}

async function exportDoc(strings) {
  const srcLang = strings[0].srcLanguage;
  const lesson = strings[0].lesson;
  const srcPath = findSrcDoc(srcLang, lesson);
  const workingDir = unpack(srcPath);
  const contentXmlPath = `${workingDir}/${contentXml}`;
  mergeXml(contentXmlPath, strings);
  const targetLang = strings[0].language;
  return saveDoc(targetLang, lesson, workingDir);
}

function saveDoc(lang, lesson, workingDir) {
  util.mkdirSafe(exportDir);
  const langExportDir = `${exportDir}/${lang}`;
  util.mkdirSafe(langExportDir);
  const fileExportPath = `${langExportDir}/${lesson}.odt`;
  util.zip(workingDir, fileExportPath);
  return fileExportPath;
}

function unpack(srcPath) {
  return util.unzip(srcPath);
}

function findSrcDoc(srcLang, lesson) {
  const langSrcDir = `${sourceDir}/${srcLang}`;
  const filenames = fs.readdirSync(langSrcDir);
  const srcFilename = filenames.find(f => f.includes(lesson));
  if (!srcFilename)
    throw `Could not find source document in ${srcLang} for lesson ${lesson}`;
  return `${langSrcDir}/${srcFilename}`;
}

function exportLangFromArgs() {
  const exportLang = process.argv[2];
  if (!exportLang)
    throw "Usage: npm run export [language]\nEx: npm run export Hdi";
  return exportLang;
}
