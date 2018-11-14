const libxmljs = require("libxmljs");
const fs = require("fs");

const xml = fs.readFileSync("sample-doc/lesson/content.xml");
const xmlDoc = libxmljs.parseXml(xml);

const textNS = "urn:oasis:names:tc:opendocument:xmlns:text:1.0";
// const xPath = `//xmlns:p[@xmlns:style-name='M.T._20_Text']`
const xPath = "//xmlns:p[contains(@xmlns:style-name, 'M.T._20_Text')]";
const nodes = xmlDoc.find(xPath, textNS);
const strings = nodes
  .map(node => node.text().trim())
  .reduce((accumStrings, string) => {
    if (!accumStrings.includes(string)) return accumStrings.concat([string]);
    return accumStrings;
  }, []);
console.log(strings.length);
console.log(strings);
