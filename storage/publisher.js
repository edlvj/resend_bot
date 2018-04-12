var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PublisherSchema = new Schema({
  from_chat: {
    type: Number,
    require: true
  },
  from_chat_type: {
    type: String,
  },
  to_chat: {
    type: Number,
    require: true
  },
  to_chat_type: {
    type: String
  }
},
{
  timestamps: true
});

module.exports = mongoose.model('Publisher', PublisherSchema);