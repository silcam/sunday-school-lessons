const stringStorage = require("../functions/stringStorage");
const params = require("../functions/params");
const translator = require("../functions/uiTranslator.js");

function lesson(code) {
  const languages = params.getParams();
  const strings = stringStorage.getStrings(code);
  const t = translator(languages.srcLang);

  let html = `<h3><a href="/">${"<< " + t("Lessons")}</a></h3>`;
  html += `<form action='/lesson/${code}' method='post'>${submitButton(
    t
  )}<table>`;
  html += strings
    .map(
      string =>
        "<tr class='src'><th>" +
        languages.srcLang +
        "</th><td>" +
        string.src +
        "</td></tr>" +
        "<tr class='target'><th>" +
        languages.targetLang +
        "</th><td>" +
        textInput(string.id, string.src, string.translation) +
        "</td></tr>\n"
    )
    .join("");
  html += "</table>" + submitButton(t) + "</form>";
  return html;
}

function textInput(id, srcText, targetText = "") {
  return srcText.length > 120
    ? `<textarea name=${id} rows="4">${targetText}</textarea>`
    : `<input type='text' name='${id}' value='${targetText}' />`;
}

function submitButton(t) {
  return `<button type='submit'>${t("Save")}</button>`;
}

module.exports = lesson;
