const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();
//const connection = require("./connection");


const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
    res.send("Hello World!");
});


app.use("/api/notes", require("./routeNote.js"));

const PORT = process.env.PORT || 5000;

app.listen(5000, (err) => {
    if (err) {
        throw new Error(`An error occurred: ${err.message}`);
    }
    console.log(`Server is listening on ${PORT}`);
});