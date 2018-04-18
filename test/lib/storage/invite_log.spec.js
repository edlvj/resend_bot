var mongoose = require('mongoose');
let inviteLog = require('./../../../lib/storage/invite_log');
var config = require('./../../../lib/config');
const expect = require('chai');

describe('InviteLog', function() {

  before(function(done) {
    var iLog = new inviteLog({
      to_chat_id: 1234,
      from_chat_id: 1232,
    });

    iLog.save(function(error) {
      if (error) console.log('error' + error.message);
    });
    done();
  });

  after(function(done) {
    inviteLog.remove({}, function() {   
    });
    done();
  });

  it('return array', function(done) {
    inviteLog.find({}, function(err, invitelogs) {
      console.log(invitelogs);
      expect(invitelogs).to.be.an('array');
    });
    done();
  });
});