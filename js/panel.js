'use strict';
(function(exports) {
  function Panel (option) {
    this.startButton = document.getElementById(option.startRecord);
    this.stopButton = document.getElementById(option.stopRecord);
    this.infoTable = document.getElementById(option.infoTable);
    this.pad = document.getElementById(option.pad);
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
      this.infoTable.textContent = '';
      this.memoryResult = this.getMemoryResult();
      this.constructUsage();
      this.constructTrace();
      this.render();
    },

    setupCanvas: function PL_setupCanvas() {
      var baseWidth = 10;
      var tracePool = this.memoryResult.allocatedEntries;
      var traceCount = tracePool.length;
      if (traceCount > 0) {
        this.pad.width = traceCount * baseWidth;
      }
      this.pad.style.width = '100%';
    },

    drawTrace: function PL_drawTrace() {
      this.setupCanvas();
      var baseWidth = 10;
      var baseLine = 400;
      var ctx = this.pad.getContext('2d');
      var tracePool = this.memoryResult.allocatedEntries; 
      var start = baseLine - 40;
      ctx.strokeStyle = 'black';
      for (var i in tracePool) {
        var entry = tracePool[i];
        var entryHeight = (entry.size / 1024) * 10;
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(10 + i * 10, baseLine);
        ctx.lineTo(10 + i * 10, baseLine - entryHeight);
        ctx.strokeStyle = '#000000';
        if (entryHeight < 0) {
          console.log('hi');
          ctx.strokeStyle = '#00ff00';
        } 
        ctx.stroke();
        //ctx.strokeStyle = '#000000';
        if (i > 0) {
          ctx.moveTo(10 + (i - 1) * 10, start);
          ctx.lineTo(10 + i * 10, start - (entryHeight/10) );
          //ctx.strokeStyle = '#000000';
          ctx.stroke();
        } 
          start = start - (entryHeight/10);
      }
    },

    constructTrace: function PL_constructTrace() {
      for (var i in this.memoryResult.tracesInfo) {
        var entry = this.memoryResult.tracesInfo[i];
        var trace = this.memoryResult.stacktraceTable[entry.traceIdx];
        entry.fnName = [];
        entry.fnName.push(trace.nameIdx);
        while (trace.parentIdx !== 0) {
          trace = this.memoryResult.stacktraceTable[trace.parentIdx];
          entry.fnName.push(trace.nameIdx);
        }
      }
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
      this.drawTrace();
      var listHtml = '',
          item = null;
      for (var i in this.memoryResult.tracesInfo) {
        item = this.memoryResult.tracesInfo[i];
        for (var j = item.fnName.length - 1; j >= 0; j--) {
          listHtml = listHtml + this.template(item.fnName[j]);
        };
        this.infoTable.innerHTML = this.infoTable.innerHTML + 
                        '<ul data-traceID = "' + i + '"">' + listHtml + '</ul>';
      }
    },

    template: function PL_template(data) {
      var fnName = this.memoryResult.frameNameTable[data];
          
      return '<li class="traceinfo" data-frameID= "' + data + '">' +
              fnName +
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