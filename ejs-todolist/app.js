const express = require('express');
const bodyParser = require('body-parser');
const port = 3000;

const date = require(__dirname + '/date.js');

const app = express();

let items = ['Buy Food', 'Prepare Food', 'Eat Food'];
let workItems = [];

app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

// app.use(express.static(__dirname + '/public'));

app.use('/css', express.static(__dirname + '/public/css/'));

app.set('views', __dirname + '/public/views');
app.set('view engine', 'ejs');

app.get('/', function (req, res) {

  let day = date.getDate();

  res.render('list', {
    listTitle: day,
    newListItems: items
  });
});

app.get('/work', function (req, res) {
  res.render('list', {
    listTitle: 'Work List',
    newListItems: workItems
  });
});

app.get('/about', function (req, res) {
  res.render('about');
});

app.post('/', function (req, res) {
  // console.log(req.body);
  let item = req.body.newItem;

  if (req.body.list === 'Work') {
    workItems.push(item);
    res.redirect('/work');
  } else {
    items.push(item);
    res.redirect('/');
  }
});

app.listen(port, function () {
  console.log('Listening on port 3000.');
});