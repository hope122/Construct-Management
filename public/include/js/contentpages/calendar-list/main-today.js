var sys_code = userLoginInfo.sysCode;
var userID = userLoginInfo.userID;
$(function(){
    getCalendarData();
    // 首頁點選後可以導頁
    $("#calendarMore").click(function(){
        loadPage("calendar/list","pagescontent");
        return false;
    });
});
function getCalendarData(type,areaID,uid){
    $("#"+areaID).find(".dataContent").remove();
    $("#"+areaID).find(".date-empty").remove();
    if(type == undefined){
        type = 2;
    }

    if(areaID == undefined){
        areaID = "today-calendarlist";
    }

    var sendData = {
        api: calendarAPI+"GetToDoList",
        data:{
            userId: userID,
            type: type
        }
    };

    $.getJSON(wrsUrl, sendData).done(function(rs){
        if(rs.Status){
            if(type == 1){
                putDataToPage(rs.Data, $("#"+areaID));
            }else{
                putSysDataToPage(rs.Data, $("#"+areaID));
            }
        }else{
            putEmptyInfo($("#"+areaID));
        }
    });
}

// 放資料
function putDataToPage(data, putArea){
    // console.log(data);
    // 畫面設定值
    var option = {styleKind:"calendar-list",style:"today"};
    // 取得畫面樣式
    getStyle(option,function(pageStyle){
        $.each(data, function(index,content){
            var pageStyleObj = $.parseHTML(pageStyle);
            $(pageStyleObj).addClass("dataContent");

            var desiStr = "個人";
            var desClass = "label-info"; 
            if(content.Type != undefined){
                if(content.Type.Uid == 1){
                    desiStr = "系統";
                    desClass = "label-danger";
                }
            }

            // 分類標籤
            $(pageStyleObj).find(".list-items").eq(0).find(".label").addClass(desClass).text(desiStr);

            // 事項標題可以點開觀看
            var Desc = $("<a>").prop("href","#").text(content.Desc).click(function(){
                calendarView(content, $(pageStyleObj));
                return false;
            });

            if(content.Location == ""){
                $(pageStyleObj).find(".map-marker").hide();
            }else{
                // $(pageStyleObj).find(".map-marker").eq(1).text(content.Location);

            }

            // 事項標題
            $(pageStyleObj).find(".list-items").eq(1).html(Desc);
            
            $(pageStyleObj).appendTo(putArea);

        });
        putArea.find(".dataContent").last().removeClass("list-items-bottom");
    });
}


// 查看
function calendarView(content, putArea){
    $("#calendarViewDialog").remove();
    var calendarViewDialog = $("<div>").prop("id","calendarViewDialog");
    calendarViewDialog.appendTo("body");

    $("#calendarViewDialog").bsDialog({
        title: content.Desc+"項目檢視",
        autoShow: true,
        start: function(){
          var option = {styleKind:"calendar-list",style:"view"};
          getStyle(option,function(calendarView){
            // 細項＆歷程用同一種
            var option = {styleKind:"calendar-list",style:"detail"};
            getStyle(option,function(detailPage){
                var calendarViewObj = $.parseHTML(calendarView);
                var isModify = true;
                var detailPutArea = $(calendarViewObj).find(".list-items").eq(6).find(".control-label").eq(1)
                
                    // 事項
                    $(calendarViewObj).find(".list-items").find("#Desc").text(content.Desc);

                    // 地點
                    $(calendarViewObj).find(".list-items").find("#Location").text(content.Location);

                    // 起日
                    $(calendarViewObj).find("#StartDate_content").text(content.StartDate);

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
                    $(calendarViewObj).find("#EndDate_content").text(EndDate);

                    $(calendarViewObj).find("#Pricipal").text(Pricipal);
                    $(calendarViewObj).find("#Designee").text(content.Designee.Name);
                    // 取得細項內容
                    var sendData = {
                        api: calendarAPI+"GetToDoList",
                        data: {
                            userId: userID,
                            type: 1,
                            fid: content.Uid
                        }
                    };
                    $.getJSON(wrsUrl,sendData, function(rs){
                        if(rs.Status){
                            $.each(rs.Data,function(detailIndex, detailContent){
                                createDetail(detailPage, detailContent, detailPutArea, true);
                            });
                        }
                    });
                
                $(calendarViewObj).find("#addDetail").remove();
                $(calendarViewObj).find("#addHistories").remove();

                var historiesArea = $(calendarViewObj).find(".list-items").eq(7).find(".control-label").eq(1);
                if(content.Histories != undefined){
                    if(content.Histories.length){
                        $.each(content.Histories, function(historiesIndex, historiesContent){
                            createDetail(detailPage, historiesContent, historiesArea, false);
                        });
                    }
                }

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


// 創建細項或歷程
function createDetail(detailStyle, content, putArea, isDetail){
    if(isDetail == undefined){
        isDetail = false;
    }

    var detailObj = $.parseHTML(detailStyle);
    var historiesPutArea = $(detailObj).find(".histories");
    $(detailObj).find(".fa-plus").remove();
    $(detailObj).find(".fa-check").remove();
    $(detailObj).find(".histories").remove();
    $(detailObj).find(".fa-trash-o").remove();

    // 目前沒有在編輯時新增細項的功能，所以應急先摘除
    if(isDetail){
        $(detailObj).find("input:text").parent().html(content.Desc);
        $(detailObj).find(".fa-trash-o").remove();

        if(content.CompletionDate){
            $(detailObj).find(".fa-check").remove();
        }
        $.each(content.Histories,function(i,historiesContents){
            createDetail(detailStyle, historiesContents, historiesPutArea);
        });
        
    }else{
        // 放內容
        $(detailObj).find("input:text").parent().text(content.Desc);

    }
    $(detailObj).appendTo(putArea);
}