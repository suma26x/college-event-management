const express = require('express');
const mysql = require('mysql2');
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'YOUR_MYSQL_PASSWORD',
    database: 'collegeeventdb'
});

// Database Connection
db.connect((err) => {
    if (err) {
        console.log("Database Connection Failed:", err.message);
        return;
    }
    console.log("Database Connected Successfully!");
});

// Home Page
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// Insert Event
app.post('/insert', (req, res) => {
    const d = req.body;

    const sql = `INSERT INTO events
    (event_id, event_name, event_date, venue, organizer)
    VALUES (?, ?, ?, ?, ?)`;

    db.query(sql, [
        d.event_id,
        d.event_name,
        d.event_date,
        d.venue,
        d.organizer
    ], (err) => {
        if (err) {
            return res.send("Insert Error: " + err.message);
        }
        res.send("Event Inserted Successfully!");
    });
});

// View Events
app.get('/events', (req, res) => {
    db.query("SELECT * FROM events", (err, result) => {
        if (err) {
            return res.send("View Error: " + err.message);
        }
        res.json(result);
    });
});

// Update Event
app.post('/update', (req, res) => {
    const d = req.body;

    const sql = `UPDATE events
    SET event_name=?, event_date=?, venue=?, organizer=?
    WHERE event_id=?`;

    db.query(sql, [
        d.event_name,
        d.event_date,
        d.venue,
        d.organizer,
        d.event_id
    ], (err, result) => {
        if (err) {
            return res.send("Update Error: " + err.message);
        }
        res.send(result.affectedRows
            ? "Event Updated Successfully!"
            : "Event ID Not Found!");
    });
});

// Delete Event
app.post('/delete', (req, res) => {
    db.query(
        "DELETE FROM events WHERE event_id=?",
        [req.body.event_id],
        (err, result) => {
            if (err) {
                return res.send("Delete Error: " + err.message);
            }
            res.send(result.affectedRows
                ? "Event Deleted Successfully!"
                : "Event ID Not Found!");
        }
    );
});

// Start Server
app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});