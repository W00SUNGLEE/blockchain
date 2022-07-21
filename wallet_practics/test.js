var express = require("express");

var app = express();

app.get("/", (req, res) => {
  res.send("respond with a resource");
});

app.get("/deploy", function (req, res) {
  res.sendFile(__dirname + "/deploy.html");
});

var server = app.listen(5000, () => {
  console.log("server is working now");
});
