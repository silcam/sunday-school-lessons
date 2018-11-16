const sqlite3 = require("sqlite3");
const fs = require("fs");

const dbFile = "translate-lessons-distrib/strings.db";
const schemaSql = fs.readFileSync("schema.sql").toString();

async function getStrings(langPattern, lesson) {
  const db = getDatabase();
  try {
    langPattern = `%${langPattern}%`;
    const sql =
      "SELECT * FROM strings WHERE language LIKE $langPattern AND lesson=$lesson;";
    const params = { $langPattern: langPattern, $lesson: lesson };
    return await dbAllPromise(db, sql, params);
  } catch (err) {
    throw err;
  } finally {
    db.close();
  }
}

async function insertStrings(language, lesson, strings) {
  const db = getDatabase();
  try {
    await clearStrings(db, language, lesson);
    for (let i = 0; i < strings.length; ++i) {
      let strObj = strings[i];
      let sql =
        "INSERT INTO strings (language, lesson, xpath, value) VALUES ($language, $lesson, $xpath, $value);";
      let params = {
        $language: language,
        $lesson: lesson,
        $xpath: strObj.xpath,
        $value: strObj.text
      };
      await dbRunPromise(db, sql, params);
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
  getStrings: getStrings
};
