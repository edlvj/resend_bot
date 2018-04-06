var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var InviteLogSchema = new Schema({
  user_id: {
    type: String,
    require: true
  },
  from_group_id: {
    type: String,
    require: true
  },
  to_group_id: {
    type: String,
    require: true
  },
},
{
  timestamps: true
});

module.exports = mongoose.model('InviteLog', InviteLogSchema);