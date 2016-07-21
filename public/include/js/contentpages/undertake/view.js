// 收文預覽
function referenceViewDialog(modifyObj){
    console.log(modifyObj);
    $("#referenceViewDialog").remove();
    var referenceViewDialog = $("<div>").prop("id","referenceViewDialog");
    referenceViewDialog.appendTo("body");

    $("#referenceViewDialog").bsDialog({
        title: modifyObj.doc_number,
        autoShow: true,
        start: referenceViewStart(modifyObj),
        button:[
        
            {
                text: "關閉",
                className: "btn-default-font-color",
                click: function(){
                    $("#referenceViewDialog").bsDialog("close");
                }
            },
        ]
    });
}


// 收文預覽時開啟的動作要做的事情
function referenceViewStart(modifyObj){
    var option = {styleKind:"received-issued",style:"reference-view"};
    getStyle(option,function(insertPage){
        var insertPageObj = $.parseHTML(insertPage);

        $.each(modifyObj, function(i, content){
            // $(insertPageObj).find("#"+i).html(content);
        })
		var sendData = {
			api: referenceAPI + "getReference",
			data:{
				uid:modifyObj.uid
			}
		};

		$.getJSON(wrsUrl, sendData).done(function(rs){
			console.log(rs.data[0]);
			
			if(rs.status && rs.data != null){
				$.each(rs.data[0], function(i, content){
					 $(insertPageObj).find("#"+i).html(content);
				})
				
			}
		});
        // 放到畫面中
        $(insertPageObj).appendTo($("#referenceViewDialog").find(".modal-body"));

        // getQCTableTypeList("tableTypeTab","tableType",true);
    });
}