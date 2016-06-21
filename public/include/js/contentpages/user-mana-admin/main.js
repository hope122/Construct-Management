var sys_code = userLoginInfo.sysCode;
var userLoginUuid = userLoginInfo.uuid;

function getAddrInfo(uid){
     // 取地址資料
    var sendData = {
        api: "AssCommonAddress/GetData_AssCommonAddress",
        threeModal: true,
        data:{
            iCmid: uid, 
            iAddr_type: -1
        }
    }
    // $.getJSON(ctrlPersonAPI + "GetData_AssCommonAddress", {iCmid: uid, iAddr_type: -1} ).done(function(rs){
    $.getJSON(wrsUrl, sendData ).done(function(rs){
        console.log(rs);
        $.each(rs.Data,function(index, content){
            $.each(content, function(cIndex, value){
                if(content.addr_type == 0){
                    $("#insertDialog").find("#census-content").find("#"+cIndex).val(value);   
                }else{
                    $("#insertDialog").find("#communication-content").find("#"+cIndex).val(value);   
                }
            });
            
        });
    });
}

function getOrgInfo(uid){
     // 先取得使用者資料
    var sendData = {
        api: "AssUser/GetData_AssUser",
        threeModal:true,
        data:{
            sys_code: sys_code,
            iUid: uid
        }
    }
     
    $.getJSON(wrsUrl, sendData ).done(function(rs){
        // console.log(rs);
        // 取得部門資料
        var orgid = rs.Data[0].orgid;
        var jobid = rs.Data[0].posid;
        var sendData = {
            api: "AssOrg/GetData_AssOrg",
            threeModal:true,
            data:{
                sys_code: sys_code,
                iUid: orgid
            }
        };
        // putOrgInfo(putArea,jobPutArea, orgID,listID)
        
        $.getJSON(wrsUrl, sendData ).done(function(rs){
            if(jobid){
                var iOfid = rs.Data[0].officeid;

                // 取得職務資料
                var sendData = {
                    api: "AssPosition/GetData_AssPosition",
                    threeModal:true,
                    data:{
                        sys_code: sys_code,
                        iOfid: iOfid,
                        iUid: jobid
                    }
                }
            
                $.getJSON(wrsUrl, sendData ).done(function(jobRs){
                    putOrgInfo( $("#insertDialog").find("#orgInfo"), $("#insertDialog").find("#orgJobInfo"), rs.Data[0], jobRs.Data[0]);

                });
            }else{
                putOrgInfo( $("#insertDialog").find("#orgInfo"), $("#insertDialog").find("#orgJobInfo"), rs.Data[0], null);

            }
        });
        

    });
}

// 新增&修改Dialog
function insertDialog(modifyObj, modifyItem){
    // console.log(modifyObj, modifyItem);
    if(modifyItem == undefined){
        modifyItem = null;
    }
    var saveBtn = "";
    if(modifyObj != undefined){
        title = "修改自然人資料";
        saveBtn = "修改";
    }else{
        title = "新增管理者自然人資料";
        saveBtn = "新增";
    }
    $("#insertDialog").remove();
    var insertDialog = $("<div>").prop("id","insertDialog");
    insertDialog.appendTo("body");

    $("#insertDialog").bsDialog({
        title: title,
        headerCloseBtn: true,
        start: function(){
          var option = {styleKind:"person",style:"in_mo"};
          getStyle(option,function(insertPage){
            var insertPageObj = $.parseHTML(insertPage);
            // 點選部門按鈕，可設置
            $(insertPageObj).find("#accountInfo").remove();
            $(insertPageObj).find(".list-items").eq(1).find(".control-label").eq(1).remove();
            
            $(insertPageObj).appendTo($("#insertDialog").find(".modal-body"));
            $("#insertDialog").bsDialog("show");
            tabCtrl("insertDialog");
            // getQCTableTypeList("tableTypeTab","tableType",true);

          });
        },
        button:[
            {
                text: saveBtn,
                className: "btn-success",
                click: function(){
                    // 基本資訊
                    var userInfo = getUserInput("userInfo-content");
                    // 通訊地址
                    var census = getUserInput("census-content");
                    census.addr_type = 0;
                    // 通訊地址
                    var communication = getUserInput("communication-content");
                    communication.addr_type = 1;

                    if(modifyObj == undefined){
                        $("#grid").find(".date-empty").remove();
                    }
                    userInfo.sys_code = sys_code;
                    var sendObj = {
                        userInfo: userInfo,
                        census:census,
                        communication:communication,
                        // sys_code: sys_code
                    }

                    if(modifyObj != undefined){
                        sendObj.userInfo.uid = modifyObj.uid;
                        sendObj.userInfo.userID = modifyObj.userID;
                        sendObj.communication.cmid = modifyObj.uid;
                        sendObj.census.cmid = modifyObj.uid;
                    }
                    // console.log(sendObj);
                    // return;

                    saveData(sendObj, modifyItem);
                    // console.log(sendObj);
                    // $("#insertDialog").bsDialog("close");
                }
            }
        ]
    });

}

// 儲存
function saveData(sendObj,modifyItem){

    method = "Insert_AssCommon";
    
    var sendData ={
        api: threeModelPersonAPI+method,
        threeModal: true,
        data: sendObj.userInfo
    };
    // 先新增自然人資料
    $.post(wrsUrl, sendData, function(rs){
        var rs = $.parseJSON(rs);

        // console.log(rs);
        // 新增
        if(rs.Status){

            if(sendObj.userInfo.uid == undefined){
                sendObj.userInfo.uid = rs.Data;
                sendObj.census.cmid = rs.Data;
                sendObj.communication.cmid = rs.Data;

                // putDataToPage(sendObj, true);
                // 地址修改ＡＰＩ
                addrMethod = "Insert_AssCommonAddress";
                acMethod = "Insert_AdminAssUser";
            }

            // 之後放入地址資料
            var sendData = {
                api: "AssCommonAddress/"+addrMethod,
                threeModal: true,
                data: sendObj.census
            }
            // $.post(ctrlPersonAPI + addrMethod, sendObj.census, function(addressRs){
            $.post(wrsUrl, sendData, function(addressRs){
                var addressRs = $.parseJSON(addressRs);

                if(addressRs.Status){
                    if(addrMethod == "Insert_AssCommonAddress"){
                        sendObj.census.uid = addressRs.Data;
                    }
                    var sendData = {
                        api: "AssCommonAddress/"+addrMethod,
                        threeModal: true,
                        data: sendObj.communication
                    };
                    // $.post(ctrlPersonAPI + addrMethod, sendObj.communication, function(oRs){
                    $.post(wrsUrl, sendData, function(oRs){
                        var oRs = $.parseJSON(oRs);

                        if(oRs.Status){

                            if(addrMethod == "Insert_AssCommonAddress"){
                                sendObj.communication.uid = oRs.Data;
                            }
                            
                            
                        }
                        // 測試
                        // acMethod = "Insert_AssUser";
                        var sendData = {
                            api: "AssUser/"+acMethod,
                            threeModal: true,
                            data: {
                                cmid: sendObj.userInfo.uid,
                                uuid: userLoginUuid,
                                sys_code: sys_code
                            }
                        };
                        // 放入帳號設置的部分
                        $.post(wrsUrl, sendData, function(rs){
                            var rs = $.parseJSON(rs);
                            if(rs.Status){
                                // userLoginInfo.userID = rs.Data;
                                $.post(configObject.setUserID,{userID: rs.Data},function(setRs){
                                    // var setRs = $.parseJSON(setRs);
                                    location.href = location.origin + "/content.html";
                                });
                                // location.href = location.origin + "/content.html";
                                // putDataToPage(sendObj.userInfo, true);
                            }
                        });
                    });
                }

            });
            
            
        }else{
            alert("新增失敗");
        }
    });
}