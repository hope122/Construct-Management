var testData = [];
var sys_code = userLoginInfo.sysCode;
var userID = userLoginInfo.userID;
var menu_code = "eab";
var orgTreeChart;
// 標籤碼，1:收文，2:發文，3:退件
var tabCode = 1;
// ----------測試用---------------
$(function(){
    getData();
    $("#testBs").bsDialog({
        autoShow:false,
        showFooterBtn:true,
        title: "擬文情境選擇",
        // modalClass: "bsDialogWindow",
        button:[{
            text: "不使用",
            click: function(){

            }
        },
        {
            text: "使用範本",
            className:"btn-success",
            click: function(){
                
                testBs2Show();
                // $(formObj).ajaxSubmit(options);
            }
        }
        ]
    });
    $("#testBs2").bsDialog({
        autoShow:false,
        showFooterBtn:true,
        title: "擬文",
        modalClass: "bsDialogWindow",
        button:[{
            text: "取消",
            click: function(){

            }
        },
        {
            text: "確認",
            className:"btn-success",
            click: function(){
                var options = {
                    url: "http://127.0.0.1:88/uploaderAPI",
                    type:"POST",
                    // data: sendObj,
                    // dataType:"JSON",
                    beforesend: function(xhr){
                        testBs3Show(xhr);
                    },
                    uploadProgress: function(event, position, total, percentComplete) {
                       console.log(event, position, total, percentComplete);

                    },
                    success: function(rs) {
                       console.log(rs);
                    },
                };
                testBs7Show();
                // $(formObj).ajaxSubmit(options);
            }
        }
        ]
    });
    tabCtrl("totalTab");
    
    $("#testBs5").bsDialog({
        autoShow:false,
        showFooterBtn:true,
        title: "檢閱公文",
        button:[{
            text: "關閉",
            // className: "btn-success",
            click: function(){
                // xhr.abort();
                // $(formObj).ajaxFormUnbind();
                $("#testBs5").bsDialog("close");
            }
        }
        ]
    });
    $("#testBs6").bsDialog({
        autoShow:false,
        showFooterBtn:true,
        title: "檢閱公文",
        button:[{
            text: "關閉",
            // className: "btn-success",
            click: function(){
                // xhr.abort();
                // $(formObj).ajaxFormUnbind();
                $("#testBs5").bsDialog("close");
            }
        }
        ]
    });
    $("#testBs7").bsDialog({
        autoShow:false,
        showFooterBtn:true,
        title: "擬文會簽與簽核",
        button:[{
            text: "取消",
            // className: "btn-success",
            click: function(){
                // xhr.abort();
                // $(formObj).ajaxFormUnbind();
                $("#testBs7").bsDialog("close");
            }
        },
        {
            text: "會簽",
            className: "btn-info",
            click: function(){
                // xhr.abort();
                // $(formObj).ajaxFormUnbind();
                testBs8Show();
                getOrgData();
            }
        },
        {
            text: "簽核",
            className: "btn-success",
            click: function(){
                // xhr.abort();
                // $(formObj).ajaxFormUnbind();
                $("#testBs7").bsDialog("close");
            }
        }
        ]
    });
});
function testBsShow(){
    $("#testBs").bsDialog("show");
}
function testBs2Show(){
    $("#testBs2").bsDialog("show");
    // formObj = $.parseHTML(formStr);
}
function testBs3Show(){
    
    $("#testBs3").bsDialog("show");
}
function testBs5Show(){
    
    $("#testBs5").bsDialog("show");
}
function testBs6Show(){
    
    $("#testBs6").bsDialog("show");
}
function testBs7Show(){
    
    $("#testBs7").bsDialog("show");
}
function testBs8Show(){
    
    $("#testBs8").bsDialog("show");
}

// ----------測試用結束-----------

function getData(areaID){
    $("#pageInsertBtn").show();

    if(areaID == undefined){
        areaID = "received-content";
    }

    if(areaID == "received-content"){
        tabCode = 1;
    }else if(areaID == "sendDoc-content"){
        tabCode = 2;
    }else{
        $("#pageInsertBtn").hide();
    }
    $("#"+areaID).find(".dataContent").remove();
    $("#"+areaID).find(".date-empty").remove();

    var sendData = {
        api: referenceAPI+"getReference",
        data:{
            
        }
    };

    $.getJSON(wrsUrl, sendData).done(function(rs){
        // console.log(rs);
        
        if(rs.status){
            putDataToPage(rs.data, $("#"+areaID));

        }else{
            putEmptyInfo($("#"+areaID));
        }
    });
}


// 放資料
function putDataToPage(data, putArea, onlyData){
    if(typeof onlyData == "undefined"){
        onlyData = false;
    }
    // console.log(data);
    // 畫面設定值
    var option = {styleKind:"received-issued",style:"reference-list"};
    // 取得畫面樣式
    getStyle(option,function(pageStyle){
        if(!onlyData){
            $.each(data, function(index,content){
                var pageStyleObj = $.parseHTML(pageStyle);
                $(pageStyleObj).addClass("dataContent");

                // 事項標題
                $(pageStyleObj).find(".list-items").eq(0).html(content.referenceNumber);

                // 類型
                // $(pageStyleObj).find(".list-items").eq(1).text(content.summary);

                // 迄日
                // $(pageStyleObj).find(".list-items").eq(2).text(content.MyKeypoint.EndDate);
                
                // 進度
                // $(pageStyleObj).find(".list-items").eq(3).text(progressStr);

                // 修改
                // $(pageStyleObj).find(".fa-pencil-square-o").click(function(){
                //     insertDialog( content, $(pageStyleObj) );
                // });

                // 完成
                $(pageStyleObj).find(".fa-check").click(function(){
                    
                    finishList(content.Uid, itemType);
                    $(this).remove();
                    $(pageStyleObj).find(".fa-pencil-square-o").remove();
                    $(pageStyleObj).find(".fa-trash-o").remove();
                });

                // 刪除
                $(pageStyleObj).find(".fa-trash-o").click(function(){
                    deleteData(content.Uid, $(this).parents(".list-items").parent());
                });
                if(content.CompletionDate){
                    $(pageStyleObj).find(".fa-pencil-square-o").remove();
                    $(pageStyleObj).find(".fa-check").remove();
                }
                
                $(pageStyleObj).appendTo(putArea);

            });
        }else{
            var pageStyleObj = $.parseHTML(pageStyle);
            $(pageStyleObj).addClass("dataContent");

            var desiStr = "個人";
            // 指派人
            var DesigneeID = data.Designee.Uid;
            // 承辦人
            var PricipalID = data.Pricipal.Uid;
            var itemType = 2;
            if(DesigneeID != PricipalID ){
                 itemType = 1;
                if(DesigneeID == userID && PricipalID != userID){
                    desiStr = "指派";
                    $(pageStyleObj).find(".fa-check").remove();
                }else{
                    desiStr = "被指";
                    $(pageStyleObj).find(".fa-trash-o").remove();
                }
            }

            var progressStr = "0%";

            if(data.CompletionDate){
                $(pageStyleObj).find(".fa-trash-o").remove();
            }
            // 事項標題可以點開觀看
            var Desc = $("<a>").prop("href","#").text(data.Desc).click(function(){
                calendarView(data, $(pageStyleObj));
                return false;
            });

            // 事項標題
            $(pageStyleObj).find(".list-items").eq(0).html(Desc);

            // 類型
            $(pageStyleObj).find(".list-items").eq(1).text(desiStr);

            // 迄日
            $(pageStyleObj).find(".list-items").eq(2).text(data.EndDate);
            
            // 進度
            $(pageStyleObj).find(".list-items").eq(3).text(progressStr);

            // 修改
            $(pageStyleObj).find(".fa-pencil-square-o").click(function(){
                insertDialog( data, $(pageStyleObj) );
            });

            // 完成
            $(pageStyleObj).find(".fa-check").click(function(){
                finishList(data.Uid, itemType);
                $(this).remove();
                $(pageStyleObj).find(".fa-pencil-square-o").remove();
                $(pageStyleObj).find(".fa-trash-o").remove();
            });

            // 刪除
            $(pageStyleObj).find(".fa-trash-o").click(function(){
                deleteData(data.Uid, $(this).parents(".list-items").parent());
            });
            if(data.CompletionDate){
                $(pageStyleObj).find(".fa-pencil-square-o").remove();
                $(pageStyleObj).find(".fa-check").remove();
            }
            
            if(putArea.find("div").length){
                putArea.find(".dataContent").eq(-1).addClass("list-items-bottom").after(pageStyleObj);
            }else{
                $(pageStyleObj).removeClass("list-items-bottom").appendTo(putArea);

            }
        }
        putArea.find(".dataContent").last().removeClass("list-items-bottom");
    });
}

// 新增類
function tabInsert(){
    if(tabCode == 1){
        // 收文
        referenceInsertDialog();
    }else if(tabCode == 2){
        insertDialog();
    }
}

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
        start: function(){
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
            $(insertPageObj).appendTo($("#insertDialog").find(".modal-body"));
            // getQCTableTypeList("tableTypeTab","tableType",true);

          });
        },
        button:[
            {
                text: saveBtn,
                className: "btn-success",
                click: function(){
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

function saveReferenceData(sendObj, modifyItem, putFormArea){
    // return
    sendObj.typeID = 1;
    sendObj.userName = userLoginInfo.userName;
    var sendData = {
        // api: docAPI+"setDocFileInsert",
        api: referenceAPI+"setReferenceInsert",
        data: sendObj
    };
    console.log(sendObj);

    $.post(wrsUrl, sendData, function(rs){
        console.log(rs);
    });
    // var options = {
    //     url: wrsAPI+"uploaderAPI",
    //     type:"POST",
    //     data: sendData,
    //     dataType:"JSON",
    //     beforesend: function(xhr){
    //         // testBs3Show(xhr);
    //     },
    //     uploadProgress: function(event, position, total, percentComplete) {
    //        console.log(event, position, total, percentComplete);

    //     },
    //     success: function(rs) {
    //        console.log(rs);
    //     },
    // };
    // $(putFormArea).ajaxSubmit(options);
}

// 儲存
function saveData(sendObj,modifyItem){

    method = "Insert_AssCommon";
    // console.log(sendData);
    // return;
    if(sendObj.userInfo.uid != undefined){
        method = "Update_AssCommon";
        modifyItem.html(name);
    }
    var sendData ={
        api: threeModelPersonAPI+method,
        threeModal: true,
        data: sendObj.userInfo
    };
    // 先新增自然人資料
    // $.post(ctrlPersonAPI + method, sendObj.userInfo, function(rs){
    $.post(wrsUrl, sendData, function(rs){
        var rs = $.parseJSON(rs);

        // console.log(rs);
        // 新增
        if(rs.Status){

            if(sendObj.userInfo.uid == undefined){
                sendObj.userInfo.uid = rs.Data;
                sendObj.census.cmid = rs.Data;
                sendObj.communication.cmid = rs.Data;
                sendObj.org.cmid = rs.Data;

                // putDataToPage(sendObj, true);
                // 地址修改ＡＰＩ
                addrMethod = "Insert_AssCommonAddress";
                acMethod = "Insert_AssUser";
            }else{
                addrMethod = "Update_AssCommonAddress";
                acMethod = "Update_AssUser";
                $(modifyItem).html(sendObj.userInfo.name);
            }

            // 之後放入地址資料
            var sendData = {
                api: "AssCommonAddress/"+addrMethod,
                threeModal: true,
                data: sendObj.census
            }
            // $.post(ctrlPersonAPI + addrMethod, sendObj.census, function(addressRs){
            $.post(wrsUrl, sendData, function(addressRs){
                var addressRs = $.parseJSON(addressRs);

                if(addressRs.Status){
                    if(addrMethod == "Insert_AssCommonAddress"){
                        sendObj.census.uid = addressRs.Data;
                    }
                    var sendData = {
                        api: "AssCommonAddress/"+addrMethod,
                        threeModal: true,
                        data: sendObj.communication
                    };
                    // $.post(ctrlPersonAPI + addrMethod, sendObj.communication, function(oRs){
                    $.post(wrsUrl, sendData, function(oRs){
                        var oRs = $.parseJSON(oRs);

                        if(oRs.Status){

                            if(addrMethod == "Insert_AssCommonAddress"){
                                sendObj.communication.uid = oRs.Data;
                            }
                            
                            
                        }
                        // 測試
                        // acMethod = "Insert_AssUser";
                        var posid = (sendObj.org.job.length)?sendObj.org.job[0]:"0";
                        var sendData = {
                            api: "AssUser/"+acMethod,
                            threeModal: true,
                            data: {
                                cmid: sendObj.org.cmid,
                                orgid: sendObj.org.org[0],
                                posid: posid,
                                uuid: userLoginUuid,
                                sid: sendObj.userInfo.sid,
                                sys_code: sys_code,
                                userID: sendObj.userInfo.userID
                            }
                        };
                        // 放入帳號設置的部分
                        $.post(wrsUrl, sendData, function(rs){
                            var rs = $.parseJSON(rs);
                            if(rs.Status){
                                sendObj.userInfo.userID = rs.Data;
                                // putDataToPage(sendObj.userInfo, true);
                            }
                        });
                    });
                }

            });
            
            
        }else{
            alert("新增失敗");
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

var sendObj = {};
// 準備簽核前的視窗，顯示與設定最後結束日期
function signInfoAndDate(){
    $("#signInfoAndDateDialog").remove();
    $("<div>").prop("id","signInfoAndDateDialog").appendTo("body");

    $("#signInfoAndDateDialog").bsDialog({
        autoShow:true,
        showFooterBtn:true,
        headerCloseBtn:false,
        // modalClass: "bsDialogWindow",
        title: "設置簽核結束日期",
        start: function(){
            var option = {
                styleKind: "received-issued",style:"undertake-dateandtype"
            }
            getStyle(option,function(pageStyle){
                var pageStyleObj = $.parseHTML(pageStyle);

                var dateOption = {
                    dateFormat: "yy-mm-dd",
                    
                    showOn: "button",
                    buttonText: '<i class="fa fa-calendar fa-lg mouse-pointer send-btn"></i>',
                    onSelect: function(dateText, inst) {
                        // end_date_content
                        $(pageStyleObj).find("#end_date_content").removeClass("item-bg-danger").text(dateText);

                    },
                    minDate: 0
                }

                $(pageStyleObj).find("#end_date").datepicker(dateOption);
                
                $(pageStyleObj).appendTo($("#signInfoAndDateDialog").find(".modal-body"));
            });
        },
        button:[
            {
                text: "匯簽",
                className: "btn-info",
                click: function(){
                    var end_date = $("#signInfoAndDateDialog").find("#end_date").val();
                    sendObj.end_date = end_date;
                    if(end_date){
                        sendObj.actionType = 0;
                        signWFSelect();
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
                        signWFSelect();
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
function signWFSelect(){
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
            signWFDialog(data);
        }else{
            errorDialog("尚未有簽核流程，請新增後再嘗試");
        }
    });
}

function signWFDialog( data ){
    // console.log(sendObj);
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
        headerCloseBtn:false,
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
                        saveSignData(sendObj);
                        // $("#signWFDialog").bsDialog("close");
                    }else{
                        
                    }
                }
            }
        ]
    });
}

function saveSignData(data){
    data["doc_uid"] = 1;
    var sendData = {
        api: apdAPI+"Insert_ApdData",
        threeModal: true,
        data:data
    }
    $.post(wrsUrl,sendData,function(rs){
        console.log(rs);
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