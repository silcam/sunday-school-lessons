const fs = require("fs");
const path = require("path");

const stringsDir = path.join("app", "strings");
const translationsDir = path.join(stringsDir, "translations");

function getLessons() {
  return fs
    .readdirSync(stringsDir)
    .filter(filename => filename.endsWith(".json"))
    .map(filename => filename.replace(".json", ""));
}

function getStrings(lesson) {
  const srcPath = path.join(stringsDir, `${lesson}.json`);
  let strings = JSON.parse(fs.readFileSync(srcPath));
  let translations = getTranslations(lesson);
  return combine(strings, translations);
}

function getTranslations(lesson) {
  const translationsPath = path.join(translationsDir, `${lesson}.json`);
  return fs.existsSync(translationsPath)
    ? JSON.parse(fs.readFileSync(translationsPath))
    : [];
}

function combine(strings, translations) {
  return strings.map(string => {
    let value = {
      id: string.id,
      src: string.value
    };
    let translation = translations.find(t => t.id == string.id);
    if (translation) {
      value.translation = translation.translation;
    }
    return value;
  });
}

module.exports = {
  getLessons: getLessons,
  getStrings: getStrings
};
