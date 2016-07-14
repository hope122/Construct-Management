var testData = [];
var sys_code = userLoginInfo.sysCode;
var orgTreeChart;
$(function(){
    getOrgData();
});

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

// 創建組織樹狀圖
function createTree(){
    orgTreeChart = $('#orgChart').orgChart({
        data: testData,
        showControls: true,
        allowEdit: false,
        newNodeText:"組織",
        onAddNode: function(node){  
            var parentID = node.data.id;
            addDialog(orgTreeChart, parentID);
        },
        onDeleteNode: function(node){
            deleteNode(node.data.id);
            orgTreeChart.deleteNode(node.data.id); 
        },
        onClickNode: function(node){
            // log('Clicked node '+node.data.id);
            jobRankTreeDialog(orgTreeChart, node.data);
            // console.log(node.data);
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
    var sendObj = {
        api: "AssTypeOffice/GetData_AssTypeOffice",
        threeModal:true,
        data:{
            sys_code: sys_code,
        }
    };
    $.getJSON(wrsUrl, sendObj).done(function(rs){
        // console.log(rs);
        if(rs.Status){
            $("#addDialog").bsDialog({
                autoShow:true,
                headerCloseBtn: headerCloseBtn,
                title: "組織單位選單",
                showFooterBtn:false,
                start: function(){
                    loader( $("#addDialog").find(".contents") );
                    $("#addDialog").find(".contents").empty();
                    createOtgList(parentID, orgTreeChart, rs.Data, false);
                },
            });
        }else{
            $("#addDialog").remove();
            errorDialog("未有組織單位，按下關閉後開始新增", function(){
                loadPage("org-unit/org-list","pagescontent")
            });
            // loadPage("org-unit/org-list","pagescontent");
        }
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
    var sendObj = {
      "officeid": contentObj.uid,
      "faid": parentID,
      "sys_code": sys_code,
    };

    var sendData = {
        api: "AssOrg/Insert_AssOrg",
        threeModal:true,
        data:sendObj
    }; 

    $.post(wrsUrl,sendData,function(rs){
        rs = $.parseJSON(rs);
        if(rs.Status){
            if(orgTreeChart != ""){
                // 新增
                // newNode : parentId,name,childID
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

    var sendData = {
        api: "AssOrg/Delete_AssOrg",
        threeModal:true,
        data:{
            iUid: uid
        }
    }; 
    $.ajax({
        url: wrsUrl,
        type: "DELETE",
        data: sendData,
        success: function(rs){
            // console.log(rs);
        }
    });
}

// 錯誤提示
function errorDialog(msg, closeCallBack){
    if($("#errorDialog").length){
        $("#errorDialog").remove();
        $("body").find(".modal-backdrop.fade.in").last().remove();
    }
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
                if(closeCallBack != undefined){
                    closeCallBack();
                }
            }
        }
        ]
    });
}
