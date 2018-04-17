var mongoose = require('mongoose');
let { inviteLog } = require('./../../storage');
let { DatabasebUrlTest } = require('./../../config');

var simple = require('simple-mock');
const expect = require('chai').expect;
var assert = require('assert');
const sinon = require('sinon');

let chai = require('chai');
let should = chai.should();
var rewire = require('rewire');

var resend_bot = rewire('./../../lib/methods');

var getFullChat = function() {
  return Promise.resolve(chatFull);
}

var getParticipants = function() {
  return Promise.resolve(groupParticipants);
}

describe('#getInfoFromGroup(chat, limit)', function() {
  it('return messages.chatFull', function(done) {
    resend_bot.__set__('getFullChat', getFullChat);
    
    var group = {
      _: 'chat',
      id: 261891709,
      title: 'test_donor',
      access_hash: '13695491023331794763'
    };
    
    resend_bot.getInfoFromGroup(group).then(data => {
      assert.equal(data, chatFull);
    });

    done();
  });

  it('return channel.getParticipants', function(done) {
   resend_bot.__set__('getParticipants', getParticipants);

    var group = {
      _: 'channel',
      megagroup: true,
      id: 1306756382,
      title: 'test_recepient',
      access_hash: '10248616973597418046'
    };

    resend_bot.getInfoFromGroup(group).then(data => {
      assert.equal(data, groupParticipants);
    });

    done();
  });

  it('return "Wrong chat type"', function(done) {
    var group = {
      _: 'channel',
      id: 1288542867,
      title: 'Spring',
      access_hash: '16549133652192072430'
    };
    
    resend_bot.getInfoFromGroup(group).catch(err => {
      assert.equal(err.message, 'Wrong chat type');
    });
    
    done();
  });  
});

var statedMessage = {
  _: 'messages.statedMessage', 
  message: {}, 
  chats: [], 
  users: []
}

var addChatUser = function() {
  return Promise.resolve(statedMessage); 
}

var inviteToChannel = function() {
  return Promise.resolve(inviteUpdate);
}

describe('#inviteUserToGroup(chat, user)', function() {
  it('return addChatUser', function(done) {
    resend_bot.__set__('addChatUser', addChatUser);
    
    var group = {
      _: 'chat',
      id: 261891709,
      title: 'test_donor',
      access_hash: '13695491023331794763'
    };

    var user = {
      _: 'user',
      id: 205082226,
      access_hash: '17709050571483037776',
      first_name: 'Not',
      last_name: 'Jew'
    };
    
    resend_bot.inviteUserToGroup(group, user).then( data => {
      assert.equal(data, statedMessage);
    });
    done();
  });


  it('return inviteToChannel', function(done) {
    resend_bot.__set__('inviteToChannel', inviteToChannel);
    
    var group = {
      _: 'channel',
      megagroup: true,
      id: 1306756382,
      title: 'test_recepient',
      access_hash: '10248616973597418046'
    };

    var user = {
      _: 'user',
      id: 205082226,
      access_hash: '17709050571483037776',
      first_name: 'Not',
      last_name: 'Jew'
    };
    
    resend_bot.inviteUserToGroup(group, user).then( data => {
      assert.equal(data, inviteUpdate);
    });

    done();
  });

  it('return "Wrong chat type"', function(done) {
    var group = {
      _: 'channel',
      id: 1306756382,
      title: 'test_recepient',
      access_hash: '10248616973597418046'
    };

    var user = {
      _: 'user',
      id: 205082226,
      access_hash: '17709050571483037776',
      first_name: 'Not',
      last_name: 'Jew'
    };
    
    resend_bot.inviteUserToGroup(group, user).catch(err => {
      assert.equal(err.message, 'Wrong chat type');
    });

    done();
  });
});

var from_chat = { 
  _: 'chat',
  id: 261891709,
  users: [ { _: 'user',
      flags: 49163,
      bot: true,
      bot_chat_history: true,
      id: 568749233,
      access_hash: '1230322078890418370'
    },
    { _: 'user',
      flags: 1115,
      self: true,
      id: 515052296,
      access_hash: '6426139655203301871',
      first_name: 'test'
    },
    { _: 'user',
      flags: 2143,
      contact: true,
      id: 205082226,
      access_hash: '17709050571483037776',
      first_name: 'test',
      last_name: 'test'
    }, 
    { _: 'user',
      flags: 2143,
      contact: true,
      id: 0300303003,
      access_hash: '1770905323483037776',
      first_name: 'test',
      last_name: 'test'
    }
  ]  
};

var to_chat = {
  _: 'chat',
  id: 261891710,
  chats: [],
  users: [ 
    { _: 'user',
      flags: 49163,
      bot: true,
      bot_chat_history: true,
      id: 568749233,
      access_hash: '1230322078890418370'
  }]
};  

var getInfoFromGroup = function(id) {
  return Promise.resolve(from_chat);
}

var inviteUserToGroup = function() {
  return inviteToChannel;
}

describe('#inviteUsers(from, to)', function() {
  before(function(done) {
    db = mongoose.connect(DatabasebUrlTest);
    done();
  });

  after(function(done) {
    mongoose.connection.close();
    done();
  });

  it('when inviteLog execept', done => {
    resend_bot.__set__('getInfoFromGroup', getInfoFromGroup);
    resend_bot.__set__('inviteUserToGroup', inviteUserToGroup);

    resend_bot.inviteUsers(from_chat, to_chat).then(data => {
      assert.equal(data, 2);
    });

    done();
  }); 

  // it('it saves log to db', function(done) { 


  // });

  // it('when inviteLog present', function(done) {
  // });



  // afterEach(function(done) {
  //  console.log(inviteLog);
  //   inviteLog.remove({}, function() {
  //     done();
  //   });
  // });
});