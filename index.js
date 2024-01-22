const express = require('express')
const app = express()
const ejs = require('ejs')
const port = 3000
const path = require('path');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine','ejs');
app.use(express.static(path.join(__dirname, 'public')));

const entryRouter = require('./routes/entry.js');

app.use('/',entryRouter);

app.get('/', (req, res) => {
  res.render('calender');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});
