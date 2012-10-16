function sketchProc(processing) {
  processing.setup = function() {};
  processing.draw = function() {};
}

var canvas = document.getElementById("canvas1");
var p = new Processing(canvas, sketchProc);