// 簽核預覽
function signStatusViewDialog(modifyObj){
    console.log(modifyObj);
    $("#signStatusViewDialog").remove();
    var signStatusViewDialog = $("<div>").prop("id","signStatusViewDialog");
    signStatusViewDialog.appendTo("body");

    $("#signStatusViewDialog").bsDialog({
        title: modifyObj.doc_number,
        autoShow: true,
        modalClass: "bsDialogWindow",
        start: signStatusViewStart(modifyObj),
        button:[
        
            {
                text: "關閉",
                className: "btn-default-font-color",
                click: function(){
                    $("#signStatusViewDialog").bsDialog("close");
                }
            },
        ]
    });
}


// 簽核預覽時開啟的動作要做的事情
function signStatusViewStart(modifyObj){
    var option = {styleKind:"received-issued",style:"sendDoc-signStatus"};
    getStyle(option,function(insertPage){
        var insertPageObj = $.parseHTML(insertPage);

        $.each(modifyObj, function(i, content){
            $(insertPageObj).find("#"+i).html(content);
        })
        
        // 放到畫面中
        $(insertPageObj).appendTo($("#signStatusViewDialog").find(".modal-body"));

        // getQCTableTypeList("tableTypeTab","tableType",true);
    });
}