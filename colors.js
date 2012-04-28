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

/*
Theme class
*/
var Theme = {
    mainColor : [
                    '#ffffff',  //default white / no theme
                    '#197780',  //blue
                    '#805a19',  //orange
                    '#5e1980',  //violet
                    '#558019'   //green
                ],
    minHue : [
                0,
                175,
                28,
                270,
                75
             ],
    maxHue : [
                0,
                195, 
                48, 
                290, 
                95
             ],
    getColor : function(theme){
        if(theme < 0 || theme >4){
            return null;
        } else if (theme === 0){
            return '#ffffff';
        }
        var h = this.minHue[theme] + Math.round(Math.random()*20);
        var s = 90;
        var v = 50;
        
        var rgb = hsvToRgb(h,s,v);
        var str = '#';
        for(var i in rgb){
            var temp = rgb[i].toString(16);
            if(temp.length == 1){
                temp = '0'+temp;
            }
            str+=temp;
        }
        return str;
    }
};
exports.Theme = Theme;
exports.theme = Theme;

