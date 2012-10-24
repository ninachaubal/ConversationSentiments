var circles = [];

function sketch(ps) {
  ps.size(800, 400);
  var buf = ps.createGraphics(ps.width*2, ps.height, ps.JAVA2D);

  ps.draw = function() {

    function expandBuffer() {
      var buf2 = ps.createGraphics(buf.width*2, buf.height, ps.JAVA2D);
      buf.loadPixels();
      for(var i in buf.pixels) {
        //TODO
      }
      buf2.updatePixels();
      buf = buf2;
    }

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

    function splatter(x, y, rad, level, r, g, b) {
       circles.push({
        x : x,
        y : y,
        rad : rad,
        r : r,
        g : g,
        b : b,
        a : 170,
        l : level
      });
      ps.noStroke();
      ps.fill(r, g, b, 170);
      ps.ellipse(x, y, rad * 2, rad * 2);
      if (level > 1 ) {
        level --;
        var num = Math.round(ps.random(2, 5));
        for (var i = 0; i < num; i ++) {
          var a = ps.random(0, ps.TWO_PI);
          var nx = x + ps.cos(a) * 6.0 * level;
          var ny = y + ps.sin(a) * 6.0 * level;
          splatter(nx, ny, rad/2, level, r, g, b);
        }
      }
    }

    function drawOldCircles() {
      for(var i in circles) {
        ps.fill(circles[i].r,circles[i].g,circles[i].b,circles[i].a);
        ps.ellipse(circles[i].x,circles[i].y,
                   2*circles[i].rad,2*circles[i].rad);
      }
    }

    function drawSpiral(data, r, g, b, i) {
      usethissomewhere = (i/30);
      i = i%30;

      if (data.spiralprocessed !== undefined) return;

      var x = (10*i*Math.cos(i) + (ps.width/2));
      var y = (10*i*Math.sin(i) + (ps.height/2));
      splatter(x, y, 15, parseInt(data.amplitude,10), r, g, b);
      data.spiralprocessed = true;
    }

    function chooseLinearPos(data, pixps) {
    }

    function drawLinear(data, r, g, b) {
      ps.noStroke();
      var pixps = 5;
      var xy = chooseLinearPos(data, pixps);
      ps.rect(xy[0], xy[1], pixps,
      (100 + (parseInt(data.amplitude,10) * 10)), 5)
    }

    function drawLinearSplatters(data, r, g, b){
      ps.noStroke();
      var pixps = 15;
      var xy = chooseLinearPos(data, pixps);
      splatter(xy[0], xy[1], 15, parseInt(data.amplitude,10), r, g, b);
    }

    function drawLinearCircles(data, r, g, b) {
      ps.noStroke();
      var pixps = 15;
      var xy = chooseLinearPos(data, pixps);
      var rad = (parseInt(data.amplitude,10) * 4));
      ps.fill(r, g, b, 170);
      ps.ellipse(xy[0], xy[0], rad * 2, rad * 2);
    }

    function drawClock(data, r, g, b) {
    }

    function drawTimeLine(data, r, g, b) {
    }

    ps.background(255);

    switch(type) {
        case 'spiral':
        case 'lsplatters':
        drawOldCircles(); break;
        case 'clock':
        case 'lcircles':
        case 'linear':
        case 'timeline': break;
      }

    for (var i in buffer) {
      var data = buffer[i];
      var rgb = hsl2rgb(parseInt(data.h, 10),
                        parseInt(data.s, 10),
                        parseInt(data.l, 10));
      var r = rgb[0];
      var g = rgb[1];
      var b = rgb[2];
      switch(type) {
        case 'spiral': drawSpiral(data, r, g, b, i); break;
        case 'linear': drawLinear(data, r, g, b); break;
        case 'lsplatters': drawLinearSplatters(data, r, g, b); break;
        case 'lcircles': drawLinearCircles(data, r, g, b); break;
        case 'clock': drawClock(data, r, g, b); break;
        case 'timeline': drawTimeLine(data, r, g, b); break;
      }
    }
  };
}
