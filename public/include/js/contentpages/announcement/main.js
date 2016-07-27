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
            type: type,
            sysCodeId: sys_code
        }
    };

    $.getJSON(wrsUrl, sendData).done(function(rs){
        $("#grid").empty();
        if(rs.Status && rs.Data.length){
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
                announcementView(content);
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