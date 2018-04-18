const expect = require('chai').expect;
var assert = require('assert');

var rewire = require('rewire');

let { Publisher } = require('./../../../lib/storage');

let list = rewire('./../../../lib/commands/list');
const { chats } = require('./../../stubs');

var getChats = function() {
  return Promise.resolve(chats);
}

describe('#list', function() {
  list.__set__('getChats', getChats);

  before(function(done) {
    var publisher = new Publisher({
      to_chat_id: chats[0].id,
      from_chat_type: chats[0]._,
      from_chat_id: chats[1].id,
      to_chat_type: chats[1]._
    });

    publisher.save(function(error) {
      if(error) 
        console.log('error' + error.message);
    });
    done();
  });
  
  it('return empty array', function(done) {
    console.log(list);
    list.then(publishers => {
      expect.equal(publishers, []);
    });
    
    done();
  });

  // it('return array', function(done) {
  //   expect.equal(list, );
  //   done();
  // });

  after(function(done) {
    Publisher.remove({}, function() {
      done();
    });
  });
});