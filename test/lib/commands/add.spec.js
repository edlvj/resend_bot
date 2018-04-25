var assert = require('assert');
var rewire = require('rewire');

var addCommand = rewire('./../../../lib/commands/add');
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

describe('#add(msg)', function() {
  addCommand.__set__('getChats', getChats);
  addCommand.__set__('bot', bot);

  it('return publisher item', function(done) {

    addCommand(textMessage).then(publisher=> {
      assert.equal(publisher.from_chat, chats[0].id);
      assert.equal(publisher.from_chat_type, chats[0]._);
      assert.equal(publisher.to_chat, chats[0].id);
      assert.equal(publisher.to_chat_type, chats[0]._);
    });
    
    done();
  });
});