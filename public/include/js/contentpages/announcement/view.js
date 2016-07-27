// 取得公告內容
function getAnnouncementContentData(putArea,uid){
    putArea.empty();
    loader(putArea);

    var sendData = {
        api: announcementAPI+"GetNewsContent",
        data:{
            uid: uid
        }
    };

    $.getJSON(wrsUrl, sendData).done(function(rs){
        putArea.empty();
        if(rs.Status){
            putArea.html(rs.Data.Content);
        }else{
            putEmptyInfo(putArea);
        }
    });
}

// 查看
function announcementView(content){
    $("#announcementViewDialog").remove();
    var announcementViewDialog = $("<div>").prop("id","announcementViewDialog");
    announcementViewDialog.appendTo("body");

    $("#announcementViewDialog").bsDialog({
        // title: content.Desc+"項目檢視",
        modalClass: "bsDialogWindow",
        autoShow: true,
        start: function(){
          var option = {styleKind:"announcement",style:"view"};
          getStyle(option,function(announcementView){
            // 細項＆歷程用同一種
            
            var announcementViewObj = $.parseHTML(announcementView);
            
            var desiStr, desClass;
            if(content.Type == 1){
                desiStr = "收發";
                desClass = "label-warning";
            }
            if(content.Type == 2){
                desiStr = "檔案";
                desClass = "label-info";
            }
            if(content.Type == 3){
                desiStr = "系統";
                desClass = "label-danger";
            }

            // 公告主旨內容
            var titleArea = $(announcementViewObj).find(".title");
            // 標籤
            titleArea.find(".control-label").eq(0).find(".label").addClass(desClass).text(desiStr);
            // 標頭
            titleArea.find(".control-label").eq(1).text(content.Title);
            // 日期
            titleArea.find(".control-label").eq(2).text(content.Date);
            $("#announcementViewDialog").find(".modal-title").html(titleArea.clone());
            

            // 取得公告內容
            var contentPutArea = $(announcementViewObj).find(".list-items").eq(0).find(".control-label");
            getAnnouncementContentData(contentPutArea, content.Uid);
             
            titleArea.remove();
            $(announcementViewObj).appendTo($("#announcementViewDialog").find(".modal-body"));
            
          });
        },
        button:[
            {
                text: "關閉",
                className: "btn-default-font-color",
                click: function(){
                    $("#announcementViewDialog").bsDialog("close");
                }
            },
        ]
    });
}