var type = 'spiral';
var dataBuffer = [];
var participants = {};

var serverURL = 'https://conversationsentiments.herokuapp.com';

gapi.hangout.onApiReady.add(function(eventObj) {
  /*do something*/
});

$(document).ready(function(){
  $('#viztype').change(function(){
    type = $('#viztype').val();
  });
});

/*gets updates from server*/
function update() {
  $.ajax({
    url: serverURL + '/data',
    success: function(data) {
      dataBuffer = data;
    }
  });
  $.ajax({
    url: serverURL + '/users',
    success: function(data) {
      participants = data;
    }
  });
}