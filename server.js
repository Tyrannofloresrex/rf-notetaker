var express = require("express");
var path = require("path");

const fs = require("fs");

// Sets up Express
var app = express();
const PORT = process.env.PORT || 3000;

// Tells express to process JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// Routes
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "./public/assets/index.html"));
});

app.get("/notes", function (req, res) {
  res.sendFile(path.join(__dirname, "./public/assets/notes.html"));
});



// API ROUTES
app.get("/api/notes", function (req, res) {
  fs.readFile(path.join(__dirname,"./db/db.json"), "utf-8", (err,data)=>{
    if (err) throw err;
    res.json(JSON.parse(data));
  });

});

app.post("/api/notes", function(req, res) {
  fs.readFile(path.join(__dirname,"./db/db.json"), "utf-8", (err,data)=>{
    if (err) throw err;
    const postNote = {
      title: req.body.title,
      text: req.body.text,
      id: Math.floor(Math.random()*1000000)
    };

    let noteDB = JSON.parse(data);
    noteDB.push(postNote);
    console.log(postNote);
    
    fs.writeFile(path.join(__dirname,"./db/db.json"), JSON.stringify(noteDB), err=> {
      if (err) throw err;
      res.send('NOTE SAVED')
    })
  })
})

app.delete(`/api/notes/:id`, function(req, res) {
  fs.readFile(path.join(__dirname,"./db/db.json"), "utf-8", (err,notes)=> {
    if (err) throw err;
    let id = parseInt(req.params.id)
    var filterDB = JSON.parse(notes).filter(note=> note.id !== id )
    console.log(filterDB)
    fs.writeFile(path.join(__dirname,"./db/db.json"), JSON.stringify(filterDB), err=> {
      res.send("Note Deleted")
    }) 
  })
})

app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "/public/assets/index.html"));
});

// Tells server to listens to connection between host and port
app.listen(PORT, function () {
  console.log("App listening on PORT " + PORT);
});
