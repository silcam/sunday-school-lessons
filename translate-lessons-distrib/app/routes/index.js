const stringStorage = require("../functions/stringStorage");

function index() {
  let html = "<ul>";
  const lessons = stringStorage.getLessons();
  html += lessons
    .map(lesson => `<li><a href="/lesson/${lesson}">${lesson}</a></li>\n`)
    .join("");
  html += "</ul>";
  return html;
}

module.exports = index;
