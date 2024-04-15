const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql');

const app = express();
const PORT = 3001;

app.use(bodyParser.json());
app.use(cors());

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123456789',
  database: 'sccinventory'
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Connected to database');
});

// Get all student accounts
app.get('/studentaccount', (req, res) => {
  connection.query('SELECT * FROM studentaccount', (err, results) => {
    if (err) {
      console.error('Error fetching data from database:', err);
      res.status(500).json({ error: 'Error fetching data from database' });
      return;
    }
    res.json(results);
  });
});

// Add a new student account
app.post('/studentaccount', (req, res) => {
  const { username, password } = req.body;
  connection.query('INSERT INTO studentaccount (username, password) VALUES (?, ?)', [username, password], (err, result) => {
    if (err) {
      console.error('Error adding data to database:', err);
      res.status(500).json({ error: 'Error adding data to database' });
      return;
    }
    res.json({ id: result.insertId, username, password });
  });
});

// Update a student account
app.put('/studentaccount/:id', (req, res) => {
  const { id } = req.params;
  const { username, password } = req.body;
  connection.query('UPDATE studentaccount SET username = ?, password = ? WHERE id = ?', [username, password, id], (err, result) => {
    if (err) {
      console.error('Error updating data in database:', err);
      res.status(500).json({ error: 'Error updating data in database' });
      return;
    }
    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Student account not found' });
      return;
    }
    res.json({ id: parseInt(id), username, password });
  });
});

// Delete a student account
app.delete('/studentaccount/:id', (req, res) => {
  const { id } = req.params;
  connection.query('DELETE FROM studentaccount WHERE id = ?', [id], (err, result) => {
    if (err) {
      console.error('Error deleting data from database:', err);
      res.status(500).json({ error: 'Error deleting data from database' });
      return;
    }
    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Student account not found' });
      return;
    }
    res.json({ message: 'Student account deleted' });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
