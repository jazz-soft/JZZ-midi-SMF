var JZZ = require('jzz');
require('.')(JZZ);

var data = require('fs').readFileSync('test.mid').toString('binary');
var smf = new JZZ.MIDI.SMF(data);

console.log(smf);
