function Base64Decode(str, encoding = "utf-8") {
  var bytes = base64js.toByteArray(str);
  return bytes;
}

var AudioContext = window.AudioContext || window.webkitAudioContext;
var audioCtx = new AudioContext();

var SoundBuffer = /** @class */ (function() {
  function SoundBuffer(ctx, sampleRate, bufferSize, debug) {
    if (bufferSize === void 0) {
      bufferSize = 6;
    }
    if (debug === void 0) {
      debug = true;
    }
    this.ctx = ctx;
    this.sampleRate = sampleRate;
    this.bufferSize = bufferSize;
    this.debug = debug;
    this.chunks = [];
    this.isPlaying = false;
    this.startTime = 0;
    this.lastChunkOffset = 0;
  }

  SoundBuffer.prototype.createChunk = function(chunk) {
    var _this = this;
    //var int16Array = new Int16Array(chunk);
    var audioBuffer = this.ctx.createBuffer(1, chunk.length, this.sampleRate);
    //var tempChunk =
    audioBuffer.getChannelData(0).set(chunk);
    // for (let index = 0; index < int16Array.length; index++) {
    //     tempChunk[index] = int16Array[index] / 32768;
    // }
    var source = this.ctx.createBufferSource();
    source.buffer = audioBuffer;
    // var lowpass = this.ctx.createBiquadFilter();
    // lowpass.type = "lowpass";
    source.connect(this.ctx.destination);
    //lowpass.connect(this.ctx.destination);
    source.onended = function(e) {
      _this.chunks.splice(_this.chunks.indexOf(source), 1);
      if (_this.chunks.length == 0) {
        _this.isPlaying = false;
        _this.startTime = 0;
        _this.lastChunkOffset = 0;
      }
    };
    return source;
  };

  SoundBuffer.prototype.log = function(data) {
    if (this.debug) {
    }
  };

  SoundBuffer.prototype.addChunk = function(data) {
    if (this.isPlaying && this.chunks.length > this.bufferSize) {
      this.log("chunk discarded");
      return; // throw away
    } else if (this.isPlaying && this.chunks.length <= this.bufferSize) {
      // schedule & add right now
      this.log("chunk accepted");
      var chunk = this.createChunk(data);
      chunk.start(this.startTime + this.lastChunkOffset);
      this.lastChunkOffset += chunk.buffer.duration;
      this.chunks.push(chunk);
    } else if (this.chunks.length < 16 && !this.isPlaying) {
      // add & don't schedule
      this.log("chunk queued");
      var chunk = this.createChunk(data);
      this.chunks.push(chunk);
    } else {
      // add & schedule entire buffer
      this.log("queued chunks scheduled");
      this.isPlaying = true;
      var chunk = this.createChunk(data);
      this.chunks.push(chunk);
      this.startTime = this.ctx.currentTime;
      this.lastChunkOffset = 0;
      for (var i = 0; i < this.chunks.length; i++) {
        var chunk_1 = this.chunks[i];
        chunk_1.start(this.startTime + this.lastChunkOffset);
        this.lastChunkOffset += chunk_1.buffer.duration;
      }
    }
  };
  return SoundBuffer;
})();

var buffer = new SoundBuffer(audioCtx, 4000, 64);
