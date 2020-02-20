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
const passportLocalMongoose = require('passport-local-mongoose');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate = require('mongoose-findorcreate');

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
    secret: process.env.SECRET,
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
  password: String,
  googleId: String
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

// userSchema.plugin(encrypt, {
//   secret: process.env.SECRET,
//   encryptedFields: ['password']
// });

const User = new mongoose.model('User', userSchema);

passport.use(User.createStrategy());

passport.serializeUser(function(user, done) {
  done(null, user.id);
});
passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/auth/google/secrets',
      userProfileURL: 'https://www.googleapis.com/oauth2/v3/userinfo'
    },
    function(accessToken, refreshToken, profile, cb) {
      console.log(profile);
      User.findOrCreate({ googleId: profile.id }, function(err, user) {
        return cb(err, user);
      });
    }
  )
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

app
  .route('/auth/google')
  .get(passport.authenticate('google', { scope: ['profile'] }));

app
  .route('/auth/google/secrets')
  .get(passport.authenticate('google', { failureRedirect: '/login' }), function(
    req,
    res
  ) {
    res.redirect('/secrets');
  });

app.listen(port, function(err) {
  if (!err) {
    console.log('Server is running on port: ' + port);
  } else {
    console.log('Server has issue running');
  }
});
