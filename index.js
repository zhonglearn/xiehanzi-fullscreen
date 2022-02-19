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

  let simultaneous = req.query.simultaneous == true || false;
  let hsklabel = "";
  let deck = req.query.hsk || "1";
  let characters = fs.readFileSync("./hsk/HSK" + deck + ".txt", {
    encoding: "utf8",
  });
  if (req.query.hsk) {
    hsklabel = "HSK" + deck + " (" + characters.length + " words)";
  }

  characters = characters.split(/\n/);
  console.log(characters.length);

  let character =
    req.query.word || characters[Math.floor(Math.random() * characters.length)];

  let charlist = [];
  let charamt = 0;

  for (charamt = 0; charamt < character.split("").length; charamt++) {
    charlist.push({ id: charamt, character: character.split("")[charamt] });
  }

  res.render("master", {
    character,
    label: hsklabel,
    simultaneous,
    charlist,
    charamt,
  });
});
app.listen(3000);
