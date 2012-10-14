/*
 * hsv <-> rbg conversion code adapted from
 * http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript
 */

var rgbToHsv = function(r, g, b){
  r = r/255, g = g/255, b = b/255;
  var max = Math.max(r, g, b), min = Math.min(r, g, b);
  var h, s, v = max;

  var d = max - min;
  s = max === 0 ? 0 : d / max;

  if(max == min){
    h = 0; // achromatic
  }else{
    switch(max){
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
      }
    h /= 6;
  }

  h = Math.round(h*360);
  s = Math.round(s*100);
  v = Math.round(v*100);
  return [h, s, v];
};
exports.rgbToHsv = rgbToHsv;

var hsvToRgb = function(h, s, v){
  h = h/360;
  v = v/100;
  s = s/100;
  var r, g, b;

  var i = Math.floor(h * 6);
  var f = h * 6 - i;
  var p = v * (1 - s);
  var q = v * (1 - f * s);
  var t = v * (1 - (1 - f) * s);

  switch(i % 6){
    case 0: r = v, g = t, b = p; break;
    case 1: r = q, g = v, b = p; break;
    case 2: r = p, g = v, b = t; break;
    case 3: r = p, g = q, b = v; break;
    case 4: r = t, g = p, b = v; break;
    case 5: r = v, g = p, b = q; break;
  }

  r = Math.round(r*255);
  g = Math.round(g*255);
  b = Math.round(b*255);
  return [r, g, b];
};
exports.hsvToRgb = hsvToRgb;

var colors = function() {
  this.s = 90;
  this.v = 70;
  this.hues = [{'id': 'dummy', 'h': 360}];
  this.assigned0 = false;
};

/*
Returns an unused color as distinct as possible from colors already being used
in the format [h,s,v]
*/
colors.prototype.getColor = function(id) {
  if (!this.assigned0) {
    this.hues.unshift({'id': id, 'h': 0});
    this.assigned0 = true;
    return [0, this.s, this.v];
  } else {
    var lowerPos = -1;
    var upperPos = -1;
    var longestRange = 0;
    for (var i in this.hues) {
      if (this.hues[i+1] !== undefined) {
        var range = this.hues[i+1].h - this.hues[i].h;
        if (range > longestRange) {
          longestRange = range;
          lowerPos = i;
          upperPos = i + 1;
        }
      }
    }
    if (this.hues[lowerPos] !== undefined &&
        this.hues[upperPos] !== undefined) {
      var h = Math.round((this.hues[lowerPos].h + this.hues[upperPos].h) / 2);
      this.hues.splice(lowerPos + 1,0,{'id': id, 'h': h});
      return [h, this.s, this.v]
    }
    return undefined;
  }
};

/*
Frees up hues associated with the given user id
*/
colors.prototype.remove = function(id) {
  for (var i in this.hues) {
    if (this.hues[i].id == id) {
      if (this.hues[i].h === 0) {
        this.assigned0 = false;
      }
      this.hues.splice(i,1);
      break;
    }
  }
};

exports.colors = colors;