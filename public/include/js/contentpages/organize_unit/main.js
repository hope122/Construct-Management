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
        // $.each();
        // 相關設定
        $("#grid").append(pageStyle);
        $("#grid").append(pageStyle);

        $("#grid").find(".list-items-bottom").last().removeClass("list-items-bottom");
    });
}

// 新增Dialog
function insertDialog(uid,name){
    if(name == undefined){
        name = "";
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
        
        if(uid == undefined){
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
            text: "新增",
            className: "btn-success",
            click: function(){
                saveData();
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
function saveData(){
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
    console.log(sendData);
    // return;
    if(uid != 0){
        method = "Update_AssTypeOffice";
    }
    $.post(ctrlAdminAPI + "Insert_AssTypeOffice",sendData,function(rs){
        // getOUData();
        console.log(rs);
    });
}

// 刪除
function deleteData(uid){
    $.ajax({
        url: ctrlAdminAPI + "Delete_AssTypeOffice",
        type: "DELETE",
        data: {iUid: uid},
        success: function(){
            getOUData();
        }
    });
    $.post(ctrlAdminAPI + "Insert_AssTypeOffice",sendData,function(rs){
        // getOUData();
        console.log(rs);
    });
}