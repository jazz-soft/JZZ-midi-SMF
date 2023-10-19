var JZZ = require('jzz');
require('jzz-midi-gm')(JZZ);
require('.')(JZZ);

var file = process.argv[2];
if (typeof file == 'undefined') file = 'test.mid';
var data = require('fs').readFileSync(file, 'binary');
var smf;
try {
  smf = new JZZ.MIDI.Clip(data);
}
catch (e) {
  try {
    smf = new JZZ.MIDI.SYX(data);
  }
  catch (e) {
    smf = new JZZ.MIDI.SMF(data);
  }
}
smf.annotate();
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
  var m2m1 = JZZ.M2M1();
  m2m1.connect(this);
  player.connect(m2m1);
  player.loop(3);
  player.play();
});
