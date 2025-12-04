const express = require('express');
const cors = require('cors');
const fs = require('fs');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const DB_FILE = './chalkboard.txt';

app.get('/api/chalkboard', (req, res) => {
  fs.readFile(DB_FILE, 'utf8', (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') {
        return res.json({ text: '' });
      }
      return res.status(500).json({ error: 'Failed to read chalkboard data' });
    }
    res.json({ text: data });
  });
});

app.post('/api/chalkboard', (req, res) => {
  const { text } = req.body;
  if (typeof text !== 'string') {
    return res.status(400).json({ error: 'Invalid chalkboard text' });
  }
  fs.writeFile(DB_FILE, text, 'utf8', (err) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to save chalkboard data' });
    }
    res.json({ success: true });
  });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
