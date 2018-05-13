# JZZ-midi-SMF

Standard MIDI Files: read / write / play

![Node.js](http://jazz-soft.github.io/img/nodejs.jpg)
![Firefox](http://jazz-soft.github.io/img/firefox.jpg)
![Chrome](http://jazz-soft.github.io/img/chrome.jpg)
![Opera](http://jazz-soft.github.io/img/opera.jpg)
![Safari](http://jazz-soft.github.io/img/safari.jpg)
![Internet Explorer](http://jazz-soft.github.io/img/msie.jpg)

## Install

[**npm install jzz-midi-smf**](https://www.npmjs.com/package/jzz-midi-smf)  
or **bower install jzz-midi-smf**  
or **yarn add jzz-midi-smf**  
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
    var data = ... // load MIDI file as string
    var smf = new JZZ.MIDI.SMF(data);
    var player = smf.player();
    player.connect(midiout);
    player.play();


## More information

Please visit [**https://jazz-soft.net**](https://jazz-soft.net) for more information.  
Your questions and comments are welcome [**here**](https://jazz-soft.org).

We would really appreciate your [**support**](https://jazz-soft.net/donate)!
