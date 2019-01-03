const express = require("express");

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
  // res.send(routes.index());
  res.send("<html><body><h1>Έυρηκα!</h1></body></html>");
});

app.get("/api/verses/:code", async (req, res) => {
  try {
    const values = await db.getVerses(req.params.code);
    if (!values) res.status(404).send(`No verses for code: ${req.params.code}`);
    else {
      res.json(values);
    }
  } catch (error) {
    console.error("Failed to fetch verse library");
    console.error(error);
    res.status(500).send("Database error");
  }
});

function hasValidKey(req) {
  return req.body.apiKey == secrets.apiKey;
}

app.listen(port, () =>
  console.log(
    `Bible Head API listening on port ${port}!\nEnvironment is ${app.get(
      "env"
    )}`
  )
);

// DB
