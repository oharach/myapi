var sqlite3 = require('sqlite3').verbose()

let db = new sqlite3.Database("mydb.sqlite", (err) => {
    if (err) {
      // Cannot open database
      console.error(err.message)
      throw err
    }else{
        console.log('Connected to the SQLite database.')
        db.run(`CREATE TABLE Users (
            userId INTEGER PRIMARY KEY AUTOINCREMENT,
            firstName text, 
            lastName text, 
            pictureURL text
            )`,
        (err) => {
            if (err) {
                // Table already created
            }else{
                // Table just created, creating some rows
                var insert = 'INSERT INTO Users (firstName, lastName) VALUES (?,?)'
                db.run(insert, ["Ossama","HARACH"])
                db.run(insert, ["Raphael","BISCHOF"])
                db.run(insert, ["Steve","JOBS"])
            }
        });  
    }
});