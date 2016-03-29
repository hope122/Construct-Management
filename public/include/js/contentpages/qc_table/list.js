$(function(){
  getQCTableTypeList();
  // getQCTableTitleList();
});

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

// 取得標題相關
function getQCTableTitleList(showArea){
  $("#table-list").empty();
  // selectOptionPut("titleID","null","請選擇自檢表");
  // $.getJSON(QCAPI + "GetTitle",function(rs){
  $.getJSON(qcTableListAPI + "GetEngSingleList",{type:"c"},function(rs){
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

function getQCTableTypeList(){
  $.getJSON(QCAPI + "GetCheckListType",function(rs){
    // console.log(rs);

    if(rs.Status){
      
      // var optionStr = '';
      $.each(rs.Data,function(index,content){
        // selectOptionPut("tableType",content.Uid,content.Name);
        var liItem = $.parseHTML("<li>");
        var tabBtnItem = $.parseHTML("<a>");
        var tabContentItem = $.parseHTML("<div>");

        $(tabContentItem).addClass("col-xs-12 col-md-12 tab-border item-display-n tableTypeTab-tab-content")
        .prop("id","tableTab-"+content.Uid+"-content");

        $(tabBtnItem).prop("href","#")
        .prop("id","tableTab-"+content.Uid)
        .html(content.Name).click(function(){
          $("#tableType").val(content.Uid);
          getQCTableTitleList("tableTab-"+content.Uid+"-content");
        });

        $(liItem).attr("role","presentation")
        .append(tabBtnItem)
        .appendTo("#tableTypeTab");

        $("#tableTypeTab").after(tabContentItem);
        if(index == 0){
          $("#tableType").val(content.Uid);
        }

      });
      //tab事件
      tabCtrl("tableTypeTab");
      // 第一個增加選取ＣＬＡＳＳ和點擊
      $("#tableTypeTab").find("li").first().addClass("active")
      .find("a").click();

      getQCTableTitleList();

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

//新增與修改
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
    $.post(QCAPI + "SaveEmptyCheckList",sendObj);
  }
  // console.log(sendObj);
}


// 套用項目範本
function QCItemCheckSelect(object){
  var checked = object.prop("checked");

  object = object.parent().parent().parent().parent();
  if(checked){
    object.find(".item-title").hide();
    object.find(".qcItemSelect").show();
  }else{
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
    putQCItemSelect( object.parent(), itemID );
  }
}

//放入套用項目範本
function putQCItemSelect(object,itemID){
  $.getJSON(QCAPI + "GetDetialItem",{itemID:itemID}).done(function(DIItem){
    // console.log(DIItem);
    // 取得內匡的樣式
    getListStyle(function(pageList){

        $.each(DIItem.Data,function(childIndex,childContent){
          // console.log(childContent);
          var pageListObj = $.parseHTML(pageList);
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
        click: function(){
          $("#myModal").bsDialog("close");
        }
      },
    ]
  });
}
