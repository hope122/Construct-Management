$(function(){
	loadTmpCardContent();
});

function loadTmpCardContent(){
	var tmpCardTableContent = $("#cardData").html();
	loader("cardData");
	var tContentStyle;
	$.get("pages/sar/tmpCardMana_content_style.html",function(rs){
		tContentStyle = rs;
	}).done(function(){
		$.getJSON(configObject.cardinfo,{},function(data){
			console.log(data);
			$("#cardData").html(tmpCardTableContent);
			if(data.status){
				var tc_data = data.tc_data;

				$.each(tc_data,function(i,v){
					var tContent = $.parseHTML(tContentStyle);
					$(tContent).find(".data-rows-content").html(v.number);
					$(tContent).find(".edit-card").val(v.number);
					setMouseEvent(tContent);
					$(tContent).prop("id",v.uid).appendTo("#cardData");
				});
				
			}
		})
		
	});
}

function setMouseEvent(object){
	$(object).mouseover(function(){
		$(this).find(".action-btn").find(".toEdit").show();
	}).mouseout(function(){
		$(this).find(".action-btn").find(".toEdit").hide();
	});
}

function removeMouseEven(object){
	$(object).unbind("mouseover");
	$(object).unbind("mouseout");
}

function addTmpCardContent(){
	var tContentStyle;
	$.get("pages/sar/tmpCardMana_content_style.html",function(rs){
		tContentStyle = rs;
	}).done(function(){
		var tContent = $.parseHTML(tContentStyle);
		$(tContent).find(".data-rows-content").hide();
		$(tContent).find(".data-rows-edit-content").show();
		$(tContent).find(".action-btn").find(".toSave").show();
		$(tContent).appendTo("#cardData");
	});
}

function getTDParents(object){
	return $(object).parent().parent().parent();
}

//存卡號
function tmpCardSaveBtn(object){
	var thisParent = getTDParents(object);
	var thisID = $(thisParent).prop("id");
	setMouseEvent(thisParent);
	$(thisParent).find(".toEdit").show();
	$(thisParent).find(".toSave").hide();
	$(thisParent).find(".data-rows-content").show();
	$(thisParent).find(".data-rows-edit-content").hide(); 
	var modifyVal = $(thisParent).find(".edit-card").val();
	$(thisParent).find(".data-rows-content").html(modifyVal);
	//修改
	if(thisID.length > 0){
		$.post(configObject.cardModify,{uid:thisID},function(rs){
			console.log(rs);
		});
	}else{ //新增
		console.log("F");
	}

}

//刪卡號
function tmpCardDelBtn(object){
	var thisParent = getTDParents(object);
	$(thisParent).remove();
}

//編輯卡號
function tmpCardModifyBtn(object){
	var thisParent = getTDParents(object);
	removeMouseEven(thisParent);
	$(thisParent).find(".toSave").show();
	$(thisParent).find(".toEdit").hide();
	$(thisParent).find(".data-rows-edit-content").show();
	$(thisParent).find(".data-rows-content").hide();
}

//取消
function tmpCardCancelBtn(object){
	var thisParent = getTDParents(object);
	setMouseEvent(thisParent);
	$(thisParent).find(".toEdit").show();
	$(thisParent).find(".toSave").hide();
	$(thisParent).find(".data-rows-content").show();
	$(thisParent).find(".data-rows-edit-content").hide();
	var original = $(thisParent).find(".data-rows-content").html();
	$(thisParent).find(".edit-card").val(original);
}