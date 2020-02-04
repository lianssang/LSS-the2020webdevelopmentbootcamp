//jshint esversion:6

const express = require('express');
const bodyParser = require('body-parser');
const date = require(__dirname + '/date.js');
const mongoose = require('mongoose');
const _ = require('lodash');

const app = express();

app.set('view engine', 'ejs');

app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(express.static('public'));

// database connection
mongoose.connect('mongodb://localhost:27017/todolistDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// database schema for item
const itemSchema = {
  name: String
};

// database schema for list
const listSchema = {
  name: String,
  items: [itemSchema]
};

const Item = mongoose.model('Item', itemSchema);

const List = mongoose.model('List', listSchema);

// initial items for item schema
const item1 = new Item({
  name: 'Welcome to your to do list!'
});

const item2 = new Item({
  name: 'Hit the + button to add a new item.'
});

const item3 = new Item({
  name: '<-- Hit this to delete an item.'
});

const defaultItems = [item1, item2, item3];

app.get('/', function (req, res) {
  // find all query from Item collection
  Item.find({}, function (err, found) {
    if (err) {
      // if encounter error, log error
      console.log(err);
    } else {
      // if item array is empty
      if (found.length === 0) {
        // insert the initial/default items
        Item.insertMany(defaultItems, function (err) {
          if (err) {
            // if encounter error, log error
            console.log(err);
          } else {
            // if else then log item is inserted
            console.log('Items have been inserted to DB.');
          }
          // after inserting redirect/refresh the page
          res.redirect('/');
        });
      } else {
        // if item is found is not empty, render the page
        res.render('list', {
          listTitle: 'Today',
          newListItems: found
        });
      }
    }
  });
});

app.post('/', function (req, res) {
  // request values from body
  const itemName = req.body.newItem;
  const listName = req.body.list;

  // a constance of newItem for schema
  const newItem = new Item({
    name: itemName
  });

  // if post is from default action
  if (listName === 'Today') {
    // add new items
    newItem.save();
    // redirect/refresh to default page
    res.redirect('/');
  } else {
    // if post is from custom action then find new page
    List.findOne({
        name: listName
      },
      function (err, found) {
        // if encounter error, log error
        if (err) {
          console.log(err);
        } else {
          // add newItem to the items of callback
          found.items.push(newItem);
          // save db
          found.save();
          // redirect/refresh to according custom page
          res.redirect('/' + listName);
        }
      }
    );
  }
});

app.post('/delete', function (req, res) {
  // request values from body
  const checkBoxItemId = req.body.checkbox;
  const listName = req.body.listName;

  // if on default page
  if (listName === 'Today') {
    // use find by Id to remove clicked checkbox item
    Item.findByIdAndRemove(checkBoxItemId, function (err) {
      if (err) {
        // if encounter error, log error
        console.log(err);
      } else {
        // if succeed, log deleted
        console.log('Item is deleted.');
      }
      // redirect/refresh to default page
      res.redirect('/');
    });
  } else {
    // use find one and update method
    List.findOneAndUpdate({
        name: listName
      }, {
        // use $pull to pull out (delete) a certain the id number of certain name
        $pull: {
          items: {
            _id: checkBoxItemId
          }
        }
      },
      function (err, found) {
        // if encounter error, log error
        if (err) {
          console.log(err);
        } else {
          // redirect/refresh to according custom page
          res.redirect('/' + listName);
        }
      }
    );
  }
});

app.get('/:customListName', function (req, res) {
  // request value from params
  // use lodash to capitalize the first letter of the word of custom page
  const customListName = _.capitalize(req.params.customListName);

  // find one method to find according custom page requested
  List.findOne({
      name: customListName
    },
    function (err, found) {
      // if encounter error, log error
      if (err) {
        console.log(err);
      } else {
        // if custom page is not found in list then create one
        if (!found) {
          // log that requested custom page on list doesn't not 
          console.log(customListName + ": doesn't exist.");

          // creating a new list for requested custom page
          const newList = new List({
            name: customListName,
            items: defaultItems
          });

          // save db
          newList.save();

          // redirect/refresh to according custom page
          res.redirect('/' + customListName);
        }
        // if custom page is found on list then render it
        else {
          // rendering the requested custom page with list
          res.render('list', {
            listTitle: found.name,
            newListItems: found.items
          });
        }
      }
    }
  );
});

// get about page
app.get('/about', function (req, res) {
  // render about page with about ejs
  res.render('about');
});

// listen to server
app.listen(3000, function () {
  // log server is running
  console.log('Server started on port 3000');
});