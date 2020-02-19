const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose'),
  Schema = mongoose.Schema;
const ejs = require('ejs');

const port = process.env.PORT || 3000;

const app = express();

app.set('view engine', 'ejs');
app.set('views', __dirname + '/public/views');

mongoose.connect('mongodb://localhost:27017/wikiDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const articleSchema = Schema({
  title: String,
  content: String
});

const Article = mongoose.model('Article', articleSchema);

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({
  extended: true
}));

// route for /articles
app
  .route('/articles')
  .get(function (req, res) {
    Article.find({}, function (err, foundArticles) {
      if (!err) {
        res.send(foundArticles);
      } else {
        res.send(err);
      }
    });
  })
  .post(function (req, res) {
    const article = new Article({
      title: req.body.title,
      content: req.body.content
    });

    article.save(function (err) {
      if (!err) {
        console.log('The following article has been saved:');
        console.log(req.body.title + '\n' + req.body.content);
      } else {
        console.log(err);
      }
    });

    res.redirect('/articles');
  })
  .delete(function (req, res) {
    Article.deleteMany({}, function (err) {
      if (!err) {
        res.send('Successfully deleted all the articles!');
      } else {
        res.send(err);
      }
    });
  });

app.route('/articles/:articleTitle').get(function (req, res) {
  Article.findOne({
    title: req.params.articleTitle
  }, function (
    err,
    foundArticle
  ) {
    if (!err) {
      if (foundArticle) {
        res.send(foundArticle);
      } else {
        res.send('No article was found.');
      }
    } else {
      res.send(err);
    }
  });
}).put(function (req, res) {
  Article.update({
    title: req.params.articleTitle
  }, {
    title: req.body.title,
    content: req.body.content
  }, {
    overwrite: true
  }, function (err) {
    if (!err) {
      res.send('Successfully updated the requested article.');
    } else {
      res.send(err);
    }
  })
}).patch(function (req, res) {
  Article.update({
    title: req.params.articleTitle
  }, {
    $set: req.body
  }, function (err) {
    if (!err) {
      res.send('Successfully updated the specific requested article information.');
    } else {
      res.send(err);
    }
  });
}).delete(function (req, res) {
  Article.deleteOne({
    title: req.params.articleTitle
  }, function (err) {
    if (!err) {
      res.send('Successfully deleted the specified article.');
    } else {
      res.send(err);
    }
  });
});

app.listen(port, function (err) {
  if (!err) {
    console.log('Server is running on port: ' + port);
  } else {
    console.log('Server is having issue running.');
  }
});