const stringStorage = require("../functions/stringStorage");
const params = require("../functions/params");
const translator = require("../functions/uiTranslator");

function index() {
  const languages = params.getParams();
  const t = translator(languages.srcLang);

  let html = `<h2>${t("Lessons")}</h2>`;
  html += "<table><tbody>";
  const lessons = stringStorage.getLessons();
  html += lessons.map(lessonHtml).join("");
  html += "</tbody></table>";
  return html;
}

function lessonHtml(lesson) {
  let html = `<tr><td><a href="/lesson/${lesson}">${lesson}</a></td>`;
  html += progress(lesson);
  html += `</tr>\n`;
  return html;
}

function progress(lesson) {
  const strings = stringStorage.getStrings(lesson);
  const percent = Math.round(
    (100 * strings.filter(translated).length) / strings.length
  );
  return `<td class="progress ${percent == 100 ? "done" : ""}">
            ${percent > 0 ? percent + "%" : ""}
          </td>\n`;
}

function translated(item) {
  return item.translation && item.translation.length > 0;
}

module.exports = index;
