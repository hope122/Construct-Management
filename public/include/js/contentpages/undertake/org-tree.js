var orgTreeChart;
var testData = [];

function getOrgData(putAreaID){
    loader( $("#"+putAreaID) );
    var sendData = {
        api: "AssOrg/GetData_AssOrg",
        threeModal:true,
        data:{
            sys_code: sys_code,
        }
    }; 

    $.getJSON(wrsUrl,sendData,function(rs){

        $("#"+putAreaID).empty();
        //有資料
        if(rs.Status){
            $.each(rs.Data, function(index, content){
                createTreeData(content.uid,content.name,content.faid, content.officeid);
            });
            // console.log(testData);
            createTree( putAreaID );
        }else{ //沒有資料
            addDialog("",0);
        }
		// console.log(rs);
	});
}

// 創建組織樹狀圖
function createTree(putAreaID){
    orgTreeChart = $("#"+putAreaID).orgChart({
        data: testData,
        showControls: false,
        allowEdit: false,
        selectModal: true,
        selectOnly: true,
        onAddNode: function(node){  
            
        },
        onDeleteNode: function(node){
            
        },
        onClickNode: function(node){
            // log('Clicked node '+node.data.id);
            // jobRankTreeDialog(orgTreeChart, node.data);
            // console.log(node.data);
        }
    });
    // console.log();
    // .html("T");
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