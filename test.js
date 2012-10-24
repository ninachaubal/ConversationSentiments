var test = function() {
  this.file = "testdata-friends.srt";
  this.fs = require('fs');
};

test.prototype.load = function() {
  file = this.fs.readFileSync(this.file, "utf-8");
  file = file.split('\n');
  console.log(file);
};
exports.test = test;
