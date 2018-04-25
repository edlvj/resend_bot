var assert = require('assert');
var rewire = require('rewire');

var authCommand = rewire('./../../../lib/commands/auth');
const { chats, textMessage } = require('./../../stubs');

const bot = {
  askQuestion: function () {
    textMessage.text = chats[0].title;
    return Promise.resolve(textMessage);
  }
}

const sendCode = function() {
  return Promise.resolve('secret');
};

const signIn = function() {
  return Promise.resolve({ first_name: "ed" });
};

describe('#auth(msg)', function() {
  authCommand.__set__('sendCode', sendCode);
  authCommand.__set__('signIn', signIn);
  authCommand.__set__('bot', bot);

  it('return publisher item', function(done) {
    authCommand(textMessage).then(user => {
      assert.equal(user.first_name, "ed");
      console.log(user);
    });
    done();
  });
});

