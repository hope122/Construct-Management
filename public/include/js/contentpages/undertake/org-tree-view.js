function orgTreeDialog(content, pageObjArea){
    $("#orgTreeDialog").remove();
    var orgTreeDialog = $("<div>").prop("id","orgTreeDialog");
    var orgChart = $("<div>").prop("id","orgTreeChart").addClass("modal-items");
    orgChart.appendTo(orgTreeDialog);
    orgTreeDialog.appendTo("body");

    $("#orgTreeDialog").bsDialog({
        title: "請選擇分文部門",
        modalClass: "bsDialogWindow",
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
					saveOffice(content, data.idStr, pageObjArea);
                }
            }
        ]
    });
}
// 使用者列表
function userListData(content, pageObjArea){
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
            userListDialog(rs.Data ,content, pageObjArea);
        }else{
            msgDialog("無法取得使用者列表");
        }
    });
}
// sys_code
// userID
function userListDialog(data ,content, pageObjArea){
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
                    sendData.uid = content.uid;
                    if(userIDList){
                        setReferenceDateDailog(sendData, pageObjArea, content);
                        // $("#userListDialog").bsDialog("close");
                    }else{
                        msgDialog("尚未選擇使用者"); 
                    }
                }
            }
        ]
    });
}

// 儲存發文指派
function saveOffice(content, officeId, pageObjArea){
    var sendData = {
        api: referenceAPI+"setReferenceOffice",
        data:{
            uid:content.uid,
            officeId:officeId
        }
    };
    $.post(wrsUrl,sendData,function(rs){
        var rs = $.parseJSON(rs);
        if(rs.status){
            msgDialog(rs.Message, false);
            // 重新讀取這筆資料
            renewListData(pageObjArea, content);
            $("#orgTreeDialog").bsDialog('close');
        }else{
            msgDialog(rs.Message);
        }
        // console.log(rs);
    });
}

// 指派＆設置預警後存取
function saveDesignate(uid,pricipalId,endDate, pageObjArea, content){
	var sendData = {
        api: referenceAPI+"setReferenceDesignate",
        data:{
            uid:uid,
            pricipalId:pricipalId,
			endDate:endDate
        }
    };
    $.post(wrsUrl,sendData,function(rs){
        var rs = $.parseJSON(rs);
        if(rs.status){
            msgDialog(rs.Message, false);
            // 重新讀取這筆資料
            renewListData(pageObjArea, content);
            $("#userListDialog").bsDialog('close');
            $("#setReferenceDateDailog").bsDialog('close');
        }else{
            msgDialog(rs.Message);
        }
    });
}


// 設定預警日期
function setReferenceDateDailog(sendData, pageObjArea, content){
    $("#setReferenceDateDailog").remove();
    $("#signInfoAndDateDialog").remove();
    
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
                
                $(".ui-datepicker").remove();
                var dateOption = {
                    dateFormat: "yy-mm-dd",
                    onSelect: function(dateText, inst) {
                        $(pageStyleObj).find("#end_date_content").removeClass("item-bg-danger").text(dateText);
                        $(pageStyleObj).find("#end_date").hide();
                    },
                    minDate: 0
                };

                $(pageStyleObj).find("#end_date").hide().datepicker(dateOption);

                $(pageStyleObj).find("#end_calendar").click(function(){
                    $(pageStyleObj).find("#end_date").show();
                });

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
					
                    if(end_date){
                        saveDesignate(sendData.uid,sendData.userIDList,end_date, pageObjArea, content);
                    }else{
                        $("#setReferenceDateDailog").find("#end_date_content").text("尚未選擇日期").addClass("item-bg-danger");
                    }
                }
            }

        ]
    });
}
