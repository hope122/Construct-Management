var sys_code = userLoginInfo.sysCode;
var userID = userLoginInfo.userID;

$(function(){
    getOUData();
});

// 取得資料
function getOUData(uid){
    var sendData = {
        api: "SuSupply/GetData_SuSupply",
        threeModal: true,
        data:{
            sys_code: sys_code
        }
    }
    if(uid != undefined){
        sendData.data.iUid = uid;
    }
    // ＡＰＩ呼叫
    // $.getJSON(ctrlAdminAPI + "GetData_AssTypeOffice", sendData ).done(function(rs){
    $.getJSON(wrsUrl, sendData ).done(function(rs){
        if(rs.Status){
            if(uid == null){
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

// 放資料
function putDataToPage(data, onlyData, resultDAta){
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
                    insertDialog(content, firstItem);
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
    var saveBtn = "";
    if(modifyObj != undefined){
        title = "修改客戶";
        saveBtn = "修改";
    }else{
        title = "新增客戶";
        saveBtn = "新增";
    }
    $("#insertDialog").remove();
    var insertDialog = $("<div>").prop("id","insertDialog");
    insertDialog.appendTo("body");

    $("#insertDialog").bsDialog({
        title:title,
        start: function(){
          var option = {styleKind:"supply",style:"insert"};
          getStyle(option,function(insertPage){
            var insertPageObj = $.parseHTML(insertPage);
            var nameArea = $(insertPageObj).find(".list-items").eq(0).find("input:text");
            var ownerArea = $(insertPageObj).find(".list-items").eq(1).find("input:text");
            var enameArea = $(insertPageObj).find(".list-items").eq(2).find("input:text");
            var taxidArea = $(insertPageObj).find(".list-items").eq(3).find("input:text");

            if(modifyObj != undefined){
                nameArea.val(modifyObj.name);
                ownerArea.val(modifyObj.owner);
                enameArea.val(modifyObj.ename);
                taxidArea.val(modifyObj.taxid);
            }
            
            $("#insertDialog").find(".modal-body").html(insertPageObj);
            $("#insertDialog").bsDialog("show");
            $("body").find(".modal-backdrop")
            // getQCTableTypeList("tableTypeTab","tableType",true);

          });
        },
        button:[
            {
                text: saveBtn,
                className: "btn-success",
                click: function(){
                    var sendData = getUserInput("insertDialog");

                    var isEmpty = false;
                    $.each(sendData, function(i,v){
                        if(i == "name" || i == "owner"){
                            if(!$.trim(v)){
                                isEmpty = true;
                                $("#insertDialog").find("#"+i).addClass("item-bg-danger");
                            }else{
                                $("#insertDialog").find("#"+i).removeClass("item-bg-danger");
                            }
                        }
                    });
                    
                    sendData.sys_code = sys_code;

                    if(modifyObj != undefined){
                        sendData.uid = modifyObj.uid;
                    }

                    if(!isEmpty){
                        saveData(modifyItem, sendData);
                        $("#insertDialog").bsDialog("close");
                    }
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
function saveData(modifyItem, sendData){
    // console.log(modifyItem);
    
    // console.log(uid);
    var method = "Insert_SuSupply";
    // console.log(sendData);
    // return;
    if(sendData.uid){
        method = "Update_SuSupply";
        modifyItem.html(sendData.name);
    }

    var sendObj = {
        api: "SuSupply/"+method,
        threeModal: true,
        data: sendData
    }
    $.post(wrsUrl,sendObj,function(rs){
        var rs = $.parseJSON(rs);
        // 新增
        if(sendData.uid == undefined){
            sendObj.data.uid = rs.Data;
            putDataToPage(sendObj.data,true, rs);
        }
    });
}

// 刪除
function deleteData(uid, removeItem, name){
    var sendData = {
        api: "SuSupply/Delete_SuSupply",
        threeModal: true,
        data:{
            uid: uid
        }
    };
    $.ajax({
        url:wrsUrl,
        type:"DELETE",
        data:sendData,
        dataType: "JSON",
        success: function(rs){
            if(rs.Status){
                removeItem.remove();
                if(!$("#grid").find(".dataContent").length){
                    var option = {styleKind:"system",style:"data-empty"};
                    getStyle(option,function(pageStyle){
                        $("#grid").html(pageStyle);
                    });
                }else{
                    $("#grid").find(".dataContent").last().removeClass("list-items-bottom");

                }

            }else{
                // 無法刪除
                couldNotDeleteDialog(name);
            }
        }
    });
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