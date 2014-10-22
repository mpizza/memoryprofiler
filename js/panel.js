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
      //this.constructTrace();
      this.constructUsage();
      //this.render();
    },

    constructTrace: function PL_constructTrace() {
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
      //console.log('traceTable:' + JSON.stringify(this.memoryResult.traceTable));
    },

    constructUsage: function PL_constructUsage() {
      var entry = null,
          cusor = null;
      for (var i in this.memoryResult.allocatedEntries) {
        cusor = this.memoryResult.allocatedEntries[i];
        entry = this.getTracesInfo(cusor.traceIdx);
        if (entry === null) {
          // init a entry
          entry = {
            traceIdx: cusor.traceIdx,
            sizeInfo: []
          };
          entry.sizeInfo.push(cusor.size);
          this.memoryResult.tracesInfo.push(entry);
        } else {
          // update sizeInfo
          entry.sizeInfo.push(cusor.size);
        }
      }
      // console.log('usage:' + JSON.stringify(this.memoryResult.tracesInfo));

    },

    getTracesInfo: function PL_getTraceInfo(id) {
      var traceInfo = null,
          item = null;
      for (var i in this.memoryResult.tracesInfo) {
        item = this.memoryResult.tracesInfo[i];
        if (id === item.traceIdx ) {
          traceInfo = item;
          break;
        }
      }

      return traceInfo;
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
        allocatedEntries: this.memoryProfiler.getAllocatedEntries(),
        tracesInfo: []
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