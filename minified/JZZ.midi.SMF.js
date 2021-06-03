!function(t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t:"function"==typeof define&&define.amd?define("JZZ.midi.SMF",["JZZ"],t):t(JZZ)}(function(p){var n,i,f;function u(t){throw new Error(t)}function e(t){var r="";return 2097151<t&&(r+=String.fromCharCode(128+(t>>21&127))),16383<t&&(r+=String.fromCharCode(128+(t>>14&127))),127<t&&(r+=String.fromCharCode(128+(t>>7&127))),r+=String.fromCharCode(127&t)}function o(t){return String.fromCharCode(t>>8)+String.fromCharCode(255&t)}function s(t){return String.fromCharCode(t>>24&255)+String.fromCharCode(t>>16&255)+String.fromCharCode(t>>8&255)+String.fromCharCode(255&t)}function h(t){return String.fromCharCode(255&t)+String.fromCharCode(t>>8&255)+String.fromCharCode(t>>16&255)+String.fromCharCode(t>>24&255)}function a(){var t,r,i=this instanceof a?this:new a,n=1,o=96;if(1==arguments.length){if(arguments[0]instanceof a)return arguments[0].copy();if(arguments[0]instanceof w){i.type=0,i.ppqn=o,i.push(new m);for(var e=0;e<arguments[0].length;e++)i[0].add(0,arguments[0][e]);return i}try{if(arguments[0]instanceof ArrayBuffer)return i.load(String.fromCharCode.apply(null,new Uint8Array(arguments[0]))),i}catch(t){}try{if(arguments[0]instanceof Uint8Array||arguments[0]instanceof Int8Array)return i.load(String.fromCharCode.apply(null,new Uint8Array(arguments[0]))),i}catch(t){}try{if(arguments[0]instanceof Buffer)return i.load(arguments[0].toString("binary")),i}catch(t){}if("string"==typeof arguments[0]&&"0"!=arguments[0]&&"1"!=arguments[0]&&"2"!=arguments[0])return i.load(arguments[0]),i;n=parseInt(arguments[0])}else 2==arguments.length?(n=parseInt(arguments[0]),o=parseInt(arguments[1])):3==arguments.length?(n=parseInt(arguments[0]),t=parseInt(arguments[1]),r=parseInt(arguments[2])):arguments.length&&u("Invalid parameters");return(isNaN(n)||n<0||2<n)&&u("Invalid parameters"),i.type=n,void 0===t?((isNaN(o)||o<0||65535<o)&&u("Invalid parameters"),i.ppqn=o):(24!=t&&25!=t&&29!=t&&30!=t&&u("Invalid parameters"),(isNaN(r)||r<0||255<r)&&u("Invalid parameters"),i.fps=t,i.ppf=r),i}function d(t,r,i,n){i={off:t,msg:r,data:i};return void 0!==n&&(i.tick=n),i}function c(t){if(!(this instanceof c))return new c(t);for(var r in t)t.hasOwnProperty(r)&&(this[r]=t[r])}function l(t){switch(240&t){case 128:case 144:case 160:case 176:case 224:return 2;case 192:case 208:return 1}switch(t){case 241:case 243:return 1;case 242:return 2}return 0}function _(t,r,i){if(!(this instanceof _))return new _(t,r,i);var n;if(this.sub[t])return this.sub[t](t,r,i);for("string"==typeof t&&4==t.length||u("Invalid chunk type: "+t),n=0;n<t.length;n++)(t.charCodeAt(n)<0||255<t.charCodeAt(n))&&u("Invalid chunk type: "+t);for("string"!=typeof r&&u("Invalid data type: "+r),n=0;n<r.length;n++)(r.charCodeAt(n)<0||255<r.charCodeAt(n))&&u("Invalid data character: "+r[n]);this.type=t,this.data=r,this.offset=i}function y(t,r,i,n,o,e){var s=r.substr(i,n);s.length<n&&(t._complain(e,"Incomplete track data",n-s.length,o),s=(s+"\0\0").substr(0,n));for(var h=0;h<n;h++)127<s.charCodeAt(h)&&(t._complain(e,"Bad MIDI value",s.charCodeAt(h),o),s=s.substr(0,h)+"\0"+s.substr(h+1));return s}function g(t,r,i,n,o){var e=function(t){if(!t.length)return 0;if(t.charCodeAt(0)<128)return[1,t.charCodeAt(0)];var r=127&t.charCodeAt(0);return r<<=7,t.charCodeAt(1)<128?[2,r+t.charCodeAt(1)]:(r+=127&t.charCodeAt(1),r<<=7,t.charCodeAt(2)<128?[3,r+t.charCodeAt(2)]:(r+=127&t.charCodeAt(2),r<<=7,r+=127&t.charCodeAt(3),[4,t.charCodeAt(3)<128?r:-r]))}(r);return o&&(n+=e[1]),e[1]<0?(e[1]=-e[1],t._complain(i,"Bad byte sequence",r.charCodeAt(0)+"/"+r.charCodeAt(1)+"/"+r.charCodeAt(2)+"/"+r.charCodeAt(3),n)):4==e[0]&&e[1]<2097152?t._complain(i,"Long VLQ value",r.charCodeAt(0)+"/"+r.charCodeAt(1)+"/"+r.charCodeAt(2)+"/"+r.charCodeAt(3),n):3==e[0]&&e[1]<16384?t._complain(i,"Long VLQ value",r.charCodeAt(0)+"/"+r.charCodeAt(1)+"/"+r.charCodeAt(2),n):2==e[0]&&e[1]<128&&t._complain(i,"Long VLQ value",r.charCodeAt(0)+"/"+r.charCodeAt(1),n),e}function m(t,r){if(!(this instanceof m))return new m(t,r);if(void((this._orig=this)._tick=0)!==t){var i,n,o,e=0,s=0,h="";for(r=r||0,r+=8;s<t.length;)s+=(n=g(this,t.substr(s,4),o,e,!0))[0],e+=n[1],o=s+r,255==t.charCodeAt(s)?((i=t.substr(s,2)).length<2&&(this._complain(o,"Incomplete track data",3-i.length,e),i="ÿ/"),s+=2,s+=(n=g(this,t.substr(s,4),o+2,e))[0],this.push(new I(e,i,t.substr(s,n[1]),o)),s+=n[1]):240==t.charCodeAt(s)||247==t.charCodeAt(s)?(i=t.substr(s,1),s+=1,s+=(n=g(this,t.substr(s,4),o+1,e))[0],this.push(new I(e,i,t.substr(s,n[1]),o)),s+=n[1]):128&t.charCodeAt(s)?(h=t.substr(s,1),s+=1,(n=l(h.charCodeAt(0)))||this._complain(o,"Unexpected MIDI message",h.charCodeAt(0),e),this.push(new I(e,h,y(this,t,s,n,e,o),o)),s+=n):128&h.charCodeAt(0)&&((n=l(h.charCodeAt(0)))||this._complain(o,"Unexpected MIDI message",h.charCodeAt(0),e),this.push(new I(e,h,y(this,t,s,n,e,o),o)),s+=n)}else this.push(new I(0,"ÿ/",""))}function C(t){t=t.toString();return t=80<t.length?(t=t.substr(0,78)).substr(0,t.lastIndexOf(" "))+" ...":t}function v(t,r,i){return t.dd.length<i?d(t._off,"Invalid "+r+" meta event: "+(t.dd.length?"data too short":"no data"),C(t),t.tt):t.dd.length>i?d(t._off,"Invalid "+r+" meta event: data too long",C(t),t.tt):void 0}function A(t,r){return d(t._off,r+" meta events must be in the first track",C(t),t.tt)}function I(t,r,i,n){var o;if(255==r.charCodeAt(0))o=p.MIDI.smf(r.charCodeAt(1),i);else{for(var e=[r.charCodeAt(0)],s=0;s<i.length;s++)e.push(i.charCodeAt(s));o=p.MIDI(e)}return void 0!==n&&(o._off=n),o.tt=t,o}function S(){var t,r,i=new p.Widget;for(r in i._info.name="MIDI Player",i._info.manufacturer="Jazz-Soft",i._info.version=n,i.playing=!1,i._loop=0,i._data=[],i._pos=0,i._tick=(t=i,function(){t.tick()}),S.prototype)S.prototype.hasOwnProperty(r)&&(i[r]=S.prototype[r]);return i}function r(t){this._receive(t)}function k(t){return(t.charCodeAt(0)<<16)+(t.charCodeAt(1)<<8)+t.charCodeAt(2)}function M(){u("Not a SYX file")}function w(t){var r,i=this instanceof w?this:new w;if(void 0===t)return i;if(t instanceof a)return i.copy(t.player()._data),i;if(t instanceof w)return i.copy(t),i;try{t instanceof ArrayBuffer&&(t=String.fromCharCode.apply(null,new Uint8Array(t)))}catch(t){}try{(t instanceof Uint8Array||t instanceof Int8Array)&&(t=String.fromCharCode.apply(null,new Uint8Array(t)))}catch(t){}try{t instanceof Buffer&&(t=t.toString("binary"))}catch(t){}"string"!=typeof t&&(t=String.fromCharCode.apply(null,t));for(var n=[],o=0;o<t.length;){for(240!=t.charCodeAt(o)&&M();o<t.length;){if(r=t.charCodeAt(o),n.push(r),247==r){i.push(p.MIDI(n)),n=[];break}o++}o++}return n.length&&M(),i}p.MIDI.SMF||(n="1.5.1",i=p.lib.now,a.version=function(){return n},((a.prototype=[]).constructor=a).prototype.copy=function(){var t=new a;t.type=this.type,t.ppqn=this.ppqn,t.fps=this.fps,t.ppf=this.ppf,t.rmi=this.rmi,t.ntrk=this.ntrk;for(var r=0;r<this.length;r++)t.push(this[r].copy());return t},a.prototype._complain=function(t,r,i){this._warn||(this._warn=[]),this._warn.push(d(t,r,i))},a.prototype.load=function(t){var r=0;"RIFF"==t.substr(0,4)&&"RMIDdata"==t.substr(8,8)&&(this.rmi=!0,t=t.substr(r=20,t.charCodeAt(16)+256*t.charCodeAt(17)+65536*t.charCodeAt(18)+16777216*t.charCodeAt(19))),this.loadSMF(t,r)},f="MThd"+String.fromCharCode(0)+String.fromCharCode(0)+String.fromCharCode(0)+String.fromCharCode(6),a.prototype.loadSMF=function(t,r){var i;t.length||u("Empty file"),t.substr(0,8)!=f&&(-1!=(i=t.indexOf(f))?(t=t.substr(i),this._complain(r,"Extra leading characters",i),r+=i):u("Not a MIDI file")),this.type=16*t.charCodeAt(8)+t.charCodeAt(9),this.ntrk=16*t.charCodeAt(10)+t.charCodeAt(11),127<t.charCodeAt(12)?(this.fps=256-t.charCodeAt(12),this.ppf=t.charCodeAt(13)):this.ppqn=256*t.charCodeAt(12)+t.charCodeAt(13),2<this.type?this._complain(8+r,"Invalid MIDI file type",this.type):0==this.type&&1<this.ntrk&&this._complain(10+r,"Wrong number of tracks for the type 0 MIDI file",this.ntrk),this.ppf||this.ppqn||u("Invalid MIDI header");for(var n=0,o=14;o<t.length-8;){var e=o+r,s=t.substr(o,4);"MTrk"==s&&n++;var h=(t.charCodeAt(o+4)<<24)+(t.charCodeAt(o+5)<<16)+(t.charCodeAt(o+6)<<8)+t.charCodeAt(o+7);h<=0&&(h=t.length-o-8,this._complain(o+r+4,"Invalid track length",t.charCodeAt(o+4)+"/"+t.charCodeAt(o+5)+"/"+t.charCodeAt(o+6)+"/"+t.charCodeAt(o+7))),o+=8;var a=t.substr(o,h);this.push(new _(s,a,e)),"MThd"==s&&this._complain(e,"Unexpected chunk type","MThd"),o+=h}n!=this.ntrk&&(this._complain(r+10,"Incorrect number of tracks",this.ntrk),this.ntrk=n),this.ntrk||u("No MIDI tracks"),(!this.type&&1<this.ntrk||2<this.type)&&(this.type=1),o<t.length&&this._complain(r+o,"Extra trailing characters",t.length-o),o>t.length&&this._complain(r+t.length,"Incomplete data",o-t.length)},c.prototype.toString=function(){var t=[];return void 0!==this.off&&t.push("offset "+this.off),void 0!==this.track&&t.push("track "+this.track),void 0!==this.tick&&t.push("tick "+this.tick),t.join(" ")+" -- "+this.msg+" ("+this.data+")"},a.prototype.validate=function(){var t,r,i=[];if(this._warn)for(t=0;t<this._warn.length;t++)i.push(c(this._warn[t]));for(t=r=0;t<this.length;t++)this[t]instanceof m&&this[t]._validate(i,++r,1==this.type?t:0);if(i.sort(function(t,r){return(t.off||0)-(r.off||0)||(t.track||0)-(r.track||0)||(t.tick||0)-(r.tick||0)}),i.length)return i},a.prototype.dump=function(t){var r="";if(t)return"RIFF"+h((r=this.dump()).length+12)+"RMIDdata"+h(r.length)+r;for(var i=this.ntrk=0;i<this.length;i++)this[i]instanceof m&&this.ntrk++,r+=this[i].dump();return r=(this.ppqn?o(this.ppqn):String.fromCharCode(256-this.fps)+String.fromCharCode(this.ppf))+r,r=f+String.fromCharCode(0)+String.fromCharCode(this.type)+o(this.ntrk)+r},a.prototype.toBuffer=function(t){return Buffer.from(this.dump(t),"binary")},a.prototype.toUint8Array=function(t){for(var r=this.dump(t),t=new ArrayBuffer(r.length),i=new Uint8Array(t),n=0;n<r.length;n++)i[n]=r.charCodeAt(n);return i},a.prototype.toArrayBuffer=function(t){return this.toUint8Array(t).buffer},a.prototype.toInt8Array=function(t){return new Int8Array(this.toArrayBuffer(t))},a.prototype.toString=function(){for(var t=this.ntrk=0;t<this.length;t++)this[t]instanceof m&&this.ntrk++;var r=["SMF:","  type: "+this.type];for(this.ppqn?r.push("  ppqn: "+this.ppqn):r.push("  fps: "+this.fps,"  ppf: "+this.ppf),r.push("  tracks: "+this.ntrk),t=0;t<this.length;t++)r.push(this[t].toString());return r.join("\n")},a.prototype.player=function(){var t,r=new S;r.ppqn=this.ppqn,r.fps=this.fps,r.ppf=this.ppf;var i,n=[],o=0,e=0;for(a=0;a<this.length;a++)this[a]instanceof m&&n.push(this[a]);if(2==this.type)for(a=0;a<n.length;a++){for(t=0;t<n[a].length;t++)(i=p.MIDI(n[a][t])).track=a,e=i.tt+o,i.tt=e,r._data.push(i);o=e}else{var s=[];for(a=0;a<n.length;a++)s[a]=0;for(;;){for(var h=!0,a=0;a<n.length;a++){for(;s[a]<n[a].length&&n[a][s[a]].tt==e;)(i=p.MIDI(n[a][s[a]])).track=a,r._data.push(i),s[a]++;s[a]>=n[a].length||(h&&(o=n[a][s[a]].tt),h=!1,o>n[a][s[a]].tt&&(o=n[a][s[a]].tt))}if(e=o,h)break}}return r._type=this.type,r._tracks=n.length,r._timing(),r},(((a.Chunk=_).prototype=[]).constructor=_).prototype.copy=function(){return new _(this.type,this.data)},_.prototype.sub={MTrk:function(t,r,i){return new m(r,i)}},_.prototype.dump=function(){return this.type+s(this.data.length)+this.data},_.prototype.toString=function(){return this.type+": "+this.data.length+" bytes"},(((a.MTrk=m).prototype=[]).constructor=m).prototype.type="MTrk",m.prototype.copy=function(){for(var t=new m,r=t.length=0;r<this.length;r++)t.push(new p.MIDI(this[r]));return t},m.prototype._validate=function(t,r,i){var n,o;if(this._warn)for(n=0;n<this._warn.length;n++)(o=c(this._warn[n])).track=r,t.push(o);for(n=0;n<this.length;n++)(o=function(t,r){var i;if(void 0!==t.ff)return 127<t.ff?d(t._off,"Invalid meta event",C(t),t.tt):0!=t.ff?t.ff<10?t.dd.length?void 0:d(t._off,"Invalid Text meta event: no data",C(t),t.tt):32==t.ff?(i=v(t,"Channel Prefix",1))?i:15<t.dd.charCodeAt(0)?d(t._off,"Invalid Channel Prefix meta event: incorrect data",C(t),t.tt):void 0:33==t.ff?(i=v(t,"MIDI Port",1))?i:127<t.dd.charCodeAt(0)?d(t._off,"Invalid MIDI Port meta event: incorrect data",C(t),t.tt):void 0:47!=t.ff?81==t.ff?(i=v(t,"Tempo",3))?i:r?A(t,"Tempo"):void 0:84==t.ff?(i=v(t,"SMPTE",5))?i:24<=t.dd.charCodeAt(0)||60<=t.dd.charCodeAt(1)||60<=t.dd.charCodeAt(2)||30<=t.dd.charCodeAt(3)||200<=t.dd.charCodeAt(4)||t.dd.charCodeAt(4)%25?d(t._off,"Invalid SMPTE meta event: incorrect data",C(t),t.tt):r?A(t,"SMPTE"):void 0:88==t.ff?(i=v(t,"Time Signature",4))?i:8<t.dd.charCodeAt(1)?d(t._off,"Invalid Time Signature meta event: incorrect data",C(t),t.tt):r?A(t,"Time Signature"):void 0:89==t.ff?(i=v(t,"Key Signature",2))?i:1<t.dd.charCodeAt(1)||255<t.dd.charCodeAt(0)||7<t.dd.charCodeAt(0)&&t.dd.charCodeAt(0)<249?d(t._off,"Invalid Key Signature meta event: incorrect data",t.toString(),t.tt):void 0:127!=t.ff?d(t._off,"Unknown meta event",C(t),t.tt):void 0:(i=v(t,"End of Track",0))?i:void 0:(i=v(t,"Sequence Number",2))?i:void 0}(this[n],i))&&(o.track=r,t.push(c(o)))},m.prototype._complain=function(t,r,i,n){this._warn||(this._warn=[]),this._warn.push(d(t,r,i,n))},m.prototype.dump=function(){for(var t,r="",i=0,n="",o=0;o<this.length;o++)if(r+=e(this[o].tt-i),i=this[o].tt,void 0!==this[o].dd)r+="ÿ",r+=String.fromCharCode(this[o].ff),r+=e(this[o].dd.length),r+=this[o].dd;else if(240==this[o][0]||247==this[o][0])for(r+=String.fromCharCode(this[o][0]),r+=e(this[o].length-1),t=1;t<this[o].length;t++)r+=String.fromCharCode(this[o][t]);else for(this[o][0]!=n&&(n=this[o][0],r+=String.fromCharCode(this[o][0])),t=1;t<this[o].length;t++)r+=String.fromCharCode(this[o][t]);return"MTrk"+s(r.length)+r},m.prototype.toString=function(){for(var t=["MTrk:"],r=0;r<this.length;r++)t.push(this[r].tt+": "+this[r].toString());return t.join("\n  ")},m.prototype.add=function(t,r){if(t=parseInt(t),(isNaN(t)||t<0)&&u("Invalid parameter"),(r=p.MIDI(r)).tt=t,this[this.length-1].tt<t&&(this[this.length-1].tt=t),47==r.ff||240<r[0]&&247!=r[0])return this;for(var i=0;i<this.length-1&&!(this[i].tt>t);i++);return this.splice(i,0,r),this},m.prototype._ch=void 0,m.prototype._sxid=127,m.prototype._image=function(){var t=function(){};t.prototype=this._orig;t=new t;return t._ch=this._ch,t._sxid=this._sxid,t._tick=this._tick,t},m.prototype.send=function(t){return this._orig.add(this._tick,t),this},m.prototype.tick=function(t){if(t!=parseInt(t)||t<0)throw RangeError("Bad tick value: "+t);if(!t)return this;var r=this._image();return r._tick=this._tick+t,r},m.prototype.sxId=function(t){if((t=void 0===t?m.prototype._sxid:t)==this._sxid)return this;if(t!=parseInt(t)||t<0||127<t)throw RangeError("Bad MIDI value: "+t);var r=this._image();return r._sxid=t,r},m.prototype.ch=function(t){if(t==this._ch||void 0===t&&void 0===this._ch)return this;if(void 0!==t&&(t!=parseInt(t)||t<0||15<t))throw RangeError("Bad channel value: "+t+" (must be from 0 to 15)");var r=this._image();return r._ch=t,r},m.prototype.note=function(t,r,i,n){return this.noteOn(t,r,i),void 0===this._ch?0<n&&this.tick(n).noteOff(t,r):0<i&&this.tick(i).noteOff(t),this},p.lib.copyMidiHelpers(m),S.prototype.onEnd=function(){},S.prototype.loop=function(t){t==parseInt(t)&&0<t?this._loop=t:this._loop=t?-1:0},S.prototype.play=function(){this.event=void 0,this.playing=!0,this.paused=!1,this._ptr=0,this._pos=0,this._p0=0,this._t0=i(),this.tick()},S.prototype.stop=function(){this._pos=0,this.playing=!1,this.event="stop",this.paused=void 0},S.prototype.pause=function(){this.event="pause"},S.prototype.resume=function(){this.playing||(this.paused?(this.event=void 0,this._t0=i(),this.playing=!0,this.paused=!1,this.tick()):this.play())},S.prototype.sndOff=function(){for(var t=0;t<16;t++)this._emit(p.MIDI.allSoundOff(t));for(t=0;t<16;t++)this._emit(p.MIDI.resetAllControllers(t))},S.prototype._filter=r,S.prototype.filter=function(t){this._filter=t instanceof Function?t:r},S.prototype._receive=function(t){81==t.ff&&this.ppqn&&(this._mul=1e3*this.ppqn/k(t.dd),this.mul=this._mul*this._speed,this._t0=i(),this._p0=this._pos),this._emit(t)},S.prototype.tick=function(){var t,r=i();for(this._pos=this._p0+(r-this._t0)*this.mul;this._ptr<this._data.length&&!((t=this._data[this._ptr]).tt>this._pos);this._ptr++)this._filter(t);this._ptr>=this._data.length&&(this._loop&&-1!=this._loop&&this._loop--,this._loop?(this._ptr=0,this._p0=0,this._t0=r):this.stop(),this.onEnd()),"stop"==this.event&&(this.playing=!1,this.paused=!1,this._pos=0,this._ptr=0,this.sndOff(),this.event=void 0),"pause"==this.event&&(this.playing=!1,this.paused=!0,this._pos>=this._duration&&(this._pos=this._duration-1),this._p0=this._pos,this.sndOff(),this.event=void 0),this.playing&&p.lib.schedule(this._tick)},S.prototype.trim=function(){for(var t,r=[],i=0,n=0,o=0;o<this._data.length;o++)if((t=this._data[o]).length||1==t.ff||5==t.ff)for(;n<=o;n++)r.push(this._data[n]);return i+=this._data[o-1].tt-this._data[n-1].tt,this._data=r,this._timing(),i},S.prototype._timing=function(){var t,r,i,n;if(this._duration=this._data[this._data.length-1].tt,this._ttt=[],this.ppqn){for(this._mul=this.ppqn/500,r=this._mul,this._durationMS=i=0,this._ttt.push({t:0,m:r,ms:0}),t=0;t<this._data.length;t++)81==(n=this._data[t]).ff&&(this._durationMS+=(n.tt-i)/r,i=n.tt,r=1e3*this.ppqn/k(n.dd),this._ttt.push({t:i,m:r,ms:this._durationMS}));this._durationMS+=(this._duration-i)/r}else this._mul=this.fps*this.ppf/1e3,this._ttt.push({t:0,m:this._mul,ms:0}),this._durationMS=this._duration/this._mul;this._speed=1,this.mul=this._mul,this._ttt.push({t:this._duration,m:0,ms:this._durationMS}),this._durationMS||(this._durationMS=1)},S.prototype.speed=function(t){return void 0!==t&&((isNaN(parseFloat(t))||t<=0)&&(t=1),this._speed=t,this.mul=this._mul*this._speed,this._p0=this._pos-(i()-this._t0)*this.mul),this._speed},S.prototype.type=function(){return this._type},S.prototype.tracks=function(){return this._tracks},S.prototype.duration=function(){return this._duration},S.prototype.durationMS=function(){return this._durationMS},S.prototype.position=function(){return this._pos},S.prototype.positionMS=function(){return this.tick2ms(this._pos)},S.prototype.jump=function(t){isNaN(parseFloat(t))&&u("Not a number: "+t),(t=t<0?0:t)>=this._duration&&(t=this._duration-1),this._goto(t)},S.prototype.jumpMS=function(t){isNaN(parseFloat(t))&&u("Not a number: "+t),(t=t<0?0:t)>=this._durationMS&&(t=this._durationMS-1),this._goto(this._ms2t(t))},S.prototype._t2ms=function(t){if(!t)return 0;for(var r=0;this._ttt[r].t<t;r++);return this._ttt[--r].ms+(t-this._ttt[r].t)/this._ttt[r].m},S.prototype._ms2t=function(t){if(!t)return 0;for(var r=0;this._ttt[r].ms<t;r++);return this._ttt[--r].t+(t-this._ttt[r].ms)*this._ttt[r].m},S.prototype._goto=function(t){this._pos=t,this.playing||(this.paused=!!t),this._toPos(),this.playing&&this.sndOff()},S.prototype._toPos=function(){for(this._ptr=0;this._ptr<this._data.length;this._ptr++){var t=this._data[this._ptr];if(t.tt>=this._pos)break;81==t.ff&&this.ppqn&&(this._mul=1e3*this.ppqn/k(t.dd))}this.mul=this._mul*this._speed,this._t0=i(),this._p0=this._pos},S.prototype.tick2ms=function(t){return isNaN(parseFloat(t))&&u("Not a number: "+t),t<=0?0:t>=this._duration?this._durationMS:this._t2ms(t)},S.prototype.ms2tick=function(t){return isNaN(parseFloat(t))&&u("Not a number: "+t),t<=0?0:t>=this._durationMS?this._duration:this._ms2t(t)},p.MIDI.SMF=a,w.version=function(){return n},((w.prototype=[]).constructor=w).prototype.copy=function(t){for(var r=0;r<t.length;r++)t[r].isSMF()||(t[r].isFullSysEx()?this.push(p.MIDI(t[r])):M())},w.prototype.dump=function(){for(var t,r="",i=0;i<this.length;i++)for(t=0;t<this[i].length;t++)r+=String.fromCharCode(this[i][t]);return r},w.prototype.toBuffer=function(){return Buffer.from(this.dump(),"binary")},w.prototype.toUint8Array=function(){for(var t=this.dump(),r=new ArrayBuffer(t.length),i=new Uint8Array(r),n=0;n<t.length;n++)i[n]=t.charCodeAt(n);return i},w.prototype.toArrayBuffer=function(){return this.toUint8Array().buffer},w.prototype.toInt8Array=function(){return new Int8Array(this.toArrayBuffer())},w.prototype.toString=function(){for(var t=["SYX:"],r=0;r<this.length;r++)t.push(this[r].toString());return t.join("\n  ")},w.prototype.player=function(){var t,r=new S;for(r.ppqn=96,t=0;t<this.length;t++){var i=p.MIDI(this[t]);i.tt=0,r._data.push(i)}return r._type=0,r._tracks=1,r._timing(),r.sndOff=function(){},r},p.MIDI.SYX=w)});