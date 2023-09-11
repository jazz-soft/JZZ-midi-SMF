!function(t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t.SMF=t:"function"==typeof define&&define.amd?define("JZZ.midi.SMF",["JZZ"],t):t(JZZ)}(function(_){var n,i,p,m;function g(t){throw new Error(t)}function o(t){var r="";return 2097151<t&&(r+=String.fromCharCode(128+(t>>21&127))),16383<t&&(r+=String.fromCharCode(128+(t>>14&127))),127<t&&(r+=String.fromCharCode(128+(t>>7&127))),r+=String.fromCharCode(127&t)}function e(t){return String.fromCharCode(t>>8)+String.fromCharCode(255&t)}function s(t){return String.fromCharCode(t>>24&255)+String.fromCharCode(t>>16&255)+String.fromCharCode(t>>8&255)+String.fromCharCode(255&t)}function h(t){return String.fromCharCode(255&t)+String.fromCharCode(t>>8&255)+String.fromCharCode(t>>16&255)+String.fromCharCode(t>>24&255)}function y(t){for(var r="",i=t.byteLength,n=0;n<i;n++)r+=String.fromCharCode(t[n]);return r}function a(){var t,r,i,n=this,e=(n instanceof a||delete(n=new a).ppqn,1),o=96;if(1==arguments.length){if(arguments[0]instanceof a)return arguments[0].copy();if(arguments[0]instanceof x){n.type=0,n.ppqn=o,n.push(new I);for(var s=0;s<arguments[0].length;s++)n[0].add(0,arguments[0][s]);return n}try{arguments[0]instanceof ArrayBuffer&&(i=y(new Uint8Array(arguments[0])))}catch(t){}try{(arguments[0]instanceof Uint8Array||arguments[0]instanceof Int8Array)&&(i=y(new Uint8Array(arguments[0])))}catch(t){}try{arguments[0]instanceof Buffer&&(i=arguments[0].toString("binary"))}catch(t){}if(""==(i="string"==typeof arguments[0]&&"0"!=arguments[0]&&"1"!=arguments[0]&&"2"!=arguments[0]?arguments[0]:i)&&g("Empty file"),i)return n.load(i),n;e=parseInt(arguments[0])}else 2==arguments.length?(e=parseInt(arguments[0]),o=parseInt(arguments[1])):3==arguments.length?(e=parseInt(arguments[0]),t=parseInt(arguments[1]),r=parseInt(arguments[2])):arguments.length&&g("Invalid parameters");return(isNaN(e)||e<0||2<e)&&g("Invalid parameters"),n.type=e,void 0===t?((isNaN(o)||o<0||65535<o)&&g("Invalid parameters"),n.ppqn=o):(24!=t&&25!=t&&29!=t&&30!=t&&g("Invalid parameters"),(isNaN(r)||r<0||255<r)&&g("Invalid parameters"),n.fps=t,n.ppf=r),n}function c(t,r,i,n,e){t={off:t,msg:r,data:i};return void 0!==n&&(t.tick=n),void 0!==e&&(t.track=e),t}function u(t){if(!(this instanceof u))return new u(t);for(var r in t)t.hasOwnProperty(r)&&(this[r]=t[r])}function d(t,r){for(var i=0;i<16;i++)r[i]&&(r[i].rm&&r[i].rl&&127==r[i].rm[0][2]&&127==r[i].rl[0][2]&&(r[i].rm[1]=!0,r[i].rl[1]=!0),l(t,r,i,"bm"),l(t,r,i,"bl"),l(t,r,i,"nm"),l(t,r,i,"nl"),l(t,r,i,"rm"),l(t,r,i,"rl")),r[i]={}}function l(t,r,i,n){if(r[i][n]&&!r[i][n][1]){var e;switch(n){case"bm":case"bl":e="Unnecessary Bank Select";break;case"nm":case"nl":e="Unnecessary NRPN";break;case"rm":case"rl":e="Unnecessary RPN"}var o=r[i][n][0];t.push(c(o._off,e,o.toString(),o.tt,o.track)),delete r[i][n]}}function f(t){switch(240&t){case 128:case 144:case 160:case 176:case 224:return 2;case 192:case 208:return 1}switch(t){case 241:case 243:return 1;case 242:return 2}return 0}function v(t){var r,i=[],n=[];for(a=0;a<t.length;a++)t[a]instanceof I&&i.push(t[a]);if(1!=t.type)for(a=0;a<i.length;a++)for(r=0;r<i[a].length;r++)i[a][r].track=a,n.push(i[a][r]);else{var e=0,o=[];for(a=0;a<i.length;a++)o[a]=0;for(;;){for(var s=!0,h=0,a=0;a<i.length;a++){for(;o[a]<i[a].length&&i[a][o[a]].tt==e;)i[a][o[a]].track=a,n.push(i[a][o[a]]),o[a]++;o[a]>=i[a].length||(s&&(h=i[a][o[a]].tt),s=!1,h>i[a][o[a]].tt&&(h=i[a][o[a]].tt))}if(e=h,s)break}}return n}function C(t,r,i){if(!(this instanceof C))return new C(t,r,i);var n;if(this.sub[t])return this.sub[t](t,r,i);for("string"==typeof t&&4==t.length||g("Invalid chunk type: "+t),n=0;n<t.length;n++)(t.charCodeAt(n)<0||255<t.charCodeAt(n))&&g("Invalid chunk type: "+t);for("string"!=typeof r&&g("Invalid data type: "+r),n=0;n<r.length;n++)(r.charCodeAt(n)<0||255<r.charCodeAt(n))&&g("Invalid data character: "+r[n]);this.type=t,this.data=r,this._off=i}function A(t,r,i,n,e,o){var s=r.substr(i,n);s.length<n&&(t._complain(o,"Incomplete track data",n-s.length,e),s=(s+"\0\0").substr(0,n));for(var h=0;h<n;h++)127<s.charCodeAt(h)&&(t._complain(o+h,"Bad MIDI value set to 0",s.charCodeAt(h),e),s=s.substr(0,h)+"\0"+s.substr(h+1));return s}function k(t,r,i,n,e){var o,s=(s=r).length?s.charCodeAt(0)<128?[1,s.charCodeAt(0)]:(o=127&s.charCodeAt(0),o<<=7,s.charCodeAt(1)<128?[2,o+s.charCodeAt(1)]:(o=o+(127&s.charCodeAt(1))<<7,s.charCodeAt(2)<128?[3,o+s.charCodeAt(2)]:(o=(o=o+(127&s.charCodeAt(2))<<7)+(127&s.charCodeAt(3)),[4,s.charCodeAt(3)<128?o:-o]))):0;return e&&(n+=s[1]),s[1]<0?(s[1]=-s[1],t._complain(i,"Bad byte sequence",r.charCodeAt(0)+"/"+r.charCodeAt(1)+"/"+r.charCodeAt(2)+"/"+r.charCodeAt(3),n)):4==s[0]&&s[1]<2097152?t._complain(i,"Long VLQ value",r.charCodeAt(0)+"/"+r.charCodeAt(1)+"/"+r.charCodeAt(2)+"/"+r.charCodeAt(3),n):3==s[0]&&s[1]<16384?t._complain(i,"Long VLQ value",r.charCodeAt(0)+"/"+r.charCodeAt(1)+"/"+r.charCodeAt(2),n):2==s[0]&&s[1]<128&&t._complain(i,"Long VLQ value",r.charCodeAt(0)+"/"+r.charCodeAt(1),n),s}function I(t,r){if(!(this instanceof I))return new I(t,r);if(this._off=r,void((this._orig=this)._tick=0)===t)this.push(new w(0,"ÿ/",""));else for(var i,n,e=0,o=0,s="",h=o+(r+=8);o<t.length;)o+=(n=k(this,t.substr(o,4),h,e,!0))[0],e+=n[1],h=o+r,255==t.charCodeAt(o)?((i=t.substr(o,2)).length<2&&(this._complain(h,"Incomplete track data",3-i.length,e),i="ÿ/"),o=(o+=2)+(n=k(this,t.substr(o,4),h+2,e))[0],this.push(new w(e,i,t.substr(o,n[1]),h)),o+=n[1]):240==t.charCodeAt(o)||247==t.charCodeAt(o)?(i=t.substr(o,1),o=(o+=1)+(n=k(this,t.substr(o,4),h+1,e))[0],this.push(new w(e,i,t.substr(o,n[1]),h)),o+=n[1]):128&t.charCodeAt(o)?(s=t.substr(o,1),o+=1,n=f(s.charCodeAt(0)),240<s.charCodeAt(0)&&this._complain(h,"Unexpected MIDI message",s.charCodeAt(0).toString(16),e),this.push(new w(e,s,A(this,t,o,n,e,h+1),h)),o+=n):128&s.charCodeAt(0)&&(n=f(s.charCodeAt(0)),240<s.charCodeAt(0)&&this._complain(h,"Unexpected MIDI message",s.charCodeAt(0).toString(16),e),this.push(new w(e,s,A(this,t,o,n,e,h),h)),o+=n)}function S(t){t=t.toString();return t=80<t.length?(t=t.substr(0,78)).substr(0,t.lastIndexOf(" "))+" ...":t}function M(t,r,i){return t.dd.length<i?c(t._off,"Invalid "+r+" meta event: "+(t.dd.length?"data too short":"no data"),S(t),t.tt):t.dd.length>i?c(t._off,"Invalid "+r+" meta event: data too long",S(t),t.tt):void 0}function b(t,r){return c(t._off,r+" meta events must be in the first track",S(t),t.tt)}function w(t,r,i,n){var e;if(255==r.charCodeAt(0))e=_.MIDI.smf(r.charCodeAt(1),i);else{for(var o=[r.charCodeAt(0)],s=0;s<i.length;s++)o.push(i.charCodeAt(s));e=_.MIDI(o)}return void 0!==n&&(e._off=n),e.tt=t,e}function N(){var t,r,i=new _.Widget;for(r in i._info.name="MIDI Player",i._info.manufacturer="Jazz-Soft",i._info.version=n,i.playing=!1,i._loop=0,i._data=[],i._pos=0,i._tick=(t=i,function(){t.tick()}),N.prototype)N.prototype.hasOwnProperty(r)&&(i[r]=N.prototype[r]);return i}function r(t){this._receive(t)}function D(t){return(t.charCodeAt(0)<<16)+(t.charCodeAt(1)<<8)+t.charCodeAt(2)}function P(){g("Not a SYX file")}function x(t){var r=this instanceof x?this:new x;if(r._orig=r,void 0!==t)if(t instanceof a)r.copy(t.player()._data);else if(t instanceof x)r.copy(t);else{try{t instanceof ArrayBuffer&&(t=y(new Uint8Array(t)))}catch(t){}try{(t instanceof Uint8Array||t instanceof Int8Array)&&(t=y(new Uint8Array(t)))}catch(t){}try{t instanceof Buffer&&(t=t.toString("binary"))}catch(t){}var i,n=[],e=0,o=0;for((t="string"!=typeof t?String.fromCharCode.apply(null,t):t).length||g("Empty file");e<t.length;){for(240!=t.charCodeAt(e)&&P();e<t.length;){if(i=t.charCodeAt(e),n.push(i),247==i){(n=_.MIDI(n))._off=o,r.push(_.MIDI(n)),n=[],o=e+1;break}e++}e++}n.length&&P()}return r}function U(t){var r=this instanceof U?this:new U;if(void((r._orig=r)._tick=0)!==t)if(t instanceof U){var i,n,e=r,o=t;for(e.length=0,e.header=new B,e.dc=o.dc,e.ppqn=o.ppqn,i=0;i<o.header.length;i++)(n=new _.UMP(o.header[i])).tt=o.header[i].tt,e.header.push(n);for(i=0;i<o.length;i++)(n=new _.UMP(o[i])).tt=o[i].tt,e.push(n)}else{try{t instanceof ArrayBuffer&&(t=y(new Uint8Array(t)))}catch(t){}try{(t instanceof Uint8Array||t instanceof Int8Array)&&(t=y(new Uint8Array(t)))}catch(t){}try{t instanceof Buffer&&(t=t.toString("binary"))}catch(t){}"string"!=typeof t&&(t=String.fromCharCode.apply(null,t));var s=r,h=t,a=void 0;h.length||g("Empty clip"),h.substr(0,8)!=m&&(-1!=(t=h.indexOf(m))?(h=h.substr(t),s._complain(a,"Extra leading characters",t),a+=t):g("Not a clip")),a+=8;for(var p,f,c,u,d=0,l=s.header;a<h.length;){for(c=h.charCodeAt(a)>>4,u=[4,4,4,8,8,16,4,4,8,8,8,12,12,16,16,16][c],p=[],f=0;f<u;f++)p.push(h.charCodeAt(a+f));(c=_.UMP(p)).isStartClip()?l!=s&&(l=s,d=0):c.isEndClip()?0:c.isDelta()?d+=c.getDelta():(c.tt=d,l.push(c)),a+=u}}else r.header||(r.header=new B),r.length||((t=_.UMP.umpEndClip()).tt=0,r.push(t));return r}function B(){}_.MIDI.SMF||(n="1.7.8",i=_.lib.now,a.version=function(){return n},a.num4=s,((a.prototype=[]).constructor=a).prototype.copy=function(){var t=new a;t.type=this.type,t.ppqn=this.ppqn,t.fps=this.fps,t.ppf=this.ppf,t.rmi=this.rmi,t.ntrk=this.ntrk;for(var r=0;r<this.length;r++)t.push(this[r].copy());return t},a.prototype._complain=function(t,r,i){this._warn||(this._warn=[]),this._warn.push(c(t,r,i))},a.prototype.load=function(t){var r=0;"RIFF"==t.substr(0,4)&&"RMIDdata"==t.substr(8,8)&&(this.rmi=!0,t=t.substr(r=20,t.charCodeAt(16)+256*t.charCodeAt(17)+65536*t.charCodeAt(18)+16777216*t.charCodeAt(19))),this.loadSMF(t,r)},p="MThd"+String.fromCharCode(0)+String.fromCharCode(0)+String.fromCharCode(0)+String.fromCharCode(6),a.prototype.loadSMF=function(t,r){t.length||g("Empty file"),t.substr(0,8)!=p&&(-1!=(i=t.indexOf(p))?(t=t.substr(i),this._complain(r,"Extra leading characters",i),r+=i):g("Not a MIDI file")),this._off=r,this.type=16*t.charCodeAt(8)+t.charCodeAt(9),this._off_type=r+8,this.ntrk=16*t.charCodeAt(10)+t.charCodeAt(11),this._off_ntrk=r+10,127<t.charCodeAt(12)?(this.fps=256-t.charCodeAt(12),this.ppf=t.charCodeAt(13),this._off_fps=r+12,this._off_ppf=r+13):(this.ppqn=256*t.charCodeAt(12)+t.charCodeAt(13),this._off_ppqn=r+12),2<this.type?this._complain(8+r,"Invalid MIDI file type",this.type):0==this.type&&1<this.ntrk&&this._complain(10+r,"Wrong number of tracks for the type 0 MIDI file",this.ntrk),this.ppf||this.ppqn||g("Invalid MIDI header");for(var i,n=0,e=14;e<t.length-8;){var o=e+r,s=t.substr(e,4),h=("MTrk"==s&&n++,(t.charCodeAt(e+4)<<24)+(t.charCodeAt(e+5)<<16)+(t.charCodeAt(e+6)<<8)+t.charCodeAt(e+7)),a=(h<=0&&(h=t.length-e-8,this._complain(e+r+4,"Invalid track length",t.charCodeAt(e+4)+"/"+t.charCodeAt(e+5)+"/"+t.charCodeAt(e+6)+"/"+t.charCodeAt(e+7))),e+=8,t.substr(e,h));this.push(new C(s,a,o)),"MThd"==s&&this._complain(o,"Unexpected chunk type","MThd"),e+=h}n!=this.ntrk&&(this._complain(r+10,"Incorrect number of tracks",this.ntrk),this.ntrk=n),this.ntrk||g("No MIDI tracks"),(!this.type&&1<this.ntrk||2<this.type)&&(this.type=1),e<t.length&&this._complain(r+e,"Extra trailing characters",t.length-e),e>t.length&&this._complain(r+t.length,"Incomplete data",e-t.length)},u.prototype.toString=function(){var t=[];return void 0!==this.off&&t.push("offset "+this.off),void 0!==this.track&&t.push("track "+this.track),void 0!==this.tick&&t.push("tick "+this.tick),t.join(" ")+" -- "+this.msg+" ("+this.data+")"},a.prototype.tracks=function(){for(var t=0,r=0;r<this.length;r++)this[r]instanceof I&&t++;return t},a.prototype.validate=function(){var t=[];if(this._warn)for(n=0;n<this._warn.length;n++)t.push(u(this._warn[n]));for(var r=v(this),i=0,n=0;n<this.length;n++)this[n]instanceof I&&(this[n]._validate(t,i),i++);var e={};for(d(t,e),n=0;n<r.length;n++){(p=function(t,r){if(void 0!==t.ff)return 127<t.ff?c(t._off,"Invalid meta event",S(t),t.tt):0==t.ff?M(t,"Sequence Number",2)||void 0:t.ff<10?t.dd.length?void 0:c(t._off,"Invalid Text meta event: no data",S(t),t.tt):32==t.ff?M(t,"Channel Prefix",1)||(15<t.dd.charCodeAt(0)?c(t._off,"Invalid Channel Prefix meta event: incorrect data",S(t),t.tt):void 0):33==t.ff?M(t,"MIDI Port",1)||(127<t.dd.charCodeAt(0)?c(t._off,"Invalid MIDI Port meta event: incorrect data",S(t),t.tt):void 0):47!=t.ff?81==t.ff?M(t,"Tempo",3)||(r&&t.track?b(t,"Tempo"):void 0):84==t.ff?M(t,"SMPTE",5)||(24<=(31&t.dd.charCodeAt(0))||60<=t.dd.charCodeAt(1)||60<=t.dd.charCodeAt(2)||30<=t.dd.charCodeAt(3)||200<=t.dd.charCodeAt(4)||t.dd.charCodeAt(4)%25?c(t._off,"Invalid SMPTE meta event: incorrect data",S(t),t.tt):3<t.dd.charCodeAt(0)>>5?c(t._off,"Invalid SMPTE meta event: incorrect format",t.dd.charCodeAt(0)>>5,t.tt):r&&t.track?b(t,"SMPTE"):void 0):88==t.ff?M(t,"Time Signature",4)||(8<t.dd.charCodeAt(1)?c(t._off,"Invalid Time Signature meta event: incorrect data",S(t),t.tt):r&&t.track?b(t,"Time Signature"):void 0):89==t.ff?M(t,"Key Signature",2)||(1<t.dd.charCodeAt(1)||255<t.dd.charCodeAt(0)||7<t.dd.charCodeAt(0)&&t.dd.charCodeAt(0)<249?c(t._off,"Invalid Key Signature meta event: incorrect data",t.toString(),t.tt):void 0):127!=t.ff?c(t._off,"Unknown meta event",S(t),t.tt):void 0:M(t,"End of Track",0)||void 0}(r[n],1==this.type))&&(p.track=r[n].track,t.push(p)),a=f=p=h=s=o=void 0;var o=t,s=e,h=r[n];if(h.length&&!(h[0]<128))if(h.isGmReset()||h.isGsReset()||h.isXgReset())d(o,s);else{var a,p=h[0]>>4,f=15&h[0];if(11==p)switch(h[1]){case 0:l(o,s,f,"bm"),s[f].bm=[h,!1];break;case 32:l(o,s,f,"bl"),s[f].bl=[h,!1];break;case 98:l(o,s,f,"nl"),l(o,s,f,"rm"),l(o,s,f,"rl"),s[f].nl=[h,!1];break;case 99:l(o,s,f,"nm"),l(o,s,f,"rm"),l(o,s,f,"rl"),s[f].nm=[h,!1];break;case 100:l(o,s,f,"rl"),l(o,s,f,"nm"),l(o,s,f,"nl"),s[f].rl=[h,!1];break;case 101:l(o,s,f,"rm"),l(o,s,f,"nm"),l(o,s,f,"nl"),s[f].rm=[h,!1];break;case 6:case 38:case 96:case 97:s[f].rm&&s[f].rl&&(s[f].rm[1]=!0,s[f].rl[1]=!0),!s[f].rm||s[f].rl||s[f].rm[1]||(a=s[f].rm[0],o.push(c(a._off,"No matching RPN LSB",a.toString(),a.tt,a.track)),s[f].rm[1]=!0),s[f].rm||!s[f].rl||s[f].rl[1]||(a=s[f].rl[0],o.push(c(a._off,"No matching RPN MSB",a.toString(),a.tt,a.track)),s[f].rl[1]=!0),s[f].nm&&s[f].nl&&(s[f].nm[1]=!0,s[f].nl[1]=!0),!s[f].nm||s[f].nl||s[f].nm[1]||(a=s[f].nm[0],o.push(c(a._off,"No matching NRPN LSB",a.toString(),a.tt,a.track)),s[f].nm[1]=!0),s[f].nm||!s[f].nl||s[f].nl[1]||(a=s[f].nl[0],o.push(c(a._off,"No matching NRPN MSB",a.toString(),a.tt,a.track)),s[f].nl[1]=!0),s[f].rm||s[f].rl||s[f].nm||s[f].nl||o.push(c(h._off,"RPN/NRPN not set",h.toString(),h.tt,h.track)),s[f].rm&&s[f].rl&&127==s[f].rm[0][2]&&127==s[f].rl[0][2]&&o.push(c(h._off,"RPN/NRPN not set",h.toString(),h.tt,h.track))}else 12==p&&(s[f].bm&&(s[f].bm[1]=!0),s[f].bl&&(s[f].bl[1]=!0),s[f].bl&&!s[f].bm&&(a=s[f].bl[0],o.push(c(a._off,"No matching Bank Select MSB",a.toString(),a.tt,a.track))),s[f].bm)&&!s[f].bl&&(a=s[f].bm[0],o.push(c(a._off,"No matching Bank Select LSB",a.toString(),a.tt,a.track)))}}if(d(t,e),t.sort(function(t,r){return(t.off||0)-(r.off||0)||(t.track||0)-(r.track||0)||(t.tick||0)-(r.tick||0)}),t.length){for(n=0;n<t.length;n++)t[n]=u(t[n]);return t}},a.prototype.dump=function(t){var r="";if(t)return"RIFF"+h((r=this.dump()).length+12)+"RMIDdata"+h(r.length)+r;for(var i=this.ntrk=0;i<this.length;i++)this[i]instanceof I&&this.ntrk++,r+=this[i].dump();return r=(this.ppqn?e(this.ppqn):String.fromCharCode(256-this.fps)+String.fromCharCode(this.ppf))+r,r=p+String.fromCharCode(0)+String.fromCharCode(this.type)+e(this.ntrk)+r},a.prototype.toBuffer=function(t){return Buffer.from(this.dump(t),"binary")},a.prototype.toUint8Array=function(t){for(var r=this.dump(t),t=new ArrayBuffer(r.length),i=new Uint8Array(t),n=0;n<r.length;n++)i[n]=r.charCodeAt(n);return i},a.prototype.toArrayBuffer=function(t){return this.toUint8Array(t).buffer},a.prototype.toInt8Array=function(t){return new Int8Array(this.toArrayBuffer(t))},a.prototype.toString=function(){for(var t=this.ntrk=0;t<this.length;t++)this[t]instanceof I&&this.ntrk++;var r=["SMF:","  type: "+this.type];for(this.ppqn?r.push("  ppqn: "+this.ppqn):r.push("  fps: "+this.fps,"  ppf: "+this.ppf),r.push("  tracks: "+this.ntrk),t=0;t<this.length;t++)r.push(this[t].toString());return r.join("\n")},a.prototype.annotate=function(){for(var t=v(this),r=_.Context(),i=0;i<t.length;i++)t[i].lbl&&(t[i].lbl=void 0),r._read(t[i]);return this},a.prototype.player=function(){var t,r=new N,i=(r.ppqn=this.ppqn,r.fps=this.fps,r.ppf=this.ppf,v(this));if(2==this.type)for(var n=0,e=0,o=0,s=0;s<i.length;s++)n!=(t=_.MIDI(i[s])).track&&(n=t.track,e=o),o=t.tt+e,t.tt=o,r._data.push(t);else for(s=0;s<i.length;s++)t=_.MIDI(i[s]),r._data.push(t);return r._type=this.type,r._tracks=this.tracks(),r._timing(),r},(((a.Chunk=C).prototype=[]).constructor=C).prototype.copy=function(){return new C(this.type,this.data)},C.prototype.sub={MTrk:function(t,r,i){return new I(r,i)}},C.prototype.dump=function(){return this.type+s(this.data.length)+this.data},C.prototype.toString=function(){return this.type+": "+this.data.length+" bytes"},(((a.MTrk=I).prototype=[]).constructor=I).prototype.type="MTrk",I.prototype.copy=function(){for(var t=new I,r=t.length=0;r<this.length;r++)t.push(new _.MIDI(this[r]));return t},I.prototype._validate=function(t,r){var i,n;if(this._warn)for(i=0;i<this._warn.length;i++)(n=u(this._warn[i])).track=r,t.push(n)},I.prototype._complain=function(t,r,i,n){this._warn||(this._warn=[]),this._warn.push(c(t,r,i,n))},I.prototype.dump=function(){for(var t,r="",i=0,n="",e=0;e<this.length;e++)if(r+=o(this[e].tt-i),i=this[e].tt,void 0!==this[e].dd)r=(r=(r=(r+="ÿ")+String.fromCharCode(this[e].ff))+o(this[e].dd.length))+this[e].dd;else if(240==this[e][0]||247==this[e][0])for(r=(r+=String.fromCharCode(this[e][0]))+o(this[e].length-1),t=1;t<this[e].length;t++)r+=String.fromCharCode(this[e][t]);else for(this[e][0]!=n&&(n=this[e][0],r+=String.fromCharCode(this[e][0])),t=1;t<this[e].length;t++)r+=String.fromCharCode(this[e][t]);return"MTrk"+s(r.length)+r},I.prototype.toString=function(){for(var t=["MTrk:"],r=0;r<this.length;r++)t.push(this[r].tt+": "+this[r].toString());return t.join("\n  ")},I.prototype.add=function(t,r){if(t=parseInt(t),(isNaN(t)||t<0)&&g("Invalid parameter"),(r=_.MIDI(r)).tt=t,this[this._orig.length-1].tt<t&&(this[this._orig.length-1].tt=t),!(47==r.ff||240<r[0]&&247!=r[0])){for(var i=0;i<this._orig.length-1&&!(this._orig[i].tt>t);i++);this._orig.splice(i,0,r)}return this},I.prototype._sxid=127,I.prototype._image=function(){function t(){}t.prototype=this._orig;var r=new t;return r._ch=this._ch,r._sxid=this._sxid,r._tick=this._tick,r},I.prototype.send=function(t){return this._orig.add(this._tick,t),this},I.prototype.tick=function(t){if(t!=parseInt(t)||t<0)throw RangeError("Bad tick value: "+t);var r;return t?((r=this._image())._tick=this._tick+t,r):this},I.prototype.sxId=function(t){if((t=void 0===t?I.prototype._sxid:t)==this._sxid)return this;if(t!=parseInt(t)||t<0||127<t)throw RangeError("Bad MIDI value: "+t);var r=this._image();return r._sxid=t,r},I.prototype.ch=function(t){if(t==this._ch||void 0===t&&void 0===this._ch)return this;if(void 0!==t&&(t!=parseInt(t)||t<0||15<t))throw RangeError("Bad channel value: "+t+" (must be from 0 to 15)");var r=this._image();return r._ch=t,r},I.prototype.note=function(t,r,i,n){return this.noteOn(t,r,i),void 0===this._ch?0<n&&this.tick(n).noteOff(t,r):0<i&&this.tick(i).noteOff(t),this},_.lib.copyMidiHelpers(I),N.prototype.onEnd=function(){},N.prototype.loop=function(t){t==parseInt(t)&&0<t?this._loop=t:this._loop=t?-1:0},N.prototype.play=function(){this.event=void 0,this.playing=!0,this.paused=!1,this._ptr=0,this._pos=0,this._p0=0,this._t0=i(),this.tick()},N.prototype.stop=function(){this._pos=0,this.playing=!1,this.event="stop",this.paused=void 0},N.prototype.pause=function(){this.event="pause"},N.prototype.resume=function(){this.playing||(this.paused?(this.event=void 0,this._t0=i(),this.playing=!0,this.paused=!1,this.tick()):this.play())},N.prototype.sndOff=function(){for(var t=0;t<16;t++)this._emit(_.MIDI.allSoundOff(t));for(t=0;t<16;t++)this._emit(_.MIDI.resetAllControllers(t))},N.prototype._filter=r,N.prototype.filter=function(t){this._filter=t instanceof Function?t:r},N.prototype._receive=function(t){81==t.ff&&this.ppqn&&(this._mul=1e3*this.ppqn/D(t.dd),this.mul=this._mul*this._speed,this._t0=i(),this._p0=this._pos),this._emit(t)},N.prototype.tick=function(){var t,r=i();for(this._pos=this._p0+(r-this._t0)*this.mul;this._ptr<this._data.length&&!((t=this._data[this._ptr]).tt>this._pos);this._ptr++)this._filter(t);this._ptr>=this._data.length&&(this._loop&&-1!=this._loop&&this._loop--,this._loop?(this._ptr=0,this._p0=0,this._t0=r):this.stop(),this.onEnd()),"stop"==this.event&&(this.playing=!1,this.paused=!1,this._pos=0,this._ptr=0,this.sndOff(),this.event=void 0),"pause"==this.event&&(this.playing=!1,this.paused=!0,this._pos>=this._duration&&(this._pos=this._duration-1),this._p0=this._pos,this.sndOff(),this.event=void 0),this.playing&&_.lib.schedule(this._tick)},N.prototype.trim=function(){for(var t,r=[],i=0,n=0;n<this._data.length;n++)if((t=this._data[n]).length||1==t.ff||5==t.ff)for(;i<=n;i++)r.push(this._data[i]);var e=(n?this._data[n-1].tt:0)-(i?this._data[i-1].tt:0);return this._data=r,this._timing(),e},N.prototype._timing=function(){var t,r,i,n;if(this._duration=this._data.length?this._data[this._data.length-1].tt:0,this._ttt=[],this.ppqn){for(this._mul=this.ppqn/500,r=this._mul,this._durationMS=i=0,this._ttt.push({t:0,m:r,ms:0}),t=0;t<this._data.length;t++)81==(n=this._data[t]).ff&&(this._durationMS+=(n.tt-i)/r,i=n.tt,r=1e3*this.ppqn/D(n.dd),this._ttt.push({t:i,m:r,ms:this._durationMS}));this._durationMS+=(this._duration-i)/r}else this._mul=this.fps*this.ppf/1e3,this._ttt.push({t:0,m:this._mul,ms:0}),this._durationMS=this._duration/this._mul;this._speed=1,this.mul=this._mul,this._ttt.push({t:this._duration,m:0,ms:this._durationMS}),this._durationMS||(this._durationMS=1)},N.prototype.speed=function(t){return void 0!==t&&((isNaN(parseFloat(t))||t<=0)&&(t=1),this._speed=t,this.mul=this._mul*this._speed,this._p0=this._pos-(i()-this._t0)*this.mul),this._speed},N.prototype.type=function(){return this._type},N.prototype.tracks=function(){return this._tracks},N.prototype.duration=function(){return this._duration},N.prototype.durationMS=function(){return this._durationMS},N.prototype.position=function(){return this._pos},N.prototype.positionMS=function(){return this.tick2ms(this._pos)},N.prototype.jump=function(t){isNaN(parseFloat(t))&&g("Not a number: "+t),(t=t<0?0:t)>=this._duration&&(t=this._duration-1),this._goto(t)},N.prototype.jumpMS=function(t){isNaN(parseFloat(t))&&g("Not a number: "+t),(t=t<0?0:t)>=this._durationMS&&(t=this._durationMS-1),this._goto(this._ms2t(t))},N.prototype._t2ms=function(t){if(!t)return 0;for(var r=0;this._ttt[r].t<t;r++);return this._ttt[--r].ms+(t-this._ttt[r].t)/this._ttt[r].m},N.prototype._ms2t=function(t){if(!t)return 0;for(var r=0;this._ttt[r].ms<t;r++);return this._ttt[--r].t+(t-this._ttt[r].ms)*this._ttt[r].m},N.prototype._goto=function(t){this._pos=t,this.playing||(this.paused=!!t),this._toPos(),this.playing&&this.sndOff()},N.prototype._toPos=function(){for(this._ptr=0;this._ptr<this._data.length;this._ptr++){var t=this._data[this._ptr];if(t.tt>=this._pos)break;81==t.ff&&this.ppqn&&(this._mul=1e3*this.ppqn/D(t.dd))}this.mul=this._mul*this._speed,this._t0=i(),this._p0=this._pos},N.prototype.tick2ms=function(t){return isNaN(parseFloat(t))&&g("Not a number: "+t),t<=0?0:t>=this._duration?this._durationMS:this._t2ms(t)},N.prototype.ms2tick=function(t){return isNaN(parseFloat(t))&&g("Not a number: "+t),t<=0?0:t>=this._durationMS?this._duration:this._ms2t(t)},_.MIDI.SMF=a,x.version=function(){return n},((x.prototype=[]).constructor=x).prototype.copy=function(t){for(var r=0;r<t.length;r++)t[r].isSMF()||(t[r].isFullSysEx()?this.push(_.MIDI(t[r])):P())},x.prototype.validate=function(){return[]},x.prototype.dump=function(){for(var t,r="",i=0;i<this.length;i++)for(t=0;t<this[i].length;t++)r+=String.fromCharCode(this[i][t]);return r},x.prototype.toBuffer=function(){return Buffer.from(this.dump(),"binary")},x.prototype.toUint8Array=function(){for(var t=this.dump(),r=new ArrayBuffer(t.length),i=new Uint8Array(r),n=0;n<t.length;n++)i[n]=t.charCodeAt(n);return i},x.prototype.toArrayBuffer=function(){return this.toUint8Array().buffer},x.prototype.toInt8Array=function(){return new Int8Array(this.toArrayBuffer())},x.prototype.toString=function(){for(var t=["SYX:"],r=0;r<this.length;r++)t.push(this[r].toString());return t.join("\n  ")},x.prototype.annotate=function(){for(var t=_.Context(),r=0;r<this.length;r++)this[r].lbl&&(this[r].lbl=void 0),t._read(this[r]);return this},x.prototype.player=function(){var t,r=new N;for(r.ppqn=96,t=0;t<this.length;t++){var i=_.MIDI(this[t]);i.tt=0,r._data.push(i)}return r._type=0,r._tracks=1,r._timing(),r.sndOff=function(){},r},x.prototype._sxid=127,x.prototype._image=function(){function t(){}t.prototype=this._orig;var r=new t;return r._ch=this._ch,r._sxid=this._sxid,r},x.prototype.add=function(t){return(t=_.MIDI(t)).isFullSysEx()&&this._orig.push(t),this},x.prototype.send=function(t){return this.add(t)},x.prototype.sxId=function(t){if((t=void 0===t?x.prototype._sxid:t)==this._sxid)return this;if(t!=parseInt(t)||t<0||127<t)throw RangeError("Bad MIDI value: "+t);var r=this._image();return r._sxid=t,r},x.prototype.ch=function(t){if(t==this._ch||void 0===t&&void 0===this._ch)return this;if(void 0!==t&&(t!=parseInt(t)||t<0||15<t))throw RangeError("Bad channel value: "+t+" (must be from 0 to 15)");var r=this._image();return r._ch=t,r},_.lib.copyMidiHelpers(x),_.MIDI.SYX=x,U.version=function(){return n},((U.prototype=[]).constructor=U).prototype._sxid=127,m="SMF2CLIP",U.prototype.dump=function(){var t,r,i=[m,this.header.dump()];for(i.push(_.UMP.umpDelta(0).dump()),i.push(_.UMP.umpStartClip().dump()),t=r=0;t<this.length;t++)i.push(_.UMP.umpDelta(this[t].tt-r).dump()),i.push(this[t].dump()),r=this[t].tt;return i.join("")},U.prototype._image=function(){function t(){}t.prototype=this._orig;var r=new t;return r._ch=this._ch,r._sxid=this._sxid,r._tick=this._tick,r},U.prototype.send=function(t){return this.add(this._tick,t)},U.prototype.tick=function(t){if(t!=parseInt(t)||t<0)throw RangeError("Bad tick value: "+t);var r;return t?((r=this._image())._tick=this._tick+t,r):this},U.prototype.add=function(t,r){t=parseInt(t),(isNaN(t)||t<0)&&g("Invalid parameter"),r=_.UMP(r);var i,n=this._orig[this._orig.length-1];if(n.tt<t&&(n.tt=t),!r.isStartClip()&&!r.isEndClip()){if(r.isDelta())return this.tick(r.getDelta());for(r.tt=t,i=0;i<this._orig.length-1&&!(this._orig[i].tt>t);i++);this._orig.splice(i,0,r)}return this},((B.prototype=[]).constructor=B).prototype._image=U.prototype._image,B.prototype.send=U.prototype.send,B.prototype.tick=U.prototype.tick,B.prototype.add=U.prototype.add,B.prototype.dump=function(){var t=[];return t.push(_.UMP.umpDelta(this.dc||0).dump()),t.push(_.UMP.umpTicksPQN(this.ppqn||96).dump()),t.join("")},B.prototype.toString=function(){var t=["Header"],r=this.dc||0;return t.push("  "+r+": "+_.UMP.umpTicksPQN(this.ppqn||96)),t.join("\n")},U.prototype._complain=function(t,r,i,n){this._warn||(this._warn=[]);t={off:t,msg:r,data:i};void 0!==n&&(t.tick=n),this._warn.push(t)},U.prototype.toString=function(){var t,r=[m,this.header.toString(),"Data"];for(r.push("  0: "+_.UMP.umpStartClip()),t=0;t<this.length;t++)r.push("  "+this[t].tt+": "+this[t]);return r.join("\n")},_.lib.copyMidi2Helpers(U),_.lib.copyMidi2Helpers(B),_.MIDI.Clip=U)});