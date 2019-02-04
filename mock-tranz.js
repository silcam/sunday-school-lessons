const fs = require("fs");

// Simulate a json file coming from the translator!
const lesson = "Q1-L01";

const strings = JSON.parse(
  fs.readFileSync(`./translate-lessons-distrib/app/strings/${lesson}.json`)
);
let translations = strings.map(s => ({
  id: s.id,
  translation: s.value.toUpperCase()
}));

fs.writeFileSync(
  `./translations/Loud-${lesson}.json`,
  JSON.stringify(translations)
);
