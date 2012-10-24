function sketch(processing) {
  processing.draw = function() {};
}

new Processing(document.getElementById("canvas1"), sketch);