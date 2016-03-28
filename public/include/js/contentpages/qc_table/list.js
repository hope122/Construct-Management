$(function(){
  getQCTableTypeList();
  // getQCTableTitleList();
});

// 取得標題相關
function getQCTableTitleList(){
  $("#table-list").empty();
  // selectOptionPut("titleID","null","請選擇自檢表");
  $.getJSON(QCAPI + "GetTitle",function(rs){
    // console.log(rs);

    if(rs.Status){
        getTableListStyle(function(tableListStyle){

            $.each(rs.Data,function(index,content){
                var tableList = $.parseHTML(tableListStyle);
                $(tableList).find(".table-name").html(content.Name);
                $(tableList).find(".edit-btn").click(function(){
                    content.Uid;
                    console.log(content.Uid);
                });
                // selectOptionPut("titleID",content.Uid,content.Name);
                $(tableList).appendTo("#table-list");
            });
            $("#table-list").find(".listContent").last().removeClass("item-border-bottom");

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
        // selectOptionPut("tebleType",content.Uid,content.Name);
        var liItem = $.parseHTML("<li>");
        var tabBtnItem = $.parseHTML("<a>");
        var tabContentItem = $.parseHTML("<div>");

        $(tabContentItem).addClass("col-xs-12 col-md-12 tab-border item-display-n tableTypeTab-tab-content")
        .prop("id","tableTab-"+content.Uid+"-content");

        $(tabBtnItem).prop("href","#")
        .prop("id","tableTab-"+content.Uid)
        .html(content.Name).click(function(){
          $("#tebleType").val(content.Uid);
        });

        $(liItem).attr("role","presentation")
        .append(tabBtnItem)
        .appendTo("#tableTypeTab");

        $("#tableTypeTab").after(tabContentItem);
        if(index == 0){
          $("#tebleType").val(content.Uid);
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

//新增與修改
function saveQCTable(){
  var selectTableObj = getUserInput("selectTableItem");
  // var tebleType = $("#tebleType").val();
  var tableTitle,
    TitleUid,
    MyContent=[];

  if(selectTableObj.titleID != "null"){// 新增
    tableTitle = $("#titleID :selected").text();
    TitleUid = $("#titleID").val();
  }else{
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
    // $.post(QCAPI + "SaveEmptyCheckList",sendObj);
  }
  console.log(selectTableObj);
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

function openDialog(){
  $("#myModal").on('show.bs.modal', function(event){
      console.log(event);
        // var button = $(event.relatedTarget);  // Button that triggered the modal
        // var titleData = button.data('title'); // Extract value from data-* attributes
        // $(this).find('.modal-title').text(titleData + ' Form');
        var thisObj = $(this).find(".modal-body");
        getTableInsertStyle(function(insertPage){
          thisObj.html(insertPage);
        });
  }).on('hidden.bs.modal',function(event){
      console.log(event);

  });

  $("#myModal").modal({
    backdrop: 'static',
    // remote: 'pages/style/qc_table/table_insert_style.html'
  });
}
