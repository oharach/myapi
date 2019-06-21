// Create express app
var express = require("express")
var app = express()
var sqlite3 = require('sqlite3').verbose()

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// DB Connection
let db = new sqlite3.Database("mydb.sqlite", sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
      // Cannot open database
      console.log("Create DB first with : npm run init")
      console.error(err.message)
      throw err
    }else{
        console.log('Connected to the SQLite database.')
    }
});

// Server port
var HTTP_PORT = 8000 
// Start server
app.listen(HTTP_PORT, () => {
    console.log("Server running on port %PORT%".replace("%PORT%",HTTP_PORT))
});
// Root endpoint
app.get("/", (req, res, next) => {
    res.json({"message":"Ok"})
});

// GET
app.get("/api/users", (req, res, next) => {
    var sql = "select * from Users"
    var params = []
    db.all(sql, params, (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            "message":"success",
            "data":rows
        })
      });
});

// POST
app.post("/api/user/", (req, res, next) => {
    var errors=[]
    if (!req.body.firstName){
        errors.push("No first name specified");
    }
    if (!req.body.lastName){
        errors.push("No last name specified");
    }
    if (errors.length){
        res.status(400).json({"error":errors.join(",")});
        return;
    }
    var data = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        pictureURL: req.body.pictureURL
    }
    var sql ='INSERT INTO Users (firstName, lastName, pictureURL) VALUES (?,?,?)'
    var params =[data.firstName, data.lastName, data.pictureURL]
    db.run(sql, params, function (err, result) {
        if (err){
            res.status(400).json({"error": err.message})
            return;
        }
        res.json({
            "message": "success",
            "data": data,
            "id" : this.lastID
        })
    });
})

// UPDATE
app.patch("/api/user/:id", (req, res, next) => {
    var data = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        pictureURL : req.body.pictureURL
    }
    db.run(
        `UPDATE Users set 
           firstName = COALESCE(?,firstName), 
           lastName = COALESCE(?,lastName), 
           pictureURL = COALESCE(?,pictureURL) 
           WHERE id = ?`,
        [data.firstName, data.lastName, data.pictureURL, req.params.id],
        function (err, result) {
            if (err){
                res.status(400).json({"error": res.message})
                return;
            }
            res.json({
                message: "success",
                data: data,
                changes: this.changes
            })
    });
})

// DELETE
app.delete("/api/user/:id", (req, res, next) => {
    db.run(
        'DELETE FROM Users WHERE id = ?',
        req.params.id,
        function (err, result) {
            if (err){
                res.status(400).json({"error": res.message})
                return;
            }
            res.json({"message":"deleted", changes: this.changes})
    });
})

// Default response for any other request
app.use(function(req, res){
    res.status(404);
});