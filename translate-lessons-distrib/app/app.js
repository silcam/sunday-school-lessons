const express = require("express");
const layout = require("./layout");
const index = require("./routes/index");
const lesson = require("./routes/lesson");

const app = express();
// app.use(express.json());
const env = app.get("env");
const port = 8080;

// app.post("/api/verses", async (req, res) => {
//   if (!hasValidKey(req)) {
//     res.status(403).send("Not allowed");
//     return;
//   }
//   try {
//     const data = req.body;
//     const code = await db.saveVerses(
//       data.code,
//       JSON.stringify(data.verses),
//       data.formatVersion
//     );
//     res.json({ code: code });
//   } catch (error) {
//     console.error("Failed to post verse library");
//     console.error(error);
//     res.status(500).send("Database error");
//   }
// });

app.get("/", async (req, res) => {
  res.send(layout(index()));
  // res.send("<html><body><h1>Έυρηκα!</h1></body></html>");
});

app.get("/lesson/:code", async (req, res) => {
  res.send(layout(lesson(req.params.code)));
});

// app.get("/api/verses/:code", async (req, res) => {
//   try {
//     const values = await db.getVerses(req.params.code);
//     if (!values) res.status(404).send(`No verses for code: ${req.params.code}`);
//     else {
//       res.json(values);
//     }
//   } catch (error) {
//     console.error("Failed to fetch verse library");
//     console.error(error);
//     res.status(500).send("Database error");
//   }
// });

app.listen(port, () =>
  console.log(
    `Translation server is running!\nGo to http://localhost:8080 in your browser`
  )
);

// DB
