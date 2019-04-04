!function(t,r){"object"==typeof exports&&"undefined"!=typeof module?module.exports=r:"function"==typeof define&&define.amd?define("JZZ.midi.SMF",["JZZ"],r):r(JZZ)}(0,function(p){if(!p.MIDI.SMF){var n="1.1.6",i=p.lib.now;u.version=function(){return n},((u.prototype=[]).constructor=u).prototype.copy=function(){var t=new u;t.type=this.type,t.ppqn=this.ppqn,t.fps=this.fps,t.ppf=this.ppf,t.rmi=this.rmi,t.ntrk=this.ntrk;for(var r=0;r<this.length;r++)t.push(this[r].copy());return t},u.prototype._complain=function(t,r,i){this._warn||(this._warn=[]),this._warn.push(c(t,r,i))},u.prototype.load=function(t){var r=0;"RIFF"==t.substr(0,4)&&"RMIDdata"==t.substr(8,8)&&(this.rmi=!0,r=20,t=t.substr(20,t.charCodeAt(16)+256*t.charCodeAt(17)+65536*t.charCodeAt(18)+16777216*t.charCodeAt(19))),this.loadSMF(t,r)};var f="MThd"+String.fromCharCode(0)+String.fromCharCode(0)+String.fromCharCode(0)+String.fromCharCode(6);u.prototype.loadSMF=function(t,r){if(t.length||d("Empty file"),t.substr(0,8)!=f){var i=t.indexOf(f);-1!=i?(t=t.substr(i),this._complain(r,"Extra leading characters",i),r+=i):d("Not a MIDI file")}this.type=16*t.charCodeAt(8)+t.charCodeAt(9),this.ntrk=16*t.charCodeAt(10)+t.charCodeAt(11),127<t.charCodeAt(12)?(this.fps=256-t.charCodeAt(12),this.ppf=t.charCodeAt(13)):this.ppqn=256*t.charCodeAt(12)+t.charCodeAt(13),2<this.type?this._complain(8+r,"Invalid MIDI file type",this.type):0==this.type&&1<this.ntrk&&this._complain(10+r,"Wrong number of tracks for the type 0 MIDI file",this.ntrk),this.ppf||this.ppqn||d("Invalid MIDI header");for(var e=0,n=14;n<t.length-8;){var o=n+r,s=t.substr(n,4);"MTrk"==s&&e++;var h=(t.charCodeAt(n+4)<<24)+(t.charCodeAt(n+5)<<16)+(t.charCodeAt(n+6)<<8)+t.charCodeAt(n+7);h<=0&&(h=t.length-n-8,this._complain(n+r+4,"Invalid track length",t.charCodeAt(n+4)+"/"+t.charCodeAt(n+5)+"/"+t.charCodeAt(n+6)+"/"+t.charCodeAt(n+7))),n+=8;var a=t.substr(n,h);this.push(new g(s,a,o)),"MThd"==s&&this._complain(o,"Unexpected chunk type","MThd"),n+=h}e!=this.ntrk&&(this._complain(r+10,"Incorrect number of tracks",this.ntrk),this.ntrk=e),this.ntrk||d("No MIDI tracks"),(!this.type&&1<this.ntrk||2<this.type)&&(this.type=1),n<t.length&&this._complain(r+n,"Extra trailing characters",t.length-n),n>t.length&&this._complain(r+t.length,"Incomplete data",n-t.length)},u.prototype.validate=function(){var t,r,i=[];if(this._warn)for(t=0;t<this._warn.length;t++)i.push(_(this._warn[t]));for(t=r=0;t<this.length;t++)this[t]instanceof y&&(r++,this[t]._validate(i,r));if(i.sort(function(t,r){return(t.off||0)-(r.off||0)||(t.track||0)-(r.track||0)||(t.tick||0)-(r.tick||0)}),i.length)return i},u.prototype.dump=function(t){var r="";if(t)return"RIFF"+a((r=this.dump()).length+12)+"RMIDdata"+a(r.length)+r;for(var i=this.ntrk=0;i<this.length;i++)this[i]instanceof y&&this.ntrk++,r+=this[i].dump();return r=(this.ppqn?s(this.ppqn):String.fromCharCode(256-this.fps)+String.fromCharCode(this.ppf))+r,r=f+String.fromCharCode(0)+String.fromCharCode(this.type)+s(this.ntrk)+r},u.prototype.toString=function(){var t;for(t=this.ntrk=0;t<this.length;t++)this[t]instanceof y&&this.ntrk++;var r=["SMF:","  type: "+this.type];for(this.ppqn?r.push("  ppqn: "+this.ppqn):r.push("  fps: "+this.fps,"  ppf: "+this.ppf),r.push("  tracks: "+this.ntrk),t=0;t<this.length;t++)r.push(this[t].toString());return r.join("\n")},u.prototype.player=function(){var t,r,i=new k;i.ppqn=this.ppqn,i.fps=this.fps,i.ppf=this.ppf;var e,n=[],o=0,s=0;for(t=0;t<this.length;t++)this[t]instanceof y&&n.push(this[t]);if(2==this.type)for(t=0;t<n.length;t++){for(r=0;r<n[t].length;r++)(e=p.MIDI(n[t][r])).track=t,s=e.tt+o,e.tt=s,i._data.push(e);o=s}else{var h=[];for(t=0;t<n.length;t++)h[t]=0;for(;;){var a=!0;for(t=0;t<n.length;t++){for(;h[t]<n[t].length&&n[t][h[t]].tt==s;)(e=p.MIDI(n[t][h[t]])).track=t,i._data.push(e),h[t]++;h[t]>=n[t].length||(a&&(o=n[t][h[t]].tt),a=!1,o>n[t][h[t]].tt&&(o=n[t][h[t]].tt))}if(s=o,a)break}}if(i._duration=s,i._ttt=[],i.ppqn){for(i.mul=i.ppqn/500,o=i.mul,s=0,i._durationMS=0,i._ttt.push({t:0,m:o,ms:0}),t=0;t<i._data.length;t++)81==(e=i._data[t]).ff&&(i._durationMS+=(e.tt-s)/o,s=e.tt,o=1e3*this.ppqn/((e.dd.charCodeAt(0)<<16)+(e.dd.charCodeAt(1)<<8)+e.dd.charCodeAt(2)),i._ttt.push({t:s,m:o,ms:i._durationMS}));i._durationMS+=(i._duration-s)/o}else i.mul=i.fps*i.ppf/1e3,i._ttt.push({t:0,m:i.mul,ms:0}),i._durationMS=s/i.mul;return i._ttt.push({t:i._duration,m:0,ms:i._durationMS}),i._durationMS||(i._durationMS=1),i._type=this.type,i._tracks=n.length,i},(((u.Chunk=g).prototype=[]).constructor=g).prototype.copy=function(){return new g(this.type,this.data)},g.prototype.sub={MTrk:function(t,r,i){return new y(r,i)}},g.prototype.dump=function(){return this.type+h(this.data.length)+this.data},g.prototype.toString=function(){return this.type+": "+this.data.length+" bytes"},(((u.MTrk=y).prototype=[]).constructor=y).prototype.copy=function(){for(var t=new y,r=t.length=0;r<this.length;r++)t.push(new p.MIDI(this[r]));return t},y.prototype._validate=function(t,r){var i,e;if(this._warn)for(i=0;i<this._warn.length;i++)(e=_(this._warn[i])).track=r,t.push(e);for(i=0;i<this.length;i++)(e=I(this[i]))&&(e.track=r,t.push(e))},y.prototype._complain=function(t,r,i,e){this._warn||(this._warn=[]),this._warn.push(c(t,r,i,e))},y.prototype.dump=function(){var t,r,i="",e=0,n="";for(t=0;t<this.length;t++)if(i+=o(this[t].tt-e),e=this[t].tt,void 0!==this[t].dd)i+="ÿ",i+=String.fromCharCode(this[t].ff),i+=o(this[t].dd.length),i+=this[t].dd;else if(240==this[t][0]||247==this[t][0])for(i+=String.fromCharCode(this[t][0]),i+=o(this[t].length-1),r=1;r<this[t].length;r++)i+=String.fromCharCode(this[t][r]);else for(this[t][0]!=n&&(n=this[t][0],i+=String.fromCharCode(this[t][0])),r=1;r<this[t].length;r++)i+=String.fromCharCode(this[t][r]);return"MTrk"+h(i.length)+i},y.prototype.toString=function(){for(var t=["MTrk:"],r=0;r<this.length;r++)t.push(this[r].tt+": "+this[r].toString());return t.join("\n  ")},y.prototype.add=function(t,r){if(t=parseInt(t),(isNaN(t)||t<0)&&d("Invalid parameter"),(r=p.MIDI(r)).tt=t,this[this.length-1].tt<t&&(this[this.length-1].tt=t),47==r.ff||255==r[0])return this;var i,e=A(r);for(i=0;i<this.length&&!(this[i].tt>t)&&!(this[i].tt==t&&A(this[i])>e);i++);return this.splice(i,0,r),this},y.prototype.send=function(t){this._orig.add(this._tick,t)},y.prototype.tick=function(t){if(t!=parseInt(t)||t<0)throw RangeError("Bad tick value: "+t);if(!t)return this;var r=function(){};r.prototype=this._orig;var i=new r;return i._tick=this._tick+t,i},y.prototype.note=function(t,r,i,e){return this.noteOn(t,r,i),0<e&&this.tick(e).noteOff(t,r),this},y.prototype.ch=function(t){if(void 0===t)return this;if(t!=parseInt(t)||t<0||15<t)throw RangeError("Bad channel value: "+t+" (must be from 0 to 15)");return new r(this._orig,t,this._tick)},(r.prototype=new y).tick=function(t){if(t!=parseInt(t)||t<0)throw RangeError("Bad tick value: "+t);return t?new r(this._orig,this._chan,this._tick+t):this},r.prototype.ch=function(t){if(void 0===t)return this._orig.tick(this._tick);if(t!=parseInt(t)||t<0||15<t)throw RangeError("Bad channel value: "+t+" (must be from 0 to 15)");return t==this._chan?this:new r(this._orig,t,this._tick)},r.prototype.note=function(t,r,i){return this.noteOn(t,r),i&&this.tick(i).noteOff(t),this},p.lib.copyMidiHelpers(y,r),k.prototype.onEnd=function(){},k.prototype.onData=function(){},k.prototype.loop=function(t){t==parseInt(t)&&0<t?this._loop=t:this._loop=t?-1:0},k.prototype.play=function(){this.event=void 0,this.playing=!0,this.paused=!1,this._ptr=0,this._pos=0,this._ms=0,this._p0=0,this._st=i(),this._t0=this._st,this.tick()},k.prototype.stop=function(){this._pos=0,this._ms=0,this.playing=!1,this.event="stop",this.paused=void 0},k.prototype.pause=function(){this.event="pause"},k.prototype.resume=function(){this.playing||(this.paused?(this.event=void 0,this._st=i(),this._t0=this._st,this.playing=!0,this.paused=!1,this.tick()):this.play())},k.prototype.sndOff=function(){for(var t=0;t<16;t++)this._emit(p.MIDI.allSoundOff(t))},k.prototype.tick=function(){var t,r=i();for(this._pos=this._p0+(r-this._t0)*this.mul;this._ptr<this._data.length&&!((t=this._data[this._ptr]).tt>this._pos);this._ptr++)81==t.ff&&this.ppqn&&(this.mul=1e3*this.ppqn/((t.dd.charCodeAt(0)<<16)+(t.dd.charCodeAt(1)<<8)+t.dd.charCodeAt(2)),this._p0=this._pos-(r-this._t0)*this.mul),this._emit(t);this._ptr>=this._data.length&&(this._loop&&-1!=this._loop&&this._loop--,this._loop?(this._ptr=0,this._p0=0,this._t0=r,this._st=r,this._ms=0):this.stop(),this.onEnd()),"stop"==this.event&&(this.playing=!1,this.paused=!1,this._pos=0,this._ms=0,this._ptr=0,this.sndOff(),this.event=void 0),"pause"==this.event&&(this.playing=!1,this.paused=!0,this._ms+=i()-this._st,this._pos>=this._duration&&(this._pos=this._duration-1),this._p0=this._pos,this.sndOff(),this.event=void 0),this.playing&&p.lib.schedule(this._tick)},k.prototype.type=function(){return this._type},k.prototype.tracks=function(){return this._tracks},k.prototype.duration=function(){return this._duration},k.prototype.durationMS=function(){return this._durationMS},k.prototype.position=function(){return this._pos},k.prototype.positionMS=function(){return this.playing?this._ms+i()-this._st:this._ms},k.prototype.jump=function(t){isNaN(parseFloat(t))&&d("Not a number: "+t),t<0&&(t=0),t>=this._duration&&(t=this._duration-1),this._goto(t,this._t2ms(t))},k.prototype.jumpMS=function(t){isNaN(parseFloat(t))&&d("Not a number: "+t),t<0&&(t=0),t>=this._durationMS&&(t=this._durationMS-1),this._goto(this._ms2t(t),t)},k.prototype._t2ms=function(t){if(!t)return 0;var r;for(r=0;this._ttt[r].t<t;r++);return r--,this._ttt[r].ms+(t-this._ttt[r].t)/this._ttt[r].m},k.prototype._ms2t=function(t){if(!t)return 0;var r;for(r=0;this._ttt[r].ms<t;r++);return r--,this._ttt[r].t+(t-this._ttt[r].ms)*this._ttt[r].m},k.prototype._goto=function(t,r){this._pos=t,this._ms=r,this._p0=t,this._t0=i(),this._st=this._t0,this.playing||(this.paused=!!t),this._toPos(),this.playing&&this.sndOff()},k.prototype._toPos=function(){for(this._ptr=0;this._ptr<this._data.length&&(e=this._data[this._ptr],!(e.tt>=this._pos));this._ptr++)81==e.ff&&this.ppqn&&(this.mul=1e3*this.ppqn/((e.dd.charCodeAt(0)<<16)+(e.dd.charCodeAt(1)<<8)+e.dd.charCodeAt(2)),this._p0=this._pos-(i()-this._t0)*this.mul)},k.prototype.tick2ms=function(t){return isNaN(parseFloat(t))&&d("Not a number: "+t),t<=0?0:t>=this._duration?this._durationMS:this._t2ms(t)},k.prototype.ms2tick=function(t){return isNaN(parseFloat(t))&&d("Not a number: "+t),t<=0?0:t>=this._durationMS?this._duration:this._ms2t(t)},p.MIDI.SMF=u}function d(t){throw new Error(t)}function o(t){var r="";return 2097151<t&&(r+=String.fromCharCode(128+(t>>21&127))),16383<t&&(r+=String.fromCharCode(128+(t>>14&127))),127<t&&(r+=String.fromCharCode(128+(t>>7&127))),r+=String.fromCharCode(127&t)}function s(t){return String.fromCharCode(t>>8)+String.fromCharCode(255&t)}function h(t){return String.fromCharCode(t>>24&255)+String.fromCharCode(t>>16&255)+String.fromCharCode(t>>8&255)+String.fromCharCode(255&t)}function a(t){return String.fromCharCode(255&t)+String.fromCharCode(t>>8&255)+String.fromCharCode(t>>16&255)+String.fromCharCode(t>>24&255)}function u(){var t,r,i=this instanceof u?this:i=new u,e=1,n=96;if(1==arguments.length){if(arguments[0]instanceof u)return arguments[0].copy();if("string"==typeof arguments[0]&&"0"!=arguments[0]&&"1"!=arguments[0]&&"2"!=arguments[0])return i.load(arguments[0]),i;e=parseInt(arguments[0])}else 2==arguments.length?(e=parseInt(arguments[0]),n=parseInt(arguments[1])):3==arguments.length?(e=parseInt(arguments[0]),t=parseInt(arguments[1]),r=parseInt(arguments[2])):arguments.length&&d("Invalid parameters");return(isNaN(e)||e<0||2<e)&&d("Invalid parameters"),i.type=e,void 0===t?((isNaN(n)||n<0||65535<e)&&d("Invalid parameters"),i.ppqn=n):(24!=t&&25!=t&&29!=t&&30!=t&&d("Invalid parameters"),(isNaN(r)||r<0||255<e)&&d("Invalid parameters"),i.fps=t,i.ppf=r),i}function c(t,r,i,e){var n={off:t,msg:r,data:i};return void 0!==e&&(n.tick=e),n}function _(t){var r={};for(var i in t)t.hasOwnProperty(i)&&(r[i]=t[i]);return r}function l(t){switch(240&t){case 128:case 144:case 160:case 176:case 224:return 2;case 192:case 208:return 1}switch(t){case 241:case 243:return 1;case 242:return 2}return 0}function g(t,r,i){var e;if(this.sub[t])return this.sub[t](t,r,i);for("string"==typeof t&&4==t.length||d("Invalid chunk type: "+t),e=0;e<t.length;e++)(t.charCodeAt(e)<0||255<t.charCodeAt(e))&&d("Invalid chunk type: "+t);for("string"!=typeof r&&d("Invalid data type: "+r),e=0;e<r.length;e++)(r.charCodeAt(e)<0||255<r.charCodeAt(e))&&d("Invalid data character: "+r[e]);this.type=t,this.data=r,this.offset=i}function m(t,r,i,e,n,o){var s=r.substr(i,e);s.length<e&&(t._complain(o,"Incomplete track data",e-s.length,n),s=(s+"\0\0").substr(0,e));for(var h=0;h<e;h++)127<s.charCodeAt(h)&&(t._complain(o,"Bad MIDI value",s.charCodeAt(h),n),s=s.substr(0,h)+"\0"+s.substr(h+1));return s}function C(t,r,i,e){var n=function(t){if(!t.length)return 0;if(t.charCodeAt(0)<128)return t.charCodeAt(0);var r=127&t.charCodeAt(0);return r<<=7,t.charCodeAt(1)<128?r+t.charCodeAt(1):(r+=127&t.charCodeAt(1),r<<=7,t.charCodeAt(2)<128?r+t.charCodeAt(2):(r+=127&t.charCodeAt(2),r<<=7,r+=127&t.charCodeAt(3),t.charCodeAt(3)<128?r:-r))}(r);return n<0&&(n=-n,t._complain(i,"Bad byte sequence",r.charCodeAt(0)+"/"+r.charCodeAt(1)+"/"+r.charCodeAt(2)+"/"+r.charCodeAt(3),e)),n}function y(t,r){if(void((this._orig=this)._tick=0)!==t){var i,e,n,o,s=0,h=0,a="";for(r=r||0,r+=8;h<t.length;)i=C(this,t.substr(h,4),o,s+i),h++,127<i&&h++,16383<i&&h++,2097151<i&&h++,s+=i,o=h+r,255==t.charCodeAt(h)?((e=t.substr(h,2)).length<2&&(this._complain(o,"Incomplete track data",3-e.length,s),e="ÿ/"),h+=2,n=C(this,t.substr(h,4),o+2,s),h++,127<n&&h++,16383<n&&h++,2097151<n&&h++,this.push(new S(s,e,t.substr(h,n),o)),h+=n):240==t.charCodeAt(h)||247==t.charCodeAt(h)?(e=t.substr(h,1),h+=1,n=C(this,t.substr(h,4),o+1,s),h++,127<n&&h++,16383<n&&h++,2097151<n&&h++,this.push(new S(s,e,t.substr(h,n),o)),h+=n):128&t.charCodeAt(h)?(a=t.substr(h,1),h+=1,(n=l(a.charCodeAt(0)))||this._complain(o,"Unexpected MIDI message",a.charCodeAt(0),s),this.push(new S(s,a,m(this,t,h,n,s,o),o)),h+=n):128&a.charCodeAt(0)&&((n=l(a.charCodeAt(0)))||this._complain(o,"Unexpected MIDI message",a.charCodeAt(0),s),this.push(new S(s,a,m(this,t,h,n,s,o),o)),h+=n)}else this.push(new S(0,"ÿ/",""))}function v(t,r,i){return t.dd.length<i?c(t._off,"Invalid "+r+" meta event: "+(t.dd.length?"data too short":"no data"),t.toString(),t.tt):t.dd.length>i?c(t._off,"Invalid "+r+" meta event: data too long",t.toString(),t.tt):void 0}function I(t){var r;if(void 0!==t.ff){if(127<t.ff)return c(t._off,"Invalid meta event",t.toString(),t.tt);if(0==t.ff){if(r=v(t,"Sequence Number",2))return r}else if(t.ff<10){if(!t.dd.length)return c(t._off,"Invalid Text meta event: no data",t.toString(),t.tt)}else if(32==t.ff){if(r=v(t,"Channel Prefix",1))return r;if(15<t.dd.charCodeAt(0))return c(t._off,"Invalid Channel Prefix meta event: incorrect data",t.toString(),t.tt)}else if(33==t.ff){if(r=v(t,"MIDI Port",1))return r;if(127<t.dd.charCodeAt(0))return c(t._off,"Invalid MIDI Port meta event: incorrect data",t.toString(),t.tt)}else if(47==t.ff){if(r=v(t,"End of Track",0))return r}else if(81==t.ff){if(r=v(t,"Tempo",3))return r}else if(84==t.ff){if(r=v(t,"SMPTE",5))return r;if(24<=t.dd.charCodeAt(0)||60<=t.dd.charCodeAt(1)||60<=t.dd.charCodeAt(2)||30<=t.dd.charCodeAt(3)||200<=t.dd.charCodeAt(4)||t.dd.charCodeAt(4)%25)return c(t._off,"Invalid SMPTE meta event: incorrect data",t.toString(),t.tt)}else if(88==t.ff){if(r=v(t,"Time Signature",4))return r;if(8<t.dd.charCodeAt(1))return c(t._off,"Invalid Time Signature meta event: incorrect data",t.toString(),t.tt)}else if(89==t.ff){if(r=v(t,"Key Signature",2))return r;if(1<t.dd.charCodeAt(1)||255<t.dd.charCodeAt(0)||7<t.dd.charCodeAt(0)&&t.dd.charCodeAt(0)<249)return c(t._off,"Invalid Key Signature meta event: incorrect data",t.toString(),t.tt)}else if(127!=t.ff)return c(t._off,"Unknown meta event",t.toString(),t.tt)}}function A(t){var r={0:0,3:1,2:2,84:3,81:4,88:5,89:6,32:7,33:7,6:8,4:9,1:16,5:16,127:17,47:20}[t.ff];if(void 0!==r)return r;if(t.length){var i=t[0]>>4;if(void 0!==(r={8:10,15:11,11:12,12:13,10:15,13:15,14:15}[i]))return r;if(9==i)return t[1]?14:10}return 18}function r(t,r,i){this._orig=t,this._chan=r,this._tick=i}function S(t,r,i,e){var n;if(255==r.charCodeAt(0))n=p.MIDI.smf(r.charCodeAt(1),i);else{for(var o=[r.charCodeAt(0)],s=0;s<i.length;s++)o.push(i.charCodeAt(s));n=p.MIDI(o)}return void 0!==e&&(n._off=e),n.tt=t,n}function k(){var t,r=new p.Widget;for(var i in r._info.name="MIDI Player",r._info.manufacturer="Jazz-Soft",r._info.version=n,r.playing=!1,r._loop=0,r._data=[],r._pos=0,r._ms=0,r._tick=(t=r,function(){t.tick()}),k.prototype)k.prototype.hasOwnProperty(i)&&(r[i]=k.prototype[i]);return r}});