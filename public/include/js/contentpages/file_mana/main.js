// 變數
var processAreaStatus = true;
var fileType = "selectToOpenFile";
var filesArr = [];
var docType;
var docTag;
var mydate = new Date();
var myMilliseconds = mydate.getTime();
var prj_uid = 1;

$(function(){ 
	// selectCategory();
	getTabData();

	plusItemEvent();
	$(".deleteItem").click(function(){
		$(this).parent().parent().remove();
	});
	$(".selectList").click(function(){
		selectList();
	});
//editSet();
});

// 點選新增按鈕
function plusItemEvent(){
	$("#plusItem").unbind("click");
	if(fileType != "selectNoToOpenFile"){
		$("#plusItem").click(function(){
			openFile();
		});
	}else{
		$("#plusItem").click(function(){
			openFileList();
		});
	}
}
// TAB 取大類別API
function getTabData(){
 	var sendObj = {
    api: DocApi+"GetDocTypeList",
 	  data:{ 
      prj_uid:prj_uid
    }
 	};

	$.getJSON(wrsUrl,sendObj,function(rs){
		if(rs.status){
			$("#tab-menu").empty();
			var firstObj;
      if(rs.data != null){
  			$.each(rs.data, function(Key , Val){
  				var tabObj = $("<li>").prop("role","presentation");
  				var categoryObj = $("<a>").prop("href","#").prop("id","category"+Val.uid);
  				
  				$(categoryObj).click(function(){
  					getDocList(Val.uid, Val.edit);
  					docType = Val.uid;
  					$("#fileContentList").empty();
  				});
  				if(Key==0){
  					firstObj = $(categoryObj);
  				}
  				$(categoryObj).appendTo(tabObj);
  				$(tabObj).appendTo("#tab-menu");
  				$(categoryObj).text(Val.name);
  			});
  			tabCtrl("tab-menu");
  			firstObj.click();
      }else{
        putEmptyInfo( $("#fileContentList") );
      }
		}else{
      putEmptyInfo( $("#fileContentList") );
    }
	});
}
// 取放資料API
function getDocList(uid, edit){
	var sendObj = 
	{
   		api : DocApi+"getDocList",
   		data:{prjuid:1,typeid:uid}
    };
   $.getJSON(wrsUrl,sendObj,function(rs){
   		// console.log(rs);
   		if(rs.data.length){
   			// 替換樣式
   			// if(edit){
   			// 	var style = "3grid-modify";
   			// }
   			// else{
   			// 	var style = "3grid-content"
   			// }
   			var option = {styleKind:"file-mana",style:"list"};
   			getStyle(option,function(pageStyle){
				// var categoryListObj = $("<div>").addClass("contents");
   				$.each(rs.data, function(Key , Val){
   					var StyleObj = $.parseHTML(pageStyle);
   					$(StyleObj).find(".list-items").eq(0).text(Val.name);//第一欄
   					$(StyleObj).find(".list-items").eq(1).text(Val.typeName);//第二欄
            $(StyleObj).find(".list-items").eq(2).text(Val.date);//第三欄
          	
          	$(StyleObj).find(".glyphicon-open-file").click(function(){
          		ReUploadFile();
          	});
          	$(StyleObj).find(".fa-pencil-square-o").css("line-height",0).click(function(){
          		modifyRename(Val.name);
          	});

          	// $(StyleObj).find(".fa-trash-o").remove();
          	$(StyleObj).appendTo($("#fileContentList"));
          	// $(StyleObj).appendTo(categoryListObj);
                                //無資料顯示暫無相關資料	
   				});
   				$("#fileContentList").find(".list-items-bottom").last().removeClass("list-items-bottom");	
   			});	
   		}else{
   			var categoryListObj = $("<div>").addClass("contents");
   			$(categoryListObj).appendTo($("#fileContentList"));
   			putEmptyInfo($(categoryListObj));
   		} 
   });

}
//小類別API
function selectCategory(pageStyleObj,contentObj){
	var sendObj = {
   		api : DocApi+"GetDocTypeList",
   		data:{
   			prj_uid:prj_uid,
   			typeid:docType
   		}
    };
    $(pageStyleObj).empty();
    $.getJSON(wrsUrl,sendObj,function(rs){
        if(rs.status && rs.data != null){
            $.each(rs.data,function(key,value){
                selectOptionPut($(pageStyleObj).find("#SmallcategoryID"),value["uid"],value["name"]);
            });
            if(contentObj!=undefined){
                $(pageStyleObj).find("#SmallcategoryID").val(contentObj.SmallcategoryID);
            }
        }else{
          selectOptionPut($(pageStyleObj).find("#SmallcategoryID"),"","無資料");

        }

        
    });
}