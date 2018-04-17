var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var InviteLogSchema = new Schema({
  invited_count: {
    type: Number,
    require: false,
    default: 0
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