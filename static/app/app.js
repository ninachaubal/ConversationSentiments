var baseURL = 'https://conversationsentiments.herokuapp.com';
var videoCanvas;
var videoFeed;

$(document).ready(function(){
  gapi.hangout.onApiReady.add(function(eventObj) {
    gapi.hangout.onParticipantsAdded.add(function(e){
      updateParticipants(e.addedParticipants);
    });
    gapi.hangout.onParticipantsRemoved.add(function(e){
      //TODO
    });
    gapi.hangout.onTopicChanged.add(function(e){
      //TODO
      console.log(e.topic);
    });

    videoCanvas = gapi.hangout.layout.getVideoCanvas();
    videoFeed = gapi.hangout.layout.getDefaultVideoFeed();
    videoCanvas.setVideoFeed(videoFeed);
    videoCanvas.setVisible(true);
    videoCanvas.setWidth(400);
    videoFeed.onDisplayedParticipantChanged.add(function(e){
      //TODO
    });

    //updateParticipants(gapi.hangout.getEnabledParticipants());
  });

  new Processing("canvas1", sketch);
});

function updateParticipants(participants) {
  var users = [];
  for (var i in e.addedParticipants) {
    users.push({
      id: e.addedParticipants[i].id,
      name: e.addedParticipants[i].person.displayName
    });
  }
  console.log(users);
  $.ajax({
    type: 'POST',
    url: baseURL + '/users',
    data: {
      users: users
    },
    success: function() {
      $.ajax({
        url: baseURL + '/users',
        success: function(data) {
          console.log(JSON.stringify(data));
        }
      });
    }
  });
}


