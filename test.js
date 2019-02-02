var JZZ = require('jzz');
require('.')(JZZ);

var data = require('fs').readFileSync('test.mid', 'binary');
var smf = new JZZ.MIDI.SMF(data);
console.log(smf.toString());
var player = smf.player();
var t = Math.round(player.durationMS() / 10);
var h = Math.floor(t / 360000);
var m = Math.floor((t % 360000) / 6000);
var s = (t % 6000) / 100;
var time = [];
if (h) time.push(h);
time.push(h && m < 10 ? '0' + m : m);
time.push(s < 10 ? '0' + s : s);
console.log('Total time:', time.join(':'));

JZZ().or('Cannot start MIDI engine!').openMidiOut().or('Cannot open MIDI Out!').and(function() {
  player.connect(this);
  player.loop(3);
  player.play();
});
