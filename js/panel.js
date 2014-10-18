'use strict';
(function(exports) {
  function Panel (option) {
    this.startButton = document.getElementById(option.startRecord);
    this.stopButton = document.getElementById(option.stopRecord);
    this.infoTable = document.getElementById(option.infoTable);
    this.memoryProfiler = option.memoryProfiler;
    this.memoryResult = {};
  }

  Panel.prototype = {
    init: function PL_init () {
      this.startButton.addEventListener('click', this.startRecord.bind(this));
      this.stopButton.addEventListener('click', this.stopRecord.bind(this));
      window.addEventListener('startprofiling', this.showLoading.bind(this));
      window.addEventListener('stopprofiling', this.showInfo.bind(this));
    },

    startRecord: function PL_startRecord(evt) {
      this.memoryProfiler.startProfiler();
    },

    stopRecord: function PL_stopRecord(evt) {
      this.memoryProfiler.stopProfiler();
    },

    showLoading: function PL_showLoading(evt) {
      this.infoTable.textContent = 'loading.....';
    },

    showInfo: function PL_showInfo(evt) {
      // this.infoTable.textContent = 'showInfo.....';
      this.memoryResult = this.getMemoryResult();
      this.constructTrace();
      //this.render();
    },

    constructTrace: function PL_constructTrace() {
      console.log('hi');
      this.memoryResult.traceTable = [];
      for (var i in this.memoryResult.stacktraceTable) {
        var trace;
        var current = this.memoryResult.stacktraceTable[i];
        if (current.parentIdx === 0) {
          trace = [];
          trace.push(current.nameIdx);
          this.memoryResult.traceTable.push(trace);
        } else {
          trace.push(current.nameIdx);
        }
      }
      console.log(JSON.stringify(this.memoryResult.traceTable));
      console.log(JSON.stringify(this.memoryResult.traceTable) + ":" + JSON.stringify(count));
    },

    render: function PL_render() {

    },

    template: function PL_template(data) {
      return '<li class="traceinfo" data-traceID="' + data.id + '">' +
             '</li>';
    },

    getMemoryResult: function PL_getMemoryResult() {
      var memoryResult = {
        frameNameTable: this.memoryProfiler.getFrameNameTable(),
        stacktraceTable: this.memoryProfiler.getStacktraceTable(),
        allocatedEntries: this.memoryProfiler.getAllocatedEntries()
      }

      return memoryResult;
    },

    stop: function PL_stop() {
      this.startButton.removeEventListener('click', this.startRecord);
      this.stopButton.removeEventListener('click', this.stopRecord);
      window.removeEventListener('startProfiling', this.showLoading);
      window.removeEventListener('stopProfiling', this.showInfo);
    }
  };
  exports.Panel = Panel;
}(window));