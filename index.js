const express = require("express");
const fs = require("fs");
const HanziWriter = require("hanzi-writer");
const app = express();
const mustacheExpress = require("mustache-express");

app.engine("html", mustacheExpress()); // register file extension mustache

app.set("view engine", "html"); // register file extension for partials
app.set("views", __dirname + "/views");

app.use(express.static(__dirname + "/public")); // set static folder

app.get("/", function (req, res) {
  if (!req.query.hsk && !req.query.word) {
    return res.render("home");
  }
  let label = "";
  let deck = req.query.hsk || "1";
  let characters, character, charinfo;

  if (req.query.word) {
    character = req.query.word;
  } else if (req.query.hsk) {
    try {
      characters = fs.readFileSync("./hsk/HSK " + deck + ".tsv", {
        encoding: "utf8",
      });

      characters = characters.split(/\n/);
      characters = characters[Math.floor(Math.random() * characters.length)];
      character = characters.split(/\t/)[0];

      charinfo = characters.split(/\t/)[2] + " - " + characters.split(/\t/)[3];

      label = "HSK" + deck + " (" + characters.length + " words)";
    } catch (e) {
      return res.render("home");
    }
  }
  let charlist = [];

  for (let charamt = 0; charamt < character.split("").length; charamt++) {
    charlist.push({ id: charamt, character: character.split("")[charamt] });
  }

  res.render("master", {
    simultaneous: req.query.simultaneous == true || false,
    character,
    label,
    charlist,
    charinfo,
    charamt: charlist.length,
  });
});
app.listen(process.env.PORT || 3000);
