require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const port = process.env.PORT || 3000;
const mongoose = require('mongoose'),
  Schema = mongoose.Schema;
// const encrypt = require('mongoose-encryption');
// const md5 = require('md5');
// const bcrypt = require('bcrypt');
// const saltRounds = 10;
const session = require('express-session');
const passport = require('passport');
const passotLocalMongoose = require('passport-local-mongoose');

const app = express();

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.use(express.static(__dirname + '/public'));
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.use(
  session({
    secret: 'Our little secret.',
    resave: false,
    saveUninitialized: false
  })
);

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect('mongodb://localhost:27017/userDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

mongoose.set('useCreateIndex', true);

const userSchema = new Schema({
  email: String,
  password: String
});

userSchema.plugin(passotLocalMongoose);

// userSchema.plugin(encrypt, {
//   secret: process.env.SECRET,
//   encryptedFields: ['password']
// });

const User = new mongoose.model('User', userSchema);

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.route('/').get(function(req, res) {
  res.render('home');
});

app
  .route('/login')
  .get(function(req, res) {
    res.render('login');
  })
  .post(function(req, res) {
    const user = new User({
      username: req.body.username,
      password: req.body.password
    });

    req.login(user, function(err) {
      if (!err) {
        passport.authenticate('local')(req, res, function() {
          res.redirect('/secrets');
        });
      } else {
        console.log(err);
      }
    });
  });

app
  .route('/register')
  .get(function(req, res) {
    res.render('register');
  })
  .post(function(req, res) {
    User.register({ username: req.body.username }, req.body.password, function(
      err,
      user
    ) {
      if (!err) {
        passport.authenticate('local')(req, res, function() {
          res.redirect('/secrets');
        });
      } else {
        console.log(err);
        res.redirect('/register');
      }
    });
  });

app.route('/secrets').get(function(req, res) {
  if (req.isAuthenticated()) {
    res.render('secrets');
  } else {
    res.redirect('/login');
  }
});

app.route('/logout').get(function(req, res) {
  req.logout();
  res.redirect('/');
});

app.listen(port, function(err) {
  if (!err) {
    console.log('Server is running on port: ' + port);
  } else {
    console.log('Server has issue running');
  }
});
