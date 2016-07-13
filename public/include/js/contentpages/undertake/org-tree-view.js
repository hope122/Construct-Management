function orgTreeDialog(uid){
    $("#orgTreeDialog").remove();
    var orgTreeDialog = $("<div>").prop("id","orgTreeDialog");
    var orgChart = $("<div>").prop("id","orgTreeChart").addClass("modal-items");
    orgChart.appendTo(orgTreeDialog);
    orgTreeDialog.appendTo("body");

    $("#orgTreeDialog").bsDialog({
        title: "請選擇分文部門",
        autoShow: true,
        start: getOrgData("orgTreeChart"),
        button:[
        
            {
                text: "取消",
                className: "btn-default-font-color",
                click: function(){
                    $("#orgTreeDialog").bsDialog("close");
                }
            },
            {
                text: "確定",
                className: "btn-success",
                click: function(){
                    var data = orgTreeChart.getSelectData();
                    console.log(data);
                }
            }
        ]
    });
}

function userListData(uid){
    var sendObj = {
        api: "AssUser/GetData_OrgAssUser",
        threeModal: true,
        data:{
            sys_code: sys_code,
            userID: userID
        }
    }
    $.getJSON(wrsUrl, sendObj, function(rs){
        if(rs.Data){
            userListDialog(rs.Data ,uid);
        }else{
            errorDialog("無法取得使用者列表");
        }
    });
}

function userListDialog(data ,uid){
    $("#userListDialog").remove();
    var userListDialog = $("<div>").prop("id","userListDialog");
    userListDialog.appendTo("body");
    var userListDialog = $("#userListDialog").bsDialogSelect({
            autoShow:true,
            showFooterBtn:true,
            headerCloseBtn:false,
            // modalClass: "bsDialogWindow",
            title: "設定承辦人員",
            data: data,
            textTag: "name",
            valeTag: "uid",
            button:[
                {
                    text: "返回",
                    // className: "btn-success",
                    click: function(){
                    
                        $("#signWFDialog").bsDialog("close");
                        
                    }
                },
                {
                    text: "確定",
                    className: "btn-success",
                    click: function(){
                        var userIDList = userListDialog.getValue();
                        sendData = {};
                        sendData.userIDList = userIDList;
                        sendData.uid = uid;
                        console.log(sendData);
                        if(userIDList){
                            
                            $("#userListDialog").bsDialog("close");
                        }else{
                            
                        }
                    }
                }
            ]
        });
}

// sys_code
// userID