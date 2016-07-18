function orgTreeDialog(uid){
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
					saveOffice(uid,data.idStr)
                    console.log(data);
                }
            }
        ]
    });
}

function userListData(uid){
    var sendObj = {
        api: "AssUser/GetData_OrgAssUser",
        threeModal: true,
        data:{
            sys_code: sys_code,
            userID: userID
        }
    }
    $.getJSON(wrsUrl, sendObj, function(rs){
        if(rs.Data){
            userListDialog(rs.Data ,uid);
        }else{
            errorDialog("無法取得使用者列表");
        }
    });
}
// sys_code
// userID
function userListDialog(data ,uid){
    $("#userListDialog").remove();
    var userListDialog = $("<div>").prop("id","userListDialog");
    userListDialog.appendTo("body");
    var userListDialog = $("#userListDialog").bsDialogSelect({
            autoShow:true,
            showFooterBtn:true,
            headerCloseBtn:false,
            // modalClass: "bsDialogWindow",
            title: "設定承辦人員",
            data: data,
            textTag: "name",
            valeTag: "uid",
            button:[
                {
                    text: "取消",
                    // className: "btn-success",
                    click: function(){
                    
                        $("#userListDialog").bsDialog("close");
                        
                    }
                },
                {
                    text: "下一步",
                    className: "btn-success",
                    click: function(){
                        var userIDList = userListDialog.getValue();
                        sendData = {};
                        sendData.userIDList = userIDList;
                        sendData.uid = uid;
                        console.log(sendData);
                        if(userIDList){
                            setReferenceDateDailog(sendData);
                            // $("#userListDialog").bsDialog("close");
                        }else{
                            
                        }
                    }
                }
            ]
        });
}

function saveOffice(uid,officeId){
	var data = [];
	console.log(referenceAPI);
    var sendData = {
        api: referenceAPI+"setReferenceOffice",
        data:{
            uid:uid,
            officeId:officeId
        }
    };
    $.post(wrsUrl,sendData,function(rs){
        console.log(rs);
    });


}

// 設定預警日期
function setReferenceDateDailog(sendData){
    $("#setReferenceDateDailog").remove();
    $("<div>").prop("id","setReferenceDateDailog").appendTo("body");

    $("#setReferenceDateDailog").bsDialog({
        autoShow:true,
        showFooterBtn:true,
        // headerCloseBtn:false,
        // modalClass: "bsDialogWindow",
        title: "設置預警日期",
        start: function(){
            var option = {
                styleKind: "received-issued",style:"undertake-dateandtype"
            }
            getStyle(option,function(pageStyle){
                var pageStyleObj = $.parseHTML(pageStyle);

                $(pageStyleObj).find(".list-items").eq(0).find(".control-label").eq(0).text("設置預警日期");
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
                
                $(pageStyleObj).appendTo($("#setReferenceDateDailog").find(".modal-body"));
            });
        },
        button:[
            {
                text: "返回",
                // className: "btn-success",
                click: function(){
                
                    $("#setReferenceDateDailog").bsDialog("close");
                    
                }
            },
            {
                text: "設定",
                className: "btn-success",
                click: function(){
                    var end_date = $("#setReferenceDateDailog").find("#end_date").val();
                    sendData.end_date = end_date;
                    console.log(sendData);
                    if(end_date){
                        

                    }else{
                        $("#setReferenceDateDailog").find("#end_date_content").text("尚未選擇日期").addClass("item-bg-danger");
                    }
                }
            }

        ]
    });
}
