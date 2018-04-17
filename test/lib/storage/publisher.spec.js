var mongoose = require('mongoose');
let Publisher = require('./storage/publisher');
var config = require('./../config');

let chai = require('chai');
let should = chai.should();

describe('Publisher', function() {

  before(function(done) {
    db = mongoose.connect(config.db);
    done();
  });

  after(function(done) {
    mongoose.connection.close();
    done();
  });
});

