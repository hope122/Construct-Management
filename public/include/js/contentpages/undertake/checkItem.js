// 收文完成確認
function referenceCheckItemFinishDialog(modifyObj,modifyItem){
    $("#insertDialog").remove();
    var insertDialog = $("<div>").prop("id","insertDialog");
    insertDialog.appendTo("body");

    $("#insertDialog").bsDialog({
        title: "事項完成 - 辦況與附件設定",
        autoShow: true,
        start: referenceCheckItemStart(modifyObj,modifyItem),
        button:[
        
            {
                text: "取消",
                className: "btn-default-font-color",
                click: function(){
                    $("#insertDialog").bsDialog("close");
                }
            },
            {
                text: "完成",
                className: "btn-danger",
                click: function(){
                    referenceCheckItemClickBtn(modifyObj,modifyItem, true);
                }
            }
        ]
    });
}

// 收文辦況確認
function referenceCheckItemDialog(modifyObj,modifyItem){
    $("#insertDialog").remove();
    var insertDialog = $("<div>").prop("id","insertDialog");
    insertDialog.appendTo("body");

    $("#insertDialog").bsDialog({
        title: "新增辦況與附件",
        autoShow: true,
        start: referenceCheckItemStart(modifyObj,modifyItem),
        button:[
        
            {
                text: "取消",
                className: "btn-default-font-color",
                click: function(){
                    $("#insertDialog").bsDialog("close");
                }
            },
            {
                text: "儲存",
                className: "btn-success",
                click: function(){
                    referenceCheckItemClickBtn(modifyObj,modifyItem, false);
                }
            }
        ]
    });
}

// 確認起始畫面
function referenceCheckItemStart(modifyObj,modifyItem){

    var option = {styleKind:"received-issued",style:"reference-checkItem"};
    getStyle(option,function(insertPage){
        var insertPageObj = $.parseHTML(insertPage);

        $(insertPageObj).find(".fa-cloud-upload").click(function(){
            var putFormArea = $(insertPageObj).find("#uploadFiles");
            fileSelect(putFormArea);
        });
        // 加載CKeditor
        $(insertPageObj).find("#summary").ckeditor();
        // CKEDITOR.replace( $(insertPageObj).find("#summary"), {});
        // 放到畫面中
        $(insertPageObj).appendTo($("#insertDialog").find(".modal-body"));
    });
}

// 收文按下新增或修改按鈕要做的事情
function referenceCheckItemClickBtn(modifyObj,modifyItem, isFinish){
    // 基本資訊
    var sendObj = getUserInput("insertDialog");
    sendObj.userID = userID;
    sendObj.uid = modifyObj.uid;
    sendObj.userName = userLoginInfo.userName;
    var putFormArea = $("#insertDialog").find("#uploadFiles");

    saveReferenceCheckItemData(sendObj, modifyItem, putFormArea, isFinish);
}

// 收文取得歷史辦況列表
function referenceDoneListView(itemObj){
    $("#referenceDoneListView").remove();
    var referenceDoneListView = $("<div>").prop("id","referenceDoneListView");
    referenceDoneListView.appendTo("body");

    $("#referenceDoneListView").bsDialog({
        title: itemObj.doc_number + "歷史辦況",
        autoShow: true,
        start: referenceDoneListStart(itemObj),
        button:[
            {
                text: "關閉",
                className: "btn-default-font-color",
                click: function(){
                    $("#referenceDoneListView").bsDialog("close");
                }
            }
        ]
    });
}

// 歷史辦況列表起始畫面
function referenceDoneListStart(modifyObj){
    var pageContent = $("<div>").addClass("contents");
    // 先取得資料
    var sendObj = {
        api: referenceAPI + "getReferenceHandling",
        data: {
            uid: modifyObj.uid
        }
    };

    $.getJSON(wrsUrl, sendObj, function(rs){
        if(rs.status && rs.data != null){
            var option = {styleKind:"received-issued",style:"reference-doneList"};
            getStyle(option,function(viewPage){

                $.each(rs.data, function(i, content){
                    var viewPageObj = $.parseHTML(viewPage);
                    $(viewPageObj).addClass("dataContent");
                    var contentString = $.parseHTML(content.content);

                    $(viewPageObj).find(".list-items").eq(0).html(contentString[0].data);
                    $(viewPageObj).find(".list-items").eq(1).text("沒有檔案");
                    $(viewPageObj).find(".list-items").eq(2).text(content.date);

                    // 放到畫面中
                    $(viewPageObj).appendTo(pageContent);
                });
                pageContent.find(".dataContent").last().removeClass("list-items-bottom");
                
            });
        }else{
            putEmptyInfo(pageContent);
        }
        $("#referenceDoneListView").find(".modal-body").append(pageContent);
    });
}
