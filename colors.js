var colors = {
  hues : [{'id': 'dummy', 'h': 360}],
  assigned0 : false,
  /*
    Returns an unused hue as distinct as possible from colors
    already being used
  */
  getColor: function(id) {
    if (!this.assigned0) {
      this.hues.unshift({'id': id, 'h': 0});
      this.assigned0 = true;
      return 0;
    } else {
      var lowerPos = -1;
      var upperPos = -1;
      var longestRange = 0;
      for (var i in this.hues) {
        if (this.hues[parseInt(i, 10)+1] !== undefined) {
          var range = this.hues[parseInt(i, 10)+1].h -
                      this.hues[parseInt(i, 10)].h;
          if (range > longestRange) {
            longestRange = range;
            lowerPos = parseInt(i, 10);
            upperPos = parseInt(i, 10)+1;
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
  },
  /*
    Frees up hues associated with the given user id
  */
  remove: function(id) {
    for (var i in this.hues) {
      if (this.hues[i].id == id) {
        if (this.hues[i].h === 0) {
          this.assigned0 = false;
        }
        this.hues.splice(i,1);
        break;
      }
    }
  },
  reset: function() {
    this.hues = [{'id': 'dummy', 'h': 360}];
    this.assigned0 = false;
  }
};

exports.colors = colors;
