var assert = require('assert');
var JZZ = require('jzz');
require('..')(JZZ);

function Sample(done, list) {
  this.done = done;
  this.list = list.slice();
  this.count = 0;
  this.compare = function(msg) {
    if (this.count < this.list.length) assert.equal(msg.slice().toString(), this.list[this.count].toString());
    this.count++;
    if (this.count == this.list.length) this.done();
  };
}

describe('tests', function() {
  it('empty', function() {
  });
});

