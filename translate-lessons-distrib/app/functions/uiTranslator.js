const strings = {
  en: {
    Save: "Save",
    Lessons: "Lessons"
  },
  fr: {
    Save: "Enregistrer",
    Lessons: "Leçons"
  },
  es: {
    Save: "Registrar",
    Lessons: "Lecciones"
  },
  po: {
    Save: "Registar",
    Lessons: "Lições"
  }
};

function translator(lang) {
  let langcode = lang.slice(0, 2).toLowerCase();
  if (!strings[langcode]) langcode = "en";
  return stringKey => {
    let string = strings[langcode][stringKey];
    if (!string) string = strings.en[stringKey];
    if (!string) string = stringKey;
    return string;
  };
}

module.exports = translator;
