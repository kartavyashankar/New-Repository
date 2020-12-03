var user = document.getElementById('username');
var teamid = document.getElementById('room');

function check(){
    var username = user.value;
    var room = teamid.value;
    if(username.indexOf(' ') > -1){
        alert('Username must not contain a space');
    }
    else{
        if(room.length>=6 && room.length<=8){
            if(room.indexOf(' ') > -1){
                alert('Team ID must not contain a space');
            }
            else{
                post.setAttribute('action', 'code/code.html');
            }
        }
        else{
            alert('Team ID must contain 6-8 characters');
        }
    }
}