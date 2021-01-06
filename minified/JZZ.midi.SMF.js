!function(t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t:"function"==typeof define&&define.amd?define("JZZ.midi.SMF",["JZZ"],t):t(JZZ)}(function(p){var e,r,f;function d(t){throw new Error(t)}function o(t){var i="";return 2097151<t&&(i+=String.fromCharCode(128+(t>>21&127))),16383<t&&(i+=String.fromCharCode(128+(t>>14&127))),127<t&&(i+=String.fromCharCode(128+(t>>7&127))),i+=String.fromCharCode(127&t)}function n(t){return String.fromCharCode(t>>8)+String.fromCharCode(255&t)}function s(t){return String.fromCharCode(t>>24&255)+String.fromCharCode(t>>16&255)+String.fromCharCode(t>>8&255)+String.fromCharCode(255&t)}function h(t){return String.fromCharCode(255&t)+String.fromCharCode(t>>8&255)+String.fromCharCode(t>>16&255)+String.fromCharCode(t>>24&255)}function a(){var t,i,r=this instanceof a?this:r=new a,e=1,n=96;if(1==arguments.length){if(arguments[0]instanceof a)return arguments[0].copy();if("string"==typeof arguments[0]&&"0"!=arguments[0]&&"1"!=arguments[0]&&"2"!=arguments[0])return r.load(arguments[0]),r;e=parseInt(arguments[0])}else 2==arguments.length?(e=parseInt(arguments[0]),n=parseInt(arguments[1])):3==arguments.length?(e=parseInt(arguments[0]),t=parseInt(arguments[1]),i=parseInt(arguments[2])):arguments.length&&d("Invalid parameters");return(isNaN(e)||e<0||2<e)&&d("Invalid parameters"),r.type=e,void 0===t?((isNaN(n)||n<0||65535<e)&&d("Invalid parameters"),r.ppqn=n):(24!=t&&25!=t&&29!=t&&30!=t&&d("Invalid parameters"),(isNaN(i)||i<0||255<e)&&d("Invalid parameters"),r.fps=t,r.ppf=i),r}function u(t,i,r,e){var n={off:t,msg:i,data:r};return void 0!==e&&(n.tick=e),n}function c(t){if(!(this instanceof c))return new c(t);for(var i in t)t.hasOwnProperty(i)&&(this[i]=t[i])}function _(t){switch(240&t){case 128:case 144:case 160:case 176:case 224:return 2;case 192:case 208:return 1}switch(t){case 241:case 243:return 1;case 242:return 2}return 0}function l(t,i,r){if(!(this instanceof l))return new l(t,i,r);var e;if(this.sub[t])return this.sub[t](t,i,r);for("string"==typeof t&&4==t.length||d("Invalid chunk type: "+t),e=0;e<t.length;e++)(t.charCodeAt(e)<0||255<t.charCodeAt(e))&&d("Invalid chunk type: "+t);for("string"!=typeof i&&d("Invalid data type: "+i),e=0;e<i.length;e++)(i.charCodeAt(e)<0||255<i.charCodeAt(e))&&d("Invalid data character: "+i[e]);this.type=t,this.data=i,this.offset=r}function g(t,i,r,e,n,o){var s=i.substr(r,e);s.length<e&&(t._complain(o,"Incomplete track data",e-s.length,n),s=(s+"\0\0").substr(0,e));for(var h=0;h<e;h++)127<s.charCodeAt(h)&&(t._complain(o,"Bad MIDI value",s.charCodeAt(h),n),s=s.substr(0,h)+"\0"+s.substr(h+1));return s}function m(t,i,r,e){var n=function(t){if(!t.length)return 0;if(t.charCodeAt(0)<128)return t.charCodeAt(0);var i=127&t.charCodeAt(0);return i<<=7,t.charCodeAt(1)<128?i+t.charCodeAt(1):(i+=127&t.charCodeAt(1),i<<=7,t.charCodeAt(2)<128?i+t.charCodeAt(2):(i+=127&t.charCodeAt(2),i<<=7,i+=127&t.charCodeAt(3),t.charCodeAt(3)<128?i:-i))}(i);return n<0&&(n=-n,t._complain(r,"Bad byte sequence",i.charCodeAt(0)+"/"+i.charCodeAt(1)+"/"+i.charCodeAt(2)+"/"+i.charCodeAt(3),e)),n}function C(t,i){if(!(this instanceof C))return new C(t,i);if(void((this._orig=this)._tick=0)!==t){var r,e,n,o,s=0,h=0,a="";for(i=i||0,i+=8;h<t.length;)r=m(this,t.substr(h,4),o,s+r),h++,127<r&&h++,16383<r&&h++,2097151<r&&h++,s+=r,o=h+i,255==t.charCodeAt(h)?((e=t.substr(h,2)).length<2&&(this._complain(o,"Incomplete track data",3-e.length,s),e="ÿ/"),h+=2,n=m(this,t.substr(h,4),o+2,s),h++,127<n&&h++,16383<n&&h++,2097151<n&&h++,this.push(new I(s,e,t.substr(h,n),o)),h+=n):240==t.charCodeAt(h)||247==t.charCodeAt(h)?(e=t.substr(h,1),h+=1,n=m(this,t.substr(h,4),o+1,s),h++,127<n&&h++,16383<n&&h++,2097151<n&&h++,this.push(new I(s,e,t.substr(h,n),o)),h+=n):128&t.charCodeAt(h)?(a=t.substr(h,1),h+=1,(n=_(a.charCodeAt(0)))||this._complain(o,"Unexpected MIDI message",a.charCodeAt(0),s),this.push(new I(s,a,g(this,t,h,n,s,o),o)),h+=n):128&a.charCodeAt(0)&&((n=_(a.charCodeAt(0)))||this._complain(o,"Unexpected MIDI message",a.charCodeAt(0),s),this.push(new I(s,a,g(this,t,h,n,s,o),o)),h+=n)}else this.push(new I(0,"ÿ/",""))}function y(t,i,r){return t.dd.length<r?u(t._off,"Invalid "+i+" meta event: "+(t.dd.length?"data too short":"no data"),t.toString(),t.tt):t.dd.length>r?u(t._off,"Invalid "+i+" meta event: data too long",t.toString(),t.tt):void 0}function v(t,i){return u(t._off,i+" meta events must be in the first track",t.toString(),t.tt)}function I(t,i,r,e){var n;if(255==i.charCodeAt(0))n=p.MIDI.smf(i.charCodeAt(1),r);else{for(var o=[i.charCodeAt(0)],s=0;s<r.length;s++)o.push(r.charCodeAt(s));n=p.MIDI(o)}return void 0!==e&&(n._off=e),n.tt=t,n}function S(){var t,i=new p.Widget;for(var r in i._info.name="MIDI Player",i._info.manufacturer="Jazz-Soft",i._info.version=e,i.playing=!1,i._loop=0,i._data=[],i._pos=0,i._tick=(t=i,function(){t.tick()}),S.prototype)S.prototype.hasOwnProperty(r)&&(i[r]=S.prototype[r]);return i}function i(t){this._receive(t)}function k(t){return(t.charCodeAt(0)<<16)+(t.charCodeAt(1)<<8)+t.charCodeAt(2)}p.MIDI.SMF||(e="1.4.3",r=p.lib.now,a.version=function(){return e},((a.prototype=[]).constructor=a).prototype.copy=function(){var t=new a;t.type=this.type,t.ppqn=this.ppqn,t.fps=this.fps,t.ppf=this.ppf,t.rmi=this.rmi,t.ntrk=this.ntrk;for(var i=0;i<this.length;i++)t.push(this[i].copy());return t},a.prototype._complain=function(t,i,r){this._warn||(this._warn=[]),this._warn.push(u(t,i,r))},a.prototype.load=function(t){var i=0;"RIFF"==t.substr(0,4)&&"RMIDdata"==t.substr(8,8)&&(this.rmi=!0,i=20,t=t.substr(20,t.charCodeAt(16)+256*t.charCodeAt(17)+65536*t.charCodeAt(18)+16777216*t.charCodeAt(19))),this.loadSMF(t,i)},f="MThd"+String.fromCharCode(0)+String.fromCharCode(0)+String.fromCharCode(0)+String.fromCharCode(6),a.prototype.loadSMF=function(t,i){var r;t.length||d("Empty file"),t.substr(0,8)!=f&&(-1!=(r=t.indexOf(f))?(t=t.substr(r),this._complain(i,"Extra leading characters",r),i+=r):d("Not a MIDI file")),this.type=16*t.charCodeAt(8)+t.charCodeAt(9),this.ntrk=16*t.charCodeAt(10)+t.charCodeAt(11),127<t.charCodeAt(12)?(this.fps=256-t.charCodeAt(12),this.ppf=t.charCodeAt(13)):this.ppqn=256*t.charCodeAt(12)+t.charCodeAt(13),2<this.type?this._complain(8+i,"Invalid MIDI file type",this.type):0==this.type&&1<this.ntrk&&this._complain(10+i,"Wrong number of tracks for the type 0 MIDI file",this.ntrk),this.ppf||this.ppqn||d("Invalid MIDI header");for(var e=0,n=14;n<t.length-8;){var o=n+i,s=t.substr(n,4);"MTrk"==s&&e++;var h=(t.charCodeAt(n+4)<<24)+(t.charCodeAt(n+5)<<16)+(t.charCodeAt(n+6)<<8)+t.charCodeAt(n+7);h<=0&&(h=t.length-n-8,this._complain(n+i+4,"Invalid track length",t.charCodeAt(n+4)+"/"+t.charCodeAt(n+5)+"/"+t.charCodeAt(n+6)+"/"+t.charCodeAt(n+7))),n+=8;var a=t.substr(n,h);this.push(new l(s,a,o)),"MThd"==s&&this._complain(o,"Unexpected chunk type","MThd"),n+=h}e!=this.ntrk&&(this._complain(i+10,"Incorrect number of tracks",this.ntrk),this.ntrk=e),this.ntrk||d("No MIDI tracks"),(!this.type&&1<this.ntrk||2<this.type)&&(this.type=1),n<t.length&&this._complain(i+n,"Extra trailing characters",t.length-n),n>t.length&&this._complain(i+t.length,"Incomplete data",n-t.length)},c.prototype.toString=function(){var t=[];return void 0!==this.off&&t.push("offset "+this.off),void 0!==this.track&&t.push("track "+this.track),void 0!==this.tick&&t.push("tick "+this.tick),t.join(" ")+" -- "+this.msg+" ("+this.data+")"},a.prototype.validate=function(){var t,i,r=[];if(this._warn)for(t=0;t<this._warn.length;t++)r.push(c(this._warn[t]));for(t=i=0;t<this.length;t++)this[t]instanceof C&&(i++,this[t]._validate(r,i,1==this.type?t:0));if(r.sort(function(t,i){return(t.off||0)-(i.off||0)||(t.track||0)-(i.track||0)||(t.tick||0)-(i.tick||0)}),r.length)return r},a.prototype.dump=function(t){var i="";if(t)return"RIFF"+h((i=this.dump()).length+12)+"RMIDdata"+h(i.length)+i;for(var r=this.ntrk=0;r<this.length;r++)this[r]instanceof C&&this.ntrk++,i+=this[r].dump();return i=(this.ppqn?n(this.ppqn):String.fromCharCode(256-this.fps)+String.fromCharCode(this.ppf))+i,i=f+String.fromCharCode(0)+String.fromCharCode(this.type)+n(this.ntrk)+i},a.prototype.toString=function(){for(var t=this.ntrk=0;t<this.length;t++)this[t]instanceof C&&this.ntrk++;var i=["SMF:","  type: "+this.type];for(this.ppqn?i.push("  ppqn: "+this.ppqn):i.push("  fps: "+this.fps,"  ppf: "+this.ppf),i.push("  tracks: "+this.ntrk),t=0;t<this.length;t++)i.push(this[t].toString());return i.join("\n")},a.prototype.player=function(){var t,i=new S;i.ppqn=this.ppqn,i.fps=this.fps,i.ppf=this.ppf,i.ppf=this.ppf;var r,e=[],n=0,o=0;for(a=0;a<this.length;a++)this[a]instanceof C&&e.push(this[a]);if(2==this.type)for(a=0;a<e.length;a++){for(t=0;t<e[a].length;t++)(r=p.MIDI(e[a][t])).track=a,o=r.tt+n,r.tt=o,i._data.push(r);n=o}else{var s=[];for(a=0;a<e.length;a++)s[a]=0;for(;;){for(var h=!0,a=0;a<e.length;a++){for(;s[a]<e[a].length&&e[a][s[a]].tt==o;)(r=p.MIDI(e[a][s[a]])).track=a,i._data.push(r),s[a]++;s[a]>=e[a].length||(h&&(n=e[a][s[a]].tt),h=!1,n>e[a][s[a]].tt&&(n=e[a][s[a]].tt))}if(o=n,h)break}}return i._type=this.type,i._tracks=e.length,i._timing(),i},(((a.Chunk=l).prototype=[]).constructor=l).prototype.copy=function(){return new l(this.type,this.data)},l.prototype.sub={MTrk:function(t,i,r){return new C(i,r)}},l.prototype.dump=function(){return this.type+s(this.data.length)+this.data},l.prototype.toString=function(){return this.type+": "+this.data.length+" bytes"},(((a.MTrk=C).prototype=[]).constructor=C).prototype.copy=function(){for(var t=new C,i=t.length=0;i<this.length;i++)t.push(new p.MIDI(this[i]));return t},C.prototype._validate=function(t,i,r){var e,n;if(this._warn)for(e=0;e<this._warn.length;e++)(n=c(this._warn[e])).track=i,t.push(n);for(e=0;e<this.length;e++)(n=function(t,i){var r;if(void 0!==t.ff){if(127<t.ff)return u(t._off,"Invalid meta event",t.toString(),t.tt);if(0==t.ff){if(r=y(t,"Sequence Number",2))return r}else if(t.ff<10){if(!t.dd.length)return u(t._off,"Invalid Text meta event: no data",t.toString(),t.tt)}else if(32==t.ff){if(r=y(t,"Channel Prefix",1))return r;if(15<t.dd.charCodeAt(0))return u(t._off,"Invalid Channel Prefix meta event: incorrect data",t.toString(),t.tt)}else if(33==t.ff){if(r=y(t,"MIDI Port",1))return r;if(127<t.dd.charCodeAt(0))return u(t._off,"Invalid MIDI Port meta event: incorrect data",t.toString(),t.tt)}else if(47==t.ff){if(r=y(t,"End of Track",0))return r}else if(81==t.ff){if(r=y(t,"Tempo",3))return r;if(i)return v(t,"Tempo")}else if(84==t.ff){if(r=y(t,"SMPTE",5))return r;if(24<=t.dd.charCodeAt(0)||60<=t.dd.charCodeAt(1)||60<=t.dd.charCodeAt(2)||30<=t.dd.charCodeAt(3)||200<=t.dd.charCodeAt(4)||t.dd.charCodeAt(4)%25)return u(t._off,"Invalid SMPTE meta event: incorrect data",t.toString(),t.tt);if(i)return v(t,"SMPTE")}else if(88==t.ff){if(r=y(t,"Time Signature",4))return r;if(8<t.dd.charCodeAt(1))return u(t._off,"Invalid Time Signature meta event: incorrect data",t.toString(),t.tt);if(i)return v(t,"Time Signature")}else if(89==t.ff){if(r=y(t,"Key Signature",2))return r;if(1<t.dd.charCodeAt(1)||255<t.dd.charCodeAt(0)||7<t.dd.charCodeAt(0)&&t.dd.charCodeAt(0)<249)return u(t._off,"Invalid Key Signature meta event: incorrect data",t.toString(),t.tt)}else if(127!=t.ff)return u(t._off,"Unknown meta event",t.toString(),t.tt)}}(this[e],r))&&(n.track=i,t.push(c(n)))},C.prototype._complain=function(t,i,r,e){this._warn||(this._warn=[]),this._warn.push(u(t,i,r,e))},C.prototype.dump=function(){for(var t,i="",r=0,e="",n=0;n<this.length;n++)if(i+=o(this[n].tt-r),r=this[n].tt,void 0!==this[n].dd)i+="ÿ",i+=String.fromCharCode(this[n].ff),i+=o(this[n].dd.length),i+=this[n].dd;else if(240==this[n][0]||247==this[n][0])for(i+=String.fromCharCode(this[n][0]),i+=o(this[n].length-1),t=1;t<this[n].length;t++)i+=String.fromCharCode(this[n][t]);else for(this[n][0]!=e&&(e=this[n][0],i+=String.fromCharCode(this[n][0])),t=1;t<this[n].length;t++)i+=String.fromCharCode(this[n][t]);return"MTrk"+s(i.length)+i},C.prototype.toString=function(){for(var t=["MTrk:"],i=0;i<this.length;i++)t.push(this[i].tt+": "+this[i].toString());return t.join("\n  ")},C.prototype.add=function(t,i){if(t=parseInt(t),(isNaN(t)||t<0)&&d("Invalid parameter"),(i=p.MIDI(i)).tt=t,this[this.length-1].tt<t&&(this[this.length-1].tt=t),47==i.ff||255==i[0])return this;for(var r=0;r<this.length-1&&!(this[r].tt>t);r++);return this.splice(r,0,i),this},C.prototype._ch=void 0,C.prototype._sxid=127,C.prototype._image=function(){function t(){}t.prototype=this._orig;var i=new t;return i._ch=this._ch,i._sxid=this._sxid,i._tick=this._tick,i},C.prototype.send=function(t){return this._orig.add(this._tick,t),this},C.prototype.tick=function(t){if(t!=parseInt(t)||t<0)throw RangeError("Bad tick value: "+t);if(!t)return this;var i=this._image();return i._tick=this._tick+t,i},C.prototype.sxId=function(t){if(void 0===t&&(t=C.prototype._sxid),t==this._sxid)return this;if(t!=parseInt(t)||t<0||127<t)throw RangeError("Bad MIDI value: "+t);var i=this._image();return i._sxid=t,i},C.prototype.ch=function(t){if(t==this._ch||void 0===t&&void 0===this._ch)return this;if(void 0!==t&&(t!=parseInt(t)||t<0||15<t))throw RangeError("Bad channel value: "+t+" (must be from 0 to 15)");var i=this._image();return i._ch=t,i},C.prototype.note=function(t,i,r,e){return this.noteOn(t,i,r),void 0===this._ch?0<e&&this.tick(e).noteOff(t,i):0<r&&this.tick(r).noteOff(t),this},p.lib.copyMidiHelpers(C),S.prototype.onEnd=function(){},S.prototype.loop=function(t){t==parseInt(t)&&0<t?this._loop=t:this._loop=t?-1:0},S.prototype.play=function(){this.event=void 0,this.playing=!0,this.paused=!1,this._ptr=0,this._pos=0,this._p0=0,this._t0=r(),this.tick()},S.prototype.stop=function(){this._pos=0,this.playing=!1,this.event="stop",this.paused=void 0},S.prototype.pause=function(){this.event="pause"},S.prototype.resume=function(){this.playing||(this.paused?(this.event=void 0,this._t0=r(),this.playing=!0,this.paused=!1,this.tick()):this.play())},S.prototype.sndOff=function(){for(var t=0;t<16;t++)this._emit(p.MIDI.allSoundOff(t))},S.prototype._filter=i,S.prototype.filter=function(t){this._filter=t instanceof Function?t:i},S.prototype._receive=function(t){81==t.ff&&this.ppqn&&(this._mul=1e3*this.ppqn/k(t.dd),this.mul=this._mul*this._speed,this._t0=r(),this._p0=this._pos),this._emit(t)},S.prototype.tick=function(){var t,i=r();for(this._pos=this._p0+(i-this._t0)*this.mul;this._ptr<this._data.length&&!((t=this._data[this._ptr]).tt>this._pos);this._ptr++)this._filter(t);this._ptr>=this._data.length&&(this._loop&&-1!=this._loop&&this._loop--,this._loop?(this._ptr=0,this._p0=0,this._t0=i):this.stop(),this.onEnd()),"stop"==this.event&&(this.playing=!1,this.paused=!1,this._pos=0,this._ptr=0,this.sndOff(),this.event=void 0),"pause"==this.event&&(this.playing=!1,this.paused=!0,this._pos>=this._duration&&(this._pos=this._duration-1),this._p0=this._pos,this.sndOff(),this.event=void 0),this.playing&&p.lib.schedule(this._tick)},S.prototype.trim=function(){for(var t,i=[],r=0,e=0,n=0;n<this._data.length;n++)if((t=this._data[n]).length||1==t.ff||5==t.ff)for(;e<=n;e++)i.push(this._data[e]);return r+=this._data[n-1].tt-this._data[e-1].tt,this._data=i,this._timing(),r},S.prototype._timing=function(){var t,i,r,e;if(this._duration=this._data[this._data.length-1].tt,this._ttt=[],this.ppqn){for(this._mul=this.ppqn/500,i=this._mul,r=0,this._durationMS=0,this._ttt.push({t:0,m:i,ms:0}),t=0;t<this._data.length;t++)81==(e=this._data[t]).ff&&(this._durationMS+=(e.tt-r)/i,r=e.tt,i=1e3*this.ppqn/k(e.dd),this._ttt.push({t:r,m:i,ms:this._durationMS}));this._durationMS+=(this._duration-r)/i}else this._mul=this.fps*this.ppf/1e3,this._ttt.push({t:0,m:this._mul,ms:0}),this._durationMS=this._duration/this._mul;this._speed=1,this.mul=this._mul,this._ttt.push({t:this._duration,m:0,ms:this._durationMS}),this._durationMS||(this._durationMS=1)},S.prototype.speed=function(t){return void 0!==t&&((isNaN(parseFloat(t))||t<=0)&&(t=1),this._speed=t,this.mul=this._mul*this._speed,this._p0=this._pos-(r()-this._t0)*this.mul),this._speed},S.prototype.type=function(){return this._type},S.prototype.tracks=function(){return this._tracks},S.prototype.duration=function(){return this._duration},S.prototype.durationMS=function(){return this._durationMS},S.prototype.position=function(){return this._pos},S.prototype.positionMS=function(){return this.tick2ms(this._pos)},S.prototype.jump=function(t){isNaN(parseFloat(t))&&d("Not a number: "+t),t<0&&(t=0),t>=this._duration&&(t=this._duration-1),this._goto(t)},S.prototype.jumpMS=function(t){isNaN(parseFloat(t))&&d("Not a number: "+t),t<0&&(t=0),t>=this._durationMS&&(t=this._durationMS-1),this._goto(this._ms2t(t))},S.prototype._t2ms=function(t){if(!t)return 0;for(var i=0;this._ttt[i].t<t;i++);return i--,this._ttt[i].ms+(t-this._ttt[i].t)/this._ttt[i].m},S.prototype._ms2t=function(t){if(!t)return 0;for(var i=0;this._ttt[i].ms<t;i++);return i--,this._ttt[i].t+(t-this._ttt[i].ms)*this._ttt[i].m},S.prototype._goto=function(t){this._pos=t,this.playing||(this.paused=!!t),this._toPos(),this.playing&&this.sndOff()},S.prototype._toPos=function(){for(this._ptr=0;this._ptr<this._data.length;this._ptr++){var t=this._data[this._ptr];if(t.tt>=this._pos)break;81==t.ff&&this.ppqn&&(this._mul=1e3*this.ppqn/k(t.dd))}this.mul=this._mul*this._speed,this._t0=r(),this._p0=this._pos},S.prototype.tick2ms=function(t){return isNaN(parseFloat(t))&&d("Not a number: "+t),t<=0?0:t>=this._duration?this._durationMS:this._t2ms(t)},S.prototype.ms2tick=function(t){return isNaN(parseFloat(t))&&d("Not a number: "+t),t<=0?0:t>=this._durationMS?this._duration:this._ms2t(t)},p.MIDI.SMF=a)});