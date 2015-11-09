var socket = io.connect(configObject.socketConn);
var systemID = '';
getAcInfo();

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

function getAcInfo(){
    $.ajax({
        url: configObject.getAcInfo,
        type: "POST",
        //data: pram,
        dataType: "JSON",
        success: function(rs){
           console.log(rs);
        }
    });
}