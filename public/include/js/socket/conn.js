var socket = io.connect('http://211.21.170.18:7077');
var systemID = '';

socket.on('chatMsg', function(data) {
    if(data.systemID != systemID){
        showNoticeToast(data.userName+':<br/>'+data.msg);
    }
});

socket.on('conn', function (data) {
          console.log(data);
    var postdata = {
        'uid': loginArr["uuid"],
        'userName' : loginArr["loginName"]
    }
    systemID = data.systemID;
    socket.emit('login', postdata,function(result){});

});