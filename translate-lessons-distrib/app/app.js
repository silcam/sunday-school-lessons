const express = require("express");
const layout = require("./layout");
const index = require("./routes/index");
const lesson = require("./routes/lesson");
const bodyParser = require("body-parser");
const stringStorage = require("./functions/stringStorage");

const app = express();
const formDateParser = bodyParser.urlencoded({ extended: false });
const port = 8080;

app.get("/", async (req, res) => {
  res.send(layout(index()));
});

app.get("/lesson/:code", async (req, res) => {
  res.send(layout(lesson(req.params.code)));
});

app.post("/lesson/:code", formDateParser, async (req, res) => {
  try {
    stringStorage.saveStrings(req.params.code, req.body);
    res.redirect("/");
  } catch (error) {
    console.error(error);
    res.status(500).send("Sorry, there was a problem.");
  }
});

app.listen(port, () =>
  console.log(
    `Translation server is running!\nGo to http://localhost:8080 in your browser`
  )
);
