# JZZ-midi-SMF

Standard MIDI Files: read / write / play

![Node.js](https://jazz-soft.github.io/img/nodejs.jpg)
![Firefox](https://jazz-soft.github.io/img/firefox.jpg)
![Chrome](https://jazz-soft.github.io/img/chrome.jpg)
![Opera](https://jazz-soft.github.io/img/opera.jpg)
![Safari](https://jazz-soft.github.io/img/safari.jpg)
![Internet Explorer](https://jazz-soft.github.io/img/msie.jpg)  
[![npm](https://img.shields.io/npm/v/jzz-midi-smf.svg)](https://www.npmjs.com/package/jzz-midi-smf)
[![npm](https://img.shields.io/npm/dt/jzz-midi-smf.svg)](https://www.npmjs.com/package/jzz-midi-smf)
[![Build Status](https://travis-ci.org/jazz-soft/JZZ-midi-SMF.svg?branch=master)](https://travis-ci.org/jazz-soft/JZZ-midi-SMF)
[![Coverage Status](https://coveralls.io/repos/github/jazz-soft/JZZ-midi-SMF/badge.svg?branch=master)](https://coveralls.io/github/jazz-soft/JZZ-midi-SMF?branch=master)


## Install

`npm install jzz-midi-smf --save`  
or `bower install jzz-midi-smf`  
or `yarn add jzz-midi-smf`  
or get the full development version and minified scripts from [**GitHub**](https://github.com/jazz-soft/JZZ-midi-SMF)

## Usage

##### Plain HTML

    <script src="JZZ.js"></script>
    <script src="JZZ.midi.SMF.js"></script>
    //...

##### CDN (always the latest version!)

    <script src="https://cdn.jsdelivr.net/npm/jzz"></script>
    <script src="https://cdn.jsdelivr.net/npm/jzz-midi-smf"></script>
    //...

##### CommonJS (Browserify and Node.js command line applications)

    var JZZ = require('jzz');
    require('jzz-midi-smf')(JZZ);
    //...

##### AMD

    require(['JZZ', 'JZZ.midi.SMF'], function(JZZ, dummy) {
      // ...
    });

## MIDI files
Supported file formats: `.mid`, `.kar`, `.rmi`

Please check the [**API Reference**](https://jazz-soft.net/doc/JZZ/midifile.html) !

##### Playing MIDI file

    var midiout = JZZ().openMidiOut();
    var data = require('fs').readFileSync('file.mid', 'binary');
    var smf = new JZZ.MIDI.SMF(data);
    var player = smf.player();
    player.connect(midiout);
    player.play();

##### Creating MIDI file from scratch

    var smf = new JZZ.MIDI.SMF(0, 96); // type 0, 96 ticks per quarter note
    var trk = new JZZ.MIDI.SMF.MTrk;
    smf.push(trk);
    // add contents:
    trk.add(0, JZZ.MIDI.smfSeqName('This is a sequence name'))
       .add(0, JZZ.MIDI.smfBPM(90)) // tempo 90 bpm
       .add(96, JZZ.MIDI.noteOn(0, 'C6', 127))
       .add(96, JZZ.MIDI.noteOn(0, 'Eb6', 127))
       .add(96, JZZ.MIDI.noteOn(0, 'G6', 127))
       .add(192, JZZ.MIDI.noteOff(0, 'C6'))
       .add(192, JZZ.MIDI.noteOff(0, 'Eb6'))
       .add(192, JZZ.MIDI.noteOff(0, 'G6'))
       .add(288, JZZ.MIDI.smfEndOfTrack());
    // or an alternative way:
    trk.smfSeqName('This is a sequence name').smfBPM(90).tick(96)
       .noteOn(0, 'C6', 127).noteOn(0, 'Eb6', 127).noteOn(0, 'G6', 127)
       .tick(96).noteOff(0, 'C6').noteOff(0, 'Eb6').noteOff(0, 'G6')
       .tick(96).smfEndOfTrack();
    // or even shorter:
    trk.smfSeqName('This is a sequence name').smfBPM(90).tick(96)
       .ch(0).note('C6', 127, 96).note('Eb6', 127, 96).note('G6', 127, 96)
       .tick(192).smfEndOfTrack();

##### Transposing MIDI file

    for (var i = 0; i < smf.length; i++) {
      if (smf[i] instanceof JZZ.MIDI.SMF.MTrk) {
        for (var j = 0; j < smf[i].length; j++) {
          var note = smf[i][j].getNote();
          if (typeof note != 'undefined') {
            if (smf[i][j].getChannel() != 9) { // skip the percussion channel
              smf[i][j].setNote(note + 12);    // transpose one octave up
            }
          }
        }
      }
    }

##### Saving MIDI file

    require('fs').writeFileSync('out.mid', smf.dump(), 'binary');


## More information

Please visit [**https://jazz-soft.net**](https://jazz-soft.net) for more information.  
Your questions and comments are welcome [**here**](https://jazz-soft.org).

We would really appreciate your [**support**](https://jazz-soft.net/donate)!
