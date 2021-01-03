const express = require("express");
const router = express.Router();
const connection = require("./connection");

router.get("/", (req, res) => {

    connection.query("SELECT * FROM notes", (error, rows) => {
        if (rows.length === 0) {
            res.status(404).send({ error: "Note not found" });
        } else {
            res.status(200).json(rows[0]);
        }
    })
});

module.exports = router