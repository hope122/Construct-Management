var sys_code = userLoginInfo.sysCode;
var userID = userLoginInfo.userID;
var menu_code = "eab";

// 標籤碼，1:收文，2:發文，3:退件
var tabCode = 1;

$(function(){
    getData();
    $("#totalTab").find("a").each(function(){
        $(this).click(function(){
            var id = $(this).prop("id");
            getData(id+"-content");
        });
    });

    tabCtrl("totalTab");
});

function getData(areaID){
    $("#pageInsertBtn").show();

    if(areaID == undefined){
        areaID = "received-content";
    }
    var method = referenceAPI + "getReferenceList";
    if(areaID == "received-content"){
        tabCode = 1;
    }else if(areaID == "sendDoc-content"){
        tabCode = 2;
        method = waDrfAPI + "getDispatchList";
    }else{
        $("#pageInsertBtn").hide();
    }
    $("#"+areaID).find(".dataContent").remove();
    $("#"+areaID).find(".date-empty").remove();

    var sendData = {
        api: method,
        data:{
            userId:userID,
            sysCodeId:sys_code
        }
    };

    $.getJSON(wrsUrl, sendData).done(function(rs){
        // console.log(rs);
        
        if(rs.status && rs.data != null){
            putDataToPage(rs.data, $("#"+areaID));

        }else{
            putEmptyInfo($("#"+areaID));
        }
    });
}


// 放資料
function putDataToPage(data, putArea){
    // 畫面設定值
    var style = "reference-list";
    if(tabCode == 2){
        style = "sendDoc-list";
    }
    var option = {styleKind:"received-issued",style:style};
    // 取得畫面樣式
    getStyle(option,function(pageStyle){
        $.each(data, function(index,content){
            var pageStyleObj = $.parseHTML(pageStyle);
            listDataInfoToShow(putArea, pageStyleObj, content);
        });
        putArea.find(".dataContent").last().removeClass("list-items-bottom");
    });
}

// 新增類
function tabInsert(){
    if(tabCode == 1){
        // 收文
        referenceInsertDialog();
    }else if(tabCode == 2){
        // insertDialog();
        selectSampleDialog();
    }
}

// 確認資料顯示的內容
function listDataInfoToShow(putArea, pageStyleObj, content, isPutToPage){
    if(isPutToPage == undefined){
        isPutToPage = true;
    }
    $(pageStyleObj).addClass("dataContent");

    // 事項標題
    $(pageStyleObj).find(".list-items").eq(0).html(content["doc_number"]);

    // 主旨
    $(pageStyleObj).find(".list-items").eq(1).text(content.subject);

    // 速別/密等
    var str = "";
    if(tabCode == 1){
        str = content.level_name;
    }else if(tabCode == 2){
        str = content.isopycnic_name;
    }
    $(pageStyleObj).find(".list-items").eq(2).text(str);

    // 預警
    $(pageStyleObj).find(".list-items").eq(3).text(content.endDate);
     
    // 狀態
    $(pageStyleObj).find(".list-items").eq(4).text(content.statusName);

    if(tabCode == 1){
        // 閱讀按鈕
        var readBtn = $(pageStyleObj).find(".fa-file-text-o");
        // 分文按鈕
        var pushDocBtn = $(pageStyleObj).find(".fa-sitemap");
        // 開始做按鈕
        var startBtn = $(pageStyleObj).find(".fa-chain-broken");
        // 辦況
        var courseBtn = $(pageStyleObj).find(".fa-plus-circle");
        // 辦況列表
        var doneListBtn = $(pageStyleObj).find(".fa-list-alt");
        // 完成按鈕
        var finishBtn = $(pageStyleObj).find(".fa-check-circle-o");
        
        // 辦況
        if(!parseInt(content.pos_do) || parseInt(content.status) != 3){
            courseBtn.remove();
        }

        if(parseInt(content.status) < 3 || !parseInt(content.pos_setof)){
            // 辦況按鈕
            doneListBtn.remove();
        }

        // 閱讀權限按鈕
        if(!parseInt(content.pos_read)){
             readBtn.remove();
        }
        // 分文按鈕
        if(!parseInt(content.pos_setof)){
            pushDocBtn.remove();
        }else{
            if(content.status != 0 && content.status != 1){
                pushDocBtn.remove();
            }
        }

        // 開始按鈕
        if(!parseInt(content.pos_do)){
            startBtn.remove();
            // 完成按鈕
            finishBtn.remove();
        }else{
            if(content.status != 2 ){
               startBtn.remove();
            }
            // 完成按鈕
            if(content.status != 3 ){
               finishBtn.remove();
            }
        }

        // 預覽
        readBtn.click(function(){
            referenceViewDialog(content);
        });
        
        // 分文
        pushDocBtn.click(function(){
            if(content.status == 0){
                orgTreeDialog(content, $(pageStyleObj));
            }else if(content.status == 1){
                userListData(content, $(pageStyleObj));
            }
        });
        // 開始做的圖示
        startBtn.click(function(){
            processItem($(pageStyleObj), content);
        });

        // 辦況按鈕新增
        courseBtn.click(function(){
            
            referenceCheckItemDialog(content, $(pageStyleObj));
        });

        // 完成
        finishBtn.click(function(){
            
            // $(this).remove();
            referenceCheckItemFinishDialog(content, $(pageStyleObj));
        });

        // 辦況歷史記錄
        doneListBtn.click(function(){
            referenceDoneListView(content);
        });
        if(content.CompletionDate){
            $(pageStyleObj).find(".fa-pencil-square-o").remove();
            $(pageStyleObj).find(".fa-check").remove();
        }
    }else if(tabCode == 2){
        // 簽核狀態預覽
        $(pageStyleObj).find(".fa-list-alt").click(function(){
            signStatusViewDialog(content);
        });
        // 修改
        $(pageStyleObj).find(".fa-pencil-square-o").click(function(){
            insertDialog( content, $(pageStyleObj) );
        });
    }
    if(isPutToPage){
        $(pageStyleObj).appendTo(putArea);
    }
}

// 重新放置單筆資料
function renewListData(pageObjArea, content){
    // 先取得資料

    var method = referenceAPI + "getReferenceList";
    var style = "reference-list";

    if(tabCode == 2){
        method = waDrfAPI + "getDispatchList";
        style = "sendDoc-list";
    }

    var sendObj = {
        api: method,
        data: {
            userId: userID,
            uid: content.uid
        }
    }
    $.getJSON(wrsUrl, sendObj).done(function(rs){
        // console.log(rs);
        
        if(rs.status && rs.data != null){
            // 畫面設定值
            var option = {styleKind:"received-issued",style:style};
            // 取得畫面樣式
            getStyle(option,function(pageStyle){
                var pageStyleObj = $.parseHTML(pageStyle);
                var itemActionBtn = $(pageStyleObj).find(".item-actionBtn").clone();
                $(pageObjArea).find(".item-actionBtn").html(itemActionBtn);
                $.blockUI();
                listDataInfoToShow("", pageObjArea, rs.data[0], false);
                $.unblockUI();

            });
        }else{
            msgDialog(rs.Message);
        }
    });
    
}

// 開始做事項
function processItem(pageObjArea, content){
    var sendObj = {
        api: referenceAPI+"setReferenceWorkStatus",
        data:{
            uid: content.uid,
            status: 1
        }
    };

    $.post(wrsUrl, sendObj, function(rs){
        var rs = $.parseJSON(rs);
        if(rs.status){
            msgDialog("「"+content["doc_number"]+"」開始辦理", false);
            renewListData(pageObjArea, content);
        }else{
            msgDialog(rs.Message);
        }
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

// 準備簽核前的視窗，顯示與設定最後結束日期
function signInfoAndDate(sendObj, modifyItem,putFormArea){
    $("#signInfoAndDateDialog").remove();
    $("#setReferenceDateDailog").remove();

    $("<div>").prop("id","signInfoAndDateDialog").appendTo("body");

    $("#signInfoAndDateDialog").bsDialog({
        autoShow:true,
        showFooterBtn:true,
        // headerCloseBtn:false,
        // modalClass: "bsDialogWindow",
        title: "設置簽核結束日期",
        start: function(){
            var option = {
                styleKind: "received-issued",style:"undertake-dateandtype"
            }
            getStyle(option,function(pageStyle){
                var pageStyleObj = $.parseHTML(pageStyle);
                
                $(".ui-datepicker").remove();
                var dateOption = {
                    dateFormat: "yy-mm-dd",
                    onSelect: function(dateText, inst) {
                        $(pageStyleObj).find("#end_date_content").removeClass("item-bg-danger").text(dateText);
                        $(pageStyleObj).find("#end_date").hide();
                    },
                    minDate: 0
                };

                $(pageStyleObj).find("#end_date").hide().datepicker(dateOption);

                $(pageStyleObj).find("#end_calendar").click(function(){
                    $(pageStyleObj).find("#end_date").show();
                });
                
                $(pageStyleObj).appendTo($("#signInfoAndDateDialog").find(".modal-body"));
            });
        },
        button:[
            {
                text: "會簽",
                className: "btn-info",
                click: function(){
                    var end_date = $("#signInfoAndDateDialog").find("#end_date").val();
                    sendObj.end_date = end_date;
                    if(end_date){
                        sendObj.actionType = 0;
                        signWFSelect(sendObj, modifyItem,putFormArea);
                        // $("#signInfoAndDateDialog").bsDialog("close");

                    }else{
                        $("#signInfoAndDateDialog").find("#end_date_content").text("尚未選擇日期").addClass("item-bg-danger");
                        
                    }
                }
            },
            {
                text: "簽核",
                className: "btn-success",
                click: function(){
                    var end_date = $("#signInfoAndDateDialog").find("#end_date").val();
                    sendObj.end_date = end_date;
                    if(end_date){
                        sendObj.actionType = 1;
                        signWFSelect(sendObj, modifyItem,putFormArea);
                        // $("#signInfoAndDateDialog").bsDialog("close");

                    }else{
                        $("#signInfoAndDateDialog").find("#end_date_content").text("尚未選擇日期").addClass("item-bg-danger");
                    }
                }
            }
        ]
    });
}

// 簽核WF設定
function signWFSelect(sendObj, modifyItem,putFormArea){
    // actionType是該文件簽核類型（0:匯簽,1:簽核）
    var data = [];
    var sendData = {
        api: "workflow/getWorkFlow",
        threeModal: true,
        data:{
            sys_code:sys_code,
            menu_code:menu_code
        }
    };

    $.getJSON(wrsUrl,sendData,function(rs){
        // $("#signDocDialog").find(".modal-body").append(orgChart);
        if(rs.status){
            data = rs.data;
            signWFDialog(data, sendObj, modifyItem,putFormArea);
        }else{
            errorDialog("尚未有簽核流程，請新增後再嘗試");
        }
    });
}

function signWFDialog( data, sendObj, modifyItem,putFormArea ){
    console.log(sendObj);
    $("#signWFDialog").remove();
    $("<div>").prop("id","signWFDialog").appendTo("body");
    var title = "";

    if(sendObj.actionType){
        title += "請選擇簽核流程";
    }else{
        title += "請選擇會簽流程";
    }
    var signWFDialog = $("#signWFDialog").bsDialogSelect({
        autoShow:true,
        showFooterBtn:true,
        // headerCloseBtn:false,
        // modalClass: "bsDialogWindow",
        title: title,
        data: data,
        textTag: "name",
        valeTag: "uid",
        button:[
            {
                text: "返回",
                // className: "btn-success",
                click: function(){
                
                    $("#signWFDialog").bsDialog("close");
                    
                }
            },
            {
                text: "確定",
                className: "btn-success",
                click: function(){
                    var wfID = signWFDialog.getValue();
                    // console.log(wfID);
                    if(wfID){
                        sendObj.wfID = wfID;
                        sendObj.userID = userID;
                        sendObj["sys_code"] = sys_code;
                        // console.log(sendObj);
                        saveSignData(sendObj, modifyItem, putFormArea);
                        // $("#signWFDialog").bsDialog("close");
                    }else{
                        errorDialog("未選擇簽核流程");
                    }
                }
            }
        ]
    });
}

function errorDialog(msg){
    $("#errorDialog").remove();
    $("<div>").prop("id","errorDialog").appendTo("body");

    $("#errorDialog").bsDialog({
        autoShow:true,
        showFooterBtn:true,
        title: "錯誤",
        start:function(){

            var msgDiv = $("<div>").html(msg);
            $("#errorDialog").find(".modal-body").append(msgDiv);
        },
        button:[{
            text: "關閉",
            className: "btn-danger",
            click: function(){
                $("#errorDialog").bsDialog("close");
            }
        }
        ]
    });
}

// 多檔案上傳
function fileSelect(putFormArea){
    var fileInput = $("<input>").prop("type","file").prop("name","files[]").prop("multiple",true).change(function(){
        // console.log($(this).prop("files"));
        var names = $.map($(this).prop("files"), function(val) { 
            // return val.name; 
            // console.log(val)
            var infoDiv = $("<div>").addClass("col-xs-12 col-md-12").html(val.name);
            $("#insertDialog").find("#isSelectFile").find(".control-label").eq(1).append(infoDiv);
        });

        // console.log(names);
        $(this).appendTo(putFormArea);
        // console.log(formObj);
        $("#insertDialog").find("#isSelectFile").show();
    });
    fileInput.click();
}

function chartToHtml(htmlString){
    return htmlString.replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
}
