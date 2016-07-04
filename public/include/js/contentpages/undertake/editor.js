// 收文新增
function referenceInsertDialog(modifyObj, modifyItem){
    // console.log(modifyObj, modifyItem);
    if(modifyItem == undefined){
        modifyItem = null;
    }
    var saveBtn = "";
    if(modifyObj != undefined){
        title = "修改收文";
        saveBtn = "修改";
    }else{
        title = "新增收文";
        saveBtn = "新增";
    }
    $("#insertDialog").remove();
    var insertDialog = $("<div>").prop("id","insertDialog");
    insertDialog.appendTo("body");

    $("#insertDialog").bsDialog({
        title: title,
        autoShow: true,
        start: referenceInsertStart(modifyObj, modifyItem),
        button:[
        
            {
                text: "取消",
                className: "btn-default-font-color",
                click: function(){
                    $("#insertDialog").bsDialog("close");
                }
            },
            {
                text: saveBtn,
                className: "btn-success",
                click: function(){
                    referenceInsertClickBtn(modifyItem);
                }
            }
        ]
    });
}

// ----------------發文擬文部分----------------

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
            // 點選部門按鈕，可設置
            $(insertPageObj).find(".fa-sitemap").click(function(){
                orgChartDialog( $(insertPageObj).find("#orgInfo"), $(insertPageObj).find("#orgJobInfo"));
            });
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
                var account = $(insertPageObj).find("#sid").val();
                $(insertPageObj).find("#accountContent").text(account);
            }else{
                // 新增
                $(insertPageObj).find("#sid").keyup(function(){
                    var account = $(this).val();
                    $(insertPageObj).find("#accountContent").text(account);
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
                    // 基本資訊
                    var userInfo = getUserInput("userInfo-content");
                    // 通訊地址
                    var census = getUserInput("census-content");
                    census.addr_type = 0;
                    // 通訊地址
                    var communication = getUserInput("communication-content");
                    communication.addr_type = 1;

                    // 取得部門&職務資訊
                    var accountInfo = getOrgVal();


                    if(modifyObj == undefined){
                        $("#grid").find(".date-empty").remove();
                    }
                    userInfo.sys_code = sys_code;
                    var sendObj = {
                        userInfo: userInfo,
                        census:census,
                        communication:communication,
                        org: accountInfo,
                        // sys_code: sys_code
                    }

                    if(modifyObj != undefined){
                        sendObj.userInfo.uid = modifyObj.uid;
                        sendObj.userInfo.userID = modifyObj.userID;
                        sendObj.communication.cmid = modifyObj.uid;
                        sendObj.census.cmid = modifyObj.uid;
                        sendObj.org.cmid = modifyObj.uid;
                    }
                    console.log(sendObj);
                    // return;

                    saveData(sendObj, modifyItem);
                    // console.log(sendObj);
                    // $("#insertDialog").bsDialog("close");
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

// 收文新增時開啟的動作要做的事情
function referenceInsertStart(modifyObj, modifyItem){
    var option = {styleKind:"received-issued",style:"reference-insert"};
    getStyle(option,function(insertPage){
        var insertPageObj = $.parseHTML(insertPage);

        $(insertPageObj).find(".fa-cloud-upload").click(function(){
            var putFormArea = $(insertPageObj).find("#uploadFiles");
            fileSelect(putFormArea);
        });
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
            var account = $(insertPageObj).find("#sid").val();
            $(insertPageObj).find("#accountContent").text(account);
        }else{
            // 新增
            $(insertPageObj).find("#sid").keyup(function(){
                var account = $(this).val();
                $(insertPageObj).find("#accountContent").text(account);
            });
        }
        // 放到畫面中
        $(insertPageObj).appendTo($("#insertDialog").find(".modal-body"));
        // getQCTableTypeList("tableTypeTab","tableType",true);
    });
}

// 收文按下新增或修改按鈕要做的事情
function referenceInsertClickBtn(modifyItem){
    // 基本資訊
    var sendObj = getUserInput("insertDialog");
    sendObj.userID = userID;
    var putFormArea = $("#insertDialog").find("#uploadFiles");
    // if(modifyObj == undefined){
    //     $("#grid").find(".date-empty").remove();
    // }
    // userInfo.sys_code = sys_code;
    // var sendObj = {
    //     userInfo: userInfo,
    //     census:census,
    //     communication:communication,
    //     org: accountInfo,
    //     // sys_code: sys_code
    // }

    // if(modifyObj != undefined){
    //     sendObj.userInfo.uid = modifyObj.uid;
    //     sendObj.userInfo.userID = modifyObj.userID;
    //     sendObj.communication.cmid = modifyObj.uid;
    //     sendObj.census.cmid = modifyObj.uid;
    //     sendObj.org.cmid = modifyObj.uid;
    // }
    // console.log(sendObj);
    // return;

    saveReferenceData(sendObj, modifyItem, putFormArea);
    // console.log(sendObj);
    // $("#insertDialog").bsDialog("close");
}

