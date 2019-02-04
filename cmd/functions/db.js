const sqlite3 = require("sqlite3");
const fs = require("fs");

const dbFile = "strings.db";
const schemaSql = fs.readFileSync("schema.sql").toString();

async function getStrings(langPattern, lesson) {
  const db = getDatabase();
  langPattern = `%${langPattern}%`;
  try {
    return lesson
      ? getStringsByLanguageAndLesson(db, langPattern, lesson)
      : getStringsByLanguage(db, langPattern);
  } catch (err) {
    throw err;
  } finally {
    db.close();
  }
}

async function getStringsByLanguage(db, langPattern) {
  const sql = "SELECT * FROM strings WHERE language LIKE $langPattern;";
  const params = { $langPattern: langPattern };
  return await dbAllPromise(db, sql, params);
}

async function getStringsByLanguageAndLesson(db, langPattern, lesson) {
  const sql =
    "SELECT * FROM strings WHERE language LIKE $langPattern AND lesson=$lesson;";
  const params = { $langPattern: langPattern, $lesson: lesson };
  return await dbAllPromise(db, sql, params);
}

async function insertStrings(language, lesson, strings) {
  const db = getDatabase();
  try {
    await clearStrings(db, language, lesson);
    for (let i = 0; i < strings.length; ++i) {
      let strObj = strings[i];
      await writeString(db, language, lesson, strObj.xpath, strObj.text);
    }
    return {};
  } catch (err) {
    return { error: err };
  } finally {
    closeDatabase(db);
  }
}

async function clearStrings(db, language, lesson) {
  const deleteSql =
    "DELETE FROM strings WHERE language=$language AND lesson=$lesson;";
  const params = { $language: language, $lesson: lesson };
  return await dbRunPromise(db, deleteSql, params);
}

async function insertTranslations(language, lesson, translations) {
  const db = getDatabase();
  try {
    await clearStrings(db, language, lesson);
    for (let i = 0; i < translations.length; ++i) {
      const translation = translations[i];
      const original = await getById(db, translation.id);
      await writeString(
        db,
        language,
        lesson,
        original.xpath,
        translation.translation,
        original.language
      );
    }
  } catch (err) {
    throw err;
  } finally {
    db.close();
  }
}

async function getById(db, id) {
  const sql = "SELECT * FROM strings WHERE id=$id;";
  const params = { $id: id };
  const rows = await dbAllPromise(db, sql, params);
  if (rows.length == 1) return rows[0];
  else throw `Could not find source string in the database with id ${id}!`;
}

async function writeString(
  db,
  language,
  lesson,
  xpath,
  value,
  srcLanguage = null
) {
  const sql =
    "INSERT INTO strings (language, lesson, xpath, value, srcLanguage) VALUES ($language, $lesson, $xpath, $value, $srcLanguage);";
  const params = {
    $language: language,
    $lesson: lesson,
    $xpath: xpath,
    $value: value,
    $srcLanguage: srcLanguage
  };
  await dbRunPromise(db, sql, params);
}

function dbRunPromise(db, sql, params) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, err => {
      err ? reject(err) : resolve("good");
    });
  });
}

function dbAllPromise(db, sql, params) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      err ? reject(err) : resolve(rows);
    });
  });
}

function getDatabase() {
  const db = new sqlite3.Database(dbFile);
  db.run(schemaSql); // Create the table if it doesn't exist
  return db;
}

function closeDatabase(db) {
  db.close();
}

module.exports = {
  insertStrings: insertStrings,
  getStrings: getStrings,
  insertTranslations: insertTranslations
};
