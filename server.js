// Create express app
var express = require("express")
var app = express()
var sqlite3 = require('sqlite3').verbose()

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

// API endpoints
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

// Default response for any other request
app.use(function(req, res){
    res.status(404);
});