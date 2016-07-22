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
                    referenceCheckItemClickBtn(modifyItem);
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
function referenceCheckItemClickBtn(modifyItem){
    // 基本資訊
    var sendObj = getUserInput("insertDialog");
    sendObj.userID = userID;
    var putFormArea = $("#insertDialog").find("#uploadFiles");

    saveReferenceCheckItemData(sendObj, modifyItem, putFormArea);
}
