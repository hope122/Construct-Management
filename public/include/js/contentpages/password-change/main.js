var sys_code = userLoginInfo.sysCode;
var userID = userLoginInfo.userID;
var uuid = userLoginInfo.uuid;

$("#change").click(function(){
    var oldPass = $("#oldPass").val();
    var newPass = $("#newPass").val();
    var confirmPass = $("#confirmPass").val();

    if(newPass == confirmPass && oldPass != newPass){
        changePass(oldPass, newPass);
    }else{
        if(newPass != confirmPass){
            $("#newPass").addClass("item-bg-danger");
            $("#confirmPass").addClass("item-bg-danger");
            msgDialog("新密碼與再次確認密碼不同");
        }else if(oldPass == newPass){
            $("#newPass").addClass("item-bg-danger");
            $("#oldPass").addClass("item-bg-danger");
            msgDialog("舊密碼不可與新密碼相同");
        }
        $("#oldPass").val("");
        $("#newPass").val("");
        $("#confirmPass").val("");
    }
});

function changePass(oldPass, newPass){
    var sendData = {
        uuid: uuid,
        oldPass: oldPass,
        newPass: newPass
    };
    $.post(changeAPI, sendData, function(rs){
        try{
            var rs = $.parseJSON(rs);
        }catch(err){

        }
        if(rs.status){
            msgDialog(rs.msg, false);
        }else{
            msgDialog(rs.msg);
        }
        $("#oldPass").val("");
        $("#newPass").val("");
        $("#confirmPass").val("");
    });
}

function msgDialog(msg, isError){
    var title = "錯誤";
    if(isError == undefined){
        isError = true;
    }

    if(!isError){
        title = "訊息";
    }
    $("#errorDialog").remove();
    $("<div>").prop("id","errorDialog").appendTo("body");

    $("#errorDialog").bsDialog({
        autoShow:true,
        showFooterBtn:true,
        title: title,
        start:function(){

            var msgDiv = $("<div>").html(msg);
            $("#errorDialog").find(".modal-body").append(msgDiv);
        },
        button:[{
            text: "關閉",
            className: "btn-danger",
            click: function(){
                $("#errorDialog").bsDialog("close");
            }
        }
        ]
    });
}