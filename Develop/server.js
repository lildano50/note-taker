const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.static('public'));

app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/assets/js/index.js'))
);

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);