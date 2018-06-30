// use express for routes
var express = require("express");
var mongojs = require("mongojs");

// requiring Body-parser for, parse incoming request bodies in a middleware before your handlers
var bodyParser = require("body-parser");
// requiring Morgan for loggin "dev", concise output colored by response status for development use. Status: token will color red= server error, yellow= client error, cyan= redirection code and uncolored= for all other code.
var logger = require("morgan");
// Require mongoose for object modeling tool, designed to work in an asynchronous env
var mongoose = require("mongoose");
// Require request and cheerio. This makes the scraping possible
// Request is used in part with Cheerio to do a webscrape, but we are using Axios for our scrape on this project.
var request = require("request");
var cheerio = require("cheerio");

// Requiring Axios for scraping our site, it is a Promised based HTTP client for the brouser and node.js. it makes HTTP requests from node.js, intercepts req, and response, transform req, res data and automatic transforms for JSON data.
var axios = require("axios");

// Initialize Express, 
var app = express();

var Article = require("./models/articles");
var Note = require("./models/note");


// look at the notes for Morgan Logger above.
app.use(logger("dev"));

// Body-parser extended, the extended option allows to choose betwwen parsing the URL-endcoded data with the querystring, when TRUE the exteded syntax allows for rich objectes and arrays to be encoded into the URL-encoed format, allowing for JSON like sxperience with URL encoded.
app.use(bodyParser.urlencoded({extended: true}));

// 
app.use(express.static("public"));

var db = require("./models");


var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");


mongoose.Promise = Promise;

// if you ar only useing one database, use  the mongoose.connect 
var databaseUri = mongoose.connect("mongodb://localhost/newsScrape");
var PORT = process.env.PORT || 3000;

if(process.env.MONGODB_URI) {

  mongoose.connect(process.env.MONGODB_URI);
}else {
  mongoose.connect(databaseUri);
}

// Database configuration
// var databaseUrl = "newsScrape";
// var collections = ["Articles"];

// var db = mongojs(databaseUrl, collections);
// db.on('error', function(error){
//   console.log('Database Error', error);
// })

app.get('/', function(req, res){
  res.send('Yep this works!');
});

app.get("/all", function(req, res) {

  db.Articles.find({})
  .then(function(dbArticle) {
    // If we were able to successfully find Articles, send them back to the client
    res.json(dbArticle);
  })
  .catch(function(err) {
    // If an error occurred, send it to the client
    res.json(err);
  });
  // db.Articles.find({}, function(error, found) {
  //   if (error) {
  //     console.log(error);
  //   }
  //   else {
  //     res.json(found);
  //   }
  // });
});

app.get("/scrape", function(req, res) {

  axios.get("http://www.echojs.com/").then(function(response) {
    // console.log(response);
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(response.data);

    // Now, we grab every h2 within an article tag, and do the following:
    const resultsArr = [];
    $("article h2").each(function(i, element) {
      // Save an empty result object
       var result = {};
      // Add the text and href of every link, and save them as properties of the result object
      result.title = $(this)
        .children("a")
          .text();

      result.link = $(this)
        .children("a")
          .attr("href");

      if (result.title && result.link) {
        resultsArr.push(result);
         db.Articles.create({
          Title: result.title,
          URL: result.link
        })
        .then(function(dbArticle) {
          // View the added result in the console
          console.log(dbArticle);
          res.json(dbArticle);
        })
        .catch(function(err) {
          // If an error occurred, send it to the client
          return res.json(err);
        });
      }
    });
    //res.status(200).json({ scrapeResults: resultsArr });
  });
  console.log('Done!!!!');
});

app.get("/article", function(req, res) {
  db.Articles.find({})
  .then(function(dbArticle) {
    // If we were able to successfully find Articles, send them back to the client
  //  res.send("hello");
    res.render("home", {Articles: dbArticle});
  })
  .catch(function(err) {
    // If an error occurred, send it to the client
    res.json(err);
  });
  
});

app.delete("/article/:id", function(req, res) {
  // this route should delete a contact from the table, if the id matches the ':id' url param
  db.Articles.delete({"_id": req.params.id})
  exec(function (err, doc) {
    if (err) {
      console.log(err);
    } else {
      res.send(doc);
    }
  });
});

app.listen(PORT, function() {
  console.log("App running on port 3000!");
})