// 儲存收文新增/修改
function saveReferenceData(sendObj, modifyItem, putFormArea){
    // return
    sendObj.typeId = 5;
    //sendObj.userName = userLoginInfo.userName;
	sendObj.levelId= 1;
	sendObj.isopycnicId=1;
	sendObj.userName="test1";
	// sendObj.uid=16;
	
	var webapi="setReferenceInsert";
	var url=wrsUrl;
	if($(putFormArea).find("input:file").length>0){
		url=wrsAPI + "uploaderAPI";
		webapi="setReferenceDocInsert"
	}
	var sendData = {
        // api: docAPI+"setDocFileInsert",
        api: referenceAPI+webapi,
        data: sendObj
    };
     // console.log(sendData);

    // $.post(wrsUrl, sendData, function(rs){
        // console.log(rs);
    // });
	
    var options = {
		//url:wrsAPI + "uploaderAPI",
        // url: wrsUrl,
		url:url,
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
