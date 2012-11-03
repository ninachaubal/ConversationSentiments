var SWN = function(path) {
  var fs = require('fs');
  var file = fs.readFileSync(path, 'utf8');
  this.swn = {};
  // part-of-speech tagger module for node
  // based on Eric Brill's rule set.
  this.pos = require('pos');
  // read file and add data to this.swn
  var lines = file.split('\n');
  lines.pop();
  for (var i in lines) {
    line = lines[i];
    if (line.charAt(0) != '#') {
      line = line.split('\t');
      var words = line[4].split(' ');
      for (var j in words) {
        word = words[j];
        word = word.substring(0, word.indexOf('#'));
        if (!(word in this.swn)) {
          this.swn[word] = {};
        }
        this.swn[word][line[0]] = {
          'pos': parseFloat(line[2]),
          'neg': parseFloat(line[3])
        };
      }
    }
  }
}

SWN.prototype.getSentiment = function(str) {
  var words = new this.pos.Lexer().lex(str);
  var taggedWords = new this.pos.Tagger().tag(words);
  var ret = [];
  
  for (var i in taggedWords) {
    var word = taggedWords[i][0]; 
    var pos;
    switch (taggedWords[i][1]) {
      // nouns
      case 'NN':
      case 'NNP':
      case 'NNPS':
      case 'NNS':
        pos = 'n';
        break;
      // verbs
      case 'VB':
      case 'VBD':
      case 'VBG':
      case 'VBN':
      case 'VBP':
      case 'VBZ':
        pos = 'v';
        break;
      // adverbs
      case 'RB':
      case 'RBR':
      case 'RBS':
      // adjectives
      case 'JJ':
      case 'JJR':
      case 'JJS':
        pos = 'a';
        break;
    }
    if (this.swn[word] !== undefined && this.swn[word][pos] != undefined) {
      ret.push({word: word, sentiment: this.swn[word][pos]})
    } 
  }
  return ret;
};
exports.swn = SWN;
