const app = require('express')();


app.get('/', (req, res) => {
  res.status(200).send("We're Online");
});

const server = require('./server')(app);
