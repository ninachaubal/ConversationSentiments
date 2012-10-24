var startX = 0;
var pixps = 10;
var startTS = 0;
var index = 0;
var buffer = [];
function sketch(ps) {
  ps.size(800, 400);
  var linbuf = ps.createGraphics(ps.width*10, ps.height, ps.JAVA2D);
  var lincbuf = ps.createGraphics(ps.width*10, ps.height, ps.JAVA2D);
  var linsbuf = ps.createGraphics(ps.width*10, ps.height, ps.JAVA2D);
  var lintbuf = ps.createGraphics(ps.width*10, ps.height, ps.JAVA2D);

  ps.draw = function() {

    function hsl2rgb (h, s, l) {
      /*from http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript*/
      h = h/360;
      s = s/100;
      l = l/100;
      var r, g, b;

      if(s == 0){
          r = g = b = l; // achromatic
      }else{
          function hue2rgb(p, q, t){
              if(t < 0) t += 1;
              if(t > 1) t -= 1;
              if(t < 1/6) return p + (q - p) * 6 * t;
              if(t < 1/2) return q;
              if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
              return p;
          }

          var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
          var p = 2 * l - q;
          r = hue2rgb(p, q, h + 1/3);
          g = hue2rgb(p, q, h);
          b = hue2rgb(p, q, h - 1/3);
      }

      return [r * 255, g * 255, b * 255];
    }

    function splatter(x, y, rad, level, r, g, b, buf) {
      buf.noStroke();
      buf.fill(r, g, b, 170);
      buf.ellipse(x, y, rad * 2, rad * 2);
      if (level > 1 ) {
        level --;
        var num = Math.round(ps.random(2, 5));
        for (var i = 0; i < num; i ++) {
          var a = ps.random(0, ps.TWO_PI);
          var nx = x + ps.cos(a) * 6.0 * level;
          var ny = y + ps.sin(a) * 6.0 * level;
          splatter(nx, ny, rad/2, level, r, g, b, buf);
        }
      }
    }

    function drawSpiral(data, r, g, b, i) {
      usethissomewhere = (i/30);
      i = i%30;

      if (data.spiralprocessed !== undefined) return;

      var x = (10*i*Math.cos(i) + (ps.width/2));
      var y = (10*i*Math.sin(i) + (ps.height/2));
      splatter(x, y, 15, parseInt(data.amplitude,10), r, g, b, ps);
      data.spiralprocessed = true;
    }

    function chooseLinearPos(data) {
      var ts = parseInt(data.time,10);
      var x = (ts - startTS)*pixps;
      return [x, ps.width/2];
    }

    function drawLinear(data, r, g, b) {
      linbuf.beginDraw();
      linbuf.noStroke();
      var xy = chooseLinearPos(data);
      linbuf.rect(xy[0], xy[1], pixps,
      (100 + (parseInt(data.amplitude,10) * 10)), 5)
      linbuf.endDraw();
    }

    function drawLinearSplatters(data, r, g, b){
      linsbuf.beginDraw();
      linsbuf.noStroke();
      var xy = chooseLinearPos(data);
      splatter(xy[0], xy[1], 15, parseInt(data.amplitude,10), r, g, b, linsbuf);
      linsbuf.endDraw();
    }

    function drawLinearCircles(data, r, g, b) {
      lincbuf.beginDraw();
      lincbuf.noStroke();
      var xy = chooseLinearPos(data);
      var rad = (parseInt(data.amplitude,10) * 4);
      lincbuf.fill(r, g, b, 170);
      lincbuf.ellipse(xy[0], xy[0], rad * 2, rad * 2);
      lincbuf.endDraw();
    }

    function drawClock(data, r, g, b) {
    }

    function drawTimeLine(data, r, g, b) {
    }

    ps.background(255);

    var img = undefined;
    while (buffer.length > 0) {
      var data = buffer.pop();
      var rgb = hsl2rgb(parseInt(data.h, 10),
                        parseInt(data.s, 10),
                        parseInt(data.l, 10));
      var r = rgb[0];
      var g = rgb[1];
      var b = rgb[2];
      if (index == 0) {
        startTS = parseInt(data.time, 10);
      }
      drawLinear(data, r, g, b);
      drawLinearCircles(data, r, g, b);
      drawLinearSplatters(data, r, g, b);
      drawTimeLine(data, r, g, b);
      switch(type) {
        case 'spiral': break;
        case 'linear': img = linbuf.get(startX, 0, linbuf.width, linbuf.height); break;
        case 'lsplatters': linsbuf.get(startX, 0, linsbuf.width, linsbuf.height); break;
        case 'lcircles': lincbuf.get(startX, 0, lincbuf.width, lincbuf.height); break;
        case 'clock':  break;
        case 'timeline': lintbuf.get(startX, 0, lintbuf.width, lintbuf.height); break;
      }
      index++;
    }
    if (img) {
      image(img, 0, 0);
    }
  };
}
