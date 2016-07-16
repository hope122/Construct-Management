var sys_code = userLoginInfo.sysCode;
var userID = userLoginInfo.userID;
$(function(){
    getAnnouncementData();
    tabContentCtrl($("#announcementTab"));
    $("#announcementTab").find(".announcementTab").click(function(){
        var type = $(this).prop("id");
        getAnnouncementData(type);
    });
});

function getAnnouncementData(type){
    $("#grid").empty();
    loader($("#grid"));
    if(type == undefined){
        type = 0;
    }

    var sendData = {
        api: announcementAPI+"GetNews",
        data:{
            type: type
        }
    };

    $.getJSON(wrsUrl, sendData).done(function(rs){
        $("#grid").empty();
        if(rs.Status){
            putAnnouncementDataToPage(rs.Data, $("#grid"));
        }else{
            putEmptyInfo($("#grid"));
        }
    });
}


// 放資料
function putAnnouncementDataToPage(data, putArea){
    // console.log(data);
    // 畫面設定值
    var option = {styleKind:"announcement",style:"list"};
    // 取得畫面樣式
    getStyle(option,function(pageStyle){
        $.each(data, function(index,content){
            var pageStyleObj = $.parseHTML(pageStyle);
            $(pageStyleObj).addClass("dataContent");

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
            

            // 分類標籤
            $(pageStyleObj).find(".list-items").eq(0).find(".label").addClass(desClass).text(desiStr);

            // 事項標題可以點開觀看
            var Desc = $("<a>").prop("href","#").text(content.Title).click(function(){
                calendarView(content, $(pageStyleObj));
                return false;
            });

            // 事項標題
            $(pageStyleObj).find(".list-items").eq(1).html(Desc);
            // 日期
            $(pageStyleObj).find(".list-items").eq(2).html(content.Date);
            
            $(pageStyleObj).appendTo(putArea);

        });
        putArea.find(".dataContent").last().removeClass("list-items-bottom-dash");
    });
}

// 查看
function announcementView(content, putArea){
    $("#announcementViewDialog").remove();
    var announcementViewDialog = $("<div>").prop("id","announcementViewDialog");
    announcementViewDialog.appendTo("body");

    $("#announcementViewDialog").bsDialog({
        title: content.Desc+"項目檢視",
        autoShow: true,
        start: function(){
          var option = {styleKind:"calendar-list",style:"view"};
          getStyle(option,function(announcementView){
            // 細項＆歷程用同一種
            var option = {styleKind:"calendar-list",style:"detail"};
            getStyle(option,function(detailPage){
                var announcementViewObj = $.parseHTML(announcementView);
                var isModify = true;
                var detailPutArea = $(announcementViewObj).find(".list-items").eq(6).find(".control-label").eq(1)
                
                    // 事項
                    $(announcementViewObj).find(".list-items").find("#Desc").text(content.Desc);

                    // 地點
                    $(announcementViewObj).find(".list-items").find("#Location").text(content.Location);

                    // 起日
                    $(announcementViewObj).find("#StartDate_content").text(content.StartDate);

                    // 迄日
                    var EndDate;
                    var Pricipal;
                    if(content.MyKeypoint != undefined){
                        EndDate = content.MyKeypoint.EndDate;
                        Pricipal = content.MyKeypoint.Pricipal.Name;
                    }else{
                        EndDate = content.EndDate;
                        Pricipal = content.Pricipal.Name;
                    }
                    $(announcementViewObj).find("#EndDate_content").text(EndDate);

                    $(announcementViewObj).find("#Pricipal").text(Pricipal);
                    $(announcementViewObj).find("#Designee").text(content.Designee.Name);
                 

                $(calendarViewObj).appendTo($("#calendarViewDialog").find(".modal-body"));
            });
          });
        },
        button:[
            {
                text: "關閉",
                className: "btn-default-font-color",
                click: function(){
                    $("#calendarViewDialog").bsDialog("close");
                }
            },
        ]
    });
}