(function(global, factory) {
  /* istanbul ignore next */
  if (typeof exports === 'object' && typeof module !== 'undefined') {
    module.exports = factory;
  }
  else if (typeof define === 'function' && define.amd) {
    define('JZZ.midi.SMF', ['JZZ'], factory);
  }
  else {
    factory(JZZ);
  }
})(this, function(JZZ) {

  /* istanbul ignore next */
  if (JZZ.MIDI.SMF) return;

  var _ver = '1.6.9';

  var _now = JZZ.lib.now;
  function _error(s) { throw new Error(s); }

  function _num(n) {
    var s = '';
    if (n > 0x1fffff) s += String.fromCharCode(((n >> 21) & 0x7f) + 0x80);
    if (n > 0x3fff) s += String.fromCharCode(((n >> 14) & 0x7f) + 0x80);
    if (n > 0x7f) s += String.fromCharCode(((n >> 7) & 0x7f) + 0x80);
    s += String.fromCharCode(n & 0x7f);
    return s;
  }
  function _num2(n) {
    return String.fromCharCode(n >> 8) + String.fromCharCode(n & 0xff);
  }
  function _num4(n) {
    return String.fromCharCode((n >> 24) & 0xff) + String.fromCharCode((n >> 16) & 0xff) + String.fromCharCode((n >> 8) & 0xff) + String.fromCharCode(n & 0xff);
  }
  function _num4le(n) {
    return String.fromCharCode(n & 0xff) + String.fromCharCode((n >> 8) & 0xff) + String.fromCharCode((n >> 16) & 0xff) + String.fromCharCode((n >> 24) & 0xff);
  }
  function _u8a2s(u) {
    var s = '';
    var len = u.byteLength;
    // String.fromCharCode.apply(null, u) throws "RangeError: Maximum call stack size exceeded" on large files
    for (var i = 0; i < len; i++) s += String.fromCharCode(u[i]);
    return s;
  }

  function SMF() {
    var self = this;
    if (!(self instanceof SMF)) {
      self = new SMF();
      delete self.ppqn;
    }
    var type = 1;
    var ppqn = 96;
    var fps;
    var ppf;
    if (arguments.length == 1) {
      if (arguments[0] instanceof SMF) {
        return arguments[0].copy();
      }
      if (arguments[0] instanceof SYX) {
        self.type = 0;
        self.ppqn = ppqn;
        self.push(new MTrk());
        for (var i = 0; i < arguments[0].length; i++) self[0].add(0, arguments[0][i]);
        return self;
      }
      var data;
      try {
        if (arguments[0] instanceof ArrayBuffer) {
          data = _u8a2s(new Uint8Array(arguments[0]));
        }
      }
      catch (err) {/**/}
      try {
        if (arguments[0] instanceof Uint8Array || arguments[0] instanceof Int8Array) {
          data = _u8a2s(new Uint8Array(arguments[0]));
        }
      }
      catch (err) {/**/}
      try {
        /* istanbul ignore next */
        if (arguments[0] instanceof Buffer) {
          data = arguments[0].toString('binary');
        }
      }
      catch (err) {/**/}
      if (typeof arguments[0] == 'string' && arguments[0] != '0' && arguments[0] != '1' && arguments[0] != '2') {
        data = arguments[0];
      }
      if (data) {
        self.load(data);
        return self;
      }
      type = parseInt(arguments[0]);
    }
    else if (arguments.length == 2) {
      type = parseInt(arguments[0]);
      ppqn = parseInt(arguments[1]);
    }
    else if (arguments.length == 3) {
      type = parseInt(arguments[0]);
      fps = parseInt(arguments[1]);
      ppf = parseInt(arguments[2]);
    }
    else if (arguments.length) _error('Invalid parameters');
    if (isNaN(type) || type < 0 || type > 2) _error('Invalid parameters');
    self.type = type;
    if (typeof fps == 'undefined') {
      if (isNaN(ppqn) || ppqn < 0 || ppqn > 0xffff) _error('Invalid parameters');
      self.ppqn = ppqn;
    }
    else {
      if (fps != 24 && fps != 25 && fps != 29 && fps != 30) _error('Invalid parameters');
      if (isNaN(ppf) || ppf < 0 || ppf > 0xff) _error('Invalid parameters');
      self.fps = fps;
      self.ppf = ppf;
    }
    return self;
  }
  SMF.version = function() { return _ver; };

  SMF.prototype = [];
  SMF.prototype.constructor = SMF;
  SMF.prototype.copy = function() {
    var smf = new SMF();
    smf.type = this.type;
    smf.ppqn = this.ppqn;
    smf.fps = this.fps;
    smf.ppf = this.ppf;
    smf.rmi = this.rmi;
    smf.ntrk = this.ntrk;
    for (var i = 0; i < this.length; i++) smf.push(this[i].copy());
    return smf;
  };

  function _issue(off, msg, data, tick, track) {
    var w = { off: off, msg: msg, data: data };
    if (typeof tick != 'undefined') w.tick = tick;
    if (typeof track != 'undefined') w.track = track;
    return w;
  }
  SMF.prototype._complain = function(off, msg, data) {
    if (!this._warn) this._warn = [];
    this._warn.push(_issue(off, msg, data));
  };
  SMF.prototype.load = function(s) {
    var off = 0;
    if (s.substr(0, 4) == 'RIFF' && s.substr(8, 8) == 'RMIDdata') {
      this.rmi = true;
      off = 20;
      s = s.substr(20, s.charCodeAt(16) + s.charCodeAt(17) * 0x100 + s.charCodeAt(18) * 0x10000 + s.charCodeAt(19) * 0x1000000);
    }
    this.loadSMF(s, off);
  };

  var MThd0006 = 'MThd' + String.fromCharCode(0) + String.fromCharCode(0) + String.fromCharCode(0) + String.fromCharCode(6);
  SMF.prototype.loadSMF = function(s, off) {
    if (!s.length) _error('Empty file');
    if (s.substr(0, 8) != MThd0006) {
      var z = s.indexOf(MThd0006);
      if (z != -1) {
        s = s.substr(z);
        this._complain(off, 'Extra leading characters', z);
        off += z;
      }
      else _error('Not a MIDI file');
    }
    this._off = off;
    this.type = s.charCodeAt(8) * 16 + s.charCodeAt(9);
    this._off_type = off + 8;
    this.ntrk = s.charCodeAt(10) * 16 + s.charCodeAt(11);
    this._off_ntrk = off + 10;
    if (s.charCodeAt(12) > 0x7f) {
      this.fps = 0x100 - s.charCodeAt(12);
      this.ppf = s.charCodeAt(13);
      this._off_fps = off + 12;
      this._off_ppf = off + 13;
    }
    else{
      this.ppqn = s.charCodeAt(12) * 256 + s.charCodeAt(13);
      this._off_ppqn = off + 12;
    }
    if (this.type > 2) this._complain(8 + off, 'Invalid MIDI file type', this.type);
    else if (this.type == 0 && this.ntrk > 1) this._complain(10 + off, 'Wrong number of tracks for the type 0 MIDI file', this.ntrk);
    if (!this.ppf && !this.ppqn) _error('Invalid MIDI header');
    var n = 0;
    var p = 14;
    while (p < s.length - 8) {
      var offset = p + off;
      var type = s.substr(p, 4);
      if (type == 'MTrk') n++;
      var len = (s.charCodeAt(p + 4) << 24) + (s.charCodeAt(p + 5) << 16) + (s.charCodeAt(p + 6) << 8) + s.charCodeAt(p + 7);
      if (len <= 0) { // broken file
        len = s.length - p - 8;
        this._complain(p + off + 4, 'Invalid track length', s.charCodeAt(p + 4) + '/' + s.charCodeAt(p + 5) + '/' + s.charCodeAt(p + 6) + '/' + s.charCodeAt(p + 7));
      }
      p += 8;
      var data = s.substr(p, len);
      this.push(new Chunk(type, data, offset));
      if (type == 'MThd') this._complain(offset, 'Unexpected chunk type', 'MThd');
      p += len;
    }
    if (n != this.ntrk) {
      this._complain(off + 10, 'Incorrect number of tracks', this.ntrk);
      this.ntrk = n;
    }
    if (!this.ntrk)  _error('No MIDI tracks');
    if (!this.type && this.ntrk > 1 || this.type > 2)  this.type = 1;
    if (p < s.length) this._complain(off + p, 'Extra trailing characters', s.length - p);
    if (p > s.length) this._complain(off + s.length, 'Incomplete data', p - s.length);
  };

  function Warn(obj) {
    if (!(this instanceof Warn)) return new Warn(obj);
    for (var k in obj) if (obj.hasOwnProperty(k)) this[k] = obj[k];
  }
  Warn.prototype.toString = function() {
    var a = [];
    if (typeof this.off != 'undefined') a.push('offset ' + this.off);
    if (typeof this.track != 'undefined') a.push('track ' + this.track);
    if (typeof this.tick != 'undefined') a.push('tick ' + this.tick);
    return a.join(' ') + ' -- ' + this.msg + ' (' + this.data + ')';
  };

  SMF.prototype.tracks = function() {
    var t = 0;
    for (var i = 0; i < this.length; i++) if (this[i] instanceof MTrk) t++;
    return t;
  };

  function _reset_state(w, s) {
    var i;
    for (i = 0; i < 16; i++) {
      if (s[i]) {
        if (s[i].rm && s[i].rl && s[i].rm[0][2] == 0x7f && s[i].rl[0][2] == 0x7f) {
          s[i].rm[1] = true;
          s[i].rl[1] = true;
        }
        _check_unused(w, s, i, 'bm');
        _check_unused(w, s, i, 'bl');
        _check_unused(w, s, i, 'nm');
        _check_unused(w, s, i, 'nl');
        _check_unused(w, s, i, 'rm');
        _check_unused(w, s, i, 'rl');
      }
      s[i] = {};
    }
  }
  function _update_state(w, s, msg) {
    if (!msg.length || msg[0] < 0x80) return;
    if (msg.isGmReset() || msg.isGsReset() || msg.isXgReset()) {
      _reset_state(w, s);
      return;
    }
    var st = msg[0] >> 4;
    var ch = msg[0] & 15;
    var m;
    if (st == 0xb) {
      switch (msg[1]) {
        case 0:
          _check_unused(w, s, ch, 'bm');
          s[ch].bm = [msg, false];
          break;
        case 0x20:
          _check_unused(w, s, ch, 'bl');
          s[ch].bl = [msg, false];
          break;
        case 0x62:
          _check_unused(w, s, ch, 'nl');
          _check_unused(w, s, ch, 'rm');
          _check_unused(w, s, ch, 'rl');
          s[ch].nl = [msg, false];
          break;
        case 0x63:
          _check_unused(w, s, ch, 'nm');
          _check_unused(w, s, ch, 'rm');
          _check_unused(w, s, ch, 'rl');
          s[ch].nm = [msg, false];
          break;
        case 0x64:
          _check_unused(w, s, ch, 'rl');
          _check_unused(w, s, ch, 'nm');
          _check_unused(w, s, ch, 'nl');
          s[ch].rl = [msg, false];
          break;
        case 0x65:
          _check_unused(w, s, ch, 'rm');
          _check_unused(w, s, ch, 'nm');
          _check_unused(w, s, ch, 'nl');
          s[ch].rm = [msg, false];
          break;
        case 0x6: case 0x26: case 0x60: case 0x61:
          if (s[ch].rm && s[ch].rl) {
            s[ch].rm[1] = true;
            s[ch].rl[1] = true;
          }
          if (s[ch].rm && !s[ch].rl && !s[ch].rm[1]) {
            m = s[ch].rm[0];
            w.push(_issue(m._off, 'No matching RPN LSB', m.toString(), m.tt, m.track));
            s[ch].rm[1] = true;
          }
          if (!s[ch].rm && s[ch].rl && !s[ch].rl[1]) {
            m = s[ch].rl[0];
            w.push(_issue(m._off, 'No matching RPN MSB', m.toString(), m.tt, m.track));
            s[ch].rl[1] = true;
          }
          if (s[ch].nm && s[ch].nl) {
            s[ch].nm[1] = true;
            s[ch].nl[1] = true;
          }
          if (s[ch].nm && !s[ch].nl && !s[ch].nm[1]) {
            m = s[ch].nm[0];
            w.push(_issue(m._off, 'No matching NRPN LSB', m.toString(), m.tt, m.track));
            s[ch].nm[1] = true;
          }
          if (!s[ch].nm && s[ch].nl && !s[ch].nl[1]) {
            m = s[ch].nl[0];
            w.push(_issue(m._off, 'No matching NRPN MSB', m.toString(), m.tt, m.track));
            s[ch].nl[1] = true;
          }
          if (!s[ch].rm && !s[ch].rl && !s[ch].nm && !s[ch].nl) {
            w.push(_issue(msg._off, 'RPN/NRPN not set', msg.toString(), msg.tt, msg.track));
          }
          if (s[ch].rm && s[ch].rl && s[ch].rm[0][2] == 0x7f && s[ch].rl[0][2] == 0x7f) {
            w.push(_issue(msg._off, 'RPN/NRPN not set', msg.toString(), msg.tt, msg.track));
          }
          break;
      }
      return;
    }
    if (st == 0xc) {
      if (s[ch].bm) s[ch].bm[1] = true;
      if (s[ch].bl) s[ch].bl[1] = true;
      if (s[ch].bl && !s[ch].bm) {
        m = s[ch].bl[0];
        w.push(_issue(m._off, 'No matching Bank Select MSB', m.toString(), m.tt, m.track));
      }
      if (s[ch].bm && !s[ch].bl) {
        m = s[ch].bm[0];
        w.push(_issue(m._off, 'No matching Bank Select LSB', m.toString(), m.tt, m.track));
      }
    }
  }
  function _check_unused(w, s, c, x) {
    if (s[c][x] && !s[c][x][1]) {
      var str;
      switch (x) {
        case 'bm': case 'bl': str = 'Unnecessary Bank Select'; break;
        case 'nm': case 'nl': str = 'Unnecessary NRPN'; break;
        case 'rm': case 'rl': str = 'Unnecessary RPN'; break;
      }
      var m = s[c][x][0];
      w.push(_issue(m._off, str, m.toString(), m.tt, m.track));
      delete s[c][x];
    }
  }
  SMF.prototype.validate = function() {
    var i, k, z;
    var w = [];
    if (this._warn) for (i = 0; i < this._warn.length; i++) w.push(Warn(this._warn[i]));
    var mm = _sort(this);
    k = 0;
    for (i = 0; i < this.length; i++) if (this[i] instanceof MTrk) {
      this[i]._validate(w, k);
      k++;
    }
    var st = {};
    _reset_state(w, st);
    for (i = 0; i < mm.length; i++) {
      z = _validate_midi(mm[i], this.type == 1);
      if (z) {
        z.track = mm[i].track;
        w.push(z);
      }
      _update_state(w, st, mm[i]);
    }
    _reset_state(w, st);
    w.sort(function(a, b) {
      return (a.off || 0) - (b.off || 0) || (a.track || 0) - (b.track || 0) || (a.tick || 0) - (b.tick || 0);
    });
    if (w.length) {
      for (i = 0; i < w.length; i++) w[i] = Warn(w[i]);
      return w;
    }
  };
  SMF.prototype.dump = function(rmi) {
    var s = '';
    if (rmi) {
      s = this.dump();
      return 'RIFF' + _num4le(s.length + 12) + 'RMIDdata' + _num4le(s.length) + s;
    }
    this.ntrk = 0;
    for (var i = 0; i < this.length; i++) {
      if (this[i] instanceof MTrk) this.ntrk++;
      s += this[i].dump();
    }
    s = (this.ppqn ? _num2(this.ppqn) : String.fromCharCode(0x100 - this.fps) + String.fromCharCode(this.ppf)) + s;
    s = MThd0006 + String.fromCharCode(0) + String.fromCharCode(this.type) + _num2(this.ntrk) + s;
    return s;
  };
  SMF.prototype.toBuffer = function(rmi) {
    return Buffer.from(this.dump(rmi), 'binary');
  };
  SMF.prototype.toUint8Array = function(rmi) {
    var str = this.dump(rmi);
    var buf = new ArrayBuffer(str.length);
    var arr = new Uint8Array(buf);
    for (var i = 0; i < str.length; i++) arr[i] = str.charCodeAt(i);
    return arr;
  };
  SMF.prototype.toArrayBuffer = function(rmi) {
    return this.toUint8Array(rmi).buffer;
  };
  SMF.prototype.toInt8Array = function(rmi) {
    return new Int8Array(this.toArrayBuffer(rmi));
  };
  SMF.prototype.toString = function() {
    var i;
    this.ntrk = 0;
    for (i = 0; i < this.length; i++) if (this[i] instanceof MTrk) this.ntrk++;
    var a = ['SMF:', '  type: ' + this.type];
    if (this.ppqn) a.push('  ppqn: ' + this.ppqn);
    else a.push('  fps: ' + this.fps, '  ppf: ' + this.ppf);
    a.push('  tracks: ' + this.ntrk);
    for (i = 0; i < this.length; i++) {
      a.push(this[i].toString());
    }
    return a.join('\n');
  };

  function _var2num(s) {
    if (!s.length) return 0; // missing last byte
    if (s.charCodeAt(0) < 0x80) return [1, s.charCodeAt(0)];
    var x = s.charCodeAt(0) & 0x7f;
    x <<= 7;
    if (s.charCodeAt(1) < 0x80) return [2, x + s.charCodeAt(1)];
    x += s.charCodeAt(1) & 0x7f;
    x <<= 7;
    if (s.charCodeAt(2) < 0x80) return [3, x + s.charCodeAt(2)];
    x += s.charCodeAt(2) & 0x7f;
    x <<= 7;
    x += s.charCodeAt(3) & 0x7f;
    return [4, s.charCodeAt(3) < 0x80 ? x : -x];
  }
  function _msglen(n) {
    switch (n & 0xf0) {
      case 0x80: case 0x90: case 0xa0: case 0xb0: case 0xe0: return 2;
      case 0xc0: case 0xD0: return 1;
    }
    switch (n) {
      case 0xf1: case 0xf3: return 1;
      case 0xf2: return 2;
    }
    return 0;
  }

  function _sort(smf) {
    var i, j;
    var tt = [];
    var mm = [];
    for (i = 0; i < smf.length; i++) if (smf[i] instanceof MTrk) tt.push(smf[i]);
    if (smf.type != 1) {
      for (i = 0; i < tt.length; i++) {
        for (j = 0; j < tt[i].length; j++) {
          tt[i][j].track = i;
          mm.push(tt[i][j]);
        }
      }
    }
    else {
      var t = 0;
      var pp = [];
      for (i = 0; i < tt.length; i++) pp[i] = 0;
      while (true) {
        var b = true;
        var m = 0;
        for (i = 0; i < tt.length; i++) {
          while (pp[i] < tt[i].length && tt[i][pp[i]].tt == t) {
            tt[i][pp[i]].track = i;
            mm.push(tt[i][pp[i]]);
            pp[i]++;
          }
          if (pp[i] >= tt[i].length) continue;
          if (b) m = tt[i][pp[i]].tt;
          b = false;
          if (m > tt[i][pp[i]].tt) m = tt[i][pp[i]].tt;
        }
        t = m;
        if (b) break;
      }
    }
    return mm;
  }

  SMF.prototype.annotate = function() {
    var mm = _sort(this);
    var ctxt = JZZ.Context();
    for (var i = 0; i < mm.length; i++) {
      if (mm[i].lbl) mm[i].lbl = undefined;
      ctxt._read(mm[i]);
    }
    return this;
  };

  SMF.prototype.player = function() {
    var pl = new Player();
    pl.ppqn = this.ppqn;
    pl.fps = this.fps;
    pl.ppf = this.ppf;
    var i;
    var e;
    var mm = _sort(this);
    if (this.type == 2) {
      var tr = 0;
      var m = 0;
      var t = 0;
      for (i = 0; i < mm.length; i++) {
        e = JZZ.MIDI(mm[i]);
        if (tr != e.track) {
          tr = e.track;
          m = t;
        }
        t = e.tt + m;
        e.tt = t;
        pl._data.push(e);
      }
    }
    else {
      for (i = 0; i < mm.length; i++) {
        e = JZZ.MIDI(mm[i]);
        pl._data.push(e);
      }
    }
    pl._type = this.type;
    pl._tracks = this.tracks();
    pl._timing();
    return pl;
  };

  function Chunk(t, d, off) {
    if (!(this instanceof Chunk)) return new Chunk(t, d, off);
    var i;
    if (this.sub[t]) return this.sub[t](t, d, off);
    if (typeof t != 'string' || t.length != 4) _error("Invalid chunk type: " + t);
    for (i = 0; i < t.length; i++) if (t.charCodeAt(i) < 0 || t.charCodeAt(i) > 255) _error("Invalid chunk type: " + t);
    if (typeof d != 'string') _error("Invalid data type: " + d);
    for (i = 0; i < d.length; i++) if (d.charCodeAt(i) < 0 || d.charCodeAt(i) > 255) _error("Invalid data character: " + d[i]);
    this.type = t;
    this.data = d;
    this._off = off;
  }
  SMF.Chunk = Chunk;
  Chunk.prototype = [];
  Chunk.prototype.constructor = Chunk;
  Chunk.prototype.copy = function() { return new Chunk(this.type, this.data); };

  Chunk.prototype.sub = {
    'MTrk': function(t, d, off) { return new MTrk(d, off); }
  };
  Chunk.prototype.dump = function() {
    return this.type + _num4(this.data.length) + this.data;
  };
  Chunk.prototype.toString = function() {
    return this.type + ': ' + this.data.length + ' bytes';
  };

  function _validate_msg_data(trk, s, p, m, t, off) {
    var x = s.substr(p, m);
    if (x.length < m) {
      trk._complain(off, 'Incomplete track data', m - x.length, t);
      x = (x + '\x00\x00').substr(0, m);
    }
    for (var i = 0; i < m; i++) if (x.charCodeAt(i) > 127) {
      trk._complain(off + i, 'Bad MIDI value set to 0', x.charCodeAt(i), t);
      x = x.substr(0, i) + '\x00' + x.substr(i + 1);
    }
    return x;
  }
  function _validate_number(trk, s, off, t, tt) {
    var nn = _var2num(s);
    if (tt) t += nn[1];
    if (nn[1] < 0) {
      nn[1] = -nn[1];
      trk._complain(off, "Bad byte sequence", s.charCodeAt(0) + '/' + s.charCodeAt(1) + '/' + s.charCodeAt(2) + '/' + s.charCodeAt(3), t);
    }
    else if (nn[0] == 4 && nn[1] < 0x200000) {
      trk._complain(off, "Long VLQ value", s.charCodeAt(0) + '/' + s.charCodeAt(1) + '/' + s.charCodeAt(2) + '/' + s.charCodeAt(3), t);
    }
    else if (nn[0] == 3 && nn[1] < 0x4000) {
      trk._complain(off, "Long VLQ value", s.charCodeAt(0) + '/' + s.charCodeAt(1) + '/' + s.charCodeAt(2), t);
    }
    else if (nn[0] == 2 && nn[1] < 0x80) {
      trk._complain(off, "Long VLQ value", s.charCodeAt(0) + '/' + s.charCodeAt(1), t);
    }
    return nn;
  }

  function MTrk(s, off) {
    if (!(this instanceof MTrk)) return new MTrk(s, off);
    this._off = off;
    this._orig = this;
    this._tick = 0;
    if(typeof s == 'undefined') {
      this.push(new Event(0, '\xff\x2f', ''));
      return;
    }
    var t = 0;
    var p = 0;
    var w = '';
    var st;
    var m;
    off += 8;
    var offset = p + off;
    while (p < s.length) {
      m = _validate_number(this, s.substr(p, 4), offset, t, true);
      p += m[0];
      t += m[1];
      offset = p + off;
      if (s.charCodeAt(p) == 0xff) {
        st = s.substr(p, 2);
        if (st.length < 2) {
          this._complain(offset, 'Incomplete track data', 3 - st.length, t);
          st = '\xff\x2f';
        }
        p += 2;
        m = _validate_number(this, s.substr(p, 4), offset + 2, t);
        p += m[0];
        this.push (new Event(t, st, s.substr(p, m[1]), offset));
        p += m[1];
      }
      else if (s.charCodeAt(p) == 0xf0 || s.charCodeAt(p) == 0xf7) {
        st = s.substr(p, 1);
        p += 1;
        m = _validate_number(this, s.substr(p, 4), offset + 1, t);
        p += m[0];
        this.push(new Event(t, st, s.substr(p, m[1]), offset));
        p += m[1];
      }
      else if (s.charCodeAt(p) & 0x80) {
        w = s.substr(p, 1);
        p += 1;
        m = _msglen(w.charCodeAt(0));
        if (w.charCodeAt(0) > 0xf0) this._complain(offset, 'Unexpected MIDI message', w.charCodeAt(0).toString(16), t);
        this.push(new Event(t, w, _validate_msg_data(this, s, p, m, t, offset + 1), offset));
        p += m;
      }
      else if (w.charCodeAt(0) & 0x80) { // running status
        m = _msglen(w.charCodeAt(0));
        if (w.charCodeAt(0) > 0xf0) this._complain(offset, 'Unexpected MIDI message', w.charCodeAt(0).toString(16), t);
        this.push(new Event(t, w, _validate_msg_data(this, s, p, m, t, offset), offset));
        p += m;
      }
    }
  }
  SMF.MTrk = MTrk;

  MTrk.prototype = [];
  MTrk.prototype.constructor = MTrk;
  MTrk.prototype.type = 'MTrk';
  MTrk.prototype.copy = function() {
    var trk = new MTrk();
    trk.length = 0;
    for (var i = 0; i < this.length; i++) trk.push(new JZZ.MIDI(this[i]));
    return trk;
  };
  function _shortmsg(msg) {
    var s = msg.toString();
    if (s.length > 80) {
      s = s.substr(0, 78);
      s = s.substr(0, s.lastIndexOf(' ')) + ' ...';
    }
    return s;
  }
  function _metaevent_len(msg, name, len) {
    if (msg.dd.length < len) return _issue(msg._off, 'Invalid ' + name + ' meta event: ' + (msg.dd.length ? 'data too short' : 'no data'), _shortmsg(msg), msg.tt);
    if (msg.dd.length > len) return _issue(msg._off, 'Invalid ' + name + ' meta event: data too long', _shortmsg(msg), msg.tt);
  }
  function _timing_first_track(msg, name) {
    return _issue(msg._off, name + ' meta events must be in the first track', _shortmsg(msg), msg.tt);
  }
  function _validate_midi(msg, t1) {
    var issue;
    if (typeof msg.ff != 'undefined') {
      if (msg.ff > 0x7f) return _issue(msg._off, 'Invalid meta event', _shortmsg(msg), msg.tt);
      else if (msg.ff == 0) {
        issue = _metaevent_len(msg, 'Sequence Number', 2); if (issue) return issue;
      }
      else if (msg.ff < 10) {
        if (!msg.dd.length) return _issue(msg._off, 'Invalid Text meta event: no data', _shortmsg(msg), msg.tt);
      }
      else if (msg.ff == 32) {
        issue = _metaevent_len(msg, 'Channel Prefix', 1); if (issue) return issue;
        if (msg.dd.charCodeAt(0) > 15) return _issue(msg._off, 'Invalid Channel Prefix meta event: incorrect data', _shortmsg(msg), msg.tt);
      }
      else if (msg.ff == 33) {
        issue = _metaevent_len(msg, 'MIDI Port', 1); if (issue) return issue;
        if (msg.dd.charCodeAt(0) > 127) return _issue(msg._off, 'Invalid MIDI Port meta event: incorrect data', _shortmsg(msg), msg.tt);
      }
      else if (msg.ff == 47) {
        issue = _metaevent_len(msg, 'End of Track', 0); if (issue) return issue;
      }
      else if (msg.ff == 81) {
        issue = _metaevent_len(msg, 'Tempo', 3); if (issue) return issue;
        if (t1 && msg.track) return _timing_first_track(msg, 'Tempo');
      }
      else if (msg.ff == 84) {
        issue = _metaevent_len(msg, 'SMPTE', 5); if (issue) return issue;
        if ((msg.dd.charCodeAt(0) & 0x1f) >= 24 || msg.dd.charCodeAt(1) >= 60 || msg.dd.charCodeAt(2) >= 60 || msg.dd.charCodeAt(3) >= 30 || msg.dd.charCodeAt(4) >= 200 || msg.dd.charCodeAt(4) % 25) return _issue(msg._off, 'Invalid SMPTE meta event: incorrect data', _shortmsg(msg), msg.tt);
        else if ((msg.dd.charCodeAt(0) >> 5) > 3) return _issue(msg._off, 'Invalid SMPTE meta event: incorrect format', msg.dd.charCodeAt(0) >> 5, msg.tt);
        if (t1 && msg.track) return _timing_first_track(msg, 'SMPTE');
      }
      else if (msg.ff == 88) {
        issue = _metaevent_len(msg, 'Time Signature', 4); if (issue) return issue;
        if (msg.dd.charCodeAt(1) > 8) return _issue(msg._off, 'Invalid Time Signature meta event: incorrect data', _shortmsg(msg), msg.tt);
        if (t1 && msg.track) return _timing_first_track(msg, 'Time Signature');
      }
      else if (msg.ff == 89) {
        issue = _metaevent_len(msg, 'Key Signature', 2); if (issue) return issue;
        if (msg.dd.charCodeAt(1) > 1 || msg.dd.charCodeAt(0) > 255 || (msg.dd.charCodeAt(0) > 7 && msg.dd.charCodeAt(0) < 249)) return _issue(msg._off, 'Invalid Key Signature meta event: incorrect data', msg.toString(), msg.tt);
      }
      else if (msg.ff == 127) {
        // Sequencer Specific meta event
      }
      else {
        return _issue(msg._off, 'Unknown meta event', _shortmsg(msg), msg.tt);
      }
    }
    else {
      //
    }
  }
  MTrk.prototype._validate = function(w, k) {
    var i, z;
    if (this._warn) for (i = 0; i < this._warn.length; i++) {
      z = Warn(this._warn[i]);
      z.track = k;
      w.push(z);
    }
  };
  MTrk.prototype._complain = function(off, msg, data, tick) {
    if (!this._warn) this._warn = [];
    this._warn.push(_issue(off, msg, data, tick));
  };
  MTrk.prototype.dump = function() {
    var s = '';
    var t = 0;
    var m = '';
    var i, j;
    for (i = 0; i < this.length; i++) {
      s += _num(this[i].tt - t);
      t = this[i].tt;
      if (typeof this[i].dd != 'undefined') {
        s += '\xff';
        s += String.fromCharCode(this[i].ff);
        s += _num(this[i].dd.length);
        s += this[i].dd;
      }
      else if (this[i][0] == 0xf0 || this[i][0] == 0xf7) {
        s += String.fromCharCode(this[i][0]);
        s += _num(this[i].length - 1);
        for (j = 1; j < this[i].length; j++) s += String.fromCharCode(this[i][j]);
      }
      else {
        if (this[i][0] != m) {
          m = this[i][0];
          s += String.fromCharCode(this[i][0]);
        }
        for (j = 1; j < this[i].length; j++) s += String.fromCharCode(this[i][j]);
      }
    }
    return 'MTrk' + _num4(s.length) + s;
  };
  MTrk.prototype.toString = function() {
    var a = ['MTrk:'];
    for (var i = 0; i < this.length; i++) {
      a.push(this[i].tt + ': ' + this[i].toString());
    }
    return a.join('\n  ');
  };

  MTrk.prototype.add = function(t, msg) {
    t = parseInt(t);
    if(isNaN(t) || t < 0) _error('Invalid parameter');
    msg = JZZ.MIDI(msg);
    msg.tt = t;
    if (this[this._orig.length - 1].tt < t) this[this._orig.length - 1].tt = t; // end of track
    if (msg.ff == 0x2f || msg[0] > 0xf0 && msg[0] != 0xf7) return this;
    var i;
    for (i = 0; i < this._orig.length - 1; i++) {
      if (this._orig[i].tt > t) break;
    }
    this._orig.splice(i, 0, msg);
    return this;
  };

  MTrk.prototype._ch = undefined;
  MTrk.prototype._sxid = 0x7f;
  MTrk.prototype._image = function() {
    var F = function() {}; F.prototype = this._orig;
    var img = new F();
    img._ch = this._ch;
    img._sxid = this._sxid;
    img._tick = this._tick;
    return img;
  };
  MTrk.prototype.send = function(msg) { this._orig.add(this._tick, msg); return this; };
  MTrk.prototype.tick = function(t) {
    if (t != parseInt(t) || t < 0) throw RangeError('Bad tick value: ' + t);
    if (!t) return this;
    var img = this._image();
    img._tick = this._tick + t;
    return img;
  };
  MTrk.prototype.sxId = function(id) {
    if (typeof id == 'undefined') id = MTrk.prototype._sxid;
    if (id == this._sxid) return this;
    if (id != parseInt(id) || id < 0 || id > 0x7f) throw RangeError('Bad MIDI value: ' + id);
    var img = this._image();
    img._sxid = id;
    return img;
  };
  MTrk.prototype.ch = function(c) {
    if (c == this._ch || typeof c == 'undefined' && typeof this._ch == 'undefined') return this;
    if (typeof c != 'undefined') {
      if (c != parseInt(c) || c < 0 || c > 15) throw RangeError('Bad channel value: ' + c  + ' (must be from 0 to 15)');
    }
    var img = this._image();
    img._ch = c;
    return img;
  };
  MTrk.prototype.note = function(c, n, v, t) {
    this.noteOn(c, n, v);
    if (typeof this._ch == 'undefined') {
      if (t > 0) this.tick(t).noteOff(c, n);
    }
    else {
      if (v > 0) this.tick(v).noteOff(c);
    }
    return this;
  };
  JZZ.lib.copyMidiHelpers(MTrk);

  function Event(t, s, d, off) {
    var midi;
    if (s.charCodeAt(0) == 0xff) {
      midi = JZZ.MIDI.smf(s.charCodeAt(1), d);
    }
    else {
      var a = [s.charCodeAt(0)];
      for (var i = 0; i < d.length; i++) a.push(d.charCodeAt(i));
      midi = JZZ.MIDI(a);
    }
    if (typeof off != 'undefined') midi._off = off;
    midi.tt = t;
    return midi;
  }

  function Player() {
    var self = new JZZ.Widget();
    self._info.name = 'MIDI Player';
    self._info.manufacturer = 'Jazz-Soft';
    self._info.version = _ver;
    self.playing = false;
    self._loop = 0;
    self._data = [];
    self._pos = 0;
    self._tick = (function(x) { return function(){ x.tick(); }; })(self);
    for (var k in Player.prototype) if (Player.prototype.hasOwnProperty(k)) self[k] = Player.prototype[k];
    return self;
  }
  Player.prototype.onEnd = function() {};
  Player.prototype.loop = function(n) {
    if (n == parseInt(n) && n > 0) this._loop = n;
    else this._loop = n ? -1 : 0;
  };
  Player.prototype.play = function() {
    this.event = undefined;
    this.playing = true;
    this.paused = false;
    this._ptr = 0;
    this._pos = 0;
    this._p0 = 0;
    this._t0 = _now();
    this.tick();
  };
  Player.prototype.stop = function() {
    this._pos = 0;
    this.playing = false;
    this.event = 'stop';
    this.paused = undefined;
  };
  Player.prototype.pause = function() {
    this.event = 'pause';
  };
  Player.prototype.resume = function() {
    if (this.playing) return;
    if (this.paused) {
      this.event = undefined;
      this._t0 = _now();
      this.playing = true;
      this.paused = false;
      this.tick();
    }
    else this.play();
  };
  Player.prototype.sndOff = function() {
    var c;
    for (c = 0; c < 16; c++) this._emit(JZZ.MIDI.allSoundOff(c));
    for (c = 0; c < 16; c++) this._emit(JZZ.MIDI.resetAllControllers(c));
  };
  function _filter(e) { this._receive(e); }
  Player.prototype._filter = _filter;
  Player.prototype.filter = function(f) {
    this._filter = f instanceof Function ? f : _filter;
  };
  function _div(s) { return (s.charCodeAt(0) << 16) + (s.charCodeAt(1) << 8) + s.charCodeAt(2); }
  Player.prototype._receive = function(e) {
    if (e.ff == 0x51 && this.ppqn) {
      this._mul = this.ppqn * 1000.0 / _div(e.dd);
      this.mul = this._mul * this._speed;
      this._t0 = _now();
      this._p0 = this._pos;
    }
    this._emit(e);
  };
  Player.prototype.tick = function() {
    var t = _now();
    var e;
    this._pos = this._p0 + (t - this._t0) * this.mul;
    for(; this._ptr < this._data.length; this._ptr++) {
      e = this._data[this._ptr];
      if (e.tt > this._pos) break;
      this._filter(e);
    }
    if (this._ptr >= this._data.length) {
      if (this._loop && this._loop != -1) this._loop--;
      if (this._loop) {
        this._ptr = 0;
        this._p0 = 0;
        this._t0 = t;
      }
      else this.stop();
      this.onEnd();
    }
    if (this.event == 'stop') {
      this.playing = false;
      this.paused = false;
      this._pos = 0;
      this._ptr = 0;
      this.sndOff();
      this.event = undefined;
    }
    if (this.event == 'pause') {
      this.playing = false;
      this.paused = true;
      if (this._pos >= this._duration) this._pos = this._duration - 1;
      this._p0 = this._pos;
      this.sndOff();
      this.event = undefined;
    }
    if (this.playing) JZZ.lib.schedule(this._tick);
  };
  Player.prototype.trim = function() {
    var i, j, e;
    var data = [];
    j = 0;
    for (i = 0; i < this._data.length; i++) {
      e = this._data[i];
      if (e.length || e.ff == 1 || e.ff == 5) {
        for (; j <= i; j++) data.push(this._data[j]);
      }
    }
    var dt = (i ? this._data[i - 1].tt : 0) - (j ? this._data[j - 1].tt : 0);
    this._data = data;
    this._timing();
    return dt;
  };
  Player.prototype._timing = function() {
    var i, m, t, e;
    this._duration = this._data.length ? this._data[this._data.length - 1].tt : 0;
    this._ttt = [];
    if (this.ppqn) {
      this._mul = this.ppqn / 500.0; // 120 bpm
      m = this._mul;
      t = 0;
      this._durationMS = 0;
      this._ttt.push({ t: 0, m: m, ms: 0 });
      for (i = 0; i < this._data.length; i++) {
        e = this._data[i];
        if (e.ff == 0x51) {
          this._durationMS += (e.tt - t) / m;
          t = e.tt;
          m = this.ppqn * 1000.0 / _div(e.dd);
          this._ttt.push({ t: t, m: m, ms: this._durationMS });
        }
      }
      this._durationMS += (this._duration - t) / m;
    }
    else {
      this._mul = this.fps * this.ppf / 1000.0; // 1s = fps*ppf ticks
      this._ttt.push({ t: 0, m: this._mul, ms: 0 });
      this._durationMS = this._duration / this._mul;
    }
    this._speed = 1;
    this.mul = this._mul;
    this._ttt.push({ t: this._duration, m: 0, ms: this._durationMS });
    if (!this._durationMS) this._durationMS = 1;
  };
  Player.prototype.speed = function(x) {
    if (typeof x != 'undefined') {
      if (isNaN(parseFloat(x)) || x <= 0) x = 1;
      this._speed = x;
      this.mul = this._mul * this._speed;
      this._p0 = this._pos - (_now() - this._t0) * this.mul;
    }
    return this._speed;
  };
  Player.prototype.type = function() { return this._type; };
  Player.prototype.tracks = function() { return this._tracks; };
  Player.prototype.duration = function() { return this._duration; };
  Player.prototype.durationMS = function() { return this._durationMS; };
  Player.prototype.position = function() { return this._pos; };
  Player.prototype.positionMS = function() { return this.tick2ms(this._pos); };
  Player.prototype.jump = function(t) {
    if (isNaN(parseFloat(t))) _error('Not a number: ' + t);
    if (t < 0) t = 0.0;
    if (t >= this._duration) t = this._duration - 1;
    this._goto(t);
  };
  Player.prototype.jumpMS = function(ms) {
    if (isNaN(parseFloat(ms))) _error('Not a number: ' + ms);
    if (ms < 0) ms = 0.0;
    if (ms >= this._durationMS) ms = this._durationMS - 1;
    this._goto(this._ms2t(ms));
  };
  Player.prototype._t2ms = function(t) {
    if (!t) return 0.0;
    var i;
    for (i = 0; this._ttt[i].t < t; i++) ;
    i--;
    return this._ttt[i].ms + (t - this._ttt[i].t) / this._ttt[i].m;
  };
  Player.prototype._ms2t = function(ms) {
    if (!ms) return 0.0;
    var i;
    for (i = 0; this._ttt[i].ms < ms; i++) ;
    i--;
    return this._ttt[i].t + (ms - this._ttt[i].ms) * this._ttt[i].m;
  };
  Player.prototype._goto = function(t) {
    this._pos = t;
    if (!this.playing) this.paused = !!t;
    this._toPos();
    if (this.playing) this.sndOff();
  };
  Player.prototype._toPos = function() {
    for(this._ptr = 0; this._ptr < this._data.length; this._ptr++) {
      var e = this._data[this._ptr];
      if (e.tt >= this._pos) break;
      if (e.ff == 0x51 && this.ppqn) this._mul = this.ppqn * 1000.0 / _div(e.dd);
    }
    this.mul = this._mul * this._speed;
    this._t0 = _now();
    this._p0 = this._pos;
  };
  Player.prototype.tick2ms = function(t) {
    if (isNaN(parseFloat(t))) _error('Not a number: ' + t);
    if (t <= 0) return 0.0;
    if (t >= this._duration) return this._durationMS;
    return this._t2ms(t);
  };
  Player.prototype.ms2tick = function(t) {
    if (isNaN(parseFloat(t))) _error('Not a number: ' + t);
    if (t <= 0) return 0.0;
    if (t >= this._durationMS) return this._duration;
    return this._ms2t(t);
  };
  JZZ.MIDI.SMF = SMF;

  function _not_a_syx() { _error('Not a SYX file'); }

  function SYX(arg) {
    var self = this instanceof SYX ? this : self = new SYX();
    self._orig = self;
    if (typeof arg != 'undefined') {
      if (arg instanceof SMF) {
        self.copy(arg.player()._data);
        return self;
      }
      if (arg instanceof SYX) {
        self.copy(arg);
        return self;
      }
      try {
        if (arg instanceof ArrayBuffer) {
          arg = _u8a2s(new Uint8Array(arg));
        }
      }
      catch (err) {/**/}
      try {
        if (arg instanceof Uint8Array || arg instanceof Int8Array) {
          arg = _u8a2s(new Uint8Array(arg));
        }
      }
      catch (err) {/**/}
      try {
        /* istanbul ignore next */
        if (arg instanceof Buffer) {
          arg = arg.toString('binary');
        }
      }
      catch (err) {/**/}
      if (typeof arg != 'string') {
        arg = String.fromCharCode.apply(null, arg);
      }
      var x;
      var msg = [];
      var i = 0;
      var off = 0;
      while (i < arg.length) {
        if (arg.charCodeAt(i) != 0xf0) _not_a_syx();
        while (i < arg.length) {
          x = arg.charCodeAt(i);
          msg.push(x);
          if (x == 0xf7) {
            msg = JZZ.MIDI(msg);
            msg._off = off;
            self.push(JZZ.MIDI(msg));
            msg = [];
            off = i + 1;
            break;
          }
          i++;
        }
        i++;
      }
      if (msg.length) _not_a_syx();
      return self;
    }
    return self;
  }
  SYX.version = function() { return _ver; };
  SYX.prototype = [];
  SYX.prototype.constructor = SYX;

  SYX.prototype.copy = function(data) {
    for (var i = 0; i < data.length; i++) if (!data[i].isSMF()) {
      if (data[i].isFullSysEx()) this.push(JZZ.MIDI(data[i]));
      else _not_a_syx();
    }
  };
  SYX.prototype.validate = function() { return []; };
  SYX.prototype.dump = function() {
    var i, j, s = '';
    for (i = 0; i < this.length; i++) for (j = 0; j < this[i].length; j++) s += String.fromCharCode(this[i][j]);
    return s;
  };
  SYX.prototype.toBuffer = function() {
    return Buffer.from(this.dump(), 'binary');
  };
  SYX.prototype.toUint8Array = function() {
    var str = this.dump();
    var buf = new ArrayBuffer(str.length);
    var arr = new Uint8Array(buf);
    for (var i = 0; i < str.length; i++) arr[i] = str.charCodeAt(i);
    return arr;
  };
  SYX.prototype.toArrayBuffer = function() {
    return this.toUint8Array().buffer;
  };
  SYX.prototype.toInt8Array = function() {
    return new Int8Array(this.toArrayBuffer());
  };
  SYX.prototype.toString = function() {
    var i;
    var a = ['SYX:'];
    for (i = 0; i < this.length; i++) {
      a.push(this[i].toString());
    }
    return a.join('\n  ');
  };
  SYX.prototype.annotate = function() {
    var ctxt = JZZ.Context();
    for (var i = 0; i < this.length; i++) {
      if (this[i].lbl) this[i].lbl = undefined;
      ctxt._read(this[i]);
    }
    return this;
  };
  SYX.prototype.player = function() {
    var pl = new Player();
    pl.ppqn = 96;
    var i;
    for (i = 0; i < this.length; i++) {
      var e = JZZ.MIDI(this[i]);
      e.tt = 0;
      pl._data.push(e);
    }
    pl._type = 0;
    pl._tracks = 1;
    pl._timing();
    pl.sndOff = function() {};
    return pl;
  };

  SYX.prototype._ch = undefined;
  SYX.prototype._sxid = 0x7f;
  SYX.prototype._image = function() {
    var F = function() {}; F.prototype = this._orig;
    var img = new F();
    img._ch = this._ch;
    img._sxid = this._sxid;
    return img;
  };
  SYX.prototype.add = function(msg) {
    msg = JZZ.MIDI(msg);
    if (msg.isFullSysEx()) this._orig.push(msg);
    return this;
  };
  SYX.prototype.send = function(msg) { return this.add(msg); };
  SYX.prototype.sxId = function(id) {
    if (typeof id == 'undefined') id = SYX.prototype._sxid;
    if (id == this._sxid) return this;
    if (id != parseInt(id) || id < 0 || id > 0x7f) throw RangeError('Bad MIDI value: ' + id);
    var img = this._image();
    img._sxid = id;
    return img;
  };
  SYX.prototype.ch = function(c) {
    if (c == this._ch || typeof c == 'undefined' && typeof this._ch == 'undefined') return this;
    if (typeof c != 'undefined') {
      if (c != parseInt(c) || c < 0 || c > 15) throw RangeError('Bad channel value: ' + c  + ' (must be from 0 to 15)');
    }
    var img = this._image();
    img._ch = c;
    return img;
  };
  JZZ.lib.copyMidiHelpers(SYX);

  JZZ.MIDI.SYX = SYX;
});
