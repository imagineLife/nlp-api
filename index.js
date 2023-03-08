const express = require("express");
const app = express();
const path = require('path');

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => res.status(200).send('init'))
app.get('/healthz', (req, res) => res.status(200).send('healthy'));

app.listen(PORT, () => {
  console.log(`API is listening on ${PORT}`);
});
