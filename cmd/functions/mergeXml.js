const libxmljs = require("libxmljs");
const fs = require("fs");

function mergeXml(contentXmlFilepath, translations) {
  const xmlDoc = getXmlDoc(contentXmlFilepath);
  const namespaces = extractNamespaces(xmlDoc);
  for (let i = 0; i < translations.length; ++i) {
    const translation = translations[i];
    const element = xmlDoc.get(translation.xpath, namespaces);
    element.text(translation.value);
  }
  fs.writeFileSync(contentXmlFilepath, xmlDoc.toString());
}

function getXmlDoc(xmlFilpath) {
  const xml = fs.readFileSync(xmlFilpath);
  return libxmljs.parseXml(xml);
}

function extractNamespaces(xmlDoc) {
  return xmlDoc
    .root()
    .namespaces()
    .reduce((accum, ns) => {
      accum[ns.prefix()] = ns.href();
      return accum;
    }, {});
}

module.exports = mergeXml;
