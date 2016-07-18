var sys_code = userLoginInfo.sysCode;
var userID = userLoginInfo.userID;
$(function(){
    tabContentCtrl($("#totalTab"));
    getData();
    $("#personal").click(function(){
        getData();

    });
    $("#total").click(function(){
        getData();

    });
});

function getData(){
    $("#totalContent").find(".dataContent").remove();
    $("#totalContent").find(".date-empty").remove();

    var sendData = {
        api: dispatchAPI+"getTemplate",
        data:{
            sysCodeId: sys_code
        }
    };

    $.getJSON(wrsUrl, sendData).done(function(rs){
        if(rs.status){
            putDataToPage(rs.data, $("#totalContent"));
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
    var option = {styleKind:"dispatch-sample",style:"list"};
    // 取得畫面樣式
    getStyle(option,function(pageStyle){
        if(!onlyData){
            $.each(data, function(index,content){
                var pageStyleObj = $.parseHTML(pageStyle);
                $(pageStyleObj).addClass("dataContent");

                // 標題
                $(pageStyleObj).find(".list-items").eq(0).html(content.gist);

                // 類別
                $(pageStyleObj).find(".list-items").eq(1).text(desiStr);

                // 類型
                $(pageStyleObj).find(".list-items").eq(2).text(content.typeName);
                

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
                console.log(data);
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
                // putArea.find(".dataContent").eq(-1).addClass("list-items-bottom").after(pageStyleObj);
                putArea.find(".dataContent").eq(0).addClass("list-items-bottom").before(pageStyleObj);
            }else{
                $(pageStyleObj).removeClass("list-items-bottom").appendTo(putArea);

            }
        }
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
        title = "修改範本";
        saveBtn = "修改";
    }else{
        title = "新增範本";
        saveBtn = "新增";
    }
    $("#insertDialog").remove();
    var insertDialog = $("<div>").prop("id","insertDialog");
    insertDialog.appendTo("body");

    $("#insertDialog").bsDialog({
        title: title,
        autoShow: true,
        start: function(){
          var option = {styleKind:"dispatch-sample",style:"insert"};
          getStyle(option,function(insertPage){
            
                var insertPageObj = $.parseHTML(insertPage);
                
                $(insertPageObj).find("#content").ckeditor();
                
                var categoryPutArea = $(insertPageObj).find("#category");
                categoryPutArea.empty();
                // 修改
                if(modifyObj != undefined){
                    // 事項
                    $(insertPageObj).find(".list-items").eq(0).find("input:text").val(modifyObj.gist);
                    $(insertPageObj).find("#content").val(modifyObj.content);

                    // // 地點
                    // $(insertPageObj).find(".list-items").eq(5).find("input:text").val(modifyObj.Location);

                    // // 起日
                    // $(insertPageObj).find("#StartDate").val(modifyObj.StartDate);
                    // $(insertPageObj).find("#StartDate_content").text(modifyObj.StartDate);
                    
                    getSampleListData(categoryPutArea);
                }else{
                    // 
                    getSampleListData(categoryPutArea);
                    
                }
                // 類別、類型
                $(insertPageObj).find("#category").change(function(){
                    var sampleTypePutArea = $(insertPageObj).find("#type_id");
                    getSampleListData(sampleTypePutArea, $(this).val());
                });

                // 類別重整鈕
                $(insertPageObj).find("#categoryRefresh").click(function(){
                    categoryPutArea.empty();
                    getSampleListData(categoryPutArea);
                });

                // 類型重整鈕
                $(insertPageObj).find("#typeRefresh").click(function(){
                    var categoryVal = $(insertPageObj).find("#category").val();
                    var sampleTypePutArea = $(insertPageObj).find("#type_id");
                    getSampleListData(sampleTypePutArea, categoryVal);
                });

                $(insertPageObj).appendTo($("#insertDialog").find(".modal-body"));
            
          });
        },
        button:[
            {
                text: "取消",
                className: "btn-default-font-color",
                click: function(){
                    $("#insertDialog").bsDialog("close");
                }
            },
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

                    // console.log(sendObj);
                    // return;
                    
                    if(!isEmptyInput){
                        saveData(sendObj, modifyItem);
                        if(modifyObj == undefined){
                            $("#total-content").find(".date-empty").remove();
                        }
                    }
                    // console.log(sendObj);
                }
            }
            
        ]
    });

}

// 儲存
function saveData(sendObj,modifyItem){
    console.log(sendObj);
    return;

    var method;
    var type;
    if(sendObj.uid != undefined){
        method = "setTemplateUpdate";
        type = "POST";
    }else{
        method = "setTemplateInsert";
        type = "POST";
    }
    var sendData ={
        api: dispatchAPI+method,
        data: sendObj,
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
                    // 標題
                    $(modifyItem).find(".list-items").eq(0).text(sendObj.gist);
                    // 迄日
                    // $(modifyItem).find(".list-items").eq(2).text(sendObj.EndDate);
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

// 類別
function getSampleListData(putArea, sampleCategoryID, sampleTypeID, setSampleCategory){
    var sendObj = {
        api: typeAPI + "getDocTypeList",
        data: {
            code_id: sys_code
        }
    };
    if(setSampleCategory == undefined){
        setSampleCategory = false;
    }
    var str = "未有類別";
    // 取類別列表
    if(sampleCategoryID != undefined){
        sendObj.data.uid = sampleCategoryID;
        putArea.empty();
        str = "未有類型";
    }

    $.getJSON(wrsUrl, sendObj, function(rs){
        if(rs.status && rs.data != null){
            $.each(rs.data, function(i, v){
                selectOptionPut(putArea, v.uid, v.name);
            });
            if(sampleTypeID != undefined){
                // 選單預設值
                putArea.val(sampleTypeID);
            }
            if(setSampleCategory){
                // 選單預設值
                putArea.val(sampleCategoryID);
            }
            // console.log(sampleCategoryID, sampleTypeID);
            putArea.change();
        }else{
            selectOptionPut(putArea, "", str);
        }
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