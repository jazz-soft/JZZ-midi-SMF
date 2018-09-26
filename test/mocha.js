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

describe('integration: read / write / play', function() {
  console.log('JZZ.MIDI.SMF v' + JZZ.MIDI.SMF.version());
  it('MIDI file type 0; fps/ppf', function(done) {
    // new file
    var smf = new JZZ.MIDI.SMF(0, 24, 16);
    var trk = new JZZ.MIDI.SMF.MTrk;
    smf.push(trk);
    trk.add(0, JZZ.MIDI.smfBPM(90))
       .add(0, JZZ.MIDI.program(0, 8))
       .add(10, JZZ.MIDI.noteOn(0, 'C#6', 127))
       .add(20, JZZ.MIDI.noteOff(0, 'C#6'))
       .add(30, JZZ.MIDI.smfEndOfTrack());
    var more = new JZZ.MIDI.SMF.Chunk('More', 'Ignore this...');
    smf.push(more);
    smf.toString();
    //console.log(smf.toString());
    // write and read
    smf = new JZZ.MIDI.SMF(smf.dump(true));
    // copy
    smf = new JZZ.MIDI.SMF(smf);
    // player
    var player = smf.player();
    var sample = new Sample(done, [
      [], [0xc0, 0x08], [0x90, 0x49, 0x7f], [0x80, 0x49, 0x40], [],
      [], [0xc0, 0x08], [0x90, 0x49, 0x7f], [0x80, 0x49, 0x40], [],
      [0xb0, 0x78, 0x00], [0xb1, 0x78, 0x00], [0xb2, 0x78, 0x00], [0xb3, 0x78, 0x00],
      [0xb4, 0x78, 0x00], [0xb5, 0x78, 0x00], [0xb6, 0x78, 0x00], [0xb7, 0x78, 0x00],
      [0xb8, 0x78, 0x00], [0xb9, 0x78, 0x00], [0xba, 0x78, 0x00], [0xbb, 0x78, 0x00],
      [0xbc, 0x78, 0x00], [0xbd, 0x78, 0x00], [0xbe, 0x78, 0x00], [0xbf, 0x78, 0x00]
    ]);
    player.connect(function(msg) { sample.compare(msg); });
    player.loop(true);
    player.loop(false);
    player.loop(2);
    player.play();
  });

  it('MIDI file type 1; ppqn', function(done) {
    var smf = new JZZ.MIDI.SMF(1, 96);
    var trk = new JZZ.MIDI.SMF.MTrk;
    smf.push(trk);
    trk.smfBPM(90);
    trk = new JZZ.MIDI.SMF.MTrk;
    smf.push(trk);
    trk.sxIdRequest(); // insert a sysex
    trk.tick(200).note(0, 'C5', 127, 10)
       .tick(20000).note(0, 'E5', 127, 10)
       .tick(3000000).ch(1).ch(1).ch(0).note('E5', 127, 10).ch()
       .tick(200).smfEndOfTrack();
    smf = new JZZ.MIDI.SMF(smf.dump());
    smf.toString();
    //console.log(smf.toString());
    var player = smf.player();
    var sample = new Sample(function() { player.stop(); done(); } , [
      [0xb0, 0x78, 0x00], [0xb1, 0x78, 0x00], [0xb2, 0x78, 0x00], [0xb3, 0x78, 0x00],
      [0xb4, 0x78, 0x00], [0xb5, 0x78, 0x00], [0xb6, 0x78, 0x00], [0xb7, 0x78, 0x00],
      [0xb8, 0x78, 0x00], [0xb9, 0x78, 0x00], [0xba, 0x78, 0x00], [0xbb, 0x78, 0x00],
      [0xbc, 0x78, 0x00], [0xbd, 0x78, 0x00], [0xbe, 0x78, 0x00], [0xbf, 0x78, 0x00],
      [0x90, 0x40, 0x7f], [0x80, 0x40, 0x40]
    ]);
    player.connect(function(msg) { sample.compare(msg); });
    player.jump(3020300);
    player.resume();
    player.jump(3020200);
  });

  it('MIDI file type 2; ppqn', function(done) {
    var smf = new JZZ.MIDI.SMF(2, 96);
    var trk = new JZZ.MIDI.SMF.MTrk;
    smf.push(trk);
    trk.smfBPM(90).tick(20).ch(0).note('C#5', 127, 20).clock();
    trk = new JZZ.MIDI.SMF.MTrk;
    smf.push(trk);
    trk.smfBPM(90).ch(0).note('F#5', 127, 20);
    smf.toString();
    //console.log(smf.toString());
    var player = smf.player();
    var sample = new Sample(done, [
      [],
      [0xb0, 0x78, 0x00], [0xb1, 0x78, 0x00], [0xb2, 0x78, 0x00], [0xb3, 0x78, 0x00],
      [0xb4, 0x78, 0x00], [0xb5, 0x78, 0x00], [0xb6, 0x78, 0x00], [0xb7, 0x78, 0x00],
      [0xb8, 0x78, 0x00], [0xb9, 0x78, 0x00], [0xba, 0x78, 0x00], [0xbb, 0x78, 0x00],
      [0xbc, 0x78, 0x00], [0xbd, 0x78, 0x00], [0xbe, 0x78, 0x00], [0xbf, 0x78, 0x00],
      [0xf8], [0x90, 0x3d, 0x7f], [0x80, 0x3d, 0x40], [],
      [], [0x90, 0x42, 0x7f], [0x80, 0x42, 0x40]
    ]);
    player.connect(function(msg) { sample.compare(msg); });
    player.resume();
    player.pause();
    player.pause();
    setTimeout(function() { player.resume(); }, 100);
  });
});

