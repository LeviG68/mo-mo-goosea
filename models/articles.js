
var mongoose = require("mongoose");

var Note = require("./note");

var Schema = mongoose.Schema;

var ArticleSchema = new Schema({

  Title: {
    type: String,
    trim: true,
  },
  Summary: {
    type: String,
    trim: true,
  },
  URL: {
    type: String,
    trim: true,
    // match: [/.+@.+\..+/, ""]
  },
  Notes: [{
    type: Schema.Types.ObjectId,
    ref: "Note"
  }],
  Date: {
    type: Date,
    default: Date.now
  },
  saved: {
    type: Boolean,
    default: false
  },
  // `date` must be of type Date. The default value is the current date
  userCreated: {
    type: Date,
    default: Date.now
  },
  id: {
    type: Schema.Types.ObjectId
  }
});

var Article = mongoose.model('Article', ArticleSchema);

// Export the User model
module.exports = Article;
