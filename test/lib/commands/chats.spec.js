var assert = require('assert');
var rewire = require('rewire');

var chatsCommand = rewire('./../../../lib/commands/chats');
const { chats } = require('./../../stubs');

const getChats = function() {
  return Promise.resolve(chats);
}

describe('#chatsCommand return titles', function() {
  chatsCommand.__set__('getChats', getChats);

  it('return titles array', function(done) {
    chatsCommand().then(chatList => {
      assert.equal(chats[0].title, chatList[0]);
    });
    
    done();
  });
});