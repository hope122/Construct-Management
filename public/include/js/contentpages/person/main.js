var sys_code = userLoginInfo.sysCode;
var testData = [];
var userLoginUuid = userLoginInfo.uuid;
var orgTreeChart;
var jobTreeChart;
var jobData = [];
$(function(){
    getOUData();
});
// 取得資料
function getOUData(uid){
    // var sendData = {}
    var sendData = {
        api: "AssCommon/GetData_AssCommon",
        threeModal: true,
        data:{
            "sys_code": sys_code
        }
    };
    if(uid != undefined){
        sendData.data.iUid = uid;
    }
    loader($("#grid"));
    // ＡＰＩ呼叫
    // $.getJSON(ctrlPersonAPI + "GetData_AssCommon", sendData ).done(function(rs){
    $.getJSON(wrsUrl, sendData ).done(function(rs){
        $("#grid").empty();
        if(rs.Status){
            if(uid == undefined){
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
        $("#grid").empty();
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

function getAddrInfo(uid){
     // 取地址資料
    var sendData = {
        api: "AssCommonAddress/GetData_AssCommonAddress",
        threeModal: true,
        data:{
            iCmid: uid, 
            iAddr_type: -1
        }
    }
    // $.getJSON(ctrlPersonAPI + "GetData_AssCommonAddress", {iCmid: uid, iAddr_type: -1} ).done(function(rs){
    $.getJSON(wrsUrl, sendData ).done(function(rs){
        $.each(rs.Data,function(index, content){
            $.each(content, function(cIndex, value){
                if(content.addr_type == 0){
                    $("#insertDialog").find("#census-content").find("#"+cIndex).val(value);   
                }else{
                    $("#insertDialog").find("#communication-content").find("#"+cIndex).val(value);   
                }
            });
            
        });
    });
}

function getOrgInfo(uid){
     // 先取得使用者資料
    var sendData = {
        api: "AssUser/GetData_AssUser",
        threeModal:true,
        data:{
            sys_code: sys_code,
            iUid: uid
        }
    }
     
    $.getJSON(wrsUrl, sendData ).done(function(rs){
        // 取得部門資料
        var orgid = rs.Data[0].orgid;
        var jobid = rs.Data[0].posid;
        var sendData = {
            api: "AssOrg/GetData_AssOrg",
            threeModal:true,
            data:{
                sys_code: sys_code,
                iUid: orgid
            }
        };
        if(orgid){
            $.getJSON(wrsUrl, sendData ).done(function(rs){
                if(jobid){
                    var iOfid = rs.Data[0].officeid;

                    // 取得職務資料
                    var sendData = {
                        api: "AssPosition/GetData_AssPosition",
                        threeModal:true,
                        data:{
                            sys_code: sys_code,
                            iOfid: iOfid,
                            iUid: jobid
                        }
                    }
                    $.getJSON(wrsUrl, sendData ).done(function(jobRs){
                        if(jobRs.Status){
                            putOrgInfo( $("#insertDialog").find("#orgInfo"), $("#insertDialog").find("#orgJobInfo"), rs.Data[0], jobRs.Data[0]);
                        }else{
                            putOrgInfo( $("#insertDialog").find("#orgInfo"), $("#insertDialog").find("#orgJobInfo"), rs.Data[0], null);
                        }
                    });
                }else{
                    putOrgInfo( $("#insertDialog").find("#orgInfo"), $("#insertDialog").find("#orgJobInfo"), rs.Data[0], null);

                }
            });
        }
    });
}

// 放資料
function putDataToPage(data, onlyData){
    if(typeof onlyData == "undefined"){
        onlyData = false;
    }
    // console.log(data);
    // 畫面設定值
    var option = {styleKind:"list",style:"1grid-modify"};
    // 取得畫面樣式
    getStyle(option,function(pageStyle){
        if(!onlyData){
            $.each(data,function(index,content){
                var pageStyleObj = $.parseHTML(pageStyle);
                $(pageStyleObj).addClass("dataContent");
                var firstItem = $(pageStyleObj).find(".list-items").eq(0);
                firstItem.html(content.name);
                // 修改
                $(pageStyleObj).find(".fa-pencil-square-o").click(function(){
                    // 取地址資料
                    insertDialog(content, firstItem);
                    getAddrInfo(content.uid);
                    getOrgInfo(content.userID);
                });

                // 刪除
                $(pageStyleObj).find(".fa-trash-o").click(function(){
                    deleteData(content.uid, $(this).parents(".list-items").parent(), content.name);
                });

                $(pageStyleObj).appendTo($("#grid"));

            });
        }else{
            var pageStyleObj = $.parseHTML(pageStyle);
            $(pageStyleObj).addClass("dataContent");
            var firstItem = $(pageStyleObj).find(".list-items").eq(0);
            firstItem.html(data.name);

            // 修改
            $(pageStyleObj).find(".fa-pencil-square-o").click(function(){
                insertDialog(data, firstItem);
                getAddrInfo(data.uid);
                getOrgInfo(data.userID);
            });

            // 刪除
            $(pageStyleObj).find(".fa-trash-o").click(function(){
                deleteData(data.uid, $(this).parents(".list-items").parent(), data.name);
            });

            if($("#grid").find("div").length){
                $("#grid").find(".dataContent").eq(-1).addClass("list-items-bottom").after(pageStyleObj);
            }else{
                $(pageStyleObj).removeClass("list-items-bottom").appendTo("#grid");

            }
        }
        $("#grid").find(".list-items-bottom").last().removeClass("list-items-bottom");
    });
}

// 新增&修改Dialog
function insertDialog(modifyObj, modifyItem){
    console.log(modifyObj, modifyItem);
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
        autoShow: true,
        start: function(){
          var option = {styleKind:"person",style:"in_mo"};
          getStyle(option,function(insertPage){
            var insertPageObj = $.parseHTML(insertPage);
            // 點選部門按鈕，可設置
            $(insertPageObj).find(".fa-sitemap").click(function(){
                orgChartDialog( $(insertPageObj).find("#orgInfo"), $(insertPageObj).find("#orgJobInfo"));
            });

            var date = new Date();
            var nowYear = date.getFullYear();
            var dateOption = {
                dateFormat: "yy-mm-dd",
                
                showOn: "button",
                buttonText: '<i class="fa fa-calendar fa-lg mouse-pointer send-btn"></i>',
                onSelect: function(dateText, inst) {
                    // end_date_content
                    $(insertPageObj).find("#birthday_content").removeClass("item-bg-danger").text(dateText);

                },
                maxDate: 0,
                changeYear: true,
                yearRange: '1950:'+nowYear
            }

            $(insertPageObj).find("#birthday").datepicker(dateOption);

            // 身分證檢查
            $(insertPageObj).find("#sid").keyup(function(){
                var typeVal = $(this).val().toUpperCase();
                if(!checkSid(typeVal)){
                    $(this).removeClass("item-bg-danger").addClass("item-bg-danger");
                }else{
                    $(this).removeClass("item-bg-danger");
                }
                $(this).val(typeVal);
            });

            // 性別按下後去除紅色筐
            $(insertPageObj).find("#sexBtn label").click(function(){
                $(insertPageObj).find("#sexContent").removeClass("item-bg-danger").empty();
            });

            // 戶籍地點選亦同按鈕
            $(insertPageObj).find("#census-same").click(function(){
                var isCheck = $(this).prop("class").search("fa-check-square-o");
                if(isCheck == -1){
                    $(this).removeClass("fa-square-o").addClass("fa-check-square-o");
                    $(insertPageObj).find("#census-content input:text").each(function(){
                        var id = $(this).prop("id");
                        var value = $(this).val();
                        $(insertPageObj).find("#communication-content").find("#"+id).val(value);
                    });
                }else{
                    $(this).removeClass("fa-check-square-o").addClass("fa-square-o");
                }
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

                    var isEmpty = false;
                    $.each(userInfo, function(i, v){
                        if(i != "birthday" && i != "sex"){
                            if(!$.trim(v)){
                                $("#insertDialog").find("#"+i).addClass("item-bg-danger");
                                isEmpty = true;
                            }
                        }else{
                            if(i == "birthday"){
                                if(!$.trim(v)){
                                    $("#insertDialog").find("#birthday_content").text("尚未選擇生日").addClass("item-bg-danger");
                                    isEmpty = true;
                                }
                            }else if(i == "sex"){
                                if(v != "0" && v != "1"){
                                    $("#insertDialog").find("#sexContent").text("尚未選擇性別").addClass("item-bg-danger");
                                    isEmpty = true;
                                }
                            }
                        }
                    });
                    if(!isEmpty){
                        if(!sendObj.org.org.length){
                            isEmpty = true;
                            $("#accountInfo").click();
                            // alert("帳號設定 > 尚未選擇部門");
                            var emptySelect = $("<div>").addClass("item-bg-danger emptySelect").text("尚未選擇部門");
                            $("#insertDialog").find("#orgInfo").append(emptySelect);
                        }
                    }
                    // return;
                    if(!isEmpty && modifyObj == undefined && checkSid(userInfo.sid)){
                        saveData(sendObj, modifyItem);
                        $("#insertDialog").bsDialog("close");
                    }else if(!isEmpty && modifyObj != undefined){
                        saveData(sendObj, modifyItem);
                        $("#insertDialog").bsDialog("close");
                    }
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
function saveData(sendObj,modifyItem){
    sendObj.uuid = userLoginUuid;
    sendObj.sys_code = sys_code;
    var method = "Insert_AssUserComplex";
    if(sendObj.userInfo.uid != undefined){
        method = "Update_AssUserComplex";
        modifyItem.html(sendObj.userInfo.name);
    }
    $.post(wrsAPI+"userRegisteredAPI/"+method, sendObj, function(rs){
        var rs = $.parseJSON(rs);
        if(rs.Status){
            if(sendObj.userInfo.uid == undefined){
                sendObj.userInfo.userID = rs.userID;
                sendObj.userInfo.uid = rs.cmid;
                putDataToPage(sendObj.userInfo, true);
            }
            // getOUData();
        }
    });
}

// 刪除
function deleteData(uid, removeItem, name){
    // var sendData = {
    //     apiMethod: ctrlPersonDelAPI + "Delete_AssCommon",
    //     data:{
    //         iUid: uid
    //     }
    // };
    var sendData = {
        api: threeModelPersonDelAPI,
        threeModal: true,
        data:{
            iUid: uid
        }
    };
    
    
    // console.log(sendData);
    // return;
    $.ajax({
        url: wrsUrl,
        type:"DELETE",
        data: sendData,
        dataType: "json",
        success:function(rs){
            // console.log(rs);
            if(!rs.Status){
                // 無法刪除
                couldNotDeleteDialog(name);
            }else{
                removeItem.remove();
                if(!$("#grid").find(".dataContent").length){
                    var option = {styleKind:"system",style:"data-empty"};
                    getStyle(option,function(pageStyle){
                        $("#grid").html(pageStyle);
                    });
                }else{
                    $("#grid").find(".dataContent").last().removeClass("list-items-bottom");
                }
            }
        },
        error:function(rs){
            couldNotDeleteDialog(name);
        }
    });
    // $.post(wrsUrl,sendData,function(rs){
    //     rs = $.parseJSON(rs);
    //     if(!rs.Status){
    //         // 無法刪除
    //         couldNotDeleteDialog(name);
    //     }else{
    //         removeItem.remove();
    //     }
    // });
}

// 當無法刪除時，提供說明
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

// 取得設定的部門資料
function getOrgVal(){
    userOrg = {};
    var orgArr = [];
    $("#insertDialog").find("#accountInfo-content").find(".org").each(function(){
        orgArr.push( $(this).val() );
    });
    var orgJobArr = [];

    // 取得設定的職務資料
    $("#insertDialog").find("#accountInfo-content").find(".jobItemContent").each(function(){
        orgJobArr.push( $(this).val() );
    });
    userOrg.org = orgArr;
    userOrg.job = orgJobArr;
    return userOrg;
}



// 取得部門資訊
function getOrgData(){
    loader( $("#orgChart") );
    // var sendData = {
    //     // api: ctrlAdminAPI,
    //     api: "AssOrg/GetData_AssOrg"
    //     data:{
    //         iSu_Id: 1
    //     }
    // }
    var sendData = {
        api: "AssOrg/GetData_AssOrg",
        threeModal:true,
        data:{
            sys_code: sys_code,
        }
    }; 
    $.getJSON(wrsUrl,sendData,function(rs){
        // console.log(rs);
        $("#orgChart").empty();
        //有資料
        if(rs.Status){
            $.each(rs.Data, function(index, content){
                createTreeData(content.uid,content.name,content.faid, content.officeid);
            });
            createTree();
        }else{ //沒有資料
            var text = $("<div>").addClass("col-xs-12 col-md-12 isOrgEmpty").text("未有組織架構");
            $("<div>").addClass("text-center").append(text).appendTo($("#orgChart"));
        }
    });
}

// 創建組織樹的資訊
function createTreeData(ID,Name,parentID,officeID){
    // console.log(ID,Name,parentID);
    var treeObj = {
        id: ID,
        name: Name,
        parent: parentID,
        listID: officeID
    };
    testData.push(treeObj);
}

// 創建組織樹狀圖
function createTree(){
    orgTreeChart = $('#orgChart').orgChart({
        data: testData,
        showControls: false,
        allowEdit: false,
        newNodeText:"組織",
        selectModal: true,
        selectOnly: true,
        rootSelect: false,
        onClickNode: function(node){
            // log('Clicked node '+node.data.id);
            // jobRankTreeDialog(orgTreeChart, node.data);
            // console.log(node.data);
        }
    });
}

// 創建職務
function getJobRank( putArea, orgID ){
    jobTreeChart = null;
    jobData = [];
    
    // var sendData = {
    //     api: ctrlAdminJobAPI,
    //     data:{
    //         iSu_Id: 1,
    //         iOfid: orgID
    //     }
    // }
    var sendData = {
        api: threeModelJobAPI,
        threeModal:true,
        data:{
            sys_code: sys_code,
            iOfid: orgID
        }
    }; 
    $.getJSON(wrsUrl,sendData,function(rs){
        putArea.empty();
        console.log(rs);
        if(rs.Status){
            // 顯示職務架構圖
            $.each(rs.Data,function(index, content){
                createJobTreeData( content.uid, content.name, content.faid );
            });
            createJobRankTree(putArea,orgID);
            // createOtgList(parentID, jobTreeChart, rs.Data,false);
        }else{ // 空的代表還未新增
            // 顯示新增ROOT按鈕
            var text = $("<div>").addClass("col-xs-12 col-md-12 isJobEmpty").text("未有對應職務");
            $("<div>").addClass("text-center").append(text).appendTo(putArea);
        }
    });
}


// 創建組織樹狀圖
function createJobRankTree(putArea, orgID){
    // console.log(jobData);
    jobTreeChart = putArea.orgChart({
        data: jobData,
        showControls: false,
        allowEdit: false,
        newNodeText:"職務",
        selectModal: true,
        selectOnly: true,
        rootSelect: false,
        onClickNode: function(node){
            // log('Clicked node '+node.data.id);
            // jobRankTreeDialog(jobTreeChart, node.data);
            // console.log(node);
        }
    });
}

// 創建組織樹的資訊
function createJobTreeData(ID, Name,parentID){

    // console.log(ID,Name,parentID);
    var treeObj = {
        id: ID,
        name: Name,
        parent: parentID
    };
    jobData.push(treeObj);
}

// 組織架構圖
function orgChartDialog(putArea, jobPutArea){
    $("#orgChartDialog").remove();
    $("<div>").prop("id","orgChartDialog").appendTo("body");

    $("#orgChartDialog").bsDialog({
        title:"組織架構圖",
        autoShow:true,
        start: function(){
            var orgChartDiv = $("<div>").prop("id", "orgChart").addClass("modal-items");
            $("#orgChartDialog").find(".modal-body").append(orgChartDiv);
            getOrgData();
        },
        button:[
            {
                text: "取消",
                click: function(){
                    $("#orgChartDialog").bsDialog("close");
                }
            },
            {
                text: "確認",
                className: "btn-success",
                click: function(){
                    if(!$("#orgChartDialog").find(".isOrgEmpty").length){
                        var selectData = orgTreeChart.getSelectData();
                        if(selectData.pageObj.length){
                            // 目前先以單人單部門做為設計
                            $("#insertDialog").find("#orgInfo").empty();
                            $("#insertDialog").find("#orgJobInfo").empty();

                            $.each(selectData.pageObj,function(i,v){
                                var content = $("<div>").addClass("col-xs-12 col-md-12 orgItem item-border item-border-radius list-items");
                                var text = $("<div>").addClass("col-xs-12 col-md-9");
                                var btnContent = $("<div>").addClass("col-xs-12 col-md-3");
                                var btn = $('<i>').addClass("fa fa-trash-o fa-lg mouse-pointer cancel-btn");
                                var setOrgVal = $("<input>").prop("type","hidden").addClass("org").val(selectData.obj[i]["id"]);

                                var jobContent = $("<div>").addClass("col-xs-12 col-md-12 orgItem item-border item-border-radius list-items");
                                var jobText = $("<div>").addClass("col-xs-12 col-md-9");
                                var jobSetBtn = $("<i>").addClass("fa fa-briefcase fa-lg mouse-pointer send-btn");
                                var jobBtnContent = $("<div>").addClass("col-xs-12 col-md-3");
                                // 部門設置
                                btn.click(function(){
                                    $(content).remove();
                                    $(jobContent).remove();
                                });
                                // 職務設定
                                jobSetBtn.click(function(){
                                    // jobPutArea
                                    jobOrgChartDialog(jobContent, selectData.obj[i]["listID"]);
                                });
                                text.text(v).appendTo(content);
                                jobText.text(v).appendTo(jobContent);

                                btnContent.append(btn).appendTo(content);
                                setOrgVal.appendTo(content);
                                jobBtnContent.append(jobSetBtn).appendTo(jobContent);


                                content.appendTo(putArea);
                                jobContent.appendTo(jobPutArea);
                            });
                            $("#orgChartDialog").bsDialog("close");
                        }
                    }else{
                        $("#orgChartDialog").bsDialog("close");
                    }
                    console.log(selectData);
                }
            }
        ]
    });
}

function jobOrgChartDialog(jobPutArea, orgID){
                                console.log(orgID);

    $("#jobOrgChartDialog").remove();
    $("<div>").prop("id","jobOrgChartDialog").appendTo("body");

    $("#jobOrgChartDialog").bsDialog({
        title:"職務架構圖",
        autoShow:true,
        start: function(){
            var orgChartDiv = $("<div>").prop("id", "orgJobChart").addClass("modal-items");
            $("#jobOrgChartDialog").find(".modal-body").append(orgChartDiv);
            getJobRank(orgChartDiv, orgID);
        },
        button:[
            {
                text: "取消",
                click: function(){
                    $("#jobOrgChartDialog").bsDialog("close");
                }
            },
            {
                text: "確認",
                className: "btn-success",
                click: function(){
                    if(!$("#jobOrgChartDialog").find(".isJobEmpty").length){
                        var selectData = jobTreeChart.getSelectData();
                        jobPutArea.find(".jobItem").remove();
                        if(selectData.pageObj.length){
                            // 職務設置
                            var jobContent = $("<div>").addClass("col-xs-12 col-md-12 jobItem");
                            var text = $("<div>").addClass("col-xs-12 col-md-9");
                            var btnContent = $("<div>").addClass("col-xs-12 col-md-3");
                            var btn = $('<i>').addClass("fa fa-trash-o fa-lg mouse-pointer cancel-btn");
                            var setOrgJobVal = $("<input>").prop("type","hidden").addClass("jobItemContent").val(selectData.idStr);
                            btn.click(function(){
                                jobContent.remove();
                            });
                            text.text(selectData.pageObj[0]).appendTo(jobContent);
                            btnContent.append(btn).appendTo(jobContent);
                            setOrgJobVal.appendTo(jobContent);
                            jobContent.appendTo(jobPutArea);
                            $("#jobOrgChartDialog").bsDialog("close");
                        }
                        // console.log(selectData);
                    }else{
                        $("#jobOrgChartDialog").bsDialog("close");
                    }
                }
            }
        ]
    });
}

function putOrgInfo(putArea,jobPutArea, orgObj, jobObj){
    // console.log(jobObj);
    var orgID = orgObj.uid,
    listID = orgObj.officeid;

    var content = $("<div>").addClass("col-xs-12 col-md-12 orgItem item-border item-border-radius list-items");
    var text = $("<div>").addClass("col-xs-12 col-md-9");
    var btnContent = $("<div>").addClass("col-xs-12 col-md-3");
    var btn = $('<i>').addClass("fa fa-trash-o fa-lg mouse-pointer cancel-btn");
    var setOrgVal = $("<input>").prop("type","hidden").addClass("org").val(orgID);

    var jobContent = $("<div>").addClass("col-xs-12 col-md-12 orgItem item-border item-border-radius list-items");
    var jobText = $("<div>").addClass("col-xs-12 col-md-9");
    var jobSetBtn = $("<i>").addClass("fa fa-briefcase fa-lg mouse-pointer send-btn");
    var jobBtnContent = $("<div>").addClass("col-xs-12 col-md-3");
    // 部門設置
    btn.click(function(){
        $(content).remove();
        $(jobContent).remove();
    });
    // 職務設定
    jobSetBtn.click(function(){
        // jobPutArea
        jobOrgChartDialog(jobContent, listID);
    });
    text.text(orgObj.name).appendTo(content);
    jobText.text(orgObj.name).appendTo(jobContent);

    btnContent.append(btn).appendTo(content);
    setOrgVal.appendTo(content);
    jobBtnContent.append(jobSetBtn).appendTo(jobContent);

    content.appendTo(putArea);
    jobContent.appendTo(jobPutArea);
    if(jobObj != null){
        putJobInfo(jobContent, jobObj);
    }
}

function putJobInfo(jobPutArea, jobObj){
    var jobID = jobObj.uid;
    // 職務設置
    var jobContent = $("<div>").addClass("col-xs-12 col-md-12 jobItem");
    var text = $("<div>").addClass("col-xs-12 col-md-9");
    var btnContent = $("<div>").addClass("col-xs-12 col-md-3");
    var btn = $('<i>').addClass("fa fa-trash-o fa-lg mouse-pointer cancel-btn");
    var setOrgJobVal = $("<input>").prop("type","hidden").addClass("jobItemContent").val(jobID);
    btn.click(function(){
        jobContent.remove();
    });
    text.text(jobObj.name).appendTo(jobContent);
    btnContent.append(btn).appendTo(jobContent);
    setOrgJobVal.appendTo(jobContent);
    jobContent.appendTo(jobPutArea);
    
}

function checkSid(value){
    var arr = value.split("");
    var letters = /^[A-Z]+$/;
    if(arr.length){
        if(!arr[0].match(letters)){
            return false;
        }
        var changeObj = {
            "A": 10,"B": 11,"C": 12,"D": 13,"E": 14,"F": 15,"G": 16,"H": 17,"I": 34,"J": 18,"K": 19,"L": 20,"M": 21,
            "N": 22,"O": 35,"P": 23,"Q": 24,"R": 25,"S": 26,"T": 27,"U": 28,"V": 29,"W": 32,"X": 30,"Y": 31,"Z": 33
        };
        var processNumber = {
            "1": 8, "2": 7, "3": 6, "4": 5, "5": 4, "6":3, "7":2, "8": 1, "9": 1
        }
        var count = 0;
        $.each(arr, function(i,v){
            if(i>0){
                count += v * processNumber[i];
            }else{
                var tmpStr = changeObj[v].toString();
                var tmpArr = tmpStr.split("");
                count += parseInt(tmpArr[0]);
                count += parseInt(tmpArr[1]) * 9;
            }
        });
        if(count % 10 != 0 || arr.length < 10){
            return false;
        }else{
            return true;
        }
    }
}