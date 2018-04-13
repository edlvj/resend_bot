var mongoose = require('mongoose');
const { DatabasebUrl } = require('./../config');

var Publisher = require('./publisher');
var inviteLog = require('./invite_log');

mongoose.connect(DatabasebUrl, function(err) {
  if (err) {
    console.error('connect to %s error: ', DatabasebUrl, err.message);
    process.exit(1);
  }
});

module.exports = {
  Publisher,
  inviteLog
}