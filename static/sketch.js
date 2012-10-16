function sketck(processing) {
  processing.setup = function() {};
  processing.draw = function() {};
}

var canvas = document.getElementById("canvas1");
console.log(canvas);
var p = new Processing(canvas, sketch);