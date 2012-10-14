$(document).ready(function(){
    var str = "hello, ";
    var parti = gapi.hangout.getEnabledParticipants();
    for (var i in parti) {
        str += parti[i].person.displayName;
    }
    $('#name').html(str);
});