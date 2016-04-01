//  var testData = [
//     {id: "A", name: 'My Organization1', parent: 0},
//     {id: "A1", name: 'CEO Office1', parent: "A"},
    

//     // {id: 3, name: 'Division 1', parent: 1},
//     // {id: 4, name: 'Division 2', parent: 1},
//     // {id: 6, name: 'Division 3', parent: 1},
//     // {id: 7, name: 'Division 4', parent: 1},
//     // {id: 8, name: 'Division 5', parent: 1},
//     // {id: 5, name: 'Sub Division', parent: 3},
    
// ];
var testData = [];
$(function(){
    if(testData.length > 0){
        createTree();
        $(".createBtn").remove();
        
    }else{
        addDialog("","root");
    }
});

function getOrgData(){
	$.getJSON(ctrlAdminAPI + "GetData_AssOrg",{},function(rs){
		
	});
}

// function putRootData(){
//     var rootObj = {
//         id: "root",
//         name: $("#rootName").val(),
//         parent: 0
//     };
//     addDialog("","root");
//     // Insert_AssOrg
//     testData.push(rootObj);
//     createTree();
//     // $(".createBtn").remove();
// }
function createTree(){
    orgTreeChart = $('#orgChart').orgChart({
        data: testData,
        showControls: true,
        allowEdit: false,
        onAddNode: function(node){ 
            // log('Created new node on node '+node.data.id);
            // org_chart.newNode(node.data.id); 
            addDialog(orgTreeChart,node.data.id);
        },
        onDeleteNode: function(node){
            log('Deleted node '+node.data.id);
            orgTreeChart.deleteNode(node.data.id); 
        },
        onClickNode: function(node){
            log('Clicked node '+node.data.id);
        }

    });
}

function addDialog(orgTreeChart, nodeID){
    $("#addDialog").remove();

    var addDialog = $("<div>").prop("id","addDialog");

    $("<div>").addClass("contents").appendTo(addDialog);
    addDialog.appendTo("body");

    var headerCloseBtn = true;

    if(orgTreeChart == ""){
        headerCloseBtn = false;
    }

    $("#addDialog").bsDialog({
        autoShow:true,
        headerCloseBtn: headerCloseBtn,
        title: "組織單位選單",
        start: function(){

            var option = {styleKind:"list",style:"1grid-add"};

            getStyle(option,function(insertPage){
                var insertPageObj = $.parseHTML(insertPage);
                $(insertPageObj).find(".fa-plus-square-o").click(function(){

                    if(orgTreeChart != ""){
                        // 新增
                        orgTreeChart.newNode(nodeID,"test");
                    }else{
                        //root
                        var rootObj = {
                            id: "root",
                            name: "root",
                            parent: 0
                        };
                        testData.push(rootObj);
                        createTree();
                    }
                    // 關閉
                    $("#addDialog").bsDialog("close");
                    // $("#addDialog").bsDialogClose();
                });
                $(insertPageObj).appendTo( $("#addDialog").find(".modal-body").find(".contents") );
                // 找最後一項去除底線
                $("#addDialog").find(".modal-body")
                .find(".contents")
                .find(".list-items-bottom").last()
                .removeClass("list-items-bottom");

                // $("#addDialog").bsDialog("show");
                

            });
        },
        showFooterBtn:false,
    });
}
// just for example purpose
function log(text){
    $('#consoleOutput').append('<p>'+text+'</p>')
}