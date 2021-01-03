const express = require("express");
const router = express.Router();
const connection = require("./connection");


// GET all data

router.get("/", (req, res) => {

    connection.query("SELECT * FROM notes", (error, rows) => {
        if (rows.length === 0) {
            res.status(404).send({ error: "Note not found" });
        } else {
            res.status(200).json(rows);
        }
    })
});

// GET - Retrieve specific fields 

router.get("/:id", (req, res, next) => {

    connection.query('SELECT * FROM notes where id=?', req.params.id, (error, rows, fields) => {
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

//GET - Retrieve a data set with the following :
// filter for data that contains... 

// filter for data that starts with...

// filter for data that is greater than... 

// GET - Ordered data recovery (i.e. ascending, descending) - The order should be passed as a route parameter

router.get("/way=", (req, res, next) => {

    connection.query('SELECT * FROM notes ORDER BY note ? ', [req.query.way], (error, rows, fields) => {
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

// POST - Insertion of a new entity

router.post("/", (req, res) => {
    const { note, date, done } = req.body;
    connection.query("INSERT INTO notes(note, date, done) VALUES(?, ?, ?)", [note, date, done], (err, results) => {
        if (err) {
            console.log(err);
            res.status(500).send("Error saving a note");
        } else {
            res.status(200).send("Successfully saved");
        }
    });
});


// PUT - Modification of an entity

router.put("/:id", (req, res) => {
    const idNote = req.params.id;

    const newNote = req.body;

    connection.query("UPDATE notes SET ? WHERE id = ?", [newNote, idNote], (err, results) => {
        if (err) {
            console.log(err);
            res.status(500).send("Error updating a note");
        } else {
            res.status(200).send("Note updated successfully ");
        }
    });
});

// PUT - Toggle a Boolean value

router.put("/toggle/:id", (req, res) => {
    const idNote = req.params.id;

    connection.query("UPDATE notes SET done = NOT done WHERE id = ?", [idNote], (err, results) => {
        if (err) {
            console.log(err);
            res.status(500).send("Error updating a note");
        } else {
            res.status(200).send("Note updated successfully ");
        }
    });
});

// DELETE - Delete an entity

router.delete("/:id", (req, res) => {

    connection.query('DELETE FROM notes WHERE id = ?', [req.params.id], (error, rows, fields) => {
        if (error) {
            console.log(error);
            res.status(500).send("Error deleting a Note");
        }
        else {
            res.status(200).send(" Note deleted!");
        }
    })
})

// DELETE - Delete all entities where boolean value is false

module.exports = router