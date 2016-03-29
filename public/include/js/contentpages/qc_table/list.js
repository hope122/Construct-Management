// $(function(){
//   getQCTableTypeList();
//   // getQCTableTitleList();
// });

// 取得範本相關
function getQCTemplate(){
  $("#table-template").empty();
  selectOptionPut("table-template","null","請選擇自檢表");
  var typeId = $("#tableType").val();
  // console.log(typeId);
  $.getJSON(QCAPI + "GetTempTitle",{typeId:typeId},function(rs){
    // console.log(rs);

    if(rs.Status){
      // console.log(rs);
      // var optionStr = '';
      $.each(rs.Data,function(index,content){
        selectOptionPut("table-template",content.Uid,content.Name);
        
      });
    }
  });
}

// 取得總表內容
function getQCTotalTableList(showArea){
  $("#"+showArea).empty();
  // selectOptionPut("titleID","null","請選擇自檢表");
  // $.getJSON(QCAPI + "GetTitle",function(rs){
  var typeId = $("#totalTableType").val();
  $.getJSON(QCAPI + "GetEmptyList",{typeId:typeId},function(rs){
    // console.log(rs);

    if(rs.Status){
        var option = {
          styleKind:"list",
          style:"1grid-modify"
        }
        getStyle(option, function(tableListStyle){

            $.each(rs.Data,function(index,content){
                var tableList = $.parseHTML(tableListStyle);
                $(tableList).addClass("listContent");
                $(tableList).find(".name").html(content.Name);
                // 編輯按鈕
                $(tableList).find(".fa-pencil-square-o").click(function(){
                    // console.log(content.uid);

                  openModifyDialog(content.Uid);
                });
                // 修改按鈕
                $(tableList).find(".fa-trash-o").click(function(){
                  // var data = $.param({checkListID: content.Uid});
                  // console.log(data);
                  $.ajax({
                    url: QCAPI + "DeleteEmptyCheckList",
                    data: {checkListID: content.Uid},
                    type:"DELETE",
                    success: function(){
                      getQCTotalTableList(showArea);
                    }
                  });
                  
                });
                // selectOptionPut("titleID",content.Uid,content.Name);
                $(tableList).appendTo("#"+showArea);
            });
            // console.log($("#"+showArea).find(".listContent").last());
            $("#"+showArea).find(".listContent").last().removeClass("list-items-bottom");

        });
      
    }

  });
}

// 取得標題相關內容
function getQCTableTitleList(showArea, API){
  // console.log(API);
  $("#"+showArea).empty();
  // selectOptionPut("titleID","null","請選擇自檢表");
  // $.getJSON(QCAPI + "GetTitle",function(rs){
  if(API == "GetEngSingleList"){
    API = qcTableListAPI + API;
    option = {type:"c"};
  }else{
    API = qcMaterielAPI + API;
    option = {};
  }
  $.getJSON(API,option,function(rs){
    // console.log(rs);

    if(rs.status){
        getTableListStyle(function(tableListStyle){

            $.each(rs.data,function(index,content){
                var tableList = $.parseHTML(tableListStyle);
                $(tableList).find(".table-name").html(content.name);
                $(tableList).find(".edit-btn").click(function(){
                    content.uid;
                    // console.log(content.uid);
                    openDialog(content.name, content.uid);
                });
                // selectOptionPut("titleID",content.Uid,content.Name);
                $(tableList).appendTo("#"+showArea);
            });
            $("#"+showArea).find(".listContent").last().removeClass("item-border-bottom");

        });
      
    }

  });
}

function getQCTableTypeList(objectID,typeValID,isInsert){
  if(typeof isInsert == "undefined"){
    isInsert = false;
  }

  $.getJSON(QCAPI + "GetCheckListType",function(rs){
    // console.log(rs);

    if(rs.Status){
      
      // var optionStr = '';
      $.each(rs.Data,function(index,content){
        // selectOptionPut("tableType",content.Uid,content.Name);
        var liItem = $.parseHTML("<li>");
        var tabBtnItem = $.parseHTML("<a>");
        var tabContentItem = $.parseHTML("<div>");

        $(tabContentItem).addClass("col-xs-12 col-md-12 tab-border item-display-n "+objectID+"-tab-content")
        .prop("id",objectID+"-"+content.Uid+"-content");

        $(tabBtnItem).prop("href","#")
        .prop("id",objectID+"-"+content.Uid)
        .html(content.Name).click(function(){
          $("#"+typeValID).val(content.Uid);
           // console.log(isInsert);
          if(isInsert){
            // console.log("T");
            var API = "GetEngSingleList";
            if(content.Uid == 1){
              API = "getMaterielList";
            }
            getQCTableTitleList(objectID+"-"+content.Uid+"-content", API);
          }else{
            getQCTotalTableList(objectID+"-"+content.Uid+"-content");
          }
        });

        $(liItem).attr("role","presentation")
        .append(tabBtnItem)
        .appendTo("#"+objectID);

        $("#"+objectID).after(tabContentItem);
        if(index == 0){
          $("#tableType").val(content.Uid);
        }

      });
      //tab事件
      tabCtrl(objectID);
      // 第一個增加選取ＣＬＡＳＳ和點擊
      $("#"+objectID).find("li").first().addClass("active")
      .find("a").click();

      // getQCTableTitleList();

    }
  });
}

// 頁面列表樣式
function getTableListStyle(callback){
  // console.log(tableDataObj);
  $.get("pages/style/qc_table/table_listContent_style.html").done(function(pageList){
    callback(pageList);
  });
}

// 頁面樣式
function getBorderStyle(callback){
  $.get("pages/style/qc_table/item_borderContent_style.html").done(function(data){
    // manipulation to get required data
    // var d = data;
    var tmpData = $.parseHTML(data);
    qcItemSelectContent(function(itemSelectContent){
      $("<option>").val("null").text("請選擇項目").appendTo($(tmpData).find(".qcItemSelect"));
      $.each(itemSelectContent.Data,function(i,content){
        $("<option>").val(content.Uid).text(content.Name).appendTo( $(tmpData).find(".qcItemSelect") );
      });
      data = $(tmpData)[0].outerHTML;
      // console.log(data);
      callback(data);
    });

  });
}

// 頁面列表樣式
function getListStyle(callback){
  // console.log(tableDataObj);
  $.get("pages/style/qc_table/item_list_style.html").done(function(pageList){
    callback(pageList);
  });
}

//項目選項
function qcItemSelectContent(callback){
  $.getJSON(QCAPI + "GetItem").done(function(data){
    callback(data);
  });
}

function addContent(){
  // 取得最外匡的樣式
  getBorderStyle(function(pageBorder){
    var pageBorderObj = $.parseHTML(pageBorder);
    $(pageBorderObj).appendTo("#table-totalContent");
  });
  // 外匡樣式結束
}

function addListContent(object){
  var object = object.parent().parent().find(".item-list");
  // 取得內匡的樣式
    getListStyle(function(pageList){
      var pageListObj = $.parseHTML(pageList);
      $(pageListObj).appendTo(object);
    });
  // console.log(object);
}

function removeItem(object){
  object.parent().parent().remove();
}

//套用範本
function getQCTableTitleContent(){
  var titleID = $("#titleID").val();
  var tableTemplate = $("#table-template").val();

  if(titleID != "null" && tableTemplate != "null"){
    // 放入標題
    var tableTitle = $("#tableTitleName").val();
    $("#qc_table_title").prop("readonly",true).val(tableTitle);

    $("#table-totalContent").empty();
    $.getJSON(QCAPI + "GetTemplate", {tempTitleID:tableTemplate}, function(rs){
      // console.log(rs);
      if(rs.Status){

        var tableDataObj = processTableData(rs.Data);
        // 取得最外匡的樣式
        getBorderStyle(function(pageBorder){
          // 取得內匡的樣式
          getListStyle(function(pageList){
            //放入
            $.each(tableDataObj, function(index,content){
              var pageBorderObj = $.parseHTML(pageBorder);
              // console.log(content);
              // $(pageBorderObj).find(".item-title").val(content.name);
              $(pageBorderObj).find(".aplyQCItemSelect").prop("checked",true);
              QCItemCheckSelect($(pageBorderObj).find(".aplyQCItemSelect"));
              $(pageBorderObj).find(".qcItemSelect").val(content.uid);

              $.each(content.child,function(childIndex,childContent){
                var pageListObj = $.parseHTML(pageList);
                $(pageListObj).addClass("qcDetialItem");
                $(pageListObj).find(".item-list-title").prop("id",childContent.DI_uid).val(childContent.DI_Name);
                $(pageListObj).find(".standard-value").prop("id",childContent.SV_uid).val(childContent.SV_Name);
                // standard-value
                // console.log(childIndex,childContent)
                $(pageListObj).appendTo( $(pageBorderObj).find(".item-list") );
              });
              $(pageBorderObj).find(".list-items-bottom").last().removeClass("list-items-bottom");
              $(pageBorderObj).appendTo("#table-totalContent");

            });
            // 放入結束
          });
          // 內匡樣式結束

        });
        // 外匡樣式結束

      }
    });

    
  }
}

// 取得編輯內容
// GET /api/CheckList/GetTemplate
function getQCTableModifyContent(uid){
  var selectTableObj = getUserInput("selectTableItem");
  
  if(uid != "null"){
    $(".qc-table-content").show();
    // 放入標題
    // var tableTitle = $("#titleID :selected").text();

    $("#table-totalContent").empty();
    $.getJSON(QCAPI + "GetEmptyCheckList", {titleID:uid}, function(rs){
      // console.log(rs);
      // return;
      if(rs.Status){

        var tableDataObj = processTableData(rs.Data.MyContent);
        $("#qc_table_title_modify").html(rs.Data.MyHead.Title.Name);

        // 取得最外匡的樣式
        getBorderStyle(function(pageBorder){
          // 取得內匡的樣式
          getListStyle(function(pageList){
            //放入
            $.each(tableDataObj, function(index,content){
              var pageBorderObj = $.parseHTML(pageBorder);
              // console.log(content);
              // $(pageBorderObj).find(".item-title").val(content.name);
              $(pageBorderObj).find(".aplyQCItemSelect").prop("checked",true);
              QCItemCheckSelect($(pageBorderObj).find(".aplyQCItemSelect"));
              $(pageBorderObj).find(".qcItemSelect").val(content.uid);

              $.each(content.child,function(childIndex,childContent){
                var pageListObj = $.parseHTML(pageList);
                $(pageListObj).addClass("qcDetialItem");
                $(pageListObj).find(".item-list-title").prop("id",childContent.DI_uid).val(childContent.DI_Name);
                $(pageListObj).find(".standard-value").prop("id",childContent.SV_uid).val(childContent.SV_Name);
                // standard-value
                // console.log(childIndex,childContent)
                $(pageListObj).appendTo( $(pageBorderObj).find(".item-list") );
              });
              $(pageBorderObj).appendTo("#table-totalContent");
            });
            // 放入結束
          });
          // 內匡樣式結束

        });
        // 外匡樣式結束

      }
    });
  }
}

//新增
function saveQCTable(){
  var selectTableObj = getUserInput("selectTableItem");
  // var tableType = $("#tableType").val();
  var tableTitle,
    TitleUid,
    MyContent=[];
  var titleID = $("#titleID").val();
  // 放入標題
  var tableTitle = $("#tableTitleName").val();
  var templateUse = $("#templateUse").prop("checked");
  // 使用範本
  if(templateUse){
    tableTitle = tableTitle;
    TitleUid = titleID;
  }else{ // 不使用範本
    tableTitle = $("#qc_table_title").val();
    TitleUid = 0;
  }

  $("#table-totalContent").find(".qcTableItem").each(function(){
    var aplyQCItemChecked = $(this).find(".aplyQCItemSelect").prop("checked");
    if(!aplyQCItemChecked){
      var itemTitle = $(this).find(".item-title").val();
    }else{
      var itemTitle = $(this).find(".qcItemSelect :selected").text();
      var itemtUid = $(this).find(".qcItemSelect").val();
    }


    $(this).find(".item-list li").each(function(){
      var DITitle = $(this).find(".item-list-title").val();
      var standardValue = $(this).find(".standard-value").val();
      var tmpDIUid = $(this).find(".item-list-title").prop("id");
      var tmpDIStdVal = $(this).find(".standard-value").prop("id");
      var DIUid = (tmpDIUid == "" ) ? 0:tmpDIUid;
      var DIStdVal = (tmpDIStdVal == "")? 0:tmpDIStdVal;
      var tmpObj = {
        "Item": {
          "Uid": itemtUid,//大於0就不用帶ＮＡＭＥ
          "Name": itemTitle
        },
        "DetialItem": {
          "Uid": DIUid,
          "Name": DITitle
        },
        "StdVal": {
          "Uid": DIStdVal,
          "Name": standardValue
        }
      };
      MyContent.push(tmpObj);

    });
  });
    // console.log(MyContent);
  var sendObj = {
      MyHead:{
        Project:{
          Uid: 1
        },
        Title:{
          Uid:TitleUid, 
          Name:tableTitle
        },
        Type:{
          Uid: selectTableObj.tableType
        }
      },
      MyContent:MyContent
    };
  if(selectTableObj.tableType != "null"){
    $.post(QCAPI + "SaveEmptyCheckList",sendObj,function(){
        $("#insertDialog").bsDialog("close");
        $("#myModal").bsDialog("close");
    });
  }
  // console.log(sendObj);
}


//修改
function saveModifyQCTable(){
  var selectTableObj = getUserInput("selectTableItem");

  var tableTitle,
    TitleUid,
    MyContent=[];
  TitleUid = $("#titleID").val();
  

  $("#table-totalContent").find(".qcTableItem").each(function(){
    var aplyQCItemChecked = $(this).find(".aplyQCItemSelect").prop("checked");
    if(!aplyQCItemChecked){
      var itemTitle = $(this).find(".item-title").val();
    }else{
      var itemTitle = $(this).find(".qcItemSelect :selected").text();
      var itemtUid = $(this).find(".qcItemSelect").val();
    }


    $(this).find(".item-list li").each(function(){
      var DITitle = $(this).find(".item-list-title").val();
      var standardValue = $(this).find(".standard-value").val();
      var tmpDIUid = $(this).find(".item-list-title").prop("id");
      var tmpDIStdVal = $(this).find(".standard-value").prop("id");
      var DIUid = (tmpDIUid == "" ) ? 0:tmpDIUid;
      var DIStdVal = (tmpDIStdVal == "")? 0:tmpDIStdVal;
      var tmpObj = {
        "Item": {
          "Uid": itemtUid,//大於0就不用帶ＮＡＭＥ
          "Name": itemTitle
        },
        "DetialItem": {
          "Uid": DIUid,
          "Name": DITitle
        },
        "StdVal": {
          "Uid": DIStdVal,
          "Name": standardValue
        }
      };
      MyContent.push(tmpObj);

    });
  });
    // console.log(MyContent);

  var sendObj = {
      checkListID:TitleUid,
      cnt:MyContent
    };
  // console.log(sendObj);

    // return;
  $.post(QCAPI + "UpdateEmptyCheckList",sendObj);
  // console.log(sendObj);
}

// 套用項目範本
function QCItemCheckSelect(object){
  var checked = object.prop("checked");

  object = object.parent().parent().parent().parent();
  // console.log(object);
  if(checked){
    object.find(".item-title").hide();
    object.find(".qcItemSelect").show();
  }else{
    // console.log(checked);
    object.find(".item-title").show();
    object.find(".qcItemSelect").hide();
    object.find(".qcItemSelect").val("null");
    object.find(".item-list").find(".qcDetialItem").remove();
  }
  // console.log(checked);
}

function QCItemSelect(object){
  var itemID = object.val();
  object = object.parent().parent();
  object.find(".item-list").find(".qcDetialItem").remove();
  if(itemID != "null"){
    putQCItemSelect( object, itemID );
  }
}

//放入套用項目範本
function putQCItemSelect(object,itemID){
  console.log(object);
  $.getJSON(QCAPI + "GetDetialItem",{itemID:itemID}).done(function(DIItem){
    // console.log(DIItem);
    // 取得內匡的樣式
    getListStyle(function(pageList){

        $.each(DIItem.Data,function(childIndex,childContent){
          // console.log(childContent);
          var pageListObj = $.parseHTML(pageList);
          $(pageListObj).addClass("qcDetialItem");
          $(pageListObj).find(".item-list-title").prop("id",childContent.DetialItem.Uid).val(childContent.DetialItem.Name).prop("readonly",true);
          // $(pageListObj).find(".standard-value").prop("id",childContent.SV_uid).val(childContent.SV_Name);
          $(pageListObj).find(".standard-value").prop("id",childContent.StdVal.Uid).val(childContent.StdVal.Name).prop("readonly",true);
          // standard-value
          // console.log(childIndex,childContent)
          $(pageListObj).appendTo( object.find(".item-list") );
        });
      // 放入結束
    });
  });
}

function processTableData(data){
  var obj = {};
  $.each( data, function(index,content){
    if(typeof obj["uid_" + content.Item.Uid] == "undefined"){
      obj["uid_" + content.Item.Uid] = {};
      obj["uid_" + content.Item.Uid].uid = content.Item.Uid;
      obj["uid_" + content.Item.Uid].name = content.Item.Name;
      obj["uid_" + content.Item.Uid].child = [];
    }
      // console.log(content.DetialItem);
      var tmpObj = {
        DI_uid: content.DetialItem.Uid,
        DI_Name: content.DetialItem.Name,
        SV_uid: content.StdVal.Uid,
        SV_Name: content.StdVal.Name
      };
    obj["uid_" + content.Item.Uid]["child"].push(tmpObj);
    
    // console.log(content);
    
  });
  return obj;
  // console.log(obj);
}

// 頁面新增樣式
function getTableInsertStyle(callback){
  // console.log(tableDataObj);
  $.get("pages/style/qc_table/table_insert_style.html").done(function(insertPage){
    callback(insertPage);
  });
}

function openDialog(title, uid){
  // $("#myModal").on('show.bs.modal', function(event){
  //     console.log(event);
  //       // var button = $(event.relatedTarget);  // Button that triggered the modal
  //       // var titleData = button.data('title'); // Extract value from data-* attributes
  //       // $(this).find('.modal-title').text(titleData + ' Form');
  //       var thisObj = $(this).find(".modal-body");
  //       getTableInsertStyle(function(insertPage){
  //         thisObj.html(insertPage);
  //       });
  // }).on('hidden.bs.modal',function(event){
  //     console.log(event);

  // });
  $("#myModal").remove();
  var myModalDialog = $("<div>").prop("id","myModal");
  myModalDialog.appendTo("body");
  
  $("#myModal").bsDialog({
    title: "新增自檢表 - "+title,
    start: function(){
      getTableInsertStyle(function(insertPage){
        var insertPageObj = $.parseHTML(insertPage);
        // $("#myModal").find(".modal-body").empty();

        $(insertPageObj).find("#titleID").val(uid);
        $(insertPageObj).find("#tableTitleName").val(title);
        $(insertPageObj).find(".templateUse").change(function(){
          // console.log($(this).prop("checked"));
          if($(this).prop("checked")){
            getQCTableTitleContent();
          }else{
            $("#table-totalContent").empty();
            $("#qc_table_title").prop("readonly",false).val("");
          }
        });
        $(insertPageObj).appendTo( $("#myModal").find(".modal-body") );

        getQCTemplate();
        $("#myModal").bsDialog("show");
      });
    },
    button:[
      {
        text: "新增",
        className: "btn-success",
        click: function(){
          saveQCTable();
        }
      },
      {
        text: "取消",
        className: "btn-default-font-color",
        click: function(){
          $("#myModal").bsDialog("close");
        }
      },
    ]
  });
}
// 新增Dialog
function openInsertDialog(){
  $("#insertDialog").remove();
  var insertDialog = $("<div>").prop("id","insertDialog");
  insertDialog.appendTo("body");
  
  $("#insertDialog").bsDialog({
    title: "新增自檢表",
    start: function(){
      var option = {styleKind:"qc_table",style:"table-insert"};
      getStyle(option,function(insertPage){
        var insertPageObj = $.parseHTML(insertPage);

        $("#insertDialog").find(".modal-body").html(insertPageObj);
        $("#insertDialog").bsDialog("show");
        getQCTableTypeList("tableTypeTab","tableType",true);

      });
    },
    showFooterBtn: false
  });
}

// 修改Dialog
function openModifyDialog(uid){
  $("#modifyDialog").remove();
  var modifyDialog = $("<div>").prop("id","modifyDialog");
  modifyDialog.appendTo("body");
  
  $("#modifyDialog").bsDialog({
    start: function(){
      var option = {styleKind:"qc_table",style:"table_insert_style"};

      getStyle(option,function(insertPage){
        var insertPageObj = $.parseHTML(insertPage);
        insertPageObj = $("<div>").html(insertPageObj);
        $(insertPageObj).find(".insertItem").remove();
        $(insertPageObj).find("#titleID").val(uid);
        // console.log(insertPageObj);
        $("#modifyDialog").find(".modal-body").html(insertPageObj);
        $("#modifyDialog").bsDialog("show");
        // getQCTableTypeList("tableTypeTab","tableType",true);
        // console.log(uid);
        getQCTableModifyContent(uid);
      });
    },
    button:[
      {
        text:"儲存",
        className: "btn-success",
        click: function(){
          saveModifyQCTable();
        }
      },
      {
        text: "取消",
        className: "btn-default-font-color",
        click: function(){
          $("#modifyDialog").bsDialog("close");
        }
      },
    ]
  });
}
