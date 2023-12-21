!function(t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t.SMF=t:"function"==typeof define&&define.amd?define("JZZ.midi.SMF",["JZZ"],t):t(JZZ)}(function(g){var e,i,c,y;function v(t){throw new Error(t)}function o(t){var r="";return 2097151<t&&(r+=String.fromCharCode(128+(t>>21&127))),16383<t&&(r+=String.fromCharCode(128+(t>>14&127))),127<t&&(r+=String.fromCharCode(128+(t>>7&127))),r+=String.fromCharCode(127&t)}function n(t){return String.fromCharCode(t>>8)+String.fromCharCode(255&t)}function s(t){return String.fromCharCode(t>>24&255)+String.fromCharCode(t>>16&255)+String.fromCharCode(t>>8&255)+String.fromCharCode(255&t)}function h(t){return String.fromCharCode(255&t)+String.fromCharCode(t>>8&255)+String.fromCharCode(t>>16&255)+String.fromCharCode(t>>24&255)}function C(t){for(var r="",i=t.byteLength,e=0;e<i;e++)r+=String.fromCharCode(t[e]);return r}function a(){var t,r,i,e=this,n=(e instanceof a||delete(e=new a).ppqn,1),o=96;if(1==arguments.length){if(arguments[0]instanceof a)return arguments[0].copy();if(arguments[0]instanceof P){e.type=0,e.ppqn=o,e.push(new A);for(var s=0;s<arguments[0].length;s++)e[0].add(0,arguments[0][s]);return e}try{arguments[0]instanceof ArrayBuffer&&(i=C(new Uint8Array(arguments[0])))}catch(t){}try{(arguments[0]instanceof Uint8Array||arguments[0]instanceof Int8Array)&&(i=C(new Uint8Array(arguments[0])))}catch(t){}try{arguments[0]instanceof Buffer&&(i=arguments[0].toString("binary"))}catch(t){}if(""==(i="string"==typeof arguments[0]&&"0"!=arguments[0]&&"1"!=arguments[0]&&"2"!=arguments[0]?arguments[0]:i)&&v("Empty file"),i)return e.load(i),e;n=parseInt(arguments[0])}else 2==arguments.length?(n=parseInt(arguments[0]),o=parseInt(arguments[1])):3==arguments.length?(n=parseInt(arguments[0]),t=parseInt(arguments[1]),r=parseInt(arguments[2])):arguments.length&&v("Invalid parameters");return(isNaN(n)||n<0||2<n)&&v("Invalid parameters"),e.type=n,void 0===t?((isNaN(o)||o<0||65535<o)&&v("Invalid parameters"),e.ppqn=o):(24!=t&&25!=t&&29!=t&&30!=t&&v("Invalid parameters"),(isNaN(r)||r<0||255<r)&&v("Invalid parameters"),e.fps=t,e.ppf=r),e}function u(t,r,i,e,n){t={off:t,msg:r,data:i};return void 0!==e&&(t.tick=e),void 0!==n&&(t.track=n),t}function d(t){if(!(this instanceof d))return new d(t);for(var r in t)t.hasOwnProperty(r)&&(this[r]=t[r])}function l(t,r){for(var i=0;i<16;i++)r[i]&&(r[i].rm&&r[i].rl&&127==r[i].rm[0][2]&&127==r[i].rl[0][2]&&(r[i].rm[1]=!0,r[i].rl[1]=!0),_(t,r,i,"bm"),_(t,r,i,"bl"),_(t,r,i,"nm"),_(t,r,i,"nl"),_(t,r,i,"rm"),_(t,r,i,"rl")),r[i]={}}function _(t,r,i,e){if(r[i][e]&&!r[i][e][1]){var n;switch(e){case"bm":case"bl":n="Unnecessary Bank Select";break;case"nm":case"nl":n="Unnecessary NRPN";break;case"rm":case"rl":n="Unnecessary RPN"}var o=r[i][e][0];t.push(u(o._off,n,o.toString(),o.tt,o.track)),delete r[i][e]}}function p(t){switch(240&t){case 128:case 144:case 160:case 176:case 224:return 2;case 192:case 208:return 1}switch(t){case 241:case 243:return 1;case 242:return 2}return 0}function m(t){var r,i=[],e=[];for(a=0;a<t.length;a++)t[a]instanceof A&&i.push(t[a]);if(1!=t.type)for(a=0;a<i.length;a++)for(r=0;r<i[a].length;r++)i[a][r].track=a,e.push(i[a][r]);else{var n=0,o=[];for(a=0;a<i.length;a++)o[a]=0;for(;;){for(var s=!0,h=0,a=0;a<i.length;a++){for(;o[a]<i[a].length&&i[a][o[a]].tt==n;)i[a][o[a]].track=a,e.push(i[a][o[a]]),o[a]++;o[a]>=i[a].length||(s&&(h=i[a][o[a]].tt),s=!1,h>i[a][o[a]].tt&&(h=i[a][o[a]].tt))}if(n=h,s)break}}return e}function I(t,r,i){if(!(this instanceof I))return new I(t,r,i);var e;if(this.sub[t])return this.sub[t](t,r,i);for("string"==typeof t&&4==t.length||v("Invalid chunk type: "+t),e=0;e<t.length;e++)(t.charCodeAt(e)<0||255<t.charCodeAt(e))&&v("Invalid chunk type: "+t);for("string"!=typeof r&&v("Invalid data type: "+r),e=0;e<r.length;e++)(r.charCodeAt(e)<0||255<r.charCodeAt(e))&&v("Invalid data character: "+r[e]);this.type=t,this.data=r,this._off=i}function f(t,r,i,e,n,o){var s=r.substr(i,e);s.length<e&&(t._complain(o,"Incomplete track data",e-s.length,n),s=(s+"\0\0").substr(0,e));for(var h=0;h<e;h++)127<s.charCodeAt(h)&&(t._complain(o+h,"Bad MIDI value set to 0",s.charCodeAt(h),n),s=s.substr(0,h)+"\0"+s.substr(h+1));return s}function k(t,r,i,e,n){var o,s=(s=r).length?s.charCodeAt(0)<128?[1,s.charCodeAt(0)]:(o=127&s.charCodeAt(0),o<<=7,s.charCodeAt(1)<128?[2,o+s.charCodeAt(1)]:(o=o+(127&s.charCodeAt(1))<<7,s.charCodeAt(2)<128?[3,o+s.charCodeAt(2)]:(o=(o=o+(127&s.charCodeAt(2))<<7)+(127&s.charCodeAt(3)),[4,s.charCodeAt(3)<128?o:-o]))):0;return n&&(e+=s[1]),s[1]<0?(s[1]=-s[1],t._complain(i,"Bad byte sequence",r.charCodeAt(0)+"/"+r.charCodeAt(1)+"/"+r.charCodeAt(2)+"/"+r.charCodeAt(3),e)):4==s[0]&&s[1]<2097152?t._complain(i,"Long VLQ value",r.charCodeAt(0)+"/"+r.charCodeAt(1)+"/"+r.charCodeAt(2)+"/"+r.charCodeAt(3),e):3==s[0]&&s[1]<16384?t._complain(i,"Long VLQ value",r.charCodeAt(0)+"/"+r.charCodeAt(1)+"/"+r.charCodeAt(2),e):2==s[0]&&s[1]<128&&t._complain(i,"Long VLQ value",r.charCodeAt(0)+"/"+r.charCodeAt(1),e),s}function A(t,r){if(!(this instanceof A))return new A(t,r);if(this._off=r,void((this._orig=this)._tick=0)===t)this.push(new w(0,"ÿ/",""));else for(var i,e,n=0,o=0,s="",h=o+(r+=8);o<t.length;)o+=(e=k(this,t.substr(o,4),h,n,!0))[0],n+=e[1],h=o+r,255==t.charCodeAt(o)?((i=t.substr(o,2)).length<2&&(this._complain(h,"Incomplete track data",3-i.length,n),i="ÿ/"),o=(o+=2)+(e=k(this,t.substr(o,4),h+2,n))[0],this.push(new w(n,i,t.substr(o,e[1]),h)),o+=e[1]):240==t.charCodeAt(o)||247==t.charCodeAt(o)?(i=t.substr(o,1),o=(o+=1)+(e=k(this,t.substr(o,4),h+1,n))[0],this.push(new w(n,i,t.substr(o,e[1]),h)),o+=e[1]):128&t.charCodeAt(o)?(s=t.substr(o,1),o+=1,e=p(s.charCodeAt(0)),240<s.charCodeAt(0)&&this._complain(h,"Unexpected MIDI message",s.charCodeAt(0).toString(16),n),this.push(new w(n,s,f(this,t,o,e,n,h+1),h)),o+=e):128&s.charCodeAt(0)&&(e=p(s.charCodeAt(0)),240<s.charCodeAt(0)&&this._complain(h,"Unexpected MIDI message",s.charCodeAt(0).toString(16),n),this.push(new w(n,s,f(this,t,o,e,n,h),h)),o+=e)}function S(t){t=t.toString();return t=80<t.length?(t=t.substr(0,78)).substr(0,t.lastIndexOf(" "))+" ...":t}function M(t,r,i){return t.dd.length<i?u(t._off,"Invalid "+r+" meta event: "+(t.dd.length?"data too short":"no data"),S(t),t.tt):t.dd.length>i?u(t._off,"Invalid "+r+" meta event: data too long",S(t),t.tt):void 0}function b(t,r){return u(t._off,r+" meta events must be in the first track",S(t),t.tt)}function w(t,r,i,e){var n;if(255==r.charCodeAt(0))n=g.MIDI.smf(r.charCodeAt(1),i);else{for(var o=[r.charCodeAt(0)],s=0;s<i.length;s++)o.push(i.charCodeAt(s));n=g.MIDI(o)}return void 0!==e&&(n._off=e),n.tt=t,n}function N(){var t,r,i=new g.Widget;for(r in i._info.name="MIDI Player",i._info.manufacturer="Jazz-Soft",i._info.version=e,i.playing=!1,i._loop=0,i._data=[],i._hdr=[],i._pos=0,i._tick=(t=i,function(){t.tick()}),N.prototype)N.prototype.hasOwnProperty(r)&&(i[r]=N.prototype[r]);return i}function r(t){this._receive(t)}function D(){v("Not a SYX file")}function P(t){var r=this instanceof P?this:new P;if(r._orig=r,void 0!==t)if(t instanceof a)r.copy(t.player()._data);else if(t instanceof P)r.copy(t);else{try{t instanceof ArrayBuffer&&(t=C(new Uint8Array(t)))}catch(t){}try{(t instanceof Uint8Array||t instanceof Int8Array)&&(t=C(new Uint8Array(t)))}catch(t){}try{t instanceof Buffer&&(t=t.toString("binary"))}catch(t){}var i,e=[],n=0,o=0;for((t="string"!=typeof t?String.fromCharCode.apply(null,t):t).length||v("Empty file");n<t.length;){for(240!=t.charCodeAt(n)&&D();n<t.length;){if(i=t.charCodeAt(n),e.push(i),247==i){(e=g.MIDI(e))._off=o,r.push(g.MIDI(e)),e=[],o=n+1;break}n++}n++}e.length&&D()}return r}function x(t){var r=this instanceof x?this:new x;if((r._orig=r)._tick=0,r.ppqn=96,void 0!==t)if(t instanceof x){var i,e,n=r,o=t;for(n.length=0,n.header=new q,n.ppqn=o.ppqn,i=0;i<o.header.length;i++)(e=new g.UMP(o.header[i])).tt=o.header[i].tt,n.header.push(e);for(i=0;i<o.length;i++)(e=new g.UMP(o[i])).tt=o[i].tt,n.push(e)}else{try{t instanceof ArrayBuffer&&(t=C(new Uint8Array(t)))}catch(t){}try{(t instanceof Uint8Array||t instanceof Int8Array)&&(t=C(new Uint8Array(t)))}catch(t){}try{t instanceof Buffer&&(t=t.toString("binary"))}catch(t){}"string"!=typeof t&&(t=String.fromCharCode.apply(null,t));var s=r,h=t,a=0;h.length||v("Empty clip"),h.substr(0,8)!=y&&(-1!=(t=h.indexOf(y))?(h=h.substr(t),s._complain(a,"Extra leading characters",t),a+=t):v("Not a clip")),a+=8,s.length=0,s.header=new q,s.ppqn=-1;for(var p,f,c,u,d,l=!0,_=!1,m=0;a<h.length;){for(d=h.charCodeAt(a)>>4,u=[4,4,4,8,8,16,4,4,8,8,8,12,12,16,16,16][d],p=[],f=0;f<u;f++)p.push(h.charCodeAt(a+f));d=c,(c=g.UMP(p)).isDelta()?(d&&d.isDelta()&&s._complain(a,"Consequential Delta Ticks message"),m+=c.getDelta()):(c.tt=m,l?c.isStartClip()?(m=0,l=!1):c.isTicksPQN()?(-1!=s.ppqn&&s._complain(a,"Multiple Ticks PQN message"),s.ppqn=c.getTicksPQN(),s.ppqn||(s._complain(a,"Bad Ticks PQN value: 0"),s.ppqn=96)):c.isEndClip()?s._complain(a,"Unexpected End of Clip message"):s.header.push(c):c.isStartClip()?s._complain(a,"Repeated Start of Clip message"):c.isEndClip()?(_&&s._complain(a,"Repeated End of Clip message"),_=!0):s.push(c)),a+=u}(c=g.UMP.umpEndClip()).tt=m,s.push(c),-1==s.ppqn&&(s._complain(a,"Missing Ticks PQN message"),s.ppqn=96)}else r.header||(r.header=new q),r.length||((t=g.UMP.umpEndClip()).tt=0,r.push(t));return r}function q(){(this._orig=this)._tick=0}g.MIDI.SMF||(e="1.8.3",i=g.lib.now,a.version=function(){return e},a.num4=s,((a.prototype=[]).constructor=a).prototype.copy=function(){var t=new a;t.type=this.type,t.ppqn=this.ppqn,t.fps=this.fps,t.ppf=this.ppf,t.rmi=this.rmi,t.ntrk=this.ntrk;for(var r=0;r<this.length;r++)t.push(this[r].copy());return t},a.prototype._complain=function(t,r,i){this._warn||(this._warn=[]),this._warn.push(u(t,r,i))},a.prototype.load=function(t){for(var r=0,i=("RIFF"==t.substr(0,4)&&"RMIDdata"==t.substr(8,8)&&(this.rmi=!0,t=t.substr(r=20,t.charCodeAt(16)+256*t.charCodeAt(17)+65536*t.charCodeAt(18)+16777216*t.charCodeAt(19))),this),e=t,n=r,o=(e.substr(0,8)!=c&&(-1!=(t=e.indexOf(c))?(e=e.substr(t),i._complain(n,"Extra leading characters",t),n+=t):v("Not a MIDI file")),i._off=n,i.type=16*e.charCodeAt(8)+e.charCodeAt(9),i._off_type=n+8,i.ntrk=16*e.charCodeAt(10)+e.charCodeAt(11),i._off_ntrk=n+10,127<e.charCodeAt(12)?(i.fps=256-e.charCodeAt(12),i.ppf=e.charCodeAt(13),i._off_fps=n+12,i._off_ppf=n+13):(i.ppqn=256*e.charCodeAt(12)+e.charCodeAt(13),i._off_ppqn=n+12),2<i.type?i._complain(8+n,"Invalid MIDI file type",i.type):0==i.type&&1<i.ntrk&&i._complain(10+n,"Wrong number of tracks for the type 0 MIDI file",i.ntrk),i.ppf||i.ppqn||v("Invalid MIDI header"),0),s=14;s<e.length-8;){var h=s+n,a=e.substr(s,4),p=("MTrk"==a&&o++,(e.charCodeAt(s+4)<<24)+(e.charCodeAt(s+5)<<16)+(e.charCodeAt(s+6)<<8)+e.charCodeAt(s+7)),f=(p<=0&&(p=e.length-s-8,i._complain(s+n+4,"Invalid track length",e.charCodeAt(s+4)+"/"+e.charCodeAt(s+5)+"/"+e.charCodeAt(s+6)+"/"+e.charCodeAt(s+7))),s+=8,e.substr(s,p));i.push(new I(a,f,h)),"MThd"==a&&i._complain(h,"Unexpected chunk type","MThd"),s+=p}o!=i.ntrk&&(i._complain(n+10,"Incorrect number of tracks",i.ntrk),i.ntrk=o),i.ntrk||v("No MIDI tracks"),(!i.type&&1<i.ntrk||2<i.type)&&(i.type=1),s<e.length&&i._complain(n+s,"Extra trailing characters",e.length-s),s>e.length&&i._complain(n+e.length,"Incomplete data",s-e.length)},c="MThd"+String.fromCharCode(0)+String.fromCharCode(0)+String.fromCharCode(0)+String.fromCharCode(6),d.prototype.toString=function(){var t=[];return void 0!==this.off&&t.push("offset "+this.off),void 0!==this.track&&t.push("track "+this.track),void 0!==this.tick&&t.push("tick "+this.tick),t.join(" ")+" -- "+this.msg+" ("+this.data+")"},a.prototype.tracks=function(){for(var t=0,r=0;r<this.length;r++)this[r]instanceof A&&t++;return t},a.prototype.validate=function(){var t=[];if(this._warn)for(e=0;e<this._warn.length;e++)t.push(d(this._warn[e]));for(var r=m(this),i=0,e=0;e<this.length;e++)this[e]instanceof A&&(this[e]._validate(t,i),i++);var n={};for(l(t,n),e=0;e<r.length;e++){(p=function(t,r){if(void 0!==t.ff)return 127<t.ff?u(t._off,"Invalid meta event",S(t),t.tt):0==t.ff?M(t,"Sequence Number",2)||void 0:t.ff<10?t.dd.length?void 0:u(t._off,"Invalid Text meta event: no data",S(t),t.tt):32==t.ff?M(t,"Channel Prefix",1)||(15<t.dd.charCodeAt(0)?u(t._off,"Invalid Channel Prefix meta event: incorrect data",S(t),t.tt):void 0):33==t.ff?M(t,"MIDI Port",1)||(127<t.dd.charCodeAt(0)?u(t._off,"Invalid MIDI Port meta event: incorrect data",S(t),t.tt):void 0):47!=t.ff?81==t.ff?M(t,"Tempo",3)||(r&&t.track?b(t,"Tempo"):void 0):84==t.ff?M(t,"SMPTE",5)||(24<=(31&t.dd.charCodeAt(0))||60<=t.dd.charCodeAt(1)||60<=t.dd.charCodeAt(2)||30<=t.dd.charCodeAt(3)||200<=t.dd.charCodeAt(4)||t.dd.charCodeAt(4)%25?u(t._off,"Invalid SMPTE meta event: incorrect data",S(t),t.tt):3<t.dd.charCodeAt(0)>>5?u(t._off,"Invalid SMPTE meta event: incorrect format",t.dd.charCodeAt(0)>>5,t.tt):r&&t.track?b(t,"SMPTE"):void 0):88==t.ff?M(t,"Time Signature",4)||(8<t.dd.charCodeAt(1)?u(t._off,"Invalid Time Signature meta event: incorrect data",S(t),t.tt):r&&t.track?b(t,"Time Signature"):void 0):89==t.ff?M(t,"Key Signature",2)||(1<t.dd.charCodeAt(1)||255<t.dd.charCodeAt(0)||7<t.dd.charCodeAt(0)&&t.dd.charCodeAt(0)<249?u(t._off,"Invalid Key Signature meta event: incorrect data",t.toString(),t.tt):void 0):127!=t.ff?u(t._off,"Unknown meta event",S(t),t.tt):void 0:M(t,"End of Track",0)||void 0}(r[e],1==this.type))&&(p.track=r[e].track,t.push(p)),a=f=p=h=s=o=void 0;var o=t,s=n,h=r[e];if(h.length&&!(h[0]<128))if(h.isGmReset()||h.isGsReset()||h.isXgReset())l(o,s);else{var a,p=h[0]>>4,f=15&h[0];if(11==p)switch(h[1]){case 0:_(o,s,f,"bm"),s[f].bm=[h,!1];break;case 32:_(o,s,f,"bl"),s[f].bl=[h,!1];break;case 98:_(o,s,f,"nl"),_(o,s,f,"rm"),_(o,s,f,"rl"),s[f].nl=[h,!1];break;case 99:_(o,s,f,"nm"),_(o,s,f,"rm"),_(o,s,f,"rl"),s[f].nm=[h,!1];break;case 100:_(o,s,f,"rl"),_(o,s,f,"nm"),_(o,s,f,"nl"),s[f].rl=[h,!1];break;case 101:_(o,s,f,"rm"),_(o,s,f,"nm"),_(o,s,f,"nl"),s[f].rm=[h,!1];break;case 6:case 38:case 96:case 97:s[f].rm&&s[f].rl&&(s[f].rm[1]=!0,s[f].rl[1]=!0),!s[f].rm||s[f].rl||s[f].rm[1]||(a=s[f].rm[0],o.push(u(a._off,"No matching RPN LSB",a.toString(),a.tt,a.track)),s[f].rm[1]=!0),s[f].rm||!s[f].rl||s[f].rl[1]||(a=s[f].rl[0],o.push(u(a._off,"No matching RPN MSB",a.toString(),a.tt,a.track)),s[f].rl[1]=!0),s[f].nm&&s[f].nl&&(s[f].nm[1]=!0,s[f].nl[1]=!0),!s[f].nm||s[f].nl||s[f].nm[1]||(a=s[f].nm[0],o.push(u(a._off,"No matching NRPN LSB",a.toString(),a.tt,a.track)),s[f].nm[1]=!0),s[f].nm||!s[f].nl||s[f].nl[1]||(a=s[f].nl[0],o.push(u(a._off,"No matching NRPN MSB",a.toString(),a.tt,a.track)),s[f].nl[1]=!0),s[f].rm||s[f].rl||s[f].nm||s[f].nl||o.push(u(h._off,"RPN/NRPN not set",h.toString(),h.tt,h.track)),s[f].rm&&s[f].rl&&127==s[f].rm[0][2]&&127==s[f].rl[0][2]&&o.push(u(h._off,"RPN/NRPN not set",h.toString(),h.tt,h.track))}else 12==p&&(s[f].bm&&(s[f].bm[1]=!0),s[f].bl&&(s[f].bl[1]=!0),s[f].bl&&!s[f].bm&&(a=s[f].bl[0],o.push(u(a._off,"No matching Bank Select MSB",a.toString(),a.tt,a.track))),s[f].bm)&&!s[f].bl&&(a=s[f].bm[0],o.push(u(a._off,"No matching Bank Select LSB",a.toString(),a.tt,a.track)))}}if(l(t,n),t.sort(function(t,r){return(t.off||0)-(r.off||0)||(t.track||0)-(r.track||0)||(t.tick||0)-(r.tick||0)}),t.length){for(e=0;e<t.length;e++)t[e]=d(t[e]);return t}},a.prototype.dump=function(t){var r="";if(t)return"RIFF"+h((r=this.dump()).length+12)+"RMIDdata"+h(r.length)+r;for(var i=this.ntrk=0;i<this.length;i++)this[i]instanceof A&&this.ntrk++,r+=this[i].dump();return r=(this.ppqn?n(this.ppqn):String.fromCharCode(256-this.fps)+String.fromCharCode(this.ppf))+r,r=c+String.fromCharCode(0)+String.fromCharCode(this.type)+n(this.ntrk)+r},a.prototype.toBuffer=function(t){return Buffer.from(this.dump(t),"binary")},a.prototype.toUint8Array=function(t){for(var r=this.dump(t),t=new ArrayBuffer(r.length),i=new Uint8Array(t),e=0;e<r.length;e++)i[e]=r.charCodeAt(e);return i},a.prototype.toArrayBuffer=function(t){return this.toUint8Array(t).buffer},a.prototype.toInt8Array=function(t){return new Int8Array(this.toArrayBuffer(t))},a.prototype.toString=function(){for(var t=this.ntrk=0;t<this.length;t++)this[t]instanceof A&&this.ntrk++;var r=["SMF:","  type: "+this.type];for(this.ppqn?r.push("  ppqn: "+this.ppqn):r.push("  fps: "+this.fps,"  ppf: "+this.ppf),r.push("  tracks: "+this.ntrk),t=0;t<this.length;t++)r.push(this[t].toString());return r.join("\n")},a.prototype.annotate=function(){for(var t=m(this),r=g.Context(),i=0;i<t.length;i++)t[i].lbl&&(t[i].lbl=void 0),r._read(t[i]);return this},a.prototype.player=function(){var t,r=new N,i=(r.ppqn=this.ppqn,r.fps=this.fps,r.ppf=this.ppf,m(this));if(2==this.type)for(var e=0,n=0,o=0,s=0;s<i.length;s++)e!=(t=g.MIDI(i[s])).track&&(e=t.track,n=o),o=t.tt+n,t.tt=o,r._data.push(t);else for(s=0;s<i.length;s++)t=g.MIDI(i[s]),r._data.push(t);return r._type=this.type,r._tracks=this.tracks(),r._timing(),r},(((a.Chunk=I).prototype=[]).constructor=I).prototype.copy=function(){return new I(this.type,this.data)},I.prototype.sub={MTrk:function(t,r,i){return new A(r,i)}},I.prototype.dump=function(){return this.type+s(this.data.length)+this.data},I.prototype.toString=function(){return this.type+": "+this.data.length+" bytes"},(((a.MTrk=A).prototype=[]).constructor=A).prototype.type="MTrk",A.prototype.copy=function(){for(var t=new A,r=t.length=0;r<this.length;r++)t.push(new g.MIDI(this[r]));return t},A.prototype._validate=function(t,r){var i,e;if(this._warn)for(i=0;i<this._warn.length;i++)(e=d(this._warn[i])).track=r,t.push(e)},A.prototype._complain=function(t,r,i,e){this._warn||(this._warn=[]),this._warn.push(u(t,r,i,e))},A.prototype.dump=function(){for(var t,r="",i=0,e="",n=0;n<this.length;n++)if(r+=o(this[n].tt-i),i=this[n].tt,void 0!==this[n].dd)r=(r=(r=(r+="ÿ")+String.fromCharCode(this[n].ff))+o(this[n].dd.length))+this[n].dd;else if(240==this[n][0]||247==this[n][0])for(r=(r+=String.fromCharCode(this[n][0]))+o(this[n].length-1),t=1;t<this[n].length;t++)r+=String.fromCharCode(this[n][t]);else for(this[n][0]!=e&&(e=this[n][0],r+=String.fromCharCode(this[n][0])),t=1;t<this[n].length;t++)r+=String.fromCharCode(this[n][t]);return"MTrk"+s(r.length)+r},A.prototype.toString=function(){for(var t=["MTrk:"],r=0;r<this.length;r++)t.push(this[r].tt+": "+this[r].toString());return t.join("\n  ")},A.prototype.add=function(t,r){if(t=parseInt(t),(isNaN(t)||t<0)&&v("Invalid parameter"),(r=g.MIDI(r)).tt=t,this[this._orig.length-1].tt<t&&(this[this._orig.length-1].tt=t),!(47==r.ff||240<r[0]&&247!=r[0])){for(var i=0;i<this._orig.length-1&&!(this._orig[i].tt>t);i++);this._orig.splice(i,0,r)}return this},A.prototype._sxid=127,A.prototype._image=function(){function t(){}t.prototype=this._orig;var r=new t;return r._ch=this._ch,r._sxid=this._sxid,r._tick=this._tick,r},A.prototype.send=function(t){return this._orig.add(this._tick,t),this},A.prototype.tick=function(t){if(t!=parseInt(t)||t<0)throw RangeError("Bad tick value: "+t);var r;return t?((r=this._image())._tick=this._tick+t,r):this},A.prototype.sxId=function(t){if((t=void 0===t?A.prototype._sxid:t)==this._sxid)return this;if(t!=parseInt(t)||t<0||127<t)throw RangeError("Bad MIDI value: "+t);var r=this._image();return r._sxid=t,r},A.prototype.ch=function(t){if(t==this._ch||void 0===t&&void 0===this._ch)return this;if(void 0!==t&&(t!=parseInt(t)||t<0||15<t))throw RangeError("Bad channel value: "+t+" (must be from 0 to 15)");var r=this._image();return r._ch=t,r},A.prototype.note=function(t,r,i,e){return this.noteOn(t,r,i),void 0===this._ch?0<e&&this.tick(e).noteOff(t,r):0<i&&this.tick(i).noteOff(t),this},g.lib.copyMidiHelpers(A),N.prototype.onEnd=function(){},N.prototype.loop=function(t){t==parseInt(t)&&0<t?this._loop=t:this._loop=t?-1:0},N.prototype.play=function(){this.event=void 0,this.playing=!0,this.paused=!1,this._ptr=0,this._pos=0,this._p0=0,this._t0=i(),this._list=this._hdr,this.tick()},N.prototype.stop=function(){this._pos=0,this.playing=!1,this.event="stop",this.paused=void 0},N.prototype.pause=function(){this.event="pause"},N.prototype.resume=function(){this.playing||(this.paused?(this.event=void 0,this._t0=i(),this.playing=!0,this.paused=!1,this.tick()):this.play())},N.prototype.sndOff=function(){for(var t=0;t<16;t++)this._emit(g.MIDI.allSoundOff(t));for(t=0;t<16;t++)this._emit(g.MIDI.resetAllControllers(t))},N.prototype._filter=r,N.prototype.filter=function(t){this._filter=t instanceof Function?t:r},N.prototype._receive=function(t){t.isTempo()&&this.ppqn&&(this._mul=this.ppqn*(t.isMidi2?1e5:1e3)/(t.getTempo()||1),this.mul=this._mul*this._speed,this._t0=i(),this._p0=this._pos),this._emit(t)},N.prototype.tick=function(){var t,r=i();for(this._pos=this._p0+(r-this._t0)*this.mul;this._ptr<this._list.length&&!((t=this._list[this._ptr]).tt>this._pos);this._ptr++)this._filter(t);this._ptr>=this._list.length&&(this._list==this._hdr?(this._list=this._data,this._ptr=0,this._p0=0,this._t0=r):(this._loop&&-1!=this._loop&&this._loop--,this._loop?(this._ptr=0,this._p0=0,this._t0=r):this.stop(),this.onEnd())),"stop"==this.event&&(this.playing=!1,this.paused=!1,this._pos=0,this._ptr=0,this.sndOff(),this.event=void 0),"pause"==this.event&&(this.playing=!1,this.paused=!0,this._pos>=this._duration&&(this._pos=this._duration-1),this._p0=this._pos,this.sndOff(),this.event=void 0),this.playing&&g.lib.schedule(this._tick)},N.prototype.trim=function(){for(var t,r=[],i=0,e=0;e<this._data.length;e++)if((t=this._data[e]).length||1==t.ff||5==t.ff)for(;i<=e;i++)r.push(this._data[i]);var n=(e?this._data[e-1].tt:0)-(i?this._data[i-1].tt:0);return this._data=r,this._timing(),n},N.prototype._timing=function(){var t,r,i,e;if(this._duration=this._data.length?this._data[this._data.length-1].tt:0,this._ttt=[],this.ppqn){for(this._mul=this.ppqn/500,r=this._mul,t=0;t<this._hdr.length;t++)(e=this._hdr[t]).isTempo()&&(r=1e5*this.ppqn/(e.getTempo()||1));for(this._durationMS=i=0,this._ttt.push({t:0,m:r,ms:0}),t=0;t<this._data.length;t++)(e=this._data[t]).isTempo()&&(this._durationMS+=(e.tt-i)/r,i=e.tt,r=this.ppqn*(e.isMidi2?1e5:1e3)/(e.getTempo()||1),this._ttt.push({t:i,m:r,ms:this._durationMS}));this._durationMS+=(this._duration-i)/r}else this._mul=this.fps*this.ppf/1e3,this._ttt.push({t:0,m:this._mul,ms:0}),this._durationMS=this._duration/this._mul;this._speed=1,this.mul=this._mul,this._ttt.push({t:this._duration,m:0,ms:this._durationMS}),this._durationMS||(this._durationMS=1)},N.prototype.speed=function(t){return void 0!==t&&((isNaN(parseFloat(t))||t<=0)&&(t=1),this._speed=t,this.mul=this._mul*this._speed,this._p0=this._pos-(i()-this._t0)*this.mul),this._speed},N.prototype.type=function(){return this._type},N.prototype.tracks=function(){return this._tracks},N.prototype.duration=function(){return this._duration},N.prototype.durationMS=function(){return this._durationMS},N.prototype.position=function(){return this._pos},N.prototype.positionMS=function(){return this.tick2ms(this._pos)},N.prototype.jump=function(t){isNaN(parseFloat(t))&&v("Not a number: "+t),(t=t<0?0:t)>=this._duration&&(t=this._duration-1),this._goto(t)},N.prototype.jumpMS=function(t){isNaN(parseFloat(t))&&v("Not a number: "+t),(t=t<0?0:t)>=this._durationMS&&(t=this._durationMS-1),this._goto(this._ms2t(t))},N.prototype._t2ms=function(t){if(!t)return 0;for(var r=0;this._ttt[r].t<t;r++);return this._ttt[--r].ms+(t-this._ttt[r].t)/this._ttt[r].m},N.prototype._ms2t=function(t){if(!t)return 0;for(var r=0;this._ttt[r].ms<t;r++);return this._ttt[--r].t+(t-this._ttt[r].ms)*this._ttt[r].m},N.prototype._goto=function(t){this._pos=t,this.playing||(this.paused=!!t),this._toPos(),this.playing&&this.sndOff()},N.prototype._toPos=function(){for(var t,r=0;r<this._hdr.length;r++)(t=this._hdr[r]).isTempo()&&(this._mul=1e5*this.ppqn/(t.getTempo()||1));for(this._ptr=0;this._ptr<this._data.length&&!((t=this._data[this._ptr]).tt>=this._pos);this._ptr++)t.isTempo()&&this.ppqn&&(this._mul=this.ppqn*(t.isMidi2?1e5:1e3)/(t.getTempo()||1));this._list=this._data,this.mul=this._mul*this._speed,this._t0=i(),this._p0=this._pos},N.prototype.tick2ms=function(t){return isNaN(parseFloat(t))&&v("Not a number: "+t),t<=0?0:t>=this._duration?this._durationMS:this._t2ms(t)},N.prototype.ms2tick=function(t){return isNaN(parseFloat(t))&&v("Not a number: "+t),t<=0?0:t>=this._durationMS?this._duration:this._ms2t(t)},g.MIDI.SMF=a,P.version=function(){return e},((P.prototype=[]).constructor=P).prototype.copy=function(t){for(var r=0;r<t.length;r++)t[r].isSMF()||(t[r].isFullSysEx()?this.push(g.MIDI(t[r])):D())},P.prototype.validate=function(){return[]},P.prototype.dump=function(){for(var t,r="",i=0;i<this.length;i++)for(t=0;t<this[i].length;t++)r+=String.fromCharCode(this[i][t]);return r},P.prototype.toBuffer=function(){return Buffer.from(this.dump(),"binary")},P.prototype.toUint8Array=function(){for(var t=this.dump(),r=new ArrayBuffer(t.length),i=new Uint8Array(r),e=0;e<t.length;e++)i[e]=t.charCodeAt(e);return i},P.prototype.toArrayBuffer=function(){return this.toUint8Array().buffer},P.prototype.toInt8Array=function(){return new Int8Array(this.toArrayBuffer())},P.prototype.toString=function(){for(var t=["SYX:"],r=0;r<this.length;r++)t.push(this[r].toString());return t.join("\n  ")},P.prototype.annotate=function(){for(var t=g.Context(),r=0;r<this.length;r++)this[r].lbl&&(this[r].lbl=void 0),t._read(this[r]);return this},P.prototype.player=function(){var t,r=new N;for(r.ppqn=96,t=0;t<this.length;t++){var i=g.MIDI(this[t]);i.tt=0,r._data.push(i)}return r._type="syx",r._tracks=1,r._timing(),r.sndOff=function(){},r},P.prototype._sxid=127,P.prototype._image=function(){function t(){}t.prototype=this._orig;var r=new t;return r._ch=this._ch,r._sxid=this._sxid,r},P.prototype.add=function(t){return(t=g.MIDI(t)).isFullSysEx()&&this._orig.push(t),this},P.prototype.send=function(t){return this.add(t)},P.prototype.sxId=function(t){if((t=void 0===t?P.prototype._sxid:t)==this._sxid)return this;if(t!=parseInt(t)||t<0||127<t)throw RangeError("Bad MIDI value: "+t);var r=this._image();return r._sxid=t,r},P.prototype.ch=function(t){if(t==this._ch||void 0===t&&void 0===this._ch)return this;if(void 0!==t&&(t!=parseInt(t)||t<0||15<t))throw RangeError("Bad channel value: "+t+" (must be from 0 to 15)");var r=this._image();return r._ch=t,r},g.lib.copyMidiHelpers(P),g.MIDI.SYX=P,x.version=function(){return e},((x.prototype=[]).constructor=x).prototype._sxid=127,y="SMF2CLIP",x.prototype._image=function(){function t(){}t.prototype=this._orig;var r=new t;return r._gr=this._gr,r._ch=this._ch,r._sxid=this._sxid,r._tick=this._tick,r},x.prototype.send=function(t){return this.add(this._tick,t)},x.prototype.tick=function(t){if(t!=parseInt(t)||t<0)throw RangeError("Bad tick value: "+t);var r;return t?((r=this._image())._tick=this._tick+t,r):this},x.prototype.add=function(t,r){t=parseInt(t),(isNaN(t)||t<0)&&v("Invalid parameter"),r=g.UMP(r);var i,e=this._orig[this._orig.length-1];if(e.tt<t&&(e.tt=t),!r.isStartClip()&&!r.isEndClip()){if(r.isDelta())return this.tick(r.getDelta());for(r.tt=t,i=0;i<this._orig.length-1&&!(this._orig[i].tt>t);i++);this._orig.splice(i,0,r)}return this},x.prototype.sxId=function(t){if((t=void 0===t?x.prototype._sxid:t)==this._sxid)return this;if(t!=parseInt(t)||t<0||127<t)throw RangeError("Bad MIDI value: "+t);var r=this._image();return r._sxid=t,r},x.prototype.gr=function(t){if(t==this._gr||void 0===t&&void 0===this._gr)return this;if(void 0!==t&&(t!=parseInt(t)||t<0||15<t))throw RangeError("Bad channel value: "+t+" (must be from 0 to 15)");var r=this._image();return r._gr=t,r},x.prototype.ch=function(t){if(t==this._ch||void 0===t&&void 0===this._ch)return this;if(void 0!==t&&(t!=parseInt(t)||t<0||15<t))throw RangeError("Bad channel value: "+t+" (must be from 0 to 15)");var r=this._image();return r._ch=t,r},((q.prototype=[]).constructor=q).prototype._image=x.prototype._image,q.prototype.send=x.prototype.send,q.prototype.tick=x.prototype.tick,q.prototype.gr=x.prototype.gr,q.prototype.ch=x.prototype.ch,q.prototype.sxId=x.prototype.sxId,q.prototype.add=function(t,r){if(t=parseInt(t),(isNaN(t)||t<0)&&v("Invalid parameter"),!(r=g.UMP(r)).isStartClip()&&!r.isEndClip()){if(r.isDelta())return this.tick(r.getDelta());var i;for(r.tt=t,i=0;i<this._orig.length&&!(this._orig[i].tt>t);i++);this._orig.splice(i,0,r)}return this},x.prototype._complain=function(t,r,i,e){this._warn||(this._warn=[]);t={off:t,msg:r,data:i};void 0!==e&&(t.tick=e),this._warn.push(t)},x.prototype.dump=function(){var t,r,i=[y];for(i.push(g.UMP.umpDelta(0).dump()),i.push(g.UMP.umpTicksPQN(this.ppqn).dump()),t=r=0;t<this.header.length;t++)i.push(g.UMP.umpDelta(this.header[t].tt-r).dump()),i.push(this.header[t].dump()),r=this.header[t].tt;for(i.push(g.UMP.umpDelta(0).dump()),i.push(g.UMP.umpStartClip().dump()),t=r=0;t<this.length;t++)i.push(g.UMP.umpDelta(this[t].tt-r).dump()),i.push(this[t].dump()),r=this[t].tt;return i.join("")},x.prototype.toBuffer=function(){return Buffer.from(this.dump(),"binary")},x.prototype.toUint8Array=function(){for(var t=this.dump(),r=new ArrayBuffer(t.length),i=new Uint8Array(r),e=0;e<t.length;e++)i[e]=t.charCodeAt(e);return i},x.prototype.toArrayBuffer=function(){return this.toUint8Array().buffer},x.prototype.toInt8Array=function(){return new Int8Array(this.toArrayBuffer())},x.prototype.toString=function(){var t,r=[y,"Header"];for(r.push("  0: "+g.UMP.umpTicksPQN(this.ppqn)),t=0;t<this.header.length;t++)r.push("  "+this.header[t].tt+": "+this.header[t]);for(r.push("Data","  0: "+g.UMP.umpStartClip()),t=0;t<this.length;t++)r.push("  "+this[t].tt+": "+this[t]);return r.join("\n")},x.prototype.annotate=function(){return this},x.prototype.player=function(){var t,r,i=new N;for(i.ppqn=this.ppqn,t=0;t<this.header.length;t++)r=g.MIDI2(this.header[t]),i._hdr.push(r);for(t=0;t<this.length;t++)r=g.MIDI2(this[t]),i._data.push(r);return i._type="clip",i._tracks=1,i._timing(),i.sndOff=function(){},i},g.lib.copyMidi2Helpers(x),g.lib.copyMidi2Helpers(q),g.MIDI.Clip=x)});