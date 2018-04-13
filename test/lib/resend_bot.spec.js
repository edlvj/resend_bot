var simple = require('simple-mock');
const expect = require('chai').expect;
var assert = require('assert');
const sinon = require('sinon');

// var proxyquire =  require('proxyquire');
// var mock = require('mock-require');

let chai = require('chai');
let should = chai.should();
var rewire = require("rewire");

// { inviteUsers, getInfoFromGroup, intiteUserToGroup }
const resend_bot = require('./../../lib/resend_bot');
const methods = require('./../../mtproto/methods');

describe('#getInfoFromGroup(chat, limit)', function() {
  before(() => {
  })

  it('return Promise with users', function(done) {

    var resend_bot = rewire('./../../lib/resend_bot');

    var duty = function(){
      return 'dsds';
    }
    
    resend_bot.__set__('getFullChat', duty);
    
    var group = { 
      _: 'chat',
      id: 261891709,
      title: 'test_donor',
      access_hash: '13695491023331794763'
    };

    console.log(resend_bot.getInfoFromGroup(group));

    done();

  });
});

// describe('#intiteUserToGroup(chat, user)', function() {
// });

// describe('#inviteUsers(from, to)', function() {
// });