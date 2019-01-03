const stringStorage = require("../functions/stringStorage");

function lesson(code) {
  const strings = stringStorage.getStrings(code);
  let html = `<form action='/lesson/${code}' method='post'><table>`;
  html += strings
    .map(
      string =>
        "<tr><td>" +
        string.src +
        "</td><td>" +
        `
        <input type='text' name='${string.id}' value='${string.translation ||
          ""}' />` +
        "</td></tr>\n"
    )
    .join("");
  html += "</table><button type='submit'>Submit</button></form>";
  return html;
}

module.exports = lesson;
