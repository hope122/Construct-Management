function orgTreeDialog(){
    $("#orgTreeDialog").remove();
    var orgTreeDialog = $("<div>").prop("id","orgTreeDialog");
    var orgChart = $("<div>").prop("id","orgTreeChart").addClass("modal-items");
    orgChart.appendTo(orgTreeDialog);
    orgTreeDialog.appendTo("body");

    $("#orgTreeDialog").bsDialog({
        title: "請選擇分文部門",
        autoShow: true,
        start: getOrgData("orgTreeChart"),
        button:[
        
            {
                text: "取消",
                className: "btn-default-font-color",
                click: function(){
                    $("#orgTreeDialog").bsDialog("close");
                }
            },
            {
                text: "確定",
                className: "btn-success",
                click: function(){
                    var data = orgTreeChart.getSelectData();
                    console.log(data);
                }
            }
        ]
    });
}