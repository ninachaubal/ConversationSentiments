var SWN = function(path){
  var fs = require('fs');
  var file = fs.readFileSync(path, 'utf-8');
  this.swn = {};
  this.processFile(file);
}

SWN.prototype.processFile = function(file) {
  var lines = file.split('\n');
  lines.pop();
  for (var i in lines) {
    line = lines[i];
    if (line.charAt(0) != '#') {
      line = line.split('\t');
      var word = line[4]
      word = word.substring(0, word.indexOf('#'));
      if (!(word in this.swn)) {
        this.swn[word] = {};
      }
      score =  parseFloat(line[2]) - parseFloat(line[3]);
      this.swn[word][line[0]] = score;
    }
  }
}

var swn = new SWN('swn.txt');


