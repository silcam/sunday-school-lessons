const libxmljs = require("libxmljs");
const fs = require("fs");

const textNS = "urn:oasis:names:tc:opendocument:xmlns:text:1.0";
const styleNS = "urn:oasis:names:tc:opendocument:xmlns:style:1.0";

function parse(contentXmlFilepath) {
  const xml = fs.readFileSync(contentXmlFilepath);
  const xmlDoc = libxmljs.parseXml(xml);

  // const xPath = `//xmlns:p[@xmlns:style-name='M.T._20_Text']`

  const otherStylesToMatch = findStylesToMatch(xmlDoc).concat(
    findStylesToMatch(xmlDoc, "Lesson_20_Title")
  );

  const xPath =
    "//xmlns:p[contains(@xmlns:style-name, 'M.T._20_Text')] | " +
    otherStylesToMatch
      .map(styleName => xPathForPWithStyle(styleName))
      .join(" | ");

  const nodes = xmlDoc.find(xPath, textNS);

  const translatableStrings = parseNodes(nodes);

  return translatableStrings;
}

// const justTheStrings = extractStrings(translatableStrings);

// console.log(justTheStrings);

function findStylesToMatch(xmlDoc, parentStyle) {
  const xPath = parentStyle
    ? xPathForParentStyle(parentStyle)
    : "//xmlns:style[contains(@xmlns:parent-style-name, 'M.T._20_Text')]";

  const nodes = xmlDoc.find(xPath, styleNS);
  let styles = parentStyle ? [parentStyle] : [];
  for (let i = 0; i < nodes.length; ++i) {
    let style = nodes[i].attr("name").value();
    let childStyles = findStylesToMatch(xmlDoc, style);
    styles = styles.concat(childStyles);
  }
  return styles;
}

function xPathForPWithStyle(styleName) {
  return `//xmlns:p[@xmlns:style-name='${styleName}']`;
}

function xPathForParentStyle(parentStyleName) {
  return `//xmlns:style[@xmlns:parent-style-name='${parentStyleName}']`;
}

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

module.exports = parse;
