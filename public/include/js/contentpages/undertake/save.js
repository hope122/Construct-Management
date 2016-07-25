// 儲存收文新增/修改
function saveReferenceData(sendObj, modifyItem, putFormArea){
     sendObj.type_id = 7;
    sendObj.user_name = userLoginInfo.userName;
	sendObj.level_id = 1;
	sendObj.isopycnic_id = 1;
	
	var method = "setReferenceInsert";
	var processURL = wrsUrl;

	if( $(putFormArea).find("input:file").length > 0){
		processURL = wrsAPI + "uploaderAPI";
		method = "setReferenceDocInsert"
	}
	var sendData = {
        api: referenceAPI + method,
        data: sendObj
    };
	// console.log(sendObj);
    var options = {
		url: processURL,
        type:"POST",
        data: sendData,
        dataType:"JSON",
        beforesend: function(xhr){
            // testBs3Show(xhr);
        },
        uploadProgress: function(event, position, total, percentComplete) {
          // console.log(event, position, total, percentComplete);

        },
        success: function(rs) {
           console.log(rs);
        },
    };
     $(putFormArea).ajaxSubmit(options);

}


function saveSignData(sendObj, modifyItem, putFormArea){
    console.log(sendObj, putFormArea);
    return;
    // data["doc_uid"] = 1;
    var sendData = {
        api: apdAPI+"Insert_ApdData",
        threeModal: true,
        data:data
    }
    $.post(wrsUrl,sendData,function(rs){
        console.log(rs);
        var rs = $.parseJSON(rs);
        if(rs.status){
            $("#signWFDialog").bsDialogSelect('close');
        }
    });
}

// 儲存收文確認事項
function saveReferenceCheckItemData(sendObj, modifyItem, putFormArea){
	sendObj.userName=userLoginInfo.userName;
	sendObj.uid=3;
	// console.log(sendObj);
    // return;
    var method = "setReferenceHandlingInsert";
    var processURL = wrsUrl;

    if( $(putFormArea).find("input:file").length > 0){
        processURL = wrsAPI + "uploaderAPI";
        method = "setReferenceHandlingDocInsert"
    }
    var sendData = {
        api: referenceAPI + method,
        data: sendObj
    };
    
    var options = {
        url: processURL,
        type:"POST",
        data: sendData,
        dataType:"JSON",
        beforesend: function(xhr){
            // testBs3Show(xhr);
        },
        uploadProgress: function(event, position, total, percentComplete) {
          // console.log(event, position, total, percentComplete);

        },
        success: function(rs) {
           console.log(rs);
        },
    };
    $(putFormArea).ajaxSubmit(options);

}
