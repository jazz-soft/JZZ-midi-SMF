# JZZ-midi-SMF

Standard MIDI Files: read / write / play

![Node.js](https://jazz-soft.github.io/img/nodejs.jpg)
![Firefox](https://jazz-soft.github.io/img/firefox.jpg)
![Chrome](https://jazz-soft.github.io/img/chrome.jpg)
![Opera](https://jazz-soft.github.io/img/opera.jpg)
![Safari](https://jazz-soft.github.io/img/safari.jpg)
![Internet Explorer](https://jazz-soft.github.io/img/msie.jpg)
![Edge](https://jazz-soft.github.io/img/edgc.jpg)  
[![npm](https://img.shields.io/npm/v/jzz-midi-smf.svg)](https://www.npmjs.com/package/jzz-midi-smf)
[![npm](https://img.shields.io/npm/dt/jzz-midi-smf.svg)](https://www.npmjs.com/package/jzz-midi-smf)
[![build](https://github.com/jazz-soft/JZZ-midi-SMF/actions/workflows/build.yml/badge.svg)](https://github.com/jazz-soft/JZZ-midi-SMF/actions)
[![Coverage Status](https://coveralls.io/repos/github/jazz-soft/JZZ-midi-SMF/badge.svg?branch=master)](https://coveralls.io/github/jazz-soft/JZZ-midi-SMF?branch=master)
[![Try jzz-midi-smf on RunKit](https://badge.runkitcdn.com/jzz-midi-smf.svg)](https://npm.runkit.com/jzz-midi-smf)

## Install

`npm install jzz-midi-smf --save`  
or `yarn add jzz-midi-smf`  
or get the full development version and minified scripts from [**GitHub**](https://github.com/jazz-soft/JZZ-midi-SMF)

## Usage

##### Plain HTML

```html
<script src="JZZ.js"></script>
<script src="JZZ.midi.SMF.js"></script>
//...
```

##### CDN (jsdelivr)

```html
<script src="https://cdn.jsdelivr.net/npm/jzz"></script>
<script src="https://cdn.jsdelivr.net/npm/jzz-midi-smf"></script>
//...
```

##### CDN (unpkg)

```html
<script src="https://unpkg.com/jzz"></script>
<script src="https://unpkg.com/jzz-midi-smf"></script>
//...
```

##### CommonJS (Browserify and Node.js command line applications)

```js
var JZZ = require('jzz');
require('jzz-midi-smf')(JZZ);
//...
```

##### AMD

```js
require(['JZZ', 'JZZ.midi.SMF'], function(JZZ, dummy) {
  // ...
});
```

## MIDI files
Supported file formats: `.mid`, `.kar`, `.rmi`

Please check the [**API Reference**](https://jazz-soft.net/doc/JZZ/midifile.html) !

##### Playing MIDI file

```js
var midiout = JZZ().openMidiOut();
var data = require('fs').readFileSync('file.mid', 'binary');
// data can be String, Buffer, ArrayBuffer, Uint8Array or Int8Array
var smf = new JZZ.MIDI.SMF(data);
var player = smf.player();
player.connect(midiout);
player.play();
//...
player.speed(0.5); // play twice slower
```

##### Viewing the contents of MIDI file

```js
console.log(smf.toString());
```

##### Validating MIDI file

```js
var warn = smf.validate();
if (warn) console.log(warn);
```

##### Creating MIDI file from scratch

```js
var smf = new JZZ.MIDI.SMF(0, 96); // type 0, 96 ticks per quarter note
var trk = new JZZ.MIDI.SMF.MTrk();
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
```

##### Exporting MIDI file data as JSON or any custom format

One easy thing to remember: `SMF` is an `Array` of `Track`s and `Track` is an `Array` of MIDI events:

```js
for (var i = 0; i < smf.length; i++) {
  for (var j = 0; j < smf[i].length; j++) {
    console.log('track:', i, 'tick:', smf[i][j].tt, smf[i][j].toString());
    // or do whatever else with the message
  }
}
```

##### Transposing MIDI file

```js
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
```

##### Getting the info

```js
var player = smf.player();
var dump = smf.dump();
console.log('Type:', player.type());
console.log('Number of tracks:', player.tracks());
console.log('Size:', dump.length, 'bytes');
console.log('Duration:', player.duration(), 'ticks');
console.log('Total time:', player.durationMS(), 'milliseconds');
```

##### Saving MIDI file

```js
require('fs').writeFileSync('out.mid', smf.dump(), 'binary');
```

## SYX files

##### All calls are almost identical to those for the SMF files:

```js
var data = require('fs').readFileSync('file.syx', 'binary');
var syx = new JZZ.MIDI.SYX(data);
syx.send([0xf0, 0x7e, 0x7f, 0x06, 0x01, 0xf7]);
syx.sxMasterVolumeF(0.5);
var player = syx.player();
player.connect(midiout);
player.play();
require('fs').writeFileSync('out.syx', syx.dump(), 'binary');
```

## Live DEMOs (source code included)

[**Read MIDI file**](https://jazz-soft.net/demo/ReadMidiFile.html) - from file, URL, Base64  
[**Write MIDI file**](https://jazz-soft.net/demo/WriteMidiFile.html) - create MIDI file from scratch  
[**MIDI Player**](https://jazz-soft.net/demo/PlayMidiFile.html) - various ways to play MIDI file  
[**Karaoke**](https://jazz-soft.net/demo/Karaoke.html) - playing MIDI files in *.kar* format

## More information

Please visit [**https://jazz-soft.net**](https://jazz-soft.net) for more information.  
