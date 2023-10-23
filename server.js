const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 3001;
const app = express();
const uuid = require('./helpers/uuid');
const notes = require('./db/db.json');
const fs = require('fs').promises;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));


app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

app.get('/api/notes', (req, res) => {
    res.json(notes);
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

      fs.readFile("./db/db.json", "utf-8")
      .then( notes => {
        const parsedNotes = JSON.parse(notes)
        parsedNotes.push(newNote)
        return JSON.stringify(parsedNotes, null, 2);
      })
      .then((updatedNote) => {
        return fs.writeFile("./db/db.json", updatedNote)
      })
      .then( err => {
        if (!err) {
          console.log("note added");
        } else {
          console.log("error adding note")
        }
      });
    // Convert the data to a string so we can save it
    const noteString = JSON.stringify(newNote, null);
    fs.appendFile(`./db/db.json`, noteString).then((err) => {
      err ? console.error(err) : console.log(`Successfully updated notes!`);
    });

    const response = {
      status: 'success',
      body: newNote,
    };

    console.log(response);
    res.status(201).json(response);
  } else {
    res.status(500).json('Error in posting note');
  }
})


app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);

