const expect = require('chai').expect;
var assert = require('assert');

const resendFactory = require('./../../lib/resend_factory');
const { textMessage, photoMessage, documentMessage } = require('./../stubs');

describe('#handleMessage(msg)', function() {
  
  it('return method sendMessage with props', function(done) {
    let subject = resendFactory.handleMessage(textMessage);

    assert.equal(subject.method, 'sendMessage');
    assert.equal(subject.properties.text, textMessage.text);
    done();
  });

  it('return method sendPhoto with props', function(done) {
    let subject = resendFactory.handleMessage(photoMessage);
    
    assert.equal(subject.method, 'sendPhoto');
    assert.equal(subject.properties.photo, photoMessage.photo[0].file_id);
    done();
  });

  it('return method sendDocument with props', function(done) {
    let subject = resendFactory.handleMessage(documentMessage);
    
    assert.equal(subject.method, 'sendDocument');
    assert.equal(subject.properties.document, documentMessage.document.file_id);
    done();
  });
});
