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
        console.log(rs);
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
                deleteData(content.uid, $(this).parents(".list-items").parent());
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
    var name = $("#insertDialog").find("input:text").val(), 
    uid = $("#insertDialog").find("#uid").val();
    uid = (uid) ? parseInt(uid): 0;

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

    $.post(ctrlAdminAPI + "Insert_AssTypeOffice",sendData,function(rs){
        // getOUData();
        // console.log(rs);
        if(uid == 0){
            var option = {styleKind:"list",style:"1grid-modify"};
            getStyle(option,function(pageStyle){
                var pageStyleObj = $.parseHTML(pageStyle);
                var firstItem = $(pageStyleObj).find(".list-items").eq(0);
                firstItem.html(name);

                $(pageStyleObj).find(".fa-pencil-square-o").click(function(){
                    insertDialog(rs.Data, name, firstItem);
                });
                $("#grid").find("div").eq(0).before(pageStyleObj);
            });
        }
    });
}

// 刪除
function deleteData(uid, removeItem){
    // $.ajax({
    //     url: ctrlAdminAPI + "Delete_AssTypeOffice",
    //     type: "DELETE",
    //     data: {iUid: uid},
    //     success: function(){
    //         getOUData();
    //     }
    // });
    console.log(uid);
    var sendData = {
        apiMethod: ctrlAdminDelAPI + "Insert_AssTypeOffice",
        deleteObj:{
            iUid: uid
        }
    };
    $.post(configObject.deleteAPI,sendData,function(rs){
        // getOUData();
        removeItem.remove();
        console.log(rs);
    });
}