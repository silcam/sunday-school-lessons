const libxmljs = require("libxmljs");
const fs = require("fs");

const xml = fs.readFileSync("sample-doc/lesson/content.xml");
const xmlDoc = libxmljs.parseXml(xml);

const textNS = "urn:oasis:names:tc:opendocument:xmlns:text:1.0";
// const xPath = `//xmlns:p[@xmlns:style-name='M.T._20_Text']`
const xPath = "//xmlns:p[contains(@xmlns:style-name, 'M.T._20_Text')]";
const nodes = xmlDoc.find(xPath, textNS);

const translatableStrings = parseNodes(nodes);

const justTheStrings = removeDuplicates(extractStrings(translatableStrings));

function parseNode(node) {
  if (node.type() == "text") {
    // Node must have at least one word character
    if (/\w/.test(node.text())) {
      return [
        {
          xpath: node.path(),
          text: node.text().trim()
        }
      ];
    }
    return [];
  }

  return parseNodes(node.childNodes());
}

function parseNodes(nodes) {
  let translatableStrings = [];
  for (let i = 0; i < nodes.length; ++i) {
    translatableStrings = translatableStrings.concat(parseNode(nodes[i]));
  }
  return translatableStrings;
}

function extractStrings(translatableStrings) {
  return translatableStrings.map(strObject => strObject.text);
}

function removeDuplicates(strings) {
  return strings.reduce((accumStrings, string) => {
    if (!accumStrings.includes(string)) return accumStrings.concat([string]);
    return accumStrings;
  }, []);
}
