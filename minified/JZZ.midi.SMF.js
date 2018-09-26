!function(t,i){"object"==typeof exports&&"undefined"!=typeof module?module.exports=i:"function"==typeof define&&define.amd?define("JZZ.midi.SMF",["JZZ"],i):i(JZZ)}(0,function(a){if(!a.MIDI.SMF){var o="1.0.2",r=a.lib.now;((u.prototype=[]).constructor=u).version=function(){return o},u.prototype.copy=function(){var t=new u;t.type=this.type,t.ppqn=this.ppqn,t.fps=this.fps,t.ppf=this.ppf,t.rmi=this.rmi,t.ntrk=this.ntrk;for(var i=0;i<this.length;i++)t.push(this[i].copy());return t},u.prototype.load=function(t){"RIFF"==t.substr(0,4)&&"RMIDdata"==t.substr(8,8)&&(this.rmi=!0,t=t.substr(20,t.charCodeAt(16)+256*t.charCodeAt(17)+65536*t.charCodeAt(18)+16777216*t.charCodeAt(19))),this.loadSMF(t)},u.prototype.loadSMF=function(t){"MThd\0\0\0"!=t.substr(0,8)&&n("Not a MIDI file"),this.type=16*t.charCodeAt(8)+t.charCodeAt(9),this.ntrk=16*t.charCodeAt(10)+t.charCodeAt(11),127<t.charCodeAt(12)?(this.fps=256-t.charCodeAt(12),this.ppf=t.charCodeAt(13)):this.ppqn=256*t.charCodeAt(12)+t.charCodeAt(13),(2<this.type||0==this.type&&1<this.ntrk||!this.ppf&&!this.ppqn)&&n("Invalid MIDI header");for(var i=0,r=14;r<t.length;){var o=t.substr(r,4);"MTrk"==o&&i++;var s=(t.charCodeAt(r+4)<<24)+(t.charCodeAt(r+5)<<16)+(t.charCodeAt(r+6)<<8)+t.charCodeAt(r+7);r+=8;var h=t.substr(r,s);this.push(new l(o,h)),r+=s}r==t.length&&i==this.ntrk||n("Corrupted MIDI file")},u.prototype.dump=function(t){var i="";if(t)return"RIFF"+f((i=this.dump()).length+12)+"RMIDdata"+f(i.length)+i;for(var r=this.ntrk=0;r<this.length;r++)this[r]instanceof C&&this.ntrk++,i+=this[r].dump();return i=(this.ppqn?s(this.ppqn):String.fromCharCode(256-this.fps)+String.fromCharCode(this.ppf))+i,i="MThd\0\0\0\0"+String.fromCharCode(this.type)+s(this.ntrk)+i},u.prototype.toString=function(){var t;for(t=this.ntrk=0;t<this.length;t++)this[t]instanceof C&&this.ntrk++;var i=["SMF:","  type: "+this.type];for(this.ppqn?i.push("  ppqn: "+this.ppqn):i.push("  fps: "+this.fps,"  ppf: "+this.ppf),i.push("  tracks: "+this.ntrk),t=0;t<this.length;t++)i.push(this[t].toString());return i.join("\n")},u.prototype.player=function(){var t,i,r=new y;r.ppqn=this.ppqn,r.fps=this.fps,r.ppf=this.ppf;var o,s=[],h=0,n=0;for(t=0;t<this.length;t++)this[t]instanceof C&&s.push(this[t]);if(2==this.type)for(t=0;t<s.length;t++){for(i=0;i<s[t].length;i++)(o=a.MIDI(s[t][i])).track=t,n=o.tt+h,o.tt=n,r._data.push(o);h=n}else{var e=[];for(t=0;t<s.length;t++)e[t]=0;for(;;){var p=!0;for(t=0;t<s.length;t++){for(;e[t]<s[t].length&&s[t][e[t]].tt==n;)(o=a.MIDI(s[t][e[t]])).track=t,r._data.push(o),e[t]++;e[t]>=s[t].length||(p&&(h=s[t][e[t]].tt),p=!1,h>s[t][e[t]].tt&&(h=s[t][e[t]].tt))}if(n=h,p)break}}return r.ppqn?r.mul=r.ppqn/500:r.mul=r.fps*r.ppf/1e3,r._duration=n,r},(((u.Chunk=l).prototype=[]).constructor=l).prototype.copy=function(){return new l(this.type,this.data)},l.prototype.sub={MThd:function(){n("Illegal chunk type: MThd")},MTrk:function(t,i){return new C(i)}},l.prototype.dump=function(){return this.type+p(this.data.length)+this.data},l.prototype.toString=function(){return this.type+": "+this.data.length+" bytes"},(((u.MTrk=C).prototype=[]).constructor=C).prototype.copy=function(){for(var t=new C,i=t.length=0;i<this.length;i++)t.push(new a.MIDI(this[i]));return t},C.prototype.dump=function(){var t,i,r="",o=0,s="";for(t=0;t<this.length;t++)if(r+=h(this[t].tt-o),o=this[t].tt,void 0!==this[t].dd)r+="ÿ",r+=String.fromCharCode(this[t].ff),r+=h(this[t].dd.length),r+=this[t].dd;else if(240==this[t][0]||247==this[t][0])for(r+=String.fromCharCode(this[t][0]),r+=h(this[t].length-1),i=1;i<this[t].length;i++)r+=String.fromCharCode(this[t][i]);else for(this[t][0]!=s&&(s=this[t][0],r+=String.fromCharCode(this[t][0])),i=1;i<this[t].length;i++)r+=String.fromCharCode(this[t][i]);return"MTrk"+p(r.length)+r},C.prototype.toString=function(){for(var t=["MTrk:"],i=0;i<this.length;i++)t.push(this[i].tt+": "+this[i].toString());return t.join("\n  ")},C.prototype.add=function(t,i){if(t=parseInt(t),(isNaN(t)||t<0)&&n("Invalid parameter"),(i=a.MIDI(i)).tt=t,this[this.length-1].tt<t&&(this[this.length-1].tt=t),47==i.ff||255==i[0])return this;var r,o=g(i);for(r=0;r<this.length&&!(this[r].tt>t)&&!(this[r].tt==t&&g(this[r])>o);r++);return this.splice(r,0,i),this},C.prototype.send=function(t){this._orig.add(this._tick,t)},C.prototype.tick=function(t){if(t!=parseInt(t)||t<0)throw RangeError("Bad tick value: "+t);if(!t)return this;var i=function(){};i.prototype=this._orig;var r=new i;return r._tick=this._tick+t,r},C.prototype.note=function(t,i,r,o){return this.noteOn(t,i,r),o&&this.tick(o).noteOff(t,i),this},C.prototype.ch=function(t){if(void 0===t)return this;if(t!=parseInt(t)||t<0||15<t)throw RangeError("Bad channel value: "+t+" (must be from 0 to 15)");return new i(this._orig,t,this._tick)},(i.prototype=new C).tick=function(t){if(t!=parseInt(t)||t<0)throw RangeError("Bad tick value: "+t);return t?new i(this._orig,this._chan,this._tick+t):this},i.prototype.ch=function(t){if(void 0===t)return this._orig.tick(this._tick);if(t!=parseInt(t)||t<0||15<t)throw RangeError("Bad channel value: "+t+" (must be from 0 to 15)");return t==this._chan?this:new i(this._orig,t,this._tick)},i.prototype.note=function(t,i,r){return this.noteOn(t,i),r&&this.tick(r).noteOff(t),this},a.lib.copyMidiHelpers(C,i),y.prototype.onEnd=function(){},y.prototype.onData=function(){},y.prototype.loop=function(t){t==parseInt(t)&&0<t?this._loop=t:this._loop=t?-1:0},y.prototype.play=function(){this.event=void 0,this.playing=!0,this.paused=!1,this._ptr=0,this._pos=0,this._p0=0,this._t0=r(),this.tick()},y.prototype.stop=function(){this._pos=0,this.event="stop",this.paused=void 0},y.prototype.pause=function(){this.event="pause"},y.prototype.resume=function(){this.playing||(this.paused?(this.event=void 0,this._t0=r(),this.playing=!0,this.paused=!1,this.tick()):this.play())},y.prototype.sndOff=function(){for(var t=0;t<16;t++)this._emit(a.MIDI.allSoundOff(t))},y.prototype.tick=function(){var t,i=r();for(this._pos=this._p0+(i-this._t0)*this.mul;this._ptr<this._data.length&&!((t=this._data[this._ptr]).tt>this._pos);this._ptr++)81==t.ff&&this.ppqn&&(this.mul=1e3*this.ppqn/((t.dd.charCodeAt(0)<<16)+(t.dd.charCodeAt(1)<<8)+t.dd.charCodeAt(2)),this._p0=this._pos-(i-this._t0)*this.mul),this._emit(t);this._ptr>=this._data.length&&(this._loop&&-1!=this._loop&&this._loop--,this._loop?(this._ptr=0,this._p0=0,this._t0=i):this.stop(),this.onEnd()),"stop"==this.event&&(this.playing=!1,this.paused=!1,this._pos=0,this._ptr=0,this.sndOff(),this.event=void 0),"pause"==this.event&&(this.playing=!1,this.paused=!0,this._pos>=this._duration&&(this._pos=this._duration-1),this._p0=this._pos,this.sndOff(),this.event=void 0),this.playing&&a.lib.schedule(this._tick)},y.prototype.duration=function(){return this._duration},y.prototype.position=function(){return this._pos},y.prototype.jump=function(t){isNaN(parseFloat(t))&&n("Not a number: "+t),t<0&&(t=0),t>=this._duration&&(t=this._duration-1),this._pos=t,this._p0=t,this._t0=r(),this.playing||(this.paused=!!t),this._toPos(),this.playing&&this.sndOff()},y.prototype._toPos=function(){for(this._ptr=0;this._ptr<this._data.length&&(e=this._data[this._ptr],!(e.tt>=this._pos));this._ptr++)81==e.ff&&this.ppqn&&(this.mul=1e3*this.ppqn/((e.dd.charCodeAt(0)<<16)+(e.dd.charCodeAt(1)<<8)+e.dd.charCodeAt(2)),this._p0=this._pos-(r()-this._t0)*this.mul)},a.MIDI.SMF=u}function n(t){throw new Error(t)}function h(t){var i="";return 2097151<t&&(i+=String.fromCharCode(128+(t>>21&127))),16383<t&&(i+=String.fromCharCode(128+(t>>14&127))),127<t&&(i+=String.fromCharCode(128+(t>>7&127))),i+=String.fromCharCode(127&t)}function s(t){return String.fromCharCode(t>>8)+String.fromCharCode(255&t)}function p(t){return String.fromCharCode(t>>24&255)+String.fromCharCode(t>>16&255)+String.fromCharCode(t>>8&255)+String.fromCharCode(255&t)}function f(t){return String.fromCharCode(255&t)+String.fromCharCode(t>>8&255)+String.fromCharCode(t>>16&255)+String.fromCharCode(t>>24&255)}function u(){var t,i,r=this instanceof u?this:r=new u,o=1,s=96;if(1==arguments.length){if(arguments[0]instanceof u)return arguments[0].copy();if("string"==typeof arguments[0]&&"0"!=arguments[0]&&"1"!=arguments[0]&&"2"!=arguments[0])return r.load(arguments[0]),r;o=parseInt(arguments[0])}else 2==arguments.length?(o=parseInt(arguments[0]),s=parseInt(arguments[1])):3==arguments.length?(o=parseInt(arguments[0]),t=parseInt(arguments[1]),i=parseInt(arguments[2])):arguments.length&&n("Invalid parameters");return(isNaN(o)||o<0||2<o)&&n("Invalid parameters"),r.type=o,void 0===t?((isNaN(s)||s<0||65535<o)&&n("Invalid parameters"),r.ppqn=s):(24!=t&&25!=t&&29!=t&&30!=t&&n("Invalid parameters"),(isNaN(i)||i<0||255<o)&&n("Invalid parameters"),r.fps=t,r.ppf=i),r}function d(t){if(t.charCodeAt(0)<128)return t.charCodeAt(0);var i=127&t.charCodeAt(0);return i<<=7,t.charCodeAt(1)<128?i+t.charCodeAt(1):(i+=127&t.charCodeAt(1),i<<=7,t.charCodeAt(2)<128?i+t.charCodeAt(2):(i+=127&t.charCodeAt(2),i<<=7,t.charCodeAt(3)<128?i+t.charCodeAt(3):void n("Corrupted MIDI track")))}function c(t){switch(240&t){case 128:case 144:case 160:case 176:case 224:return 2;case 192:case 208:return 1;default:n("Corrupted MIDI track")}}function l(t,i){var r;if(this.sub[t])return this.sub[t](t,i);for("string"==typeof t&&4==t.length||n("Invalid chunk type: "+t),r=0;r<t.length;r++)(t.charCodeAt(r)<0||255<t.charCodeAt(r))&&n("Invalid chunk type: "+t);for("string"!=typeof i&&n("Invalid data type: "+i),r=0;r<i.length;r++)(i.charCodeAt(r)<0||255<i.charCodeAt(r))&&n("Invalid data character: "+i[r]);this.type=t,this.data=i}function C(t){if(void((this._orig=this)._tick=0)!==t)for(var i,r,o,s=0,h=0,n="";h<t.length;)i=d(t.substr(h,4)),h++,127<i&&h++,16383<i&&h++,2097151<i&&h++,s+=i,255==t.charCodeAt(h)?(r=t.substr(h,2),h+=2,o=d(t.substr(h,4)),h++,127<o&&h++,16383<o&&h++,2097151<o&&h++,this.push(new _(s,r,t.substr(h,o))),h+=o):240==t.charCodeAt(h)||247==t.charCodeAt(h)?(r=t.substr(h,1),h+=1,o=d(t.substr(h,4)),h++,127<o&&h++,16383<o&&h++,2097151<o&&h++,this.push(new _(s,r,t.substr(h,o))),h+=o):128&t.charCodeAt(h)?(n=t.substr(h,1),h+=1,o=c(n.charCodeAt(0)),this.push(new _(s,n,t.substr(h,o))),h+=o):128&n.charCodeAt(0)&&(o=c(n.charCodeAt(0)),this.push(new _(s,n,t.substr(h,o))),h+=o);else this.push(new _(0,"ÿ/",""))}function g(t){var i={0:0,3:1,2:2,84:3,81:4,88:5,89:6,32:7,33:7,6:8,4:9,1:16,5:16,127:17,47:20}[t.ff];if(void 0!==i)return i;if(t.length){var r=t[0]>>4;if(void 0!==(i={8:10,15:11,11:12,12:13,10:15,13:15,14:15}[r]))return i;if(9==r)return t[1]?14:10}return 18}function i(t,i,r){this._orig=t,this._chan=i,this._tick=r}function _(t,i,r){var o;if(this.tt=t,this.status=i,this.data=r,255==i.charCodeAt(0))o=a.MIDI.smf(i.charCodeAt(1),r);else{for(var s=[i.charCodeAt(0)],h=0;h<r.length;h++)s.push(r.charCodeAt(h));o=a.MIDI(s)}return o.tt=t,o}function y(){var t,i=new a.Widget;for(var r in i._info.name="MIDI Player",i._info.manufacturer="Jazz-Soft",i._info.version=o,i.playing=!1,i._loop=0,i._data=[],i._pos=0,i._tick=(t=i,function(){t.tick()}),y.prototype)y.prototype.hasOwnProperty(r)&&(i[r]=y.prototype[r]);return i}});