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
function selectSampleDialog(){
    $("#selectSampleDialog").remove();
    var selectSampleDialog = $("<div>").prop("id","selectSampleDialog");
    selectSampleDialog.appendTo("body");

    $("#selectSampleDialog").bsDialog({
        title: "擬文情境選擇",
        start: function(){
          var option = {styleKind:"received-issued",style:"sendDoc-sample"};
          getStyle(option,function(samplePage){
            var samplePageObj = $.parseHTML(samplePage);

            $(samplePageObj).find("#sampleCategory").change(function(){
                var sampleTypePutArea = $(samplePageObj).find("#sampleType");
                getSampleListData(sampleTypePutArea, $(this).val());
            });

            var putArea = $(samplePageObj).find("#sampleCategory");
            putArea.empty();

            getSampleListData(putArea);

            // sampleType
            $(samplePageObj).appendTo( $("#selectSampleDialog").find(".modal-body") );
          });
        },
        button:[
            {
                text: "關閉",
                className: "pull-left",
                click: function(){
                    $("#selectSampleDialog").bsDialog("close");
                }
            },
            {
                text: "不使用",
                className: "btn-danger",
                click: function(){
                    $("#selectSampleDialog").bsDialog("close");
                    insertDialog();
                }
            },
            {
                text: "使用",
                className: "btn-success",
                click: function(){
                    var selectSampleTypeID = $("#selectSampleDialog").find("#sampleType").val();
                    getSampleData(selectSampleTypeID);
                }
            },
        ]
    });

}


// 新增&修改Dialog
function insertDialog(modifyObj, modifyItem, sampleData){
    // console.log(modifyObj, modifyItem);
    if(modifyItem == undefined){
        modifyItem = null;
    }
    var saveBtn = "";
    if(modifyObj != undefined){
        title = "修改擬文";
        saveBtn = "修改";
    }else{
        title = "新增擬文";
        saveBtn = "設定簽核";
    }
    $("#insertDialog").remove();
    var insertDialog = $("<div>").prop("id","insertDialog");
    insertDialog.appendTo("body");

    $("#insertDialog").bsDialog({
        title: title,
        autoShow: true,
        start: dispatchStart(modifyObj, modifyItem, sampleData),
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
                    // 取得資訊
                    var sendObj = getUserInput("insertDialog");
                    // 檢查是否有選取正本，至少要一個
                    var originalTarget = $("#insertDialog").find("#originalTarget .originalTargetID");
                    var originalIDStr = "";
                    if( originalTarget.length ){
                        $.each(originalTarget, function(){
                            originalIDStr += $(this).val() + ",";
                        });
                        originalIDStr = originalIDStr.substring(0, originalIDStr.length - 1);
                    }
                    sendObj.originalID = originalIDStr;

                    // 檢查是否有選取副本
                    var duplicateTarget = $("#insertDialog").find("#originalTarget .duplicateTargetID");
                    var duplicateTargetIDStr = "";
                    if( duplicateTarget.length ){
                        $.each(originalTarget, function(){
                            duplicateTargetIDStr += $(this).val() + ",";
                        });
                        duplicateTargetIDStr = duplicateTargetIDStr.substring(0, duplicateTargetIDStr.length - 1);
                    }
                    sendObj.duplicateTargetID = duplicateTargetIDStr;


                    if(originalIDStr){
                        signInfoAndDate(sendObj);
                    $("#insertDialog").bsDialog("close");

                    }else{
                        $("#insertDialog").find("#originalTarget").addClass("item-bg-danger").text("尚未選擇受文對象");
                    }
                }
            }
        ]
    });

}

// ---------以上為擬文動作----------------

// 收文新增時開啟的動作要做的事情
function referenceInsertStart(modifyObj, modifyItem){
    var option = {styleKind:"received-issued",style:"reference-insert"};
    getStyle(option,function(insertPage){
        var insertPageObj = $.parseHTML(insertPage);

        $(insertPageObj).find(".fa-cloud-upload").click(function(){
            var putFormArea = $(insertPageObj).find("#uploadFiles");
            fileSelect(putFormArea);
        });
        // 加載CKeditor
        $(insertPageObj).find("#summary").ckeditor();
        // CKEDITOR.replace( $(insertPageObj).find("#summary"), {});
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

// 取得擬文選單
function getSampleListData(putArea, sampleCategoryID, sampleTypeID){
    var sendObj = {
        api: typeAPI + "getDocTypeList",
        data: {
            code_id: sys_code
        }
    };
    var str = "未有類別";
    // 取類別列表
    if(sampleCategoryID != undefined){
        sendObj.data.uid = sampleCategoryID;
        putArea.empty();
        str = "未有類型";
    }

    $.getJSON(wrsUrl, sendObj, function(rs){
        if(rs.status && rs.data != null){
            $.each(rs.data, function(i, v){
                selectOptionPut(putArea, v.uid, v.name);
            });
            putArea.change();
        }else{
            selectOptionPut(putArea, "", str);
        }
    });
}

// 取得範本內容
function getSampleData(sampleTypeID){
    var sendObj = {
        api: waDrfAPI + "getTemplate",
        data: {
            docTypeid: sampleTypeID
        }
    };

    $.getJSON(wrsUrl, sendObj, function(rs){
        if(rs.status && rs.data != null){
            // console.log(rs);
            $("#selectSampleDialog").bsDialog("close");
            insertDialog(undefined,undefined,rs.data[0]);
        }else{
            errorDialog("未有擬文範本，請選擇其他類型或類別");
        }
    });
}

// 擬文新增/修改頁面相關
function dispatchStart(modifyObj, modifyItem, sampleData){
    var option = {styleKind:"received-issued",style:"sendDoc-insert"};
    getStyle(option,function(insertPage){
        var insertPageObj = $.parseHTML(insertPage);
        
        // 說明
        $(insertPageObj).find("#content").ckeditor();
        if(sampleData != undefined){
            $(insertPageObj).find("#content").val(sampleData.content);
            $(insertPageObj).find("#gist").val(sampleData.gist);

        }
        // 承辦人的名字
        $(insertPageObj).find("#pointPeople").text(userLoginInfo.userName);

        // 附件上傳
        $(insertPageObj).find(".fa-cloud-upload").click(function(){
            var putFormArea = $(insertPageObj).find("#uploadFiles");
            fileSelect(putFormArea);
        });

        // 正本新增鈕
        $(insertPageObj).find(".list-items").eq(0).find(".fa-plus").click(function(){
            var orgiginalPutArea = $(insertPageObj).find("#originalTarget");
            originalAndDuplicateSelect(orgiginalPutArea, true);
        });

        // 副本新增鈕
        $(insertPageObj).find(".list-items").eq(1).find(".fa-plus").click(function(){
            var duplicatePutArea = $(insertPageObj).find("#duplicateTarget");
            originalAndDuplicateSelect(duplicatePutArea, false);
        });

        // 取得速別
        getSpeedTypeAndSecretType($(insertPageObj).find("#speedType"));
        // 取得密等
        getSpeedTypeAndSecretType($(insertPageObj).find("#secretType"), 2);

        // 速別重整鈕
        $(insertPageObj).find(".list-items").eq(2).find(".fa-refresh").click(function(){
            getSpeedTypeAndSecretType($(insertPageObj).find("#speedType"));
        });
        // 密等重整鈕
        $(insertPageObj).find(".list-items").eq(3).find(".fa-refresh").click(function(){
            getSpeedTypeAndSecretType($(insertPageObj).find("#secretType"), 2);
        });

        // // 修改
        // if(modifyObj != undefined){

        //     // console.log("T");
        //     $.each(modifyObj, function(index,content){
        //         if(index != "sex" ){
        //             $(insertPageObj).find("#"+index).val(content);
        //         }else{
        //             $(insertPageObj).find("[name=sex][value=" + content + "]").attr("checked",true).parent().addClass("active");
        //         }
        //     });
        //     var account = $(insertPageObj).find("#sid").val();
        //     $(insertPageObj).find("#accountContent").text(account);
        // }else{
        //     // 新增
        //     $(insertPageObj).find("#sid").keyup(function(){
        //         var account = $(this).val();
        //         $(insertPageObj).find("#accountContent").text(account);
        //     });
        // }
        $(insertPageObj).appendTo($("#insertDialog").find(".modal-body"));

    });
}

// 取得速別＆密等
function getSpeedTypeAndSecretType(putArea, typeID){
    if(typeID == undefined){
        typeID = 1;
    }
    putArea.empty();
    var sendObj = {
        api: typeAPI+"getTypeList",
        data: {
            type: typeID
        }
    };

    $.getJSON(wrsUrl, sendObj, function(rs){
        if(rs.status && rs.data != null){
            $.each(rs.data, function(i, v){
                selectOptionPut(putArea, v.uid, v.name);

            });
        }else{
            selectOptionPut(putArea, "", "無資料");
        }
    });
}

// 創建正、副本相關選項
function originalAndDuplicateSelect(putArea,isOriginal){
    var siClass = "duplicateTargetID";
    if(isOriginal){
        siClass = "originalTargetID";
    }
    if(!$(putArea).find("."+siClass).length){
        $(putArea).empty().removeClass("item-bg-danger");
    }
    var option = {styleKind:"received-issued",style:"sendDoc-originalAndDuplicate"};
    getStyle(option,function(odPage){
        var odPageObj = $.parseHTML(odPage);
        var selectItem = $("<select>").addClass("form-control "+siClass);
        
        getSUOptionList(selectItem);

        $(odPageObj).find(".control-label").eq(0).append(selectItem);
        $(odPageObj).find(".fa-refresh").click(function(){
            getSUOptionList(selectItem);
        });
        $(odPageObj).find(".fa-trash-o").click(function(){
            $(odPageObj).remove();
        });
        $(odPageObj).appendTo(putArea);
    });
}

function getSUOptionList(putArea){
    putArea.empty();

    var sendObj = {
        api: "SuSupply/GetData_SuSupply",
        threeModal: true,
        data:{
            sys_code: sys_code
        }
    };

    $.getJSON(wrsUrl, sendObj, function(rs){
        if(rs.Status){
            $.each(rs.Data, function(i, v){
                selectOptionPut(putArea, v.uid, v.name);

            });
        }else{
            selectOptionPut(putArea, "", "無資料");
        }
    });
}
