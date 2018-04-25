const assert = require('assert');
const rewire = require('rewire');

let Publisher = require('./../../../lib/storage/publisher');
var dropCommand = rewire('./../../../lib/commands/drop');
const { chats, textMessage } = require('./../../stubs');

const getChats = function() {
  return Promise.resolve(chats);
}

const bot = {
  askKeyboardQuestion: function () {
    textMessage.text = chats[1].title + ' => ' + chats[0].title;
    return Promise.resolve(textMessage);
  }
}

describe('#drop(msg)', function() {
  dropCommand.__set__('getChats', getChats);
  dropCommand.__set__('bot', bot);

  before(function(done) {
    var publisher = new Publisher({
      to_chat: chats[0].id,
      from_chat_type: chats[0]._,
      from_chat: chats[1].id,
      to_chat_type: chats[1]._
    });

    publisher.save(function(error) {
      if (error) console.log('error' + error.message);
    })
    done();
  });

  it('return publisher item', function(done) {
    dropCommand().then(drop => {
      assert.equal(drop.ok, 1);
    });

    done();
  });

  after(function(done) {
    Publisher.remove().then(data =>{
      console.log(data);
      done();
    });
    
    
  });
});