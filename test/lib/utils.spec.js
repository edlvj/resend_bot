const expect = require('chai').expect;
var assert = require('assert');

const utils = require('./../../lib/utils');
const { group, megaGroup, channel } = require('./../stubs');

describe('#isMegaGroup(chat)', function() {
  it('return true', function(done) {
    assert.equal(utils.isMegaGroup(megaGroup), true);
    done();
  });

  it('return false', function(done) {
    assert.equal(utils.isMegaGroup(group), false);
    done();
  });

  it('return false', function(done) {
    assert.equal(utils.isMegaGroup(channel), false);
    done();
  });
});

describe('#isGroup(chat)', function() {
  it('return true', function(done) {
    assert.equal(utils.isGroup(group), true);
    done();
  });

  it('return false', function(done) {
    assert.equal(utils.isGroup(megaGroup), false);
    done();
  });

  it('return false', function(done) {
    assert.equal(utils.isGroup(channel), false);
    done();
  });
});

describe('#isChannel(chat)', function() {
  it('return true', function(done) {
    assert.equal(utils.isChannel(channel), true);
    done();
  });

  it('return false', function(done) {
    assert.equal(utils.isChannel(megaGroup), false);
    done();
  });

  it('return false', function(done) {
    assert.equal(utils.isChannel(group), false);
    done();
  });
});

describe('#getChatId(chat_type, chat)', function() {
  it('return with minus', function(done) {
    assert.equal(utils.getChatId("chat", 123), -123);
    done();
  });

  it('return with minus 100', function(done) {
    assert.equal(utils.getChatId("channel", 123), -100123);
    done();
  });
});