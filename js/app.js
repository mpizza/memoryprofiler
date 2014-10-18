'use strict';
// DOMContentLoaded is fired once the document has been loaded and parsed,
// but without waiting for other external resources to load (css/images/etc)
// That makes the app more responsive and perceived as faster.
// https://developer.mozilla.org/Web/Reference/Events/DOMContentLoaded
window.addEventListener('DOMContentLoaded', start);
var app = {
  panel: null
};

function start() {
  if (! ('memprofiler' in navigator)) {
    console.log('use mock !!!!');
    navigator.memprofiler = new MockMemProfiler();
    // var test =  navigator.memprofiler.getFrameNameTable();
    // console.log('test:' + JSON.stringify(test[1]));
  } else {
    console.log('use real memProfiler');
  }
  var option = {
    startRecord: 'startRecord',
    stopRecord: 'stopRecord',
    infoTable: 'infoTable',
    memoryProfiler: navigator.memprofiler
  }
  app.panel = new Panel(option);
  app.panel.init();
}
