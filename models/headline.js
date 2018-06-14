require = require("moongoose");

var Schema = mongoose.Schema:

var UsedSchema = new Schema({

  headline: {
    type: String,
    trim: true,
  },
  link: {
    type: String,
    trim: true,
  },
  URL: {
    type: String,
    trim: true,
    match: [/.+@.+\..+/, ""]
  },
  
  // `date` must be of type Date. The default value is the current date
  userCreated: {
    type: Date,
    default: Date.now
  }
});

var Headlines = mongoose.model('Headlines', UserSchema);

// Export the User model
module.exports = Headline;
