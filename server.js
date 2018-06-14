
var express = require("express");
var mongojs = require("mongojs");
// Require request and cheerio. This makes the scraping possible
var request = require("request");
var cheerio = require("cheerio");
var axios = require("axios");

// Initialize Express
var app = express();

app.use(express.static("public"));

// Database configuration
var databaseUrl = "scraper";
var collections = ["scrapedData"];

var db = mongojs(databaseUrl, collections);
db.on('error', function(error){
  console.log('Database Error', error);
})

app.get('/', function(req, res){
  res.send('Yep this works!');
});

app.get("/all", function(req, res) {

  db.scrapedData.find({}, function(error, found) {
    if (error) {
      console.log(error);
    }
    else {
      res.json(found);
    }
  });
});

app.get("/scrape", function(req, res) {
  var link = "";
  var title = "";
  axios.get("http://www.echojs.com/").then(function(response) {
    console.log("working");
    var $ = cheerio.load(response.data);

    $('article h2').each(function(i, element){

      var title = $(this).children("a").text();
      console.log(title);
      // var link = $(this).children('h').attr('href');
      // console.log(link);

      if (title && link) {
        db.headlines.insert({
          title: title,
          link: link
        },
        function (err, inserted) {
          if (err) {
            console.log(err);

          } 
          else {
            console.log(inserted);
          }
        });
      }
    });
  });
  res.send("Scrape Complete: " + title);
});
//   scrapedData.find({}, function(error, found) {

//     if (error) {
//       console.log(error);
//     }
//     else{
//       res.json(found);
//     }
//   });
// });

app.listen(3000, function() {
  console.log("App running on port 3000!");
})