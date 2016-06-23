//var socket = io.connect(configObject.socketConn);
var socket = io.connect("http://127.0.0.1:7077");

var sysCode, uuid, userID;
// 登入資訊確認後才設置
function setSocket(){
    sysCode = userLoginInfo.sysCode;
    uuid = userLoginInfo.uuid;
    userID = userLoginInfo.userID;
    var sendData = {
        uuid: uuid,
        userID: userID,
        sysCode: sysCode
    }

    socket.emit('onlineSystem', sendData);
}

socket.on('sysPushSpecified', function(data) {
    showNoticeToast(data.msg);
});