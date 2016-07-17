var sys_code = userLoginInfo.sysCode;
var userID = userLoginInfo.userID;
$(function(){
    getAnnouncementData();
    // 首頁點選後可以導頁
    $("#announcementMore").click(function(){
        loadPage("announcement/list","pagescontent");
        return false;
    });

    tabContentCtrl($("#announcementTab"));
    $("#announcementTab").find(".announcementTab").click(function(){
        var type = $(this).prop("id");
        getAnnouncementData(type);
    });
});

// 取得列表資料
function getAnnouncementData(type){
    $("#home-announcementlist").empty();
    loader($("#home-announcementlist"));
    if(type == undefined){
        type = 0;
    }

    var sendData = {
        api: announcementAPI+"GetNews",
        data:{
            first: 0,
            count: 5,
            type: type
        }
    };

    $.getJSON(wrsUrl, sendData).done(function(rs){
        $("#home-announcementlist").empty();
        if(rs.Status){
            putAnnouncementDataToPage(rs.Data, $("#home-announcementlist"));
        }else{
            putEmptyInfo($("#home-announcementlist"));
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



