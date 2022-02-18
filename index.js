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
  let deck = req.query.hsk || "1";
  let size = req.query.size || "1920";
  let characters = fs.readFileSync("./hsk/HSK" + deck + ".txt", {
    encoding: "utf8",
  });

  characters = characters.split(/\n/);
  console.log(characters.length);

  let character =
    req.query.word || characters[Math.floor(Math.random() * characters.length)];

  let charlist = [];

  for (var i = 0; i < character.split("").length; i++) {
    charlist.push({ id: i, character: character.split("")[i] });
  }

  res.render("master", {
    character,
    charlist,
    size: size / (charlist.length + 2 / charlist.length),
  });
});
app.listen(3000);
