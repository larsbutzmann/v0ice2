setTimeout(function () {
  window.scrollTo(0, 1);
}, 1000);

function __log(data) {
  console.log(data);
}

var audio_context,
  recorder;

window.onload = function init() {
  try {
    // webkit shim
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
    window.URL = window.URL || window.webkitURL;

    audio_context = new AudioContext;
  } catch (e) {
    alert('No web audio support in this browser!');
  }

  navigator.getUserMedia({audio: true}, startUserMedia, function(e) {
    __log('No live audio input: ' + e);
  });
};

function startUserMedia(stream) {
  var input = audio_context.createMediaStreamSource(stream);
  __log('Media stream created.');

  // input.connect(audio_context.destination);
  // __log('Input connected to audio context destination.');

  recorder = new Recorder(input);
  __log('Recorder initialised.');
}

$("#record-btn").click(function() {
  recorder && recorder.record();
  this.disabled = true;
  this.nextElementSibling.disabled = false;
  __log('Recording...');
});

$("#stop-btn").click(function() {
  recorder && recorder.stop();
  this.disabled = true;
  this.previousElementSibling.disabled = false;
  __log('Stopped recording.');

  // create WAV download link using audio data blob
  createDownloadLink();

  recorder.clear();
});

function createDownloadLink() {
  recorder && recorder.exportWAV(function(blob) {
    var url = URL.createObjectURL(blob);
    var div = document.createElement('li');
    var au = document.createElement('audio');
    var hf = document.createElement('a');

    au.controls = true;
    au.src = url;
    hf.href = url;
    hf.download = new Date().toISOString() + '.wav';
    hf.innerHTML = hf.download;
    div.appendChild(au);
    div.appendChild(hf);
    $("#recordings")[0].appendChild(div);
  });
}

/**
 * Basic data structure functions
 */

Array.prototype.in_array = function (value) {
  return (this.indexOf(value) !== -1);
};

Array.prototype.push_unique = function (value) {
  if (!this.in_array(value)) {
      this.push(value);
  }
};