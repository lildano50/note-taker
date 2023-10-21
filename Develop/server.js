const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 3001;
const app = express();
const { readFromFile, readAndAppend } = require('./helpers/fsUtils');
const uuid = require('./helpers/uuid');

app.use(express.static('public'));

// app.use('/notes', notesRouter);
// const notesRouter = require('/notes')

app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

app.get('/api/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './db/db.json'))
    readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data))) 
});

app.post('/api/notes', (req, res) => {
    console.info(`${req.method} request received to submit notes`);
    const { title, text } = req.body;    
    if (title && text) {
      const newNote = {
        title,
        text,
        feedback_id: uuid(),
      };
    readAndAppend(newNote, './db/db.json');
      const response = {
        status: 'success',
        body: newNote,
      };
      res.json(response);
    } else {
      res.json('Error in posting note');
    }
})


app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);

