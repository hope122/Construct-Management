// 儲存收文新增/修改
function saveReferenceData(sendObj, modifyItem, putFormArea){
    // return
    sendObj.typeID = 1;
    sendObj.userName = userLoginInfo.userName;
    var sendData = {
        // api: docAPI+"setDocFileInsert",
        api: referenceAPI+"setReferenceInsert",
        data: sendObj
    };
    console.log(sendObj);

    $.post(wrsUrl, sendData, function(rs){
        console.log(rs);
    });
    // var options = {
    //     url: wrsAPI+"uploaderAPI",
    //     type:"POST",
    //     data: sendData,
    //     dataType:"JSON",
    //     beforesend: function(xhr){
    //         // testBs3Show(xhr);
    //     },
    //     uploadProgress: function(event, position, total, percentComplete) {
    //        console.log(event, position, total, percentComplete);

    //     },
    //     success: function(rs) {
    //        console.log(rs);
    //     },
    // };
    // $(putFormArea).ajaxSubmit(options);
}
