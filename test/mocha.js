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
  trk.tick(0).tick(200).smfBPM(60).tick(200).smfEndOfTrack();
  var chk = JZZ.MIDI.SMF.Chunk('fake', '');
  var player = smf.player();

  it('constructor', function() {
    JZZ.MIDI.SMF('0');
    assert.throws(function() {
      JZZ.MIDI.SMF(0, 24, 16, 0);
    });
    assert.throws(function() {
      JZZ.MIDI.SMF(-1, 24, 16);
    });
    assert.throws(function() {
      JZZ.MIDI.SMF(0, 31, 16);
    });
    assert.throws(function() {
      JZZ.MIDI.SMF(0, 24, 300);
    });
    assert.throws(function() {
      JZZ.MIDI.SMF(0, -1);
    });
    assert.throws(function() {
      JZZ.MIDI.SMF('');
    });
    assert.throws(function() {
      JZZ.MIDI.SMF('not a midi file');
    });
    assert.throws(function() { // No MIDI tracks
      JZZ.MIDI.SMF(JZZ.MIDI.SMF().dump());
    });
    assert.throws(function() { // Invalid MIDI header
      var dump = JZZ.MIDI.SMF(0, 24, 16).dump();
      JZZ.MIDI.SMF(dump.substr(0, 13) + '\0' + dump.substr(14));
    });
    assert.throws(function() {
      JZZ.MIDI.SMF.Chunk();
    });
    assert.throws(function() {
      JZZ.MIDI.SMF.Chunk('xxxЯ');
    });
    assert.throws(function() {
      JZZ.MIDI.SMF.Chunk('xxxx');
    });
    assert.throws(function() {
      JZZ.MIDI.SMF.Chunk('xxxx', 'xxxЯ');
    });
  });
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
    assert.throws(function() { player.tick2ms(); });
  });
  it('ms2tick', function() {
    assert.equal(player.ms2tick(-1), 0);
    assert.equal(player.ms2tick(500), 100);
    assert.equal(player.ms2tick(2000), 300);
    assert.equal(player.ms2tick(5000), 400);
    assert.throws(function() { player.ms2tick(); });
  });
  it('jump', function() {
    assert.throws(function() { player.jump(); });
    assert.throws(function() { player.jumpMS(); });
    assert.equal(player._t2ms(0), 0);
  });
  it('type', function() {
    assert.equal(chk.type, 'fake');
    assert.equal(trk.type, 'MTrk');
  });
  it('throw', function() {
    assert.throws(function() { trk.add(); });
    assert.throws(function() { trk.tick(); });
    assert.throws(function() { trk.ch(-1); });
    assert.throws(function() { trk.sxId(-1); });
  });
  it('validate', function() {
    var smf = new JZZ.MIDI.SMF(1);
    var trk = new JZZ.MIDI.SMF.MTrk();
    smf.push(trk);
    smf.validate();
    trk.smfBPM(90).smfTimeSignature('3/4').smfSMPTE(JZZ.SMPTE())
      .smf(0, 'xx').smf(0, 'xxx').smf(5, '')
      .smf(32, 'x').smf(32, 'xx').smf(32, '\1')
      .smf(33, 'x').smf(33, 'xx')
      .smf(81, '').smf(81, 'x').smf(81, 'xxxx')
      .smf(84, 'xxxxx').smf(84, 'xxxxxx')
      .smf(88, 'xxxx').smf(88, 'xxxxx')
      .smf(89, 'xx').smf(89, 'xxx')
      .smf(127, '').smf(126, '')
      .sxGM().sxGS().send([0xf0, 0x43, 0x10, 0x4c, 0x00, 0x00, 0x7e, 0x00, 0xf7])
    ;
    trk = new JZZ.MIDI.SMF.MTrk();
    smf.push(trk);
    trk.smfBPM(90).smfTimeSignature('3/4').smfSMPTE(JZZ.SMPTE())
      .ch(1)
      .dataMSB(1).dataLSB(2).dataIncr().dataDecr()
      .rpn(1).nrpn(1);
    var val = smf.validate();
    for (var i = 0; i < val.length; i++) val[i].toString();
    smf = new JZZ.MIDI.SMF(0);
    smf.push(JZZ.MIDI.SMF.MTrk());
    smf.push(JZZ.MIDI.SMF.MTrk());
    smf[1].send([0xf0, 0xf7, 0xf7, 0xf7, 0xf7, 0xf7, 0xf7, 0xf7])
      .bank(0, 0).bank(0, 0).program(0, 0)
      .bankMSB(1, 0).program(1, 0).bankLSB(2, 0).program(2, 0)
      .rpn(0, 0).dataIncr(0).rpn(0, 0)
      .rpnMSB(1, 0).dataMSB(1, 0).rpnLSB(2, 0).dataLSB(2, 0)
      .nrpn(0, 0).dataDecr(0).nrpn(0, 0)
      .nrpnMSB(1, 0).dataMSB(1, 0).nrpnLSB(2, 0).dataLSB(2, 0)
      .dataIncr(3).rpn(4, 0x7f, 0x7f).dataDecr(4)
    ;
    var dump = smf.dump();
    dump = dump.substr(0, 9) + '\3' + dump.substr(10);
    dump = dump.replace('MTrk', 'MThd')
    dump = dump.replace('\xf0\7\xf7\xf7\xf7\xf7\xf7\xf7\xf7', '\xf1\0\0\xf3\0\0\xf2\0\0');
    smf = JZZ.MIDI.SMF(dump);
    smf.validate();
    //console.log(smf.validate());
    //console.log(smf.toString());
  });
  it('trim', function() {
    var smf = new JZZ.MIDI.SMF(1);
    var trk = new JZZ.MIDI.SMF.MTrk();
    smf.push(trk);
    assert.equal(smf.player().trim(), 0);
    trk.tick(100).smfBPM(120);
    assert.equal(smf.player().trim(), 100);
    trk.tick(100).smfText('the end');
    assert.equal(smf.player().trim(), 0);
    trk.length = 0;
    assert.equal(smf.player().trim(), 0);
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
       .add(0, JZZ.MIDI.program(0, 8).label('dummy'))
       .add(10, JZZ.MIDI.noteOn(0, 'C#6', 127))
       .add(20, JZZ.MIDI.noteOff(0, 'C#6'))
       .add(30, JZZ.MIDI.smfEndOfTrack());
    var more = new JZZ.MIDI.SMF.Chunk('More', 'Ignore this...');
    smf.push(more);
    smf.annotate();
    smf.toString();
    //console.log(smf.toString());
    // write and read
    smf = new JZZ.MIDI.SMF(smf.dump(true));
    // read from Buffer
    smf = new JZZ.MIDI.SMF(smf.toBuffer());
    // read from ArrayBuffer
    smf = new JZZ.MIDI.SMF(smf.toArrayBuffer());
    // read from Int8Array
    smf = new JZZ.MIDI.SMF(smf.toInt8Array());
    // copy
    smf = new JZZ.MIDI.SMF(smf);
    // player
    var player = smf.player();

    assert.equal(player.duration(), 30);
    assert.equal(player.durationMS(), 78.125);
    assert.equal(player.position(), 0);
    assert.equal(player.positionMS(), 0);
    player.jump(-1);
    assert.equal(player.position(), 0);
    player.jump(1000000);
    assert.equal(player.position(), 29);
    player.jump(20);
    assert.equal(player.position(), 20);
    player.jumpMS(-1);
    assert.equal(player.positionMS(), 0);
    player.jumpMS(1000000);
    assert.equal(player.positionMS(), 77.125);
    player.jumpMS(50);
    assert.equal(player.positionMS(), 50);
    player.jump(0);
    player.speed(2);
    assert.equal(player.speed(), 2);
    player.speed(-1);
    assert.equal(player.speed(), 1);
    player.filter(function() {});
    player.filter();

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
    player.resume();
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
       .tick(3000000).ch(1).ch(1).ch(0).note('E5', 127, 10).ch().sxId(1).sxId(1).sxId()
       .tick(200).smfEndOfTrack().add(0, [0x99, 0x40, 0x7f]);
    var str = smf.dump();
    str = str.substring(0, str.length - 1); // make a fixable corrupted file
    smf = new JZZ.MIDI.SMF(str);
    smf = new JZZ.MIDI.SMF(smf.dump() + ' ');
    smf.annotate().annotate();
    smf.toString();
    //console.log(smf.toString());
    var player = smf.player();
    var sample = new Sample(function() { player.stop(); done(); } , [
      [0xb0, 0x78, 0x00], [0xb1, 0x78, 0x00], [0xb2, 0x78, 0x00], [0xb3, 0x78, 0x00],
      [0xb4, 0x78, 0x00], [0xb5, 0x78, 0x00], [0xb6, 0x78, 0x00], [0xb7, 0x78, 0x00],
      [0xb8, 0x78, 0x00], [0xb9, 0x78, 0x00], [0xba, 0x78, 0x00], [0xbb, 0x78, 0x00],
      [0xbc, 0x78, 0x00], [0xbd, 0x78, 0x00], [0xbe, 0x78, 0x00], [0xbf, 0x78, 0x00],
      [0xb0, 0x79, 0x00], [0xb1, 0x79, 0x00], [0xb2, 0x79, 0x00], [0xb3, 0x79, 0x00],
      [0xb4, 0x79, 0x00], [0xb5, 0x79, 0x00], [0xb6, 0x79, 0x00], [0xb7, 0x79, 0x00],
      [0xb8, 0x79, 0x00], [0xb9, 0x79, 0x00], [0xba, 0x79, 0x00], [0xbb, 0x79, 0x00],
      [0xbc, 0x79, 0x00], [0xbd, 0x79, 0x00], [0xbe, 0x79, 0x00], [0xbf, 0x79, 0x00],
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
    trk.smfBPM(90).tick(20).ch(0).clock().note('C#5', 127, 20).add(0, [0xc0, 0x0c]);
    trk = new JZZ.MIDI.SMF.MTrk;
    smf.push(trk);
    trk.ch(0).note('F#5', 127, 20);
    smf.annotate();
    smf.toString();
    //console.log(smf.toString());
    var player = smf.player();
    var sample = new Sample(done, [
      [], [0xc0, 0x0c],
      [0xb0, 0x78, 0x00], [0xb1, 0x78, 0x00], [0xb2, 0x78, 0x00], [0xb3, 0x78, 0x00],
      [0xb4, 0x78, 0x00], [0xb5, 0x78, 0x00], [0xb6, 0x78, 0x00], [0xb7, 0x78, 0x00],
      [0xb8, 0x78, 0x00], [0xb9, 0x78, 0x00], [0xba, 0x78, 0x00], [0xbb, 0x78, 0x00],
      [0xbc, 0x78, 0x00], [0xbd, 0x78, 0x00], [0xbe, 0x78, 0x00], [0xbf, 0x78, 0x00],
      [0xb0, 0x79, 0x00], [0xb1, 0x79, 0x00], [0xb2, 0x79, 0x00], [0xb3, 0x79, 0x00],
      [0xb4, 0x79, 0x00], [0xb5, 0x79, 0x00], [0xb6, 0x79, 0x00], [0xb7, 0x79, 0x00],
      [0xb8, 0x79, 0x00], [0xb9, 0x79, 0x00], [0xba, 0x79, 0x00], [0xbb, 0x79, 0x00],
      [0xbc, 0x79, 0x00], [0xbd, 0x79, 0x00], [0xbe, 0x79, 0x00], [0xbf, 0x79, 0x00],
      [0x90, 0x3d, 0x7f], [0x80, 0x3d, 0x40], [],
      [0x90, 0x42, 0x7f], [0x80, 0x42, 0x40]
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
  it('0.mid', function() {
    var smf = new JZZ.MIDI.SMF(load('0.mid'));
    var val = smf.validate();
    for (var i = 0; i < val.length; i++) val[i].toString();
  });
  it('1.mid', function() {
    var smf = new JZZ.MIDI.SMF(load('1.mid'));
    smf.validate();
  });
  it('2.mid', function() {
    var smf = new JZZ.MIDI.SMF(load('2.mid'));
    var val = smf.validate();
    for (var i = 0; i < val.length; i++) val[i].toString();
  });
  it('3.mid', function() {
    var smf = new JZZ.MIDI.SMF(load('3.mid'));
    smf.validate();
    smf.player().trim();
  });
  it('4.mid', function() {
    var smf = new JZZ.MIDI.SMF(load('4.mid'));
    var val = smf.validate();
    for (var i = 0; i < val.length; i++) val[i].toString();
  });
  it('5.mid', function() {
    var smf = new JZZ.MIDI.SMF(load('5.mid'));
    var val = smf.validate();
    for (var i = 0; i < val.length; i++) val[i].toString();
  });
  it('6.mid', function() {
    var smf = new JZZ.MIDI.SMF(load('6.mid'));
    var val = smf.validate();
    for (var i = 0; i < val.length; i++) val[i].toString();
  });
  it('7.mid', function() {
    var smf = new JZZ.MIDI.SMF(load('7.mid'));
    smf.validate();
  });
  it('8.mid', function() {
    var smf = new JZZ.MIDI.SMF(load('8.mid'));
    smf.validate();
  });
});

describe('SYX', function() {
  it('version', function() {
    assert.equal(JZZ.MIDI.SYX.version(), JZZ.MIDI.SMF.version());
  });
  it('constructor', function() {
    assert.equal(JZZ.MIDI.SMF.version(), JZZ.MIDI.SMF.version());
    var syx = JZZ.MIDI.SYX(JZZ.MIDI.sxIdRequest());
    assert.equal(syx[0].toString(), 'f0 7e 7f 06 01 f7');
    assert.equal(syx.toString(), 'SYX:\n  f0 7e 7f 06 01 f7');
    syx = JZZ.MIDI.SYX([0xf0, 0x7e, 0x7f, 0x06, 0x01, 0xf7, 0xf0, 0x7e, 0x01, 0x06, 0x01, 0xf7]);
    assert.equal(syx[0].toString(), 'f0 7e 7f 06 01 f7');
    assert.equal(syx[1].toString(), 'f0 7e 01 06 01 f7');
    assert.throws(function() {
      JZZ.MIDI.SYX([0x7e, 0x7f, 0x06, 0x01, 0xf7]);
    });
    assert.throws(function() {
      JZZ.MIDI.SYX([0xf0, 0x7e, 0x7f, 0x06, 0x01]);
    });
    assert.throws(function() {
      var smf = JZZ.MIDI.SMF();
      smf.push(JZZ.MIDI.SMF.MTrk());
      smf[0].note(0, 60, 127).ch(0).note(60, 27);
      JZZ.MIDI.SYX(smf);
    });
    syx = JZZ.MIDI.SYX(syx.dump());
    syx = JZZ.MIDI.SYX(syx.toBuffer());
    syx = JZZ.MIDI.SYX(syx.toArrayBuffer());
    syx = JZZ.MIDI.SYX(syx.toInt8Array());
    syx = JZZ.MIDI.SYX(syx.toUint8Array());
    syx = JZZ.MIDI.SYX(JZZ.MIDI.SMF(syx));
    syx = JZZ.MIDI.SYX(syx);
    assert.equal(syx[0].toString(), 'f0 7e 7f 06 01 f7');
    assert.equal(syx[1].toString(), 'f0 7e 01 06 01 f7');
    syx.validate();
  });
  it('player', function(done) {
    var syx = JZZ.MIDI.SYX(JZZ.MIDI.sxIdRequest());
    var player = syx.player();
    var sample = new Sample(done, [
      [0xf0, 0x7e, 0x7f, 0x06, 0x01, 0xf7]
    ]);
    player.connect(function(msg) { sample.compare(msg); });
    player.play();
  });
  it('helpers', function() {
    var syx = new JZZ.MIDI.SYX();
    syx.send(JZZ.MIDI([0xf0, 0xf7]).label('dummy'))
      .noteOn(0, 'C7', 127).ch().ch(0).ch(0).noteOff('C7').ch()
      .sxMasterVolumeF(0).sxId().sxId(5).sxId(5).sxMasterVolumeF(1).add([0xf0, 0xf7]).sxId().annotate();
    assert.equal(syx[0].toString(), 'f0 f7');
    assert.equal(syx[1].toString(), 'f0 7f 7f 04 01 00 00 f7 (Master Volume)');
    assert.equal(syx[2].toString(), 'f0 7f 05 04 01 7f 7f f7 (Master Volume)');
    assert.equal(syx[3].toString(), 'f0 f7');
    assert.throws(function() { syx.ch(-1); });
    assert.throws(function() { syx.sxId(-1); });
  });
});
