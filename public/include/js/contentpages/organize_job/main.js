var sys_code = userLoginInfo.sysCode;
var userID = userLoginInfo.userID;

$(function(){
    getOUData();
});

// 取得資料
function getOUData(uid){
    loader($("#grid"));
    var sendData = {
        api: "AssTypePosition/GetData_AssTypePosition",
        threeModal: true,
        data:{
            sys_code: sys_code
        }
    }

    if(uid != undefined){
        sendData.data.iUid = uid;
    }
    // ＡＰＩ呼叫
    $.getJSON(wrsUrl, sendData ).done(function(rs){
        $("#grid").empty();
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
function putDataToPage(data, onlyData){
    if(typeof onlyData == "undefined"){
        onlyData = false;
    }

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
    if(name == undefined){
        name = "";
    }
    if(modifyItem == undefined){
        modifyItem = null;
    }
    var saveBtn = "";
    if(modifyObj != undefined){
        title = "修改職務";
        saveBtn = "修改";
    }else{
        title = "新增職務";
        saveBtn = "新增";
    }
    $("#insertDialog").remove();
    var insertDialog = $("<div>").prop("id","insertDialog");
    insertDialog.appendTo("body");

    $("#insertDialog").bsDialog({
        title:title,
        autoShow: true,
        start: function(){
          var option = {styleKind:"org-job",style:"insert"};
          getStyle(option,function(insertPage){
            var insertPageObj = $.parseHTML(insertPage);
            
            $(insertPageObj).removeClass("row").addClass("contents");
            var nameArea = $(insertPageObj).find("#name");
            if(modifyObj != undefined){
                nameArea.val(modifyObj.name);
                modifySetPositionBtn(modifyObj.uid, $(insertPageObj));

            }

            $(insertPageObj).find("#referencePositionBtn").click(function(){
                var isClick = $(this).prop("class").search("fa-check-square-o");
                if(isClick == -1){
                    $(this).removeClass("fa-square-o").addClass("fa-check-square-o");
                }else{
                    $(this).removeClass("fa-check-square-o").addClass("fa-square-o");
                }
            });
            
            $("#insertDialog").find(".modal-body").html(insertPageObj);
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
                    isEmpty = false;
                    $.each(sendData, function(i, content){
                        if( i== "name"){
                            if(!$.trim(content)){
                                $("#insertDialog").find("#"+i).addClass("item-bg-danger");
                                isEmpty = true;
                            }
                        }
                    });
                    if(!isEmpty){
                        sendData.sys_code = sys_code;

                        if(modifyObj == undefined){
                            $("#grid").find(".date-empty").remove();
                        }else{
                            sendData.uid = modifyObj.uid;
                        }

                        // 分文權限
                        var referencePosition = $("#insertDialog").find("#referencePositionBtn").prop("class").search("fa-check-square-o");
                        sendData.referencePosition = referencePosition
                        saveData(sendData, modifyItem);
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
function saveData(sendData, modifyItem){
    var method = "Insert_AssTypePosition";
    
    if(sendData.uid != undefined){
        method = "Update_AssTypePosition";
        modifyItem.html(sendData.name);
    }
    var sendObj = {
        api: "AssTypePosition/"+method,
        threeModal: true,
        data: sendData
    }
    $.post( wrsUrl, sendObj, function(rs){
        var rs = $.parseJSON(rs);
        // 新增
        if(sendData.uid == undefined){
            sendData.uid = rs.Data;
            putDataToPage(sendData, true);
        }
        setPosition(sendData);
    });
}

function setPosition(sendData){
    var method = "setReferencePositionInsert";
    
    if(sendData.referencePosition == -1){
        method = "setReferencePositionDelete";
    }

    var sendObj = {
        api: referenceAPI+method,
        data: {
            pos_id: sendData.uid,
            code_id: sys_code,
            createId: userID
        }
    }
    $.post( wrsUrl, sendObj, function(rs){
        var rs = $.parseJSON(rs);
    });
}

function modifySetPositionBtn(uid,itemObj){
    var sendObj = {
        api: referenceAPI+"getReferencePosition",
        data: {
            pos_id: uid,
        }
    }
    $.getJSON(wrsUrl, sendObj, function(rs){
        if(rs.status){
            if(parseInt(rs.whether)){
                itemObj.find("#referencePositionBtn").removeClass("fa-square-o").addClass("fa-check-square-o");
            }
        }
        itemObj.find("#loader").remove();
        itemObj.find("#postitonArea").show();
    });
}

// 刪除
function deleteData(uid, removeItem, name){
    var sendData = {
        api: "AssTypePosition/Delete_AssTypePosition",
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