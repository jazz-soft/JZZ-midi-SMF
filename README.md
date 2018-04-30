# JZZ-midi-SMF

The work is still in progress, but the working demo is already there...

## Demo

In the working copy directory, run
`npm install`,  
then run
`node test`,
or open `test.html`.

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
Accepted file formats: `.mid`, `.kar`, `.rmi`

##### Playing MIDI file

    var midiout = JZZ().openMidiOut();
    var data = ... // see test.html for the
                   // various ways to load MIDI file
    var smf = new JZZ.MIDI.SMF(data);
    var player = smf.player();
    player.connect(midiout);
    player.play();
