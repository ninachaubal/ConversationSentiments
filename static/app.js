var colors = function() {
  this.hues = [{'id': 'dummy', 'h': 360}];
  this.assigned0 = false;
};

/*
Returns an unused hue as distinct as possible from colors already being used
*/
colors.prototype.getColor = function(id) {
  if (!this.assigned0) {
    this.hues.unshift({'id': id, 'h': 0});
    this.assigned0 = true;
    return 0;
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
      return h
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

//============================================================================//

var col = colors();
var hueMap = {};
var videoCanvas;
var videoFeed;

gapi.hangout.onApiReady.add(function(eventObj) {
  gapi.hangout.onParticipantsAdded.add(function(e){
    for (i in e.addedParticipants) {
      hueMap[id] = col.getColor(e.addedParticipants[i].id);
    }
  });
  gapi.hangout.onParticipantsRemoved.add(function(e){
    //TODO
  });
  gapi.hangout.onTopicChanged.add(function(e){
    //TODO
  });

  videoCanvas = gapi.hangout.layout.getVideoCanvas();
  videoFeed = gapi.hangout.layout.getDefaultVideoFeed();
  videoCanvas.setVideoFeed(videoFeed);
  videoCanvas.setVisible(true);
  videoCanvas.setWidth(400)
});




