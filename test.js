var JZZ = require('jzz');
require('.')(JZZ);

var data = require('fs').readFileSync('test.mid').toString('binary');
var smf = new JZZ.MIDI.SMF(data);
console.log(smf.toString());

var player = smf.player();
JZZ().or('Cannot start MIDI engine!').openMidiOut().or('Cannot open MIDI Out!').and(function() {
  player.connect(this);
  player.loop(3);
  player.play();
});
