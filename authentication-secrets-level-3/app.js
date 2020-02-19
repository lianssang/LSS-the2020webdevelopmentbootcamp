require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const port = process.env.PORT || 3000;
const mongoose = require('mongoose'),
  Schema = mongoose.Schema;
// const encrypt = require('mongoose-encryption');
const md5 = require('md5');

const app = express();

mongoose.connect('mongodb://localhost:27017/userDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const userSchema = new Schema({
  email: String,
  password: String
});

// userSchema.plugin(encrypt, {
//   secret: process.env.SECRET,
//   encryptedFields: ['password']
// });

const User = new mongoose.model('User', userSchema);

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.use(express.static(__dirname + '/public'));
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.route('/').get(function(req, res) {
  res.render('home');
});

app
  .route('/login')
  .get(function(req, res) {
    res.render('login');
  })
  .post(function(req, res) {
    const username = req.body.username;
    const password = md5(req.body.password);

    User.findOne(
      {
        email: username
      },
      function(err, foundUser) {
        if (!err) {
          if (foundUser) {
            console.log('Username is match.');
            console.log(foundUser);
            if (foundUser.password === password) {
              console.log('Username and password is match.');
              res.render('secrets');
            } else {
              console.log('Username and password is not match.');
              res.redirect('/login');
            }
          } else {
            console.log('Username is not found.');
            res.redirect('/login');
          }
        } else {
          console.log(err);
          res.redirect('/login');
        }
      }
    );
  });

app
  .route('/register')
  .get(function(req, res) {
    res.render('register');
  })
  .post(function(req, res) {
    const newUser = new User({
      email: req.body.username,
      password: md5(req.body.password)
    });

    newUser.save(function(err) {
      if (!err) {
        console.log('New user has been registered successfully.');
        res.render('secrets');
      } else {
        console.log(err);
        res.redirect('/register');
      }
    });
  });

app.listen(port, function(err) {
  if (!err) {
    console.log('Server is running on port: ' + port);
  } else {
    console.log('Server has issue running');
  }
});
