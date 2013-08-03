var audio_context,
  recorder;

window.onload = function init() {
  try {
    // webkit shim
    window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext;
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
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
  $("#onair").show();
  __log('Recording...');
});

$("#stop-btn").click(function() {
  recorder && recorder.stop();
  this.disabled = true;
  this.previousElementSibling.disabled = false;
  $("#onair").hide();
  __log('Stopped recording.');

  // create WAV download link using audio data blob
  createDownloadLink();

  recorder.clear();
});

function createDownloadLink() {
  recorder && recorder.exportWAV(function(blob) {
    __log(blob);
    var url = URL.createObjectURL(blob);
    __log(url);

    l = blob

    var div = document.createElement('li');
    var au = document.createElement('audio');
    // var hf = document.createElement('a');
    var btn = document.createElement('button');

    btn.className = "btn";
    btn.innerHTML = "Submit";
    btn.addEventListener("click", function() {
      var form = new FormData();
      form.append("user_audio_blob", blob);
      var request = new XMLHttpRequest();
      request.open("POST", "/record", false);
      request.send(form);
      $(this).remove();
    });

    au.controls = true;
    au.src = url;
    // hf.href = url;
    // hf.download = new Date().toISOString() + '.wav';
    // hf.innerHTML = hf.download;
    div.appendChild(au);
    // div.appendChild(hf);
    div.appendChild(btn);
    $("#recordings")[0].appendChild(div);
  });
}