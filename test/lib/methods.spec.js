var mongoose = require('mongoose');
let { inviteLog } = require('./../../lib/storage');
let { DatabasebUrlTest } = require('./../../lib/config');

const expect = require('chai').expect;
var assert = require('assert');
var rewire = require('rewire');
var methods = rewire('./../../lib/methods');

const { chatFull, groupParticipants, statedMessage, inviteUpdate} = require('./../stubs');

var getFullChat = function() {
  return Promise.resolve(chatFull);
}

var getParticipants = function() {
  return Promise.resolve(groupParticipants);
}

describe('#getInfoFromGroup(chat, limit)', function() {
  it('return messages.chatFull', function(done) {
    methods.__set__('getFullChat', getFullChat);
    
    let group = {
      _: 'chat',
      id: 261891709,
      title: 'test_donor',
      access_hash: '13695491023331794763'
    };
    
    methods.getInfoFromGroup(group).then(data => {
      assert.equal(data, chatFull);
    });

    done();
  });

  it('return channel.getParticipants', function(done) {
   methods.__set__('getParticipants', getParticipants);

    let group = {
      _: 'channel',
      megagroup: true,
      id: 1306756382,
      title: 'test_recepient',
      access_hash: '10248616973597418046'
    };

    methods.getInfoFromGroup(group).then(data => {
      assert.equal(data, groupParticipants);
    });

    done();
  });

  it('return "Wrong chat type"', function(done) {
    let group = {
      _: 'channel',
      id: 1288542867,
      title: 'Spring',
      access_hash: '16549133652192072430'
    };
    
    methods.getInfoFromGroup(group).catch(err => {
      assert.equal(err.message, 'Wrong chat type');
    });
    
    done();
  });  
});

var addChatUser = function() {
  return Promise.resolve(statedMessage); 
}

var inviteToChannel = function() {
  return Promise.resolve(inviteUpdate);
}

describe('#inviteUserToGroup(chat, user)', function() {
  it('return addChatUser', function(done) {
    methods.__set__('addChatUser', addChatUser);
    
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
    
    methods.inviteUserToGroup(group, user).then( data => {
      assert.equal(data, statedMessage);
    });
    done();
  });


  // it('return inviteToChannel', function(done) {
  //   methods.__set__('inviteToChannel', inviteToChannel);
    
  //   var group = {
  //     _: 'channel',
  //     megagroup: true,
  //     id: 1306756382,
  //     title: 'test_recepient',
  //     access_hash: '10248616973597418046'
  //   };

  //   var user = {
  //     _: 'user',
  //     id: 205082226,
  //     access_hash: '17709050571483037776',
  //     first_name: 'Not',
  //     last_name: 'Jew'
  //   };
    
  //   methods.inviteUserToGroup(group, user).then( data => {
  //     assert.equal(data, inviteUpdate);
  //   });

  //   done();
  // });

  // it('return "Wrong chat type"', function(done) {
  //   var group = {
  //     _: 'channel',
  //     id: 1306756382,
  //     title: 'test_recepient',
  //     access_hash: '10248616973597418046'
  //   };

  //   var user = {
  //     _: 'user',
  //     id: 205082226,
  //     access_hash: '17709050571483037776',
  //     first_name: 'Not',
  //     last_name: 'Jew'
  //   };
    
  //   methods.inviteUserToGroup(group, user).catch(err => {
  //     assert.equal(err.message, 'Wrong chat type');
  //   });

  //   done();
  // });
});

var from_mega_group = { 
  _: 'channel',
  id: 261891709,
  megagroup: true,
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

var to_group = {
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
  return Promise.resolve(from_mega_group);
}

var inviteUserToGroup = function() {
  return inviteToChannel;
}

var inviteUsersToMegaGroup = function() {
  return inviteToChannel;
}

describe('#inviteUsers(from, to)', function() {
  it('save the user count', done => {
    methods.__set__('getInfoFromGroup', getInfoFromGroup);
    methods.__set__('inviteUserToGroup', inviteUserToGroup);
    methods.__set__('inviteUsersToMegaGroup', inviteUsersToMegaGroup);

    methods.inviteUsers(from_mega_group, to_group).then(data => {
      assert.equal(data, 2);
    });

    //must 2
    inviteLog.find().then(data => {
      console.log(data);
    })

    // inviteLog.findOne({from_chat_id: from_mega_group.id, to_chat_id: to_group.id }).then(data => {
    //   console.log(data);
    //   assert.equal(data.invited_count, 1);
    // }) 
    
    done();
  }); 
   
  after(function(done) {
    inviteLog.remove({}, function() {
      done();
    });
  });

  // it('must return reject promise on fullfit', function(done) {
    
  //   done();

  // });
});