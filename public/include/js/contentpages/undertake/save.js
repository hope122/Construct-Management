// 儲存收文新增/修改
function saveReferenceData(sendObj, modifyItem, putFormArea){
    sendObj.typeId = 5;
    sendObj.userName = userLoginInfo.userName;
	sendObj.levelId = 1;
	sendObj.isopycnicId = 1;
	
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


function saveSignData(sendObj){
    console.log(sendObj);
    return;
    // data["doc_uid"] = 1;
    var sendData = {
        api: apdAPI+"Insert_ApdData",
        threeModal: true,
        data:data
    }
    $.post(wrsUrl,sendData,function(rs){
        console.log(rs);
    });
}
