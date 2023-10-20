const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.static('public'));

app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/assets/js/index.js'))
);

app.get('/api/notes', (req, res) => 
  res.sendFile(path.join(__dirname, '/db/db.json'))  
);

app.post('/api/notes', (req, res) => {
    console.info(`${req.method} request received to submit notes`);
    const { title, text } = req.body;
    if (title && text) {
    const newNote = {
        title,
        text
    };
    readAndAppend(newNote, './db/db.json');
    const response = {
        status: 'success',
        body: newNote,
    };
    res.json(response);
    } else {
    res.json('Error in posting notes');
    }
});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);