loadtestdata = function(filename, addUser, addData) {
  var fs = require('fs');
  var file = fs.readFileSync(filename, "utf-8");
  file = file.split('\r\n');
  var participants = {};
  var currentParticipant = '';
  var currentText = '';
  var currentDuration = 0;
  var currentAmplitude = 0;
  var currentTopic = 'unknown';
  var id = 0;
  for (index in file) {
    var line = file[index];
    if (line.length == 0) {
      addData(currentText, participants[currentParticipant],
              currentDuration, currentAmplitude, currentTopic); 
      currentParticipant = '';
      currentText = '';
      currentDuration = 0;
      currentAmplitude = 0;
    } else {
      var re = /^(\d\d):(\d\d):(\d\d),(\d\d\d)\s-->\s(\d\d):(\d\d):(\d\d),(\d\d\d)/;
      var result = line.match(re);
      if (result != null) {
        var endTimeMillis = (parseInt(result[1],10)*3.6e+6) +
                            (parseInt(result[2],10)*60000) +
                            (parseInt(result[3],10)*1000) +
                            (parseInt(result[4],10));
        var startTImeMillis = (parseInt(result[5],10)*3.6e+6) +
                              (parseInt(result[6],10)*60000) +
                              (parseInt(result[7],10)*1000) +
                              (parseInt(result[8],10));
      } else {
        re = /^([A-Za-z]*):\s(.*)/;
        result = line.match(re);
        if (result != null) {
          if (result[1] == 'Topic') { // use "Topic: topic" lines  
            currentTopic = result[2];
          } else {
            addData(currentText, participants[currentParticipant],
                    currentDuration, currentAmplitude, currentTopic);
            currentParticipant = result[1];
            if (participants[currentParticipant] === undefined) {
              participants[currentParticipant] = 'id'+id;
              id++;
              addUser(participants[currentParticipant], currentParticipant);
            }
            currentText = result[2];
            currentAmplitude = 4; //TODO: change this for amplitude
          }
        } else {
          re = /^\d\d/;
          result = line.match(re);
          if (result == null) {
            currentText += line;
          }
        } 
      }
    }
  }
};
exports.loadtestdata = loadtestdata;
