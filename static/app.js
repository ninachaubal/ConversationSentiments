gapi.hangout.onApiReady.add(function(eventObj) {
  main();
});

function main() {
  var str = "hello, ";
    var parti = gapi.hangout.getEnabledParticipants();
    for (var i in parti) {
        str += parti[i].person.displayName;
    }
    $('#name').html(str);
}