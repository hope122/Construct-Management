$(function(){
    getOUData();
});
// var sys_code = SysCode;
var sys_code = 2;
// 取得資料
function getOUData(uid){
    // var sendData = {}
    var sendData = {
        api: "AssCommon/GetData_AssCommon",
        threeModal: true,
        data:{
            sys_code: sys_code
        }
    };
    if(uid != undefined){
        sendData.data.iUid = uid;
    }
    loader($("#grid"));
    // ＡＰＩ呼叫
    // $.getJSON(ctrlPersonAPI + "GetData_AssCommon", sendData ).done(function(rs){
    $.getJSON(wrsUrl, sendData ).done(function(rs){
        $("#grid").empty();
        if(rs.Status){
            if(uid == undefined){
                putDataToPage(rs.Data);
            }else{
                // insertDialog(uid,name);
            }
        }else{
            // 放入空的
            putDataEmptyInfo($("#grid"));
        }
        // console.log(rs);
    }).fail(function(){
        $("#grid").empty();
        // 放入空的
        putDataEmptyInfo($("#grid"));
    });
}

function putDataEmptyInfo(putArea){
    // 畫面設定值
    var option = {styleKind:"system",style:"data-empty"};
    // 取得畫面樣式
    getStyle(option,function(pageStyle){
        // 相關設定
        putArea.append(pageStyle);

        putArea.find(".list-items-bottom").last().removeClass("list-items-bottom");
    });
}

function getAddrInfo(uid){
     // 取地址資料
    $.getJSON(ctrlPersonAPI + "GetData_AssCommonAddress", {iCmid: uid, iAddr_type: -1} ).done(function(rs){
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

// 放資料
function putDataToPage(data, onlyData){
    if(typeof onlyData == "undefined"){
        onlyData = false;
    }
    // console.log(data);
    // 畫面設定值
    var option = {styleKind:"list",style:"1grid-modify"};
    // 取得畫面樣式
    getStyle(option,function(pageStyle){
        if(!onlyData){
            $.each(data,function(index,content){
                var pageStyleObj = $.parseHTML(pageStyle);
                $(pageStyleObj).addClass("dataContent");
                var firstItem = $(pageStyleObj).find(".list-items").eq(0);
                firstItem.html(content.name);
                // 修改
                $(pageStyleObj).find(".fa-pencil-square-o").click(function(){
                    // 取地址資料
                    insertDialog(content, firstItem);
                    getAddrInfo(content.uid);
                });

                // 刪除
                $(pageStyleObj).find(".fa-trash-o").click(function(){
                    deleteData(content.uid, $(this).parents(".list-items").parent(), content.name);
                });

                $(pageStyleObj).appendTo($("#grid"));

            });
        }else{
            var pageStyleObj = $.parseHTML(pageStyle);
            $(pageStyleObj).addClass("dataContent");
            var firstItem = $(pageStyleObj).find(".list-items").eq(0);
            firstItem.html(data.name);

            // 修改
            $(pageStyleObj).find(".fa-pencil-square-o").click(function(){
                insertDialog(data, firstItem);
                getAddrInfo(data.uid);
            });

            // 刪除
            $(pageStyleObj).find(".fa-trash-o").click(function(){
                deleteData(data.uid, $(this).parents(".list-items").parent(), data.name);
            });

            if($("#grid").find("div").length){
                $("#grid").find(".dataContent").eq(-1).addClass("list-items-bottom").after(pageStyleObj);
            }else{
                $(pageStyleObj).removeClass("list-items-bottom").appendTo("#grid");

            }
        }
        $("#grid").find(".list-items-bottom").last().removeClass("list-items-bottom");
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
        title = "新增自然人資料";
        saveBtn = "新增";
    }
    $("#insertDialog").remove();
    var insertDialog = $("<div>").prop("id","insertDialog");
    insertDialog.appendTo("body");

    $("#insertDialog").bsDialog({
        title: title,
        start: function(){
          var option = {styleKind:"person",style:"in_mo"};
          getStyle(option,function(insertPage){
            var insertPageObj = $.parseHTML(insertPage);
            // 修改
            if(modifyObj != undefined){
                // console.log("T");
                $.each(modifyObj, function(index,content){
                    if(index != "sex" ){
                        $(insertPageObj).find("#"+index).val(content);
                    }else{
                        $(insertPageObj).find("[name=sex][value=" + content + "]").attr("checked",true).parent().addClass("active");
                    }
                });
            }
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
                    var userInfo = getUserInput("userInfo-content");
                    var census = getUserInput("census-content");
                    census.addr_type = 0;

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
                        sendObj.communication.cmid = modifyObj.uid;
                        sendObj.census.cmid = modifyObj.uid;
                    }
                    // console.log(sendObj);
                    // return;
                    saveData(sendObj, modifyItem);
                    // console.log(sendObj);
                    $("#insertDialog").bsDialog("close");
                }
            },
            {
                text: "取消",
                className: "btn-default-font-color",
                click: function(){
                    $("#insertDialog").bsDialog("close");
                }
            },
        ]
    });

}

// 儲存
function saveData(sendObj,modifyItem){
    method = "Insert_AssCommon";
    // console.log(sendData);
    // return;
    if(sendObj.userInfo.uid != undefined){
        method = "Update_AssCommon";
        modifyItem.html(name);
    }
    var sendData ={
        api: threeModelPersonAPI+method,
        threeModal: true,
        data: sendObj.userInfo
    };
    // 先新增自然人資料
    // $.post(ctrlPersonAPI + method, sendObj.userInfo, function(rs){
    $.post(wrsUrl, sendData, function(rs){
        // console.log(rs);
        // 新增
        if(sendObj.userInfo.uid == undefined){
            sendObj.userInfo.uid = rs.Data;
            sendObj.census.cmid = rs.Data;
            sendObj.communication.cmid = rs.Data;
            // putDataToPage(sendObj, true);
            // 地址修改ＡＰＩ
            addrMethod = "Insert_AssCommonAddress";
        }else{
            addrMethod = "Update_AssCommonAddress";
            $(modifyItem).html(sendObj.userInfo.name);
        }
        // console.log(addrMethod);
        // 之後放入地址資料
        // console.log(sendObj.census);
        // if(sendObj.census.Size()){
            $.post(ctrlPersonAPI + addrMethod, sendObj.census, function(rs){
                if(rs.Status){
                    sendObj.census.uid = rs.Data;
                    $.post(ctrlPersonAPI + addrMethod, sendObj.communication, function(oRs){
                        if(oRs.Status){
                            sendObj.communication.uid = rs.Data;

                            if(addrMethod == "Insert_AssCommonAddress"){
                                putDataToPage(sendObj.userInfo, true);
                            }
                        }
                    });

                }
            });
        // }
    });
}

// 刪除
function deleteData(uid, removeItem, name){
    // var sendData = {
    //     apiMethod: ctrlPersonDelAPI + "Delete_AssCommon",
    //     data:{
    //         iUid: uid
    //     }
    // };
    var sendData = {
        api: threeModelPersonDelAPI,
        threeModal: true,
        data:{
            iUid: uid
        }
    };
    
    
    // console.log(sendData);
    // return;
    $.ajax({
        url: wrsUrl,
        type:"DELETE",
        data: sendData,
        dataType: "json",
        success:function(rs){
            // console.log(rs);
            if(!rs.Status){
                // 無法刪除
                couldNotDeleteDialog(name);
            }else{
                removeItem.remove();
                if(!$("#grid").find(".dataContent").length){
                    var option = {styleKind:"system",style:"data-empty"};
                    getStyle(option,function(pageStyle){
                        $("#grid").html(pageStyle);
                    });
                }else{
                    $("#grid").find(".dataContent").last().removeClass("list-items-bottom");
                }
            }
        },
        error:function(rs){
            couldNotDeleteDialog(name);
        }
    });
    // $.post(wrsUrl,sendData,function(rs){
    //     rs = $.parseJSON(rs);
    //     if(!rs.Status){
    //         // 無法刪除
    //         couldNotDeleteDialog(name);
    //     }else{
    //         removeItem.remove();
    //     }
    // });
}

// 當無法刪除時，提供說明
function couldNotDeleteDialog(name){
    $("#couldNotDeleteDialog").remove();
    $("<div>").prop("id","couldNotDeleteDialog").appendTo("body");

    $("#couldNotDeleteDialog").bsDialog({
    start: function(){
        var string = name+" 已被使用為組織上層，故無法刪除";
        $("#couldNotDeleteDialog").find(".modal-body").html(string);
    },
    button:[
        {
            text: "關閉",
            className: "btn-danger",
            click: function(){
                $("#couldNotDeleteDialog").bsDialog("close");
            }
        }
    ]
    });

}