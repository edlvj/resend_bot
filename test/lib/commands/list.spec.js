var assert = require('assert');
var rewire = require('rewire');

let { Publisher } = require('./../../../lib/storage');

var listCommand = rewire('./../../../lib/commands/list');
const { chats } = require('./../../stubs');

var getChats = function() {
  return Promise.resolve(chats);
}

describe('#listCommand with publishers', function() {
  listCommand.__set__('getChats', getChats);

  before(function() {
    var publisher = new Publisher({
      to_chat: chats[0].id,
      from_chat_type: chats[0]._,
      from_chat: chats[1].id,
      to_chat_type: chats[1]._
    });

    publisher.save();
  });
  
  it('return one element array', function(done) {
    let subject = listCommand();
    subject.then(publisherList => {
      assert.equal(publisherList[0], chats[1].title +' => ' + chats[0].title);
    });
    
    done();
  });

  after(function() {
    Publisher.remove({}, function() {});
  });
});

describe('#listCommand without publishers', function() {
  listCommand.__set__('getChats', getChats);

  it('return empty array', function(done) {
    let subject = listCommand();
    
    subject.then(publisherList => {
      assert.equal(publisherList.length, 0);
    });
    
    done();
  });
});