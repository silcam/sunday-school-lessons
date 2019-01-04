const stringStorage = require("../functions/stringStorage");
const params = require("../functions/params");

function lesson(code) {
  const languages = params.getParams();
  const strings = stringStorage.getStrings(code);
  let html = `<form action='/lesson/${code}' method='post'>${submitButton()}<table>`;
  html += strings
    .map(
      string =>
        "<tr><th>" +
        languages.srcLang +
        "</th><td>" +
        string.src +
        "</td></tr>" +
        "<tr><th>" +
        languages.targetLang +
        "</th><td>" +
        `
        <input type='text' name='${string.id}' value='${string.translation ||
          ""}' />` +
        "</td></tr>\n"
    )
    .join("");
  html += "</table>" + submitButton() + "</form>";
  return html;
}

function submitButton() {
  return "<button type='submit'>Submit</button>";
}

module.exports = lesson;
