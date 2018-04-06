var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PublisherSchema = new Schema({
  from_chat: {
    type: String,
    require: true
  },
  to_chat: {
    type: String,
    require: true
  },
},
{
  timestamps: true
});

module.exports = mongoose.model('Publisher', PublisherSchema);