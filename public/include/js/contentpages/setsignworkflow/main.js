var testData = [];
var userID = userLoginInfo.userID;
var sys_code = userLoginInfo.sysCode;
var menu_code = 'eab';

$(function(){
    getWFData();
});
// 取得資料
function getWFData(){
    var sendData = {
        api: wrokflowAPI+"getWorkFlow",
        threeModal:true,
        data:{
            sys_code: sys_code,
            menu_code: menu_code,
            allData: true
        }
    }
    
    $("#wfContent").empty();

    $.getJSON(wrsUrl, sendData, function(rs){
        if(rs.status){
            var option = { styleKind: "list", style: "3grid-modify"}
            getStyle(option,function(pageStyle){
                $.each(rs.data,function(index,content){
                    var pageStyleObj = $.parseHTML(pageStyle);
                    $(pageStyleObj).addClass("dataContent");
                    $(pageStyleObj).find(".list-items").eq(0).text(content.name);
                    $(pageStyleObj).find(".list-items").eq(1).text("共"+(parseInt(content.maxLayer)+1) + "層");
                    $(pageStyleObj).find(".list-items").eq(2).text(content.userName);
                    $(pageStyleObj).appendTo($("#wfContent"));
                });
                $("#wfContent").find(".dataContent").last().removeClass("list-items-bottom");
            });
        }else{
            putEmptyInfo($("#wfContent"));
        }
    }).fail(function(){
        putEmptyInfo($("#wfContent"));
    });
}

function orgContentShow(putArea){
    $("#orgContent").remove();
    var orgContent = $("<div>").prop("id","orgContent");
    var thisContent = $("<div>").prop("id","orgChartContainer").addClass("modal-items").css("width","100%");
    var orgChar = $("<div>").prop("id","orgChart");
    orgChar.appendTo(thisContent);
    thisContent.appendTo(orgContent);
    orgContent.appendTo("body");

    $("#orgContent").bsDialog({
        autoShow:true,
        showFooterBtn:true,
        modalClass: "bsDialogWindow",
        title: "欲送達流程部門",
        start:function(){
            getOrgData();
        },
        button:[{
            text: "取消",
            // className: "btn-success",
            click: function(){
                $("#orgContent").bsDialog("close");
            }
        },{
            text: "確定",
            className: "btn-success",
            click: function(){
                if(putArea.find(".empty").length){
                    putArea.find(".empty").remove();
                }
                var selectData = orgTreeChart.getSelectData();
                // console.log(selectData);
                $.each(selectData.pageObj,function(i,v){
                    var dataStyle = $("<div>").addClass("col-xs-12 col-md-12 item-list-border contents signflowItem");
                    // var content = $("<div>").addClass("col-xs-12 col-md-12");
                    
                    var strContent = $("<div>").addClass("col-xs-11 col-md-9");
                    var trashContent = $("<div>").addClass("col-xs-1 col-md-3");
                    var idContent = $("<input>").prop("type","hidden").addClass("flowID").val(selectData.idArr[i]);
                    // <i class="fa fa-trash-o"></i>
                    strContent.text(v).appendTo(dataStyle);
                    var trash = $('<i class="fa fa-trash-o mouse-pointer cancel-btn"></i>');
                    trash.click(function(){
                        dataStyle.remove();
                        if(!putArea.find(".signflowItem").length){
                            var emptyContent = $("<div>").addClass("empty").html("階段未有資料");
                            
                            putArea.html(emptyContent);
                        }
                    });
                    trashContent.append(trash).appendTo(dataStyle);
                    idContent.appendTo(dataStyle);
                    dataStyle.appendTo(putArea);
                });
                $("#orgContent").bsDialog("close");

            }
        }
        ]
    });
}
// 新增流程
function insertDialog(){
    $("#insertDialog").remove();
    
    var thisContent = $("<div>").prop("id","insertDialog").addClass("").css("width","100%");
    
    thisContent.appendTo("body");

    $("#insertDialog").bsDialog({
        autoShow:true,
        showFooterBtn:true,
        modalClass: "bsDialogWindow",
        title: "簽核流程設定",
        start:function(){
            // getOrgData();
            // 畫面設定值
            var option = {styleKind:"setsignworkflow",style:"insert"};
            // 取得畫面樣式
            getStyle(option,function(pageStyle){
                var pageStyleObj = $.parseHTML(pageStyle);
                var flowStyle = $(pageStyleObj).find(".modal-items").html();
                $(pageStyleObj).find("#newFlow").click(function(){

                    var totalFlowLayerNumber = $(pageStyleObj).find(".modal-items").find(".flowItems").length;
                    totalFlowLayerNumber = totalFlowLayerNumber+1;

                    var flowStyleObj = $.parseHTML(flowStyle);

                    $(flowStyleObj).appendTo($(pageStyleObj).find(".modal-items"));
                    $(flowStyleObj).find(".flowName").text("階段"+totalFlowLayerNumber);
                    // 垃圾桶按鈕
                    var trash = $('<i class="fa fa-trash mouse-pointer fa-lg cancel-btn"></i>');
                    trash.click(function(){
                        $(flowStyleObj).remove();
                    });
                    $(flowStyleObj).find(".flowBtn").append(trash);
                    $(flowStyleObj).find(".flowPlusBtn").click(function(){
                        var putArea = $(this).parents(".panel-default").find(".panel-body");
                        orgContentShow(putArea);
                    });

                });
                $(pageStyleObj).find(".flowPlusBtn").click(function(){
                    var putArea = $(this).parents(".panel-default").find(".panel-body");
                    orgContentShow(putArea);
                });
                $(pageStyleObj).appendTo($("#insertDialog").find(".modal-body"));
            });
        },
        button:[{
            text: "取消",
            // className: "btn-success",
            click: function(){
                $("#insertDialog").bsDialog("close");
            }
        },{
            text: "確定",
            className: "btn-success",
            click: function(){
                // $("#orgContent").bsDialog("close");
                // orgTreeChart.getSelectData();
                var layerObj = {};
                $("#insertDialog").find(".flowItems").each(function(index){
                    console.log(index);
                    var idStr = "";
                    $(this).find(".signflowItem").each(function(){
                        var selectVale = $(this).find(".flowID").val();
                        idStr += selectVale+",";
                    });
                    if(idStr.length){
                        idStr = idStr.substring( 0 ,idStr.length-1);
                    }
                    layerObj[index] = idStr;
                });
                var data = {};
                data.layer = layerObj;
                data.title = $("#insertDialog").find(".list-items").find("input:text").val();
                data.menuCode = "eab";
                data.sysCode = sys_code;
                data.user = userID;
                saveData(data);
                console.log(data);
            }
        }
        ]
    });
}

// 取得組織資料
function getOrgData(){
    loader($("#orgChart"));
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
            addDialog("",0);
        }
		// console.log(rs);
	});
}

function saveData(data,uid){
    processAPI = "insertWorkFlow";
    // 修改
    if(uid != undefined){
        processAPI = "modify";
    }
    var sendData = {
        api: wrokflowAPI+processAPI,
        threeModal: true,
        data:data
    }
    $.post(wrsUrl,sendData,function(rs){
        console.log(rs);
    });
}

// 創建組織樹狀圖
function createTree(){
    orgTreeChart = $('#orgChart').orgChart({
        data: testData,
        showControls: false,
        allowEdit: false,
        newNodeText:"組織",
        selectModal: true,
        selectOnly: false,
        rootSelect: false,
        onAddNode: function(node){  
            var parentID = node.data.id;
            // addDialog(orgTreeChart, parentID);
        },
        onDeleteNode: function(node){
            deleteNode(node.data.id);
            orgTreeChart.deleteNode(node.data.id); 
        },
        onClickNode: function(node){
            // log('Clicked node '+node.data.id);
            // jobRankTreeDialog(orgTreeChart, node.data);
            console.log(node.data);
        }
    });
}

// 取得組織資料
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
        // console.log(rs);
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

// 新增
function addDialog(orgTreeChart, parentID){
    $("#addDialog").remove();

    var addDialog = $("<div>").prop("id","addDialog");

    $("<div>").addClass("contents").appendTo(addDialog);
    addDialog.appendTo("body");

    var headerCloseBtn = true;

    if(orgTreeChart == ""){
        headerCloseBtn = false;
        $("#orgChart").empty();
    }

    $("#addDialog").bsDialog({
        autoShow:true,
        headerCloseBtn: headerCloseBtn,
        title: "組織單位選單",
        start: function(){
            loader( $("#addDialog").find(".contents") );
            // 取得組織資料
            $.getJSON(ctrlAdminAPI + "GetData_AssTypeOffice").done(function(rs){
                $("#addDialog").find(".contents").empty();
                // console.log(rs);
                if(rs.Status){
                    createOtgList(parentID, orgTreeChart, rs.Data, false);
                }
            });
        },
        showFooterBtn:false,
    });
}

// 職級樹狀列表
function jobRankTreeDialog(orgTreeChart, nodeData){
    // console.log(nodeData);
    $("#jobRankTreeDialog").remove();

    var jobRankTreeDialog = $("<div>").prop("id","jobRankTreeDialog");

    $("<div>").addClass("contents").appendTo(jobRankTreeDialog);
    jobRankTreeDialog.appendTo("body");

    var headerCloseBtn = true;

    if(orgTreeChart == ""){
        headerCloseBtn = false;
        $("#orgChart").empty();
    }

    $("#jobRankTreeDialog").bsDialog({
        autoShow:true,
        headerCloseBtn: headerCloseBtn,
        title: nodeData.name + " 職務架構圖",
        modalClass: "bsDialogWindow",
        start: function(){
            loader( $("#jobRankTreeDialog").find(".contents") );
            getJobRank( $("#jobRankTreeDialog").find(".contents"), nodeData.listID );
            // console.log(nodeData);
            // 取得組織資料
            // $.getJSON(ctrlAdminAPI + "GetData_AssTypeOffice").done(function(rs){
            //     $("#addJobRankDialog").find(".contents").empty();
            //     // console.log(rs);
            //     if(rs.Status){
            //         createOtgList(parentID, orgTreeChart, rs.Data,false);
            //     }
            // });
        },
        showFooterBtn:false,
    });
}

function createOtgList(parentID, orgTreeChart,data,isEmpty){

    if(isEmpty == undefined){
        isEmpty = false;
    }

    if(!isEmpty){
        var option = {styleKind:"list",style:"1grid-add"};
        // 取得選單樣式
        getStyle(option,function(insertPage){

            $.each(data, function(index, content){
                // 轉物件
                var insertPageObj = $.parseHTML(insertPage);
                $(insertPageObj).find(".list-items").eq(0).html(content.name);
                // 新增按鈕事件
                $(insertPageObj).find(".fa-plus-square-o").click(function(){
                    // 創建組織資料與節點
                    creatOrgData(orgTreeChart, content, parentID);
                   // console.log();
                });
                $(insertPageObj).appendTo( $("#addDialog").find(".modal-body").find(".contents") );
                // 找最後一項去除底線
                $("#addDialog").find(".modal-body")
                .find(".contents")
                .find(".list-items-bottom").last()
                .removeClass("list-items-bottom");

                // $("#addDialog").bsDialog("show");
            });

        });
    }else{
        var option = {styleKind:"system",style:"data-empty"};
        // 取得選單樣式
        getStyle(option,function(emptyStyle){
            $("#addDialog").find(".modal-body").find(".contents").html(insertPageObj);
        });
    }
}

function creatOrgData(orgTreeChart,contentObj,parentID){
    // console.log(contentObj);
    var sendObj = {
      "officeid": contentObj.uid,
      "faid": parentID,
      "suid": 1
    };
    // return;
    // console.log(sendObj);
    $.post(ctrlAdminAPI + "Insert_AssOrg",sendObj).done(function(rs){
        console.log(rs);
        if(rs.Status){
            if(orgTreeChart != ""){
                // 新增
                // newNode : parentId,name,childID
                console.log(parentID, contentObj.name, rs.Data);
                orgTreeChart.newNode( parentID, contentObj.name, rs.Data, contentObj.uid );
            }else{
                // ROOT
                createTreeData(rs.Data, contentObj.name, parentID, contentObj.officeid);
                createTree();
            }
            // 關閉
            $("#addDialog").bsDialog("close");

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

function deleteNode(uid){
    var sendObj = {
        apiMethod: ctrlAdminDelAPI+"Delete_AssOrg",
        deleteObj:{
            iUid: uid
        }
    }
    // console.log(uid);
    $.post(configObject.deleteAPI , sendObj).done(function(rs){
        console.log(rs);
    });
}

// just for example purpose
