const rkmidi = require("runkit-midi");
const JZZ = require('jzz');
require('jzz-midi-smf')(JZZ);

const smf = new JZZ.MIDI.SMF(0, 96);
const trk = new JZZ.MIDI.SMF.MTrk();
smf.push(trk);
trk.smfBPM(90).ch(0).program(16)
   .tick(96).noteOn('C6', 127).tick(96).noteOn('Eb6', 127)
   .tick(96).noteOn('G6', 127).tick(96).noteOn('C7', 127)
   .tick(192).noteOff('C6').noteOff('Eb6').noteOff('G6')
   .noteOff('C7').tick(96).smfEndOfTrack();

rkmidi(smf);
// click the [▶run] button... ↓