var assert = require('assert');
var fs = require('fs');
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

describe('functions', function() {
  var smf = JZZ.MIDI.SMF(1, 100); // test without the 'new' keyword
  var trk = JZZ.MIDI.SMF.MTrk(); // test without the 'new' keyword
  smf.push(trk);
  trk.tick(200).smfBPM(60).tick(200).smfEndOfTrack();
  var player = smf.player();

  it('type', function() {
    assert.equal(player.type(), 1);
  });
  it('tracks', function() {
    assert.equal(player.tracks(), 1);
  });
  it('duration', function() {
    assert.equal(player.duration(), 400);
    assert.equal(player.durationMS(), 3000);
  });
  it('tick2ms', function() {
    assert.equal(player.tick2ms(-1), 0);
    assert.equal(player.tick2ms(100), 500);
    assert.equal(player.tick2ms(1000), 3000);
  });
  it('ms2tick', function() {
    assert.equal(player.ms2tick(-1), 0);
    assert.equal(player.ms2tick(500), 100);
    assert.equal(player.ms2tick(2000), 300);
    assert.equal(player.ms2tick(5000), 400);
  });
});

describe('integration: read / write / play', function() {
  console.log('JZZ.MIDI.SMF v' + JZZ.MIDI.SMF.version());
  it('MIDI file type 0; fps/ppf', function(done) {
    // new file
    var smf = new JZZ.MIDI.SMF(0, 24, 16);
    var trk = new JZZ.MIDI.SMF.MTrk();
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

    assert.equal(player.duration(), 30);
    assert.equal(player.durationMS(), 78.125);
    assert.equal(player.position(), 0);
    assert.equal(player.positionMS(), 0);
    player.jump(20);
    assert.equal(player.position(), 20);
    player.jumpMS(50);
    assert.equal(player.positionMS(), 50);
    player.jump(0);

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
    var trk = new JZZ.MIDI.SMF.MTrk();
    smf.push(trk);
    trk.smfBPM(90);
    trk = new JZZ.MIDI.SMF.MTrk;
    smf.push(trk);
    trk.sxIdRequest(); // insert a sysex
    trk.tick(200).note(0, 'C5', 127, 10)
       .tick(20000).note(0, 'E5', 127, 10)
       .tick(3000000).ch(1).ch(1).ch(0).note('E5', 127, 10).ch()
       .tick(200).smfEndOfTrack();
    var str = smf.dump();
    str = str.substring(0, str.length - 1); // make a fixable corrupted file
    smf = new JZZ.MIDI.SMF(str);
    smf = new JZZ.MIDI.SMF(smf.dump() + ' ');
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

  it.skip('MIDI file type 2; ppqn', function(done) {
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

describe('MIDI files', function() {
  function load(fname) {
    return fs.readFileSync(__dirname + '/midi/' + fname, 'binary');
  }
  it('1.mid', function() {
    var smf = new JZZ.MIDI.SMF(load('1.mid'));
    smf.validate();
  });
  it('2.mid', function() {
    var smf = new JZZ.MIDI.SMF(load('2.mid'));
    smf.validate();
  });
  it('3.mid', function() {
    var smf = new JZZ.MIDI.SMF(load('3.mid'));
    smf.validate();
    smf.player().trim();
  });
  it('4.mid', function() {
    var smf = new JZZ.MIDI.SMF(load('4.mid'));
    smf.validate();
  });
  it('5.mid', function() {
    var smf = new JZZ.MIDI.SMF(load('5.mid'));
    smf.validate();
  });
  it('6.mid', function() {
    var smf = new JZZ.MIDI.SMF(load('6.mid'));
    smf.validate();
  });
  it('7.mid', function() {
    var smf = new JZZ.MIDI.SMF(load('7.mid'));
    smf.validate();
  });
  it('8.mid', function() {
    var smf = new JZZ.MIDI.SMF(load('8.mid'));
    smf.validate();
  });
  it('9.mid', function() {
    var smf = new JZZ.MIDI.SMF(load('9.mid'));
    smf.validate();
  });
});
