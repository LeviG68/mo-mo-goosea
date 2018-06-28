// require mongoose
var mongoose = require("mongoose");

//  create a schema class
var Schema = mongoose.Schema;

// create the Note Schema
var noteSchema = new Schema({
  body: {
    type: String
  },
  article: {
    type: Schema.Types.ObjectId,
    ref: "Article"
  }
});

// creat the note model with the noteSchema
var Note = mongoose.model("Note", noteSchema);

// export the note model
module.exports = Note;

