var testData = [];
// ----------測試用---------------
$(function(){
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
    $("#testBs8").bsDialog({
        autoShow:false,
        showFooterBtn:true,
        modalClass: "bsDialogWindow",
        title: "請選擇會簽部門",
        button:[{
            text: "取消",
            // className: "btn-success",
            click: function(){
                // xhr.abort();
                // $(formObj).ajaxFormUnbind();
                $("#testBs8").bsDialog("close");
            }
        },{
            text: "確定",
            className: "btn-success",
            click: function(){
                // xhr.abort();
                // $(formObj).ajaxFormUnbind();
                $("#testBs8").bsDialog("close");
            }
        }
        ]
    });
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
function fileSelect(){
    var fileInput = $("<input>").prop("type","file").prop("name","files[]").prop("multiple",true).change(function(){
        // console.log($(this).prop("files"));
        var names = $.map($(this).prop("files"), function(val) { 
            // return val.name; 
            var infoDiv = $("<div>").addClass("col-xs-12 col-md-12").html(val.name);
            $("#isSelectFile").find(".control-label").eq(1).append(infoDiv);
        });

        // console.log(names);
        $(this).appendTo(formObj);
        // console.log(formObj);
        $("#isSelectFile").show();
    });
    fileInput.click();
}
// ----------測試用結束-----------

function getOrgData(){
    loader($("#orgChart"));
	$.getJSON(ctrlAdminAPI + "GetData_AssOrg",{iSu_Id: 1},function(rs){
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
