const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "bubbles6",
    database: "studyplanner"
});

db.connect(err => {
    if (err) {
        console.log("DB connection error:", err);
    } else {
        console.log("Connected to DB");
    }
});

app.post("/plan", (req, res) => {
    const { subjects, hours } = req.body;

    const count = subjects.length;
    const timePerSubject = (hours / count).toFixed(1);

    let result = "";

    subjects.forEach(sub => {
        result += `${sub.trim()} → ${timePerSubject} hrs\n`;
    });

    result += "\nTip: Take 10 min breaks every hour.";

    const sql = "INSERT INTO plans (subjects, hours, plan) VALUES (?, ?, ?)";
    db.query(sql, [subjects.join(","), hours, result]);

    res.send(result);
});

app.listen(3000, () => console.log("Server running on port 3000"));