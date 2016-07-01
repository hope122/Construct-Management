var testData = [];
var sys_code = userLoginInfo.sysCode;
var userID = userLoginInfo.userID;
var menu_code = "eab";
var orgTreeChart;
$(function(){
    getCalendarData();
    $("#systems").click(function(){
        getCalendarData(7,"systems-content");

    });
    $("#total").click(function(){
        getCalendarData(1,"total-content");

    });
    tabCtrl("totalTab");
});
function getCalendarData(type,areaID,uid){
    $("#"+areaID).find(".dataContent").remove();
    $("#"+areaID).find(".date-empty").remove();
    if(type == undefined){
        type = 1;
    }

    if(areaID == undefined){
        areaID = "total-content";
    }

    var sendData = {
        api: calendarAPI+"GetToDoList",
        data:{
            userId: userID,
            type: type
        }
    };

    $.getJSON(wrsUrl, sendData).done(function(rs){
        // console.log(rs);
        
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
function putDataToPage(data, putArea, onlyData){
    if(typeof onlyData == "undefined"){
        onlyData = false;
    }
    // console.log(data);
    // 畫面設定值
    var option = {styleKind:"calendar-list",style:"normal"};
    // 取得畫面樣式
    getStyle(option,function(pageStyle){
        if(!onlyData){
            $.each(data, function(index,content){
                var pageStyleObj = $.parseHTML(pageStyle);
                $(pageStyleObj).addClass("dataContent");

                var desiStr = "個人";
                // 指派人
                var DesigneeID = content.Designee.Uid;
                // 承辦人
                var PricipalID = content.MyKeypoint.Pricipal.Uid;
                var itemType = 2;
                if(DesigneeID != PricipalID ){
                    itemType = 1;
                    if(DesigneeID == userID && PricipalID != userID){
                        desiStr = "指派";
                        // $(pageStyleObj).find(".fa-check")
                        // .remove();
                    }else{
                        desiStr = "被指";
                        $(pageStyleObj).find(".fa-trash-o").remove();
                    }
                }

                if(DesigneeID != userID){
                    $(pageStyleObj).find(".fa-pencil-square-o").remove();
                }

                var progressStr = content.Progress + "%";
                if(content.Type.Uid == 1){
                    $(pageStyleObj).find(".item-actionBtn").empty().text("-");
                    progressStr = "-";
                }

                if(content.CompletionDate){
                    $(pageStyleObj).find(".fa-trash-o").remove();
                }

                // 事項標題可以點開觀看
                var Desc = $("<a>").prop("href","#").text(content.Desc).click(function(){
                    calendarView(content, $(pageStyleObj));
                    return false;
                });

                // 事項標題
                $(pageStyleObj).find(".list-items").eq(0).html(Desc);

                // 類型
                $(pageStyleObj).find(".list-items").eq(1).text(desiStr);

                // 迄日
                $(pageStyleObj).find(".list-items").eq(2).text(content.MyKeypoint.EndDate);
                
                // 進度
                $(pageStyleObj).find(".list-items").eq(3).text(progressStr);

                // 修改
                $(pageStyleObj).find(".fa-pencil-square-o").click(function(){
                    insertDialog( content, $(pageStyleObj) );
                });

                // 完成
                $(pageStyleObj).find(".fa-check").click(function(){
                    
                    finishList(content.Uid, itemType);
                    $(this).remove();
                    $(pageStyleObj).find(".fa-pencil-square-o").remove();
                    $(pageStyleObj).find(".fa-trash-o").remove();
                });

                // 刪除
                $(pageStyleObj).find(".fa-trash-o").click(function(){
                    deleteData(content.Uid, $(this).parents(".list-items").parent());
                });
                if(content.CompletionDate){
                    $(pageStyleObj).find(".fa-pencil-square-o").remove();
                    $(pageStyleObj).find(".fa-check").remove();
                }
                
                $(pageStyleObj).appendTo(putArea);

            });
        }else{
            var pageStyleObj = $.parseHTML(pageStyle);
            $(pageStyleObj).addClass("dataContent");

            var desiStr = "個人";
            // 指派人
            var DesigneeID = data.Designee.Uid;
            // 承辦人
            var PricipalID = data.Pricipal.Uid;
            var itemType = 2;
            if(DesigneeID != PricipalID ){
                 itemType = 1;
                if(DesigneeID == userID && PricipalID != userID){
                    desiStr = "指派";
                    $(pageStyleObj).find(".fa-check").remove();
                }else{
                    desiStr = "被指";
                    $(pageStyleObj).find(".fa-trash-o").remove();
                }
            }

            var progressStr = "0%";

            if(data.CompletionDate){
                $(pageStyleObj).find(".fa-trash-o").remove();
            }
            // 事項標題可以點開觀看
            var Desc = $("<a>").prop("href","#").text(data.Desc).click(function(){
                calendarView(data, $(pageStyleObj));
                return false;
            });

            // 事項標題
            $(pageStyleObj).find(".list-items").eq(0).html(Desc);

            // 類型
            $(pageStyleObj).find(".list-items").eq(1).text(desiStr);

            // 迄日
            $(pageStyleObj).find(".list-items").eq(2).text(data.EndDate);
            
            // 進度
            $(pageStyleObj).find(".list-items").eq(3).text(progressStr);

            // 修改
            $(pageStyleObj).find(".fa-pencil-square-o").click(function(){
                insertDialog( data, $(pageStyleObj) );
            });

            // 完成
            $(pageStyleObj).find(".fa-check").click(function(){
                finishList(data.Uid, itemType);
                $(this).remove();
                $(pageStyleObj).find(".fa-pencil-square-o").remove();
                $(pageStyleObj).find(".fa-trash-o").remove();
            });

            // 刪除
            $(pageStyleObj).find(".fa-trash-o").click(function(){
                deleteData(data.Uid, $(this).parents(".list-items").parent());
            });
            if(data.CompletionDate){
                $(pageStyleObj).find(".fa-pencil-square-o").remove();
                $(pageStyleObj).find(".fa-check").remove();
            }
            
            if(putArea.find("div").length){
                putArea.find(".dataContent").eq(-1).addClass("list-items-bottom").after(pageStyleObj);
            }else{
                $(pageStyleObj).removeClass("list-items-bottom").appendTo(putArea);

            }
        }
        putArea.find(".dataContent").last().removeClass("list-items-bottom");
    });
}

// 放資料
function putSysDataToPage(data, putArea){
    // 畫面設定值
    var option = {styleKind:"calendar-list",style:"sys-tab"};
    // 取得畫面樣式
    getStyle(option,function(pageStyle){
        
        $.each(data, function(index,content){
            var pageStyleObj = $.parseHTML(pageStyle);
            $(pageStyleObj).addClass("dataContent");

            // 事項標題
            $(pageStyleObj).find(".list-items").eq(0).html(content.Desc);

            // 迄日
            $(pageStyleObj).find(".list-items").eq(2).text(content.MyKeypoint.EndDate);

            $(pageStyleObj).appendTo(putArea);

        });
        
        putArea.find(".dataContent").last().removeClass("list-items-bottom");
    });
}

// 新增&修改Dialog
function insertDialog(modifyObj, modifyItem){
    // console.log(modifyObj, modifyItem);
    if(modifyItem == undefined){
        modifyItem = null;
    }
    var saveBtn = "";
    if(modifyObj != undefined){
        title = "修改事項";
        saveBtn = "修改";
    }else{
        title = "新增事項";
        saveBtn = "新增";
    }
    $("#insertDialog").remove();
    var insertDialog = $("<div>").prop("id","insertDialog");
    insertDialog.appendTo("body");

    $("#insertDialog").bsDialog({
        title: title,
        autoShow: true,
        start: function(){
          var option = {styleKind:"calendar-list",style:"insert"};
          getStyle(option,function(insertPage){
            // 細項＆歷程用同一種
            var option = {styleKind:"calendar-list",style:"detail"};
            getStyle(option,function(detailPage){
                var insertPageObj = $.parseHTML(insertPage);
                var isModify = false;
                var detailPutArea = $(insertPageObj).find(".list-items").eq(6).find(".control-label").eq(1);

                var dateOptionStart = {
                    dateFormat: "yy-mm-dd",
                    
                    showOn: "button",
                    buttonText: '<i class="fa fa-calendar fa-lg mouse-pointer send-btn"></i>',
                    onSelect: function(dateText, inst) {
                        // end_date_content
                        $(insertPageObj).find("#StartDate_content").removeClass("item-bg-danger").text(dateText);

                    },
                    minDate: 0
                };

                var dateOptionEnd = {
                    dateFormat: "yy-mm-dd",
                    
                    showOn: "button",
                    buttonText: '<i class="fa fa-calendar fa-lg mouse-pointer send-btn"></i>',
                    onSelect: function(dateText, inst) {
                        // end_date_content
                        $(insertPageObj).find("#EndDate_content").removeClass("item-bg-danger").text(dateText);

                    },
                    minDate: 0
                };

                $(insertPageObj).find("#StartDate").datepicker(dateOptionStart);
                $(insertPageObj).find("#EndDate").datepicker(dateOptionEnd);
                var selectWorkID;
                if(modifyObj != undefined){
                    // 指派人
                    var DesigneeID = modifyObj.Designee.Uid;
                    // 承辦人
                    var PricipalID;
                    if(modifyObj.MyKeypoint != undefined){
                        PricipalID = modifyObj.MyKeypoint.Pricipal.Uid;
                    }else{
                        PricipalID = modifyObj.Pricipal.Uid;
                    }

                    if(DesigneeID != PricipalID ){
                        if(DesigneeID == userID && PricipalID != userID){
                            // desiStr = "指派";
                            $(insertPageObj).find("#PricipalItem")
                            .removeClass("fa-square-o")
                            .addClass("fa-check-square-o");
                            $(insertPageObj).find("#Pricipal").show();

                            selectWorkID = PricipalID;
                        }else{
                            // desiStr = "被指";
                            $(insertPageObj).find("#DesigneeItem")
                            .removeClass("fa-square-o")
                            .addClass("fa-check-square-o");
                            $(insertPageObj).find("#Pricipal").show();

                            selectWorkID = DesigneeID;   
                        }
                    }else{
                        selectWorkID = null;
                    }
                }else{
                    selectWorkID = null;
                }

                // 指派
                var putAreaArr = [];
                var PricipalArea = $(insertPageObj).find("#Pricipal");
                putAreaArr.push(PricipalArea);

                // 回報
                var DesigneeArea = $(insertPageObj).find("#Designee");
                putAreaArr.push(DesigneeArea);

                getUserList(putAreaArr, selectWorkID);


                $(insertPageObj).find("#PricipalItem").click(function(){
                    var DesigneeItemCheck = $(insertPageObj).find("#DesigneeItem").prop("class").search("fa-check-square-o");
                    $(insertPageObj).find("#Designee").hide();
                    
                    if(DesigneeItemCheck != -1){
                        $(insertPageObj).find("#DesigneeItem").removeClass("fa-check-square-o").addClass("fa-square-o");
                    }
                    var thisItemCheck = $(this).prop("class").search("fa-check-square-o");

                    if(thisItemCheck != -1){
                        $(this).removeClass("fa-check-square-o").addClass("fa-square-o");
                        $(insertPageObj).find("#Pricipal").hide();
                    }else{
                        $(this).removeClass("fa-square-o").addClass("fa-check-square-o");
                        $(insertPageObj).find("#Pricipal").show();
                    }
                });

                $(insertPageObj).find("#DesigneeItem").click(function(){
                    var DesigneeItemCheck = $(insertPageObj).find("#PricipalItem").prop("class").search("fa-check-square-o");
                    $(insertPageObj).find("#Pricipal").hide();
                    
                    if(DesigneeItemCheck != -1){
                        $(insertPageObj).find("#PricipalItem").removeClass("fa-check-square-o").addClass("fa-square-o");                        
                    }
                    var thisItemCheck = $(this).prop("class").search("fa-check-square-o");

                    if(thisItemCheck != -1){
                        $(this).removeClass("fa-check-square-o").addClass("fa-square-o");
                        $(insertPageObj).find("#Designee").hide();

                    }else{
                        $(this).removeClass("fa-square-o").addClass("fa-check-square-o");
                        $(insertPageObj).find("#Designee").show();

                    }
                });

                // 修改
                if(modifyObj != undefined){
                    isModify = true;
                    // 事項
                    $(insertPageObj).find(".list-items").eq(0).find("input:text").val(modifyObj.Desc);

                    // 地點
                    $(insertPageObj).find(".list-items").eq(5).find("input:text").val(modifyObj.Location);

                    // 起日
                    $(insertPageObj).find("#StartDate").val(modifyObj.StartDate);
                    $(insertPageObj).find("#StartDate_content").text(modifyObj.StartDate);

                    // 迄日
                    var EndDate;
                    if(modifyObj.MyKeypoint != undefined){
                        EndDate = modifyObj.MyKeypoint.EndDate;
                    }else{
                        EndDate = modifyObj.EndDate;
                    }
                    $(insertPageObj).find("#EndDate").val(EndDate);
                    $(insertPageObj).find("#EndDate_content").text(EndDate);
                    // 取得細項內容
                    var sendData = {
                        api: calendarAPI+"GetToDoList",
                        data: {
                            userId: userID,
                            type: 1,
                            fid: modifyObj.Uid
                        }
                    };
                    $.getJSON(wrsUrl,sendData, function(rs){
                        if(rs.Status){
                            $.each(rs.Data,function(detailIndex, detailContent){
                                createDetail(detailPage, detailContent, detailPutArea, isModify, true,true);
                            });
                        }
                    });
                }else{
                    $(insertPageObj).find("#historiesArea").remove();
                }
                // 如果是編輯，無法新增細項
                if(!isModify){
                    $(insertPageObj).find("#addDetail").click(function(){
                        createDetail(detailPage, "", detailPutArea, isModify, false, true);
                    });
                }else{
                    $(insertPageObj).find("#addDetail").remove();
                    var historiesArea = $(insertPageObj).find(".list-items").eq(7).find(".control-label").eq(1);
                    if(modifyObj.Histories.length){
                        $.each(modifyObj.Histories, function(historiesIndex, historiesContent){
                            createDetail(detailPage, historiesContent, historiesArea, isModify, false,false);
                        });
                    }

                    // 增加辦況
                    $(insertPageObj).find("#addHistories").click(function(){
                        var tmpModifyObj = {
                            modifyObj: modifyObj,
                            modifyItem: modifyItem
                        };
                        createDetail(detailPage, modifyObj.Uid, historiesArea, isModify, true, false, tmpModifyObj);

                    });
                }


                $(insertPageObj).appendTo($("#insertDialog").find(".modal-body"));
            });
          });
        },
        button:[
            {
                text: saveBtn,
                className: "btn-success",
                click: function(){
                    var sendObj = getUserInput("insertDialog");

                    var isEmptyInput = false;
                    $.each(sendObj, function(i, content){
                        if(i != "Pricipal" && i != "Designee" && i != "Location"){
                            if(!content){
                                if(i != "StartDate" && i != "EndDate"){
                                    $("#insertDialog").find("#"+i).addClass("item-bg-danger");
                                }else{
                                    $("#insertDialog").find("#"+i+"_content").addClass("item-bg-danger").text("尚未選擇日期");
                                }
                                isEmptyInput = true;
                                console.log(i, content);
                            }
                        }
                    });

                    if(modifyObj != undefined){
                        sendObj.Uid = modifyObj.Uid;
                        sendObj.startDate = sendObj.StartDate;
                        sendObj.endDate = sendObj.EndDate;
                        sendObj.Trace = true;
                    }else{
                        sendObj.Fid = 0;
                        sendObj.Creater = {
                            Uid:userID
                        };
                        sendObj.Type = {
                            Uid: 2
                        };
                    }

                    var PricipalItem = $("#insertDialog").find("#PricipalItem").prop("class").search("fa-check-square-o");                        
                    var DesigneeItem = $("#insertDialog").find("#DesigneeItem").prop("class").search("fa-check-square-o");
                    // console.log(PricipalItem, DesigneeItem);
                    if(PricipalItem == -1 && DesigneeItem == -1){
                        
                        sendObj.Pricipal = {
                            Uid: userID,
                            Name: userLoginInfo.userName
                        };

                        sendObj.Designee = {
                            Uid: userID,
                            Name: userLoginInfo.userName
                        };
                        
                    }else{
                        if(DesigneeItem != -1){
                            sendObj.Pricipal = {
                                Uid: userID,
                                Name: userLoginInfo.userName

                            };
                            sendObj.Designee = {
                                Uid: sendObj.Designee,
                                Name: $("#insertDialog").find('#Pricipal :selected').text()

                            }
                        }
                        if(PricipalItem != -1){
                            sendObj.Designee = {
                                Uid: userID,
                                Name: userLoginInfo.userName

                            };
                            sendObj.Pricipal = {
                                Uid: sendObj.Pricipal,
                                Name: $("#insertDialog").find('#Pricipal :selected').text()

                            }
                        }
                    }

                    // console.log(sendObj);
                    // return;
                    if(modifyObj == undefined){
                        $("#total-content").find(".date-empty").remove();
                    }
                    if(!isEmptyInput){
                        saveData(sendObj, modifyItem);
                    }
                    // console.log(sendObj);
                }
            },
            {
                text: "取消",
                className: "btn-default-font-color",
                click: function(){
                    $("#insertDialog").bsDialog("close");
                }
            },
        ]
    });

}

// 創建細項或歷程
function createDetail(detailStyle, content, putArea, isModify, isHistories, isDetail, modifyObj){
    if(isHistories == undefined){
        isHistories = false;
    }
    if(isDetail == undefined){
        isDetail = false;
    }

    if(modifyObj == undefined){
        modifyObj = false;
    }

    var detailObj = $.parseHTML(detailStyle);
    var historiesPutArea = $(detailObj).find(".histories");
    
    // 刪除鈕
    $(detailObj).find(".fa-trash-o").click(function(){
        var removeArea = $(this).parents(".detail-item").eq(0);
        removeArea.remove();
    });
    if(isDetail){
        // 加號，可新增歷程
        $(detailObj).find(".fa-plus").click(function(){
            createDetail(detailStyle, content.Uid, historiesPutArea, isModify, true, false);
            // console.log("T");
        });

        $(detailObj).find(".fa-check").click(function(){
            finishList(content.Uid, 2);
            $(this).remove();
        });
    }
    // 目前沒有在編輯時新增細項的功能，所以應急先摘除
    if(isModify){

        if(isHistories){
            if(typeof content == "object"){
                $(detailObj).find("input:text").parent().html(content.Desc);
                $(detailObj).find(".fa-trash-o").remove();

                if(content.CompletionDate){
                    $(detailObj).find(".fa-check").remove();
                }
                $.each(content.Histories,function(i,historiesContents){
                    createDetail(detailStyle, historiesContents, historiesPutArea, isModify, false, false);
                });

            }else{
                $(detailObj).find(".fa-plus").remove();
                $(detailObj).find(".fa-check").removeClass("fa-check").addClass("fa-floppy-o").click(function(){
                    // console.log(content,$(detailObj).find("input:text").val());
                    var Desc = $(detailObj).find("input:text").val();
                    var listID = content;
                    saveHistories(listID, Desc, $(detailObj), modifyObj);

                });
            }
        }else{
            if(!isDetail){
                // 辦況
                $(detailObj).find("input:text").parent().html(content.Desc);
                $(detailObj).find(".fa-plus").remove();
                $(detailObj).find(".fa-check").remove();
                $(detailObj).find(".histories").remove();
                $(detailObj).find(".fa-trash-o").remove();
            }
        }
        
    }else{
        // 放內容
        $(detailObj).find("input:text").val(content.Desc);
        $(detailObj).find(".fa-check").remove();
        $(detailObj).find(".fa-plus").remove();


    }
    $(detailObj).appendTo(putArea);
}

// 取得回報和指派使用者列表
function getUserList(putAreaArr, selectID){
    var sendData = {
        api: "AssCommon/GetData_AssCommon",
        threeModal: true,
        data:{
            sys_code: sys_code
        }
    };
    $.getJSON(wrsUrl, sendData,function(rs){
        if(rs.Status){
            $.each(putAreaArr,function(i,putArea){
                $.each(rs.Data, function(dI, content){
                    selectOptionPut(putArea,content.userID,content.name);
                });
                if(selectID != null){
                    $(putArea).val(selectID);
                }
            });
        }else{
            $.each(putAreaArr,function(i,putArea){
                selectOptionPut(putArea,"","未有資料");
            });
        }
    });
    
}

// 完成事項
function finishList(uid, itemType){
    // var data = [];
    // data.push(uid);
    var sendData = {
        // api: calendarAPI+"CompleteToDoList",
        api: calendarAPI+"ReturnToDoList",
        data:{
            Type: itemType,
            ToDoId: uid
        },
        // changeJson: true
    };
    // console.log(sendData);
    $.ajax({
        url: wrsUrl,
        type: "POST",
        data: sendData,
        dataType: "JOSN",
        success: function(rs){
            // console.log(rs);
        }
    });
}

// 儲存
function saveData(sendObj,modifyItem){
    
    var method;
    var type;
    var data;
    var contentType = "";
    var changeJson = false;
    if(sendObj.Uid != undefined){
        method = "UpdateToDoList";
        type = "PUT";
        data = sendObj;
    }else{
        method = "InsertToDoList";
        type = "POST";
        data = [];
        data.push(sendObj);
        $("#insertDialog").find(".detail-item").each(function(){
            var detailItemVal = $(this).find("input:text").val();
            if(detailItemVal){
                var tmpObj = $.extend({}, sendObj);
                tmpObj.Desc = detailItemVal;
                tmpObj.Fid = -1;
                data.push(tmpObj);
            }
        });
        contentType = "application/json";
        changeJson = true;
    }
    var sendData ={
        api: calendarAPI+method,
        data: data,
        contentType: contentType,
        changeJson: changeJson
    };
    // return;
    $.ajax({
        url: wrsUrl,
        data: sendData,
        type: type,
        dataType: "JSON",
        success: function(rs){
            console.log(rs);
            if(rs.Status){
                if(sendObj.Uid != undefined){
                    // 事項標題
                    $(modifyItem).find(".list-items").eq(0).text(sendObj.Desc);
                    // 迄日
                    $(modifyItem).find(".list-items").eq(2).text(sendObj.EndDate);
                }else{
                    sendObj.Uid = rs.Data[0];
                    putDataToPage(sendObj, $("#total-content"), true);
                }
                $("#insertDialog").bsDialog("close");
            }else{
                errorDialog(rs.Data);
            }
        }
    });
}

function deleteData(uid, removeArea){
    var data = [];
    data.push(uid);
    var sendData = {
        api: calendarAPI+"DeleteToDoList",
        data:data,
        contentType: "application/json",
        changeJson: true
    };
    $.ajax({
        url: wrsUrl,
        type: "DELETE",
        data: sendData,
        success: function(rs){
            var rs = $.parseJSON(rs);
            if(!rs.Status){
                errorDialog(rs.Data);
            }else{
                $(removeArea).remove();
                $("#total-content").find(".dataContent").last().removeClass("list-items-bottom");
            }
            
        }
    });
}

function saveHistories(listID,Desc, area, modifyObj){
    var floppy = $(area).find(".fa-floppy-o");
    var trash = $(area).find(".fa-trash-o");
    floppy.hide();
    trash.hide();

    var data = [];
    var sendObj = {
        ListId: listID,
        Desc: Desc
    }
    data.push(sendObj);
    var sendData = {
        api: calendarAPI+"InsertHistories",
        data:data,
        contentType: "application/json",
        changeJson: true
    };
    $.post(wrsUrl, sendData).done(function(rs){
        // console.log(rs);
        var rs = $.parseJSON(rs);
        if(rs.Status){
            floppy.remove();
            trash.remove();
            $(area).find("input:text").parent().text(Desc);
            if(modifyObj){
                modifyObj.modifyObj.Histories.push(sendObj);
                $(modifyObj.modifyItem).find(".fa-pencil-square-o").unbind("click").click(function(){
                    insertDialog( modifyObj.modifyObj , $(modifyObj.modifyItem) );
                });
            }
        }else{
            floppy.show();
            trash.show();
        }
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
                                createDetail(detailPage, detailContent, detailPutArea, isModify, true,true);
                            });
                        }
                    });
                
                $(calendarViewObj).find("#addDetail").remove();

                var historiesArea = $(calendarViewObj).find(".list-items").eq(7).find(".control-label").eq(1);
                if(content.Histories.length){
                    $.each(content.Histories, function(historiesIndex, historiesContent){
                        createDetail(detailPage, historiesContent, historiesArea, isModify, false,false);
                    });
                }

                // 增加辦況
                $(calendarViewObj).find("#addHistories").click(function(){
                    var tmpModifyObj = {
                        modifyObj: content,
                        modifyItem: putArea
                    };
                    createDetail(detailPage, content.Uid, historiesArea, isModify, true, false, tmpModifyObj);

                });

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

// 回報事項
function returmWorkDialog(){
    $("#returmWorkDialog").remove();
    $("<div>").prop("id","returmWorkDialog").appendTo("body");

    $("#returmWorkDialog").bsDialog({
        autoShow:true,
        showFooterBtn:true,
        title: "回報事項",
        start:function(){

            var msgDiv = $("<div>").html(msg);
            $("#returmWorkDialog").find(".modal-body").append(msgDiv);
        },
        button:[{
            text: "關閉",
            className: "btn-danger",
            click: function(){
                $("#returmWorkDialog").bsDialog("close");
            }
        }
        ]
    });
}


// 錯誤訊息
function errorDialog(msg){
    $("#errorDialog").remove();
    $("<div>").prop("id","errorDialog").appendTo("body");

    $("#errorDialog").bsDialog({
        autoShow:true,
        showFooterBtn:true,
        title: "錯誤",
        start:function(){

            var msgDiv = $("<div>").html(msg);
            $("#errorDialog").find(".modal-body").append(msgDiv);
        },
        button:[{
            text: "關閉",
            className: "btn-danger",
            click: function(){
                $("#errorDialog").bsDialog("close");
            }
        }
        ]
    });
}