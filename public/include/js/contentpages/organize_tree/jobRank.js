var jobTreeChart;
var jobData = [];
function getJobRank( putArea, orgID ){
    // console.log(orgID);
	jobTreeChart = null;
	jobData = [];

    var sendData = {
        api: "AssPosition/GetData_AssPosition",
        threeModal:true,
        data:{
            sys_code: sys_code,
            iOfid: orgID
        }
    }; 

    $.getJSON(wrsUrl,sendData,function(rs){
	    putArea.empty();
	    // console.log(rs);
	    if(rs.Status){
	    	// 顯示職務架構圖
            $.each(rs.Data,function(index, content){
                createJobTreeData( content.uid, content.name, content.faid );
            });
	    	createJobRankTree(putArea,orgID);
	        // createOtgList(parentID, jobTreeChart, rs.Data,false);
	    }else{ // 空的代表還未新增
	    	// 顯示新增ROOT按鈕
	    	var btn = $("<i>").addClass("fa fa-plus-square-o fa-2x send-btn mouse-pointer");
	    	btn.click(function(){
	    		addJobRank(putArea, orgID, jobTreeChart);
	    	});
	    	$("<div>").addClass("text-center").append(btn).appendTo(putArea);
	    }
	});
}

function addJobRank(putArea, orgID, jobTreeChart, parentID){
	if(parentID == undefined){
		parentID = 0;
	}
	$("#addJobRank").remove();

    var addJobRank = $("<div>").prop("id","addJobRank");

    $("<div>").addClass("contents").appendTo(addJobRank);
    addJobRank.appendTo("body");

    $("#addJobRank").bsDialog({
        autoShow:true,
        title: "職務選單",
        start: function(){
            loader( $("#addJobRank").find(".contents") );
            // 取得職務資料
            // $.getJSON(ctrlAdminAPI + "GetData_AssTypePosition",{}).done(function(rs){
            var sendData = {
                api: "AssTypePosition/GetData_AssTypePosition",
                threeModal:true,
                data:{
                    sys_code: sys_code,
                }
            }; 

            $.getJSON(wrsUrl,sendData,function(rs){
                $("#addJobRank").find(".contents").empty();
                // console.log(rs);
                if(rs.Status){
                    createJobList(putArea, parentID, jobTreeChart, rs.Data, orgID, false);
                }else{
                    var option = {styleKind:"system",style:"data-empty"};
                    // 取得選單樣式
                    getStyle(option,function(emptyStyle){
                        $("#addJobRank").find(".modal-body").find(".contents").html(emptyStyle);
                    });
                }
            });
        },
        showFooterBtn:false,
    });
}

// 創建選擇職務列表
function createJobList(putArea, parentID, jobTreeChart, data, orgID, isEmpty){
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
                    // console.log(jobTreeChart, content, parentID);
                    creatJobData(putArea, jobTreeChart, content, parentID, orgID);
                   // console.log();
                });
                $(insertPageObj).appendTo( $("#addJobRank").find(".modal-body").find(".contents") );
            });
            // 找最後一項去除底線
            $("#addJobRank").find(".modal-body")
            .find(".contents")
            .find(".list-items-bottom").last()
            .removeClass("list-items-bottom");
        });
    }else{
        var option = {styleKind:"system",style:"data-empty"};
        // 取得選單樣式
        getStyle(option,function(emptyStyle){
            $("#addJobRank").find(".modal-body").find(".contents").html(emptyStyle);
        });
    }
}

// 創建組織樹狀圖
function createJobRankTree(putArea, orgID){
    jobTreeChart = putArea.orgChart({
        data: jobData,
        rootNodesDelete:true,
        showControls: true,
        allowEdit: false,
        newNodeText:"職務",
        onAddNode: function(node){  
            var parentID = node.data.id;
            // addJobRank(putArea, orgID, jobTreeChart, parentID)
            addJobRank(putArea, orgID, jobTreeChart, parentID);
        },
        onDeleteNode: function(node){
            jobDeleteNode(node.data, putArea, orgID);
        },
        onClickNode: function(node){
            // log('Clicked node '+node.data.id);
            // jobRankTreeDialog(jobTreeChart, node.data);
            // console.log(node);
        }
    });
}

// 創建職務資料
function creatJobData(putArea, jobTreeChart, contentObj, parentID, orgID){
    var sendObj = {
      "psid": contentObj.uid,
      "ofid": orgID,
      "faid": parentID,
      // "suid": 1
      "sys_code": sys_code
    };

    var sendData = {
        api: "AssPosition/Insert_AssPosition",
        threeModal:true,
        data: sendObj
    }; 

    $.post(wrsUrl,sendData,function(rs){
        var rs = $.parseJSON(rs);
        if(rs.Status){
            if(jobTreeChart != null){
                // 新增
                // newNode : parentId,name,childID
                jobTreeChart.newNode( parentID, contentObj.name, rs.Data );
            }else{
                // ROOT
                createJobTreeData(rs.Data, contentObj.name, parentID);
                createJobRankTree(putArea, orgID);
            }
            // 關閉
            $("#addJobRank").bsDialog("close");
        }
        // 測試用
        // if(jobTreeChart != null){
        //     // 新增
        //     // newNode : parentId,name,childID
        //     jobTreeChart.newNode( parentID, contentObj.name, 2 );
        // }else{
        //     // ROOT
        //     createJobTreeData(1, contentObj.name, parentID);
        //     createJobRankTree(putArea, orgID);
        // }
        // $("#addJobRank").bsDialog("close");
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
// 刪除
function jobDeleteNode(data, putArea, orgID){
    var sendData = {
        api: "AssPosition/Delete_AssPosition",
        threeModal:true,
        data: {
            iUid: data.id
        }
    }; 
    $.ajax({
        url: wrsUrl,
        type: "DELETE",
        data: sendData,
        dataType: "json",
        success: function(rs){
            // console.log(rs);
            if(!rs.Status){
                errorDialog("此職務已被使用，無法刪除");
            }else{
                if(data.parent == 0){
                    getJobRank( putArea, orgID );
                }else{
                    jobTreeChart.deleteNode(data.id); 
                }
            }
        }
    });
}