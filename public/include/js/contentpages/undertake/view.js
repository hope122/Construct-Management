// 收文預覽
function referenceViewDialog(modifyObj){
    // console.log(modifyObj);
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
    console.log(modifyObj);
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
			// console.log(rs.data[0]);
			
			if(rs.status && rs.data != null){
				$.each(rs.data[0], function(i, content){
                    if(i!="explanation"){
					   $(insertPageObj).find("#"+i).html(content);
                    }else{
                        // console.log($.parseHTML(content));
                        var string = $.parseHTML(content);
                        $(insertPageObj).find("#"+i).html(string[0].data);
                    }
				})
				
			}else{
                msgDialog("無法取得「"+modifyObj.subject+"」內容");
                $("#referenceViewDialog").bsDialog("close");
            }
		});
        // 放到畫面中
        $(insertPageObj).appendTo($("#referenceViewDialog").find(".modal-body"));

        // getQCTableTypeList("tableTypeTab","tableType",true);
    });
}

// 擬文預覽
function sendDocViewDialog(modifyObj){
    // console.log(modifyObj);
    $("#sendDocViewDialog").remove();
    var sendDocViewDialog = $("<div>").prop("id","sendDocViewDialog");
    sendDocViewDialog.appendTo("body");

    $("#sendDocViewDialog").bsDialog({
        title: modifyObj.doc_number,
        autoShow: true,
        start: sendDocViewStart(modifyObj),
        button:[
        
            {
                text: "關閉",
                className: "btn-default-font-color",
                click: function(){
                    $("#sendDocViewDialog").bsDialog("close");
                }
            },
        ]
    });
}


// 擬文預覽時開啟的動作要做的事情
function sendDocViewStart(modifyObj){
    console.log(modifyObj);
    var option = {styleKind:"received-issued",style:"sendDoc-view"};
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
        /*
        $.getJSON(wrsUrl, sendData).done(function(rs){
            // console.log(rs.data[0]);
            
            if(rs.status && rs.data != null){
                $.each(rs.data[0], function(i, content){
                    if(i!="explanation"){
                       $(insertPageObj).find("#"+i).html(content);
                    }else{
                        // console.log($.parseHTML(content));
                        var string = $.parseHTML(content);
                        $(insertPageObj).find("#"+i).html(string[0].data);
                    }
                })
                
            }else{
                msgDialog("無法取得「"+modifyObj.subject+"」內容");
                $("#sendDocViewDialog").bsDialog("close");
            }
        });
        */
        // 放到畫面中
        $(insertPageObj).appendTo($("#sendDocViewDialog").find(".modal-body"));

        // getQCTableTypeList("tableTypeTab","tableType",true);
    });
}