(function (window) {
  'use strict';

  var bitrateInterval = 0;

  // Based on https://github.com/webrtc/samples/blob/gh-pages/src/content/peerconnection/bandwidth/js/main.js
  window.trackBitrate = function (connection, cb) {
    window.untrackBitrate(cb);
    var lastResult;
    bitrateInterval = setInterval(function () {
      connection.getStats(null).then(function(res) {
        res.forEach(function(report) {
          var bytes;
          var packets;
          var now = report.timestamp;
          if ((report.type === 'outboundrtp') ||
              (report.type === 'outbound-rtp') ||
              (report.type === 'ssrc' && report.bytesSent)) {
            bytes = report.bytesSent;
            packets = report.packetsSent;
            if (report.mediaType === 'video' && lastResult && lastResult.get(report.id)) {
              // calculate bitrate
              var bitrate = 8 * (bytes - lastResult.get(report.id).bytesSent) /
                  (now - lastResult.get(report.id).timestamp);
              cb(bitrate, packets);
            }
          }
        });
        lastResult = res;
      });
    }, 1000);
  }

  window.untrackBitrate = function() {
    clearInterval(bitrateInterval);
  }

  // easy access query variables.
  function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split('=');
      if (decodeURIComponent(pair[0]) == variable) {
        return decodeURIComponent(pair[1]);
      }
    }
    return undefined;
  }
  window.query = getQueryVariable;

})(this);
