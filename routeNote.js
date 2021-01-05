const express = require("express");
const router = express.Router();
const connection = require("./connection");


// 1-- GET all data

router.get("/all", (req, res) => {

    connection.query("SELECT * FROM notes", (error, rows) => {
        if (rows.length === 0) {
            res.status(404).send({ error: "Note not found" });
        } else {
            res.status(200).json(rows);
        }
    })
});

// 2-- GET - Retrieve specific fields 

router.get("/all/:id", (req, res, next) => {

    connection.query('SELECT * FROM notes where id=?', req.params.id, (error, rows) => {
        if (error) {
            return next(error);
        }
        if (rows.length === 0) {
            res.status(404).send({ error: "Note not found" });
        } else {
            res.status(200).json(rows);
        }
    })
})

//GET  - Retrieve a data set with the following :
// 3-- filter for data that contains... 
router.get("/filter1", (req, res) => {
    const { contain } = req.query
    connection.query(`SELECT * FROM notes where note like '%${contain}%'`, (error, rows) => {
        if (error) {
            console.log(error);
            res.status(500).send("Error retrieving data");

        } else if (rows.length === 0) {
            res.status(404).send("no text found for this filter");
        } else {
            res.status(200).json(rows);
        }
    })
})



// 4-- filter for data that starts with...

router.get("/filter2", (req, res) => {
    const { start } = req.query
    connection.query(`SELECT * FROM notes where note like '${start}%'`, (error, rows) => {
        if (error) {
            console.log(error);
            res.status(500).send("Error retrieving data");

        } else if (rows.length === 0) {
            res.status(404).send("no text found for this filter");
        } else {
            res.status(200).json(rows);
        }
    })
})

//5-- filter for data that is greater than... 

router.get("/date", (req, res) => {

    connection.query(`SELECT * FROM notes where added_at >= ?`, [req.query.date], (error, rows) => {
        if (error) {
            console.log(error);
            res.status(500).send("Error retrieving data");

        } else if (rows.length === 0) {
            res.status(404).send("no text found for this filter");
        } else {
            res.status(200).json(rows);
        }
    })
})

//6-- GET - Ordered data recovery (i.e. ascending, descending) - The order should be passed as a route parameter

router.get("/order", (req, res, next) => {
    const { way } = req.query

    connection.query(`SELECT * FROM notes ORDER BY note ${way}`, (error, rows) => {
        if (error) {
            return next(error);

        } else {
            res.status(200).json(rows);
        }
    })
})


//7-- POST - Insertion of a new entity

router.post("/", (req, res) => {
    const { note, date, done } = req.body;
    connection.query("INSERT INTO notes(note, date, done) VALUES(?, ?, ?)", [note, date, done], (err, rows) => {
        if (err) {
            console.log(err);
            res.status(500).send("Error saving a note");
        } else {
            res.status(200).send("Successfully saved");
        }
    });
});


//8-- PUT - Modification of an entity

router.put("/:id", (req, res) => {
    const idNote = req.params.id;

    const newNote = req.body;

    connection.query("UPDATE notes SET ? WHERE id = ?", [newNote, idNote], (err, rows) => {
        if (err) {
            console.log(err);
            res.status(500).send("Error updating a note");
        } else {
            res.status(200).send("Note updated successfully ");
        }
    });
});

//9-- PUT - Toggle a Boolean value

router.put("/toggle/:id", (req, res) => {
    const idNote = req.params.id;

    connection.query("UPDATE notes SET done = NOT done WHERE id = ?", [idNote], (err, rows) => {
        if (err) {
            console.log(err);
            res.status(500).send("Error updating a note");
        } else {
            res.status(200).send("Note updated successfully ");
        }
    });
});

//10-- DELETE - Delete an entity

router.delete("/:id", (req, res) => {

    connection.query("DELETE FROM notes WHERE id = ?", [req.params.id], (error, rows) => {
        if (error) {
            console.log(error);
            res.status(500).send("Error deleting a Note");
        }
        else {
            res.status(200).send(" Note deleted!");
        }
    })
})

// 11-- DELETE - Delete all entities where boolean value is false
router.delete("/done", (req, res) => {

    connection.query("DELETE FROM notes WHERE done = 0", (error, rows) => {
        if (error) {
            console.log(error);
            res.status(500).send("Error deleting a Note");
        }
        else {
            res.status(200).send(" Note deleted!");
        }
    })
})
module.exports = router