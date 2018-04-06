var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var InviteLogSchema = new Schema({
  user_id: {
    type: String,
    require: true
  },
  user_name: {
    type: String,
    require: true
  },
  from_chat_id: {
    type: String,
    require: true
  },
  to_chat_id: {
    type: String,
    require: true
  },
},
{
  timestamps: true
});

module.exports = mongoose.model('InviteLog', InviteLogSchema);