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

##### Playing MIDI file

    var midiout = JZZ().openMidiOut();
    var data = require('fs').readFileSync('file.mid').toString('binary');
    var smf = new JZZ.MIDI.SMF(data);
    var player = smf.player();
    player.connect(midiout);
    player.play();


##### Saving MIDI file

    require('fs').writeFileSync('out.mid', smf.dump(), 'binary');


## More information

Please visit [**https://jazz-soft.net**](https://jazz-soft.net) for more information.  
Your questions and comments are welcome [**here**](https://jazz-soft.org).

We would really appreciate your [**support**](https://jazz-soft.net/donate)!
