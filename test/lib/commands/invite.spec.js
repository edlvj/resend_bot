const assert = require('assert');
const rewire = require('rewire');

let inviteLog = require('./../../../lib/storage/invite_log');
var inviteCommand = rewire('./../../../lib/commands/invite');
const { chats, textMessage } = require('./../../stubs');

const getChats = function() {
  return Promise.resolve(chats);
}

const bot = {
  askKeyboardQuestion: function () {
    textMessage.text = chats[0].title;
    return Promise.resolve(textMessage);
  }
}

const inviteUsers = function() {
  return Promise.resolve(Promise.resolve(0));
}

describe('#invite(msg)', function() {
  inviteCommand.__set__('getChats', getChats);
  inviteCommand.__set__('bot', bot);
  inviteCommand.__set__('inviteUsers', inviteUsers);

  it('return invited count', function(done) {
    inviteCommand().then(invite_count => {
      assert.equal(invite_count, 0);
    });

    done();
  });
});
