const process = require("process");
const util = require("./functions/util");
const db = require("./functions/db");

viewStrings();

async function viewStrings() {
  try {
    const params = parseArgv();
    const rows = await db.getStrings(params.langPattern, params.lesson);
    const output = rows.map(row => row.value).join("\n\n");
    console.log(output);
  } catch (error) {
    console.error(error);
  }
}

function parseArgv() {
  try {
    const pattern = /\d+/;
    let qNum = pattern.exec(process.argv[3]);
    let lNum = util.zeroPad(pattern.exec(process.argv[4]), 2);
    return {
      langPattern: process.argv[2],
      lesson: `Q${qNum}-L${lNum}`
    };
  } catch (error) {
    throw "Usage: npm run view-strings [language] [q#] [l#]\nEx: npm run view-strings eng q1 l2";
  }
}
