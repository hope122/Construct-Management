$(function(){
	$.ajax({
		url: "http://127.0.0.1:99/engineeringmanage/getdata",
		type: "POST",
		data: { type: "index" },
		dataType: "JSON",
		async: false,
		success:
			function(rs){
				//console.log(rs);
				var ul = $("<ul/>").appendTo($("#dataTree"));
				createTree(ul, rs["dataTree"]);	
				creatUnitSelect($("#unitSelection"), rs["unitArr"]);
			},
		error:
			function(e){
				console.log(e);
			}
	});
		
	$("#dataTree a").click(function(){
		//提示使用者目前選
		$("#chosen").text($(this).text());
		
		//設定參數
		$("#target").text($(this).text());
		var $code = $(this)[0].getAttribute("data-code");
		$("#chosen_code").val($code);
		$("#table_for_insert").val(getTable($code,0));
		$("#table_for_getTypeId").val(getTable($code,1));
		
		$("#cancel_chosen").show();		
		
		//樹狀結構開合
		showOrHide($(this).siblings("ul"));
		
		return false;
	});
	
});

function createTree(currentNode, dataArray){
	for(var index in dataArray){
		//console.log(dataArray[index]);
		
		var li = $("<li/>").appendTo(currentNode);
		var a = $("<a/>")
				.text(dataArray[index]["name"])
				.attr("href", "#")
				.attr("data-code", dataArray[index]["code"])
				.appendTo(li);
		if(dataArray[index]["child"] !== null){
			var ul = $("<ul/>")
					.css("display", "none")
					.appendTo(li)
			createTree(ul, dataArray[index]["child"]);
		}
	}
}

function showOrHide(node){
	for(var i=0; i<node.length; i++){
		if(node[i].style.display == "none"){
			node[i].style.display = "block";
		}else{
			node[i].style.display = "none";;
		}
	}
}

function cancel_chosen(){
	$("#chosen").html("");
	$("#target").html("");
	$("#table_for_insert").val("eng_type_a");
	$("#table_for_getTypeId").val("");
	$("#cancel_chosen").hide();
}

function newData(){
	$chosen = $("#chosen").html();
	$code = $("#chosen_code").val();
	if( $code.length == 6 ){
		alert("無法新增 "+$chosen+" 的子項目");
	}else{
		if( $code.length == 4 ){
			$("#unitSelection").show();
		}
		$("#index_area").hide();
		$("#edit_area").show();
	}
}

function cancelNewData(){
	$("#index_area").show();
	$("#edit_area").hide();
}

function getTable($code,$type){
	var $table="";
	
	switch($code.length){
		case 1:
			if($type==0){
				$table = "eng_type_b";
			}else if($type==1){
				$table = "eng_type_a";
			}
			break;
		case 2:
			if($type==0){
				$table = "eng_type_c";
			}else if($type==1){
				$table = "eng_type_b";
			}
			break;
		case 4:
			if($type==0){
				$table = "eng_type_d";
			}else if($type==1){
				$table = "eng_type_c";
			}
			break;
		default:
	}

	return $table;
}

function sendData(){
	var $typeId;
	var $fCode;
	if($("#table_for_getTypeId").val()!=""){
		//取得所需typeId
		$.ajax({
			url: "http://127.0.0.1:99/engineeringmanage/getdata",
			type: "POST",
			data: { type: "getTypeId", table: $("#table_for_getTypeId").val(), code: $("#chosen_code").val() },
			dataType: "JSON",
			async: false,
			success:
				function(rs){
					console.log(rs);
					$typeId = rs.dataArray["uid"];
					$fCode = rs.dataArray["code"];
				},
			error:
				function(e){
					console.log(e);
				}
		});
	}
	
	//新增資料
	$.ajax({
		url: "http://127.0.0.1:99/engineeringmanage/insertdata",
		type: "POST",
		data: { table: $("#table_for_insert").val(), 
				name: $("#eng_name").val(),
				//scode: $("#eng_scode").val(),
				typeid: $typeId,
				fCode: $fCode, 
				//typeid_u:
		},
		dataType: "JSON",
		async: false,
		success:
			function(rs){
				console.log(rs.msg);
				//location.reload();
			},
		error:
			function(e){
				console.log(e);
			}
	});

	
}

function creatUnitSelect(currentNode, dataArray){
	var unit1 = $("<select/>")
				.attr("id","unit1")
				.appendTo(currentNode);
	var unit2 = $("<select/>")
				.attr("id","unit1")
				.appendTo(currentNode);
	
	for(var i=0; i<dataArray.length; i++){
		var option1 = $("<option/>")
					.attr("value", i+1)
					.text(dataArray[i]["unit1"])
					.appendTo(unit1);
		var option2 = $("<option/>")
					.attr("value", i+1)
					.text(dataArray[i]["unit2"])
					.appendTo(unit2);
	}
}



/* function changeSetting($code){
	switch($code.length){
		case 1:
			$("#table").val("eng_type_a");	
			$("#unit").hide();
			break;
		case 2:
			$("#table").val("eng_type_b");
			$("#unit").hide();
			break;
		case 4:
			$("#table").val("eng_type_c");
			$("#unit").hide();
			break;
		case 6:
			$("#table").val("eng_type_d");
			$("#unit").show();
			break;
		default:
	}
	$("#code").val($code);
} */

/* function setSelection($dataArray){
	setOption($dataArray.eng_type_a, $("#eng_type_a"));
	setOption($dataArray.eng_type_b, $("#eng_type_b"));
	setOption($dataArray.eng_type_c, $("#eng_type_c"));
	setOption($dataArray.eng_type_d, $("#eng_type_d"));
}

function setOption($dataArray, $selector){
	var selectElement = $selector;
	$("<option/>").attr("value", 0).text("-請選擇-").appendTo(selectElement);
	for(var i=0; i< $dataArray.length; i++){
		$("<option/>").attr("value", i+1)
					  .attr("data-code", $dataArray[i]["code"])
					  .text($dataArray[i]["name"])
					  .appendTo(selectElement);
	}
} */