var pageRowShow = 2;
var nowPage = 1;

$(function() {
	$( "#of-items" ).combobox();
	// $( "#toggle" ).click(function() {
	//   $( "#combobox" ).toggle();
	// });
	getComboboxSelectList();
});

function getComboboxSelectList(){
	$.getJSON(configObject.getOrderFormItem, function( rs ) {
		var optionStr = '';
		if(rs.status){
			$.each(rs.list, function(i,v){
				optionStr += '<option value="'+v.uid+'">'+v.ma_name+'</option>';
			});
			$(optionStr).appendTo("#of-items");
		}else{
			$("#msg_add_content").html(rs.msg).parent().show();
		}
		if(rs.total_row >= pageRowShow){
			var totalPage = Math.ceil(rs.total_row / pageRowShow);
			//開始做頁碼
			var btn = '';
			for(var i=1; i<=totalPage; i++){
				btn += '<button type="button" class="btn btn-default" onclick="gotoPageTab('+i+','+nowPage+','+pageRowShow+')">' + i + '</button>';
			}
			$("#pageTab").html(btn);
		}
	});
	$("#of-items");
}

function getComboboxVal(){
	console.log($("#combobox").val());
}

//頁碼呼叫函式
function gotoPageTab(goPage,RowLimit,Total){
	var start = goPage*pageRowShow;
	var end = start+pageRowShow;
	nowPage = goPage;

	$.getJSON(configObject.getSelectItem, {}, function( rs ) {
		
	});
}