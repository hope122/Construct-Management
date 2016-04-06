$(function(){
    getOUData();
});

// 取得資料
function getOUData(uid){
    var sendData = {}
    if(uid != undefined){
        sendData = { iUid : uid };
    }
    // ＡＰＩ呼叫
    $.getJSON(ctrlAdminAPI + "GetData_AssTypeOffice", sendData ).done(function(rs){
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
function putDataToPage(data){
    // console.log(data);
    // 畫面設定值
    var option = {styleKind:"list",style:"1grid-modify"};
    // 取得畫面樣式
    getStyle(option,function(pageStyle){
        $.each(data,function(index,content){
            var pageStyleObj = $.parseHTML(pageStyle);
            var firstItem = $(pageStyleObj).find(".list-items").eq(0);
            firstItem.html(content.name);
            // 修改
            $(pageStyleObj).find(".fa-pencil-square-o").click(function(){
                insertDialog(content.uid, content.name, firstItem);
            });

            // 刪除
            $(pageStyleObj).find(".fa-trash-o").click(function(){
                deleteData(content.uid, $(this).parents(".list-items").parent(), content.name);
            });

            $(pageStyleObj).appendTo($("#grid"));

        });

        $("#grid").find(".list-items-bottom").last().removeClass("list-items-bottom");
    });
}

// 新增&修改Dialog
function insertDialog(uid, name, modifyItem){
    if(name == undefined){
        name = "";
    }
    if(modifyItem == undefined){
        modifyItem = null;
    }
    var saveBtn = "";
    if(uid != undefined){
        saveBtn = "修改";
    }else{
        saveBtn = "新增";
    }
    $("#insertDialog").remove();
    var insertDialog = $("<div>").prop("id","insertDialog");
    insertDialog.appendTo("body");

    $("#insertDialog").bsDialog({
    start: function(){
      var option = {styleKind:"input",style:"text-help-only"};
      getStyle(option,function(insertPage){
        var insertPageObj = $.parseHTML(insertPage);

        $(insertPageObj).find(".row").removeClass("row").addClass("contents");
        $(insertPageObj).find(".control-label").text("單位名稱");
        $(insertPageObj).find("input:text").val(name);
        
        if(uid != undefined){
            $("<input>").attr("type","hidden").prop("id","uid").val(uid).appendTo(insertPageObj);
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
                if(uid == undefined){
                    $("#grid").find(".date-empty").remove();
                }
                saveData(modifyItem);
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
function saveData(modifyItem){
    console.log(modifyItem);
    var name = $("#insertDialog").find("input:text").val(), 
    uid = $("#insertDialog").find("#uid").val();
    uid = (uid) ? parseInt(uid): 0;
    console.log(uid);
    var sendData = {
        // stData:{
            uid: uid,
            name: name
        // }
    },
    method = "Insert_AssTypeOffice";
    // console.log(sendData);
    // return;
    if(uid != 0){
        method = "Update_AssTypeOffice";
        modifyItem.html(name);
    }
    // console.log(method);
// return;
    $.post(ctrlAdminAPI + method,sendData,function(rs){
        // getOUData();
        // console.log(rs);
        if(uid == 0){
            var option = {styleKind:"list",style:"1grid-modify"};
            getStyle(option,function(pageStyle){
                var pageStyleObj = $.parseHTML(pageStyle);
                var firstItem = $(pageStyleObj).find(".list-items").eq(0);
                firstItem.html(name);

                // 修改
                $(pageStyleObj).find(".fa-pencil-square-o").click(function(){
                    insertDialog(rs.Data, name, firstItem);
                });

                // 刪除
                $(pageStyleObj).find(".fa-trash-o").click(function(){
                    deleteData(uid, $(this).parents(".list-items").parent(),name);
                });
                if($("#grid").find("div").length){
                    $("#grid").find("div").eq(0).before(pageStyleObj);
                }else{
                    $(pageStyleObj).removeClass("list-items-bottom").appendTo("#grid");

                }
            });
        }
    });
}

// 刪除
function deleteData(uid, removeItem, name){
    var sendData = {
        apiMethod: ctrlAdminDelAPI + "Delete_AssTypeOffice",
        deleteObj:{
            iUid: uid
        }
    };
    // console.log(removeItem);
        

    // return;
    $.post(configObject.deleteAPI,sendData,function(rs){
        rs = $.parseJSON(rs);
        if(rs.Status){
            removeItem.remove();
            if(!$("#grid").find("div").length){
                var option = {styleKind:"system",style:"data-empty"};
                getStyle(option,function(pageStyle){
                    $("#grid").html(pageStyle);
                });
            }
        }else{
            // 無法刪除
            couldNotDeleteDialog(name);
        }
        // removeItem.remove();
        console.log(rs);
    });
}

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