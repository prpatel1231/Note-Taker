const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 8080;

// Sets up the Express app with middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

//reading the db.json file
let db = fs.readFileSync("./db/db.json","utf-8");
db? db = JSON.parse(db):db=[];

//API Routes
app.get("/api/notes", (req, res) => {
  return res.send(db);
});

app.post("/api/notes", (req, res) => {
  let body = req.body;
  db.push(body);
  fs.writeFileSync("./db/db.json", JSON.stringify(db), "utf-8");
  res.json(true);
});

app.delete("/api/notes/:id", (req,res) => {
  const selected = db.find(note => note.id === parseFloat(req.params.id));
  if(!selected) return res.status(404).send("The note not found");
  
  const index = db.indexOf(selected);
  db.splice(index,1);
  fs.writeFileSync("./db/db.json", JSON.stringify(db), "utf-8");
  return res.json(true);
});

//HTML routes
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname,"./public/index.html"));
});

//listening to server
app.listen(PORT, function() {
  console.log("App listening on PORT " + PORT);
});
