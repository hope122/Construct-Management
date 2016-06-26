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
                    
                    // return;

                    saveData(sendObj, modifyItem);
                    // console.log(sendObj);
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