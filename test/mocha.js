﻿var assert = require('assert');
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

it('integration', function(done) {
  // new file
  var smf = new JZZ.MIDI.SMF(0, 96);
  var trk = new JZZ.MIDI.SMF.MTrk;
  smf.push(trk);
  trk.add(10, JZZ.MIDI.noteOn(0, 'C#6', 127))
     .add(20, JZZ.MIDI.noteOff(0, 'C#6'))
     .add(30, JZZ.MIDI.smfEndOfTrack());
  // write and read
  smf = new JZZ.MIDI.SMF(smf.dump());
  // player
  var player = smf.player();
  var sample = new Sample(done, [
    [0x90, 0x49, 0x7f], [0x80, 0x49, 0x40], [],
    [0xb0, 0x78, 0x00], [0xb1, 0x78, 0x00], [0xb2, 0x78, 0x00], [0xb3, 0x78, 0x00],
    [0xb4, 0x78, 0x00], [0xb5, 0x78, 0x00], [0xb6, 0x78, 0x00], [0xb7, 0x78, 0x00],
    [0xb8, 0x78, 0x00], [0xb9, 0x78, 0x00], [0xba, 0x78, 0x00], [0xbb, 0x78, 0x00],
    [0xbc, 0x78, 0x00], [0xbd, 0x78, 0x00], [0xbe, 0x78, 0x00], [0xbf, 0x78, 0x00]
  ]);
  player.connect(function(msg) {
    //console.log(msg.toString());
    sample.compare(msg);
  });
  player.play();
});

