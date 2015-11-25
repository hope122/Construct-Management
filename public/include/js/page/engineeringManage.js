$(function(){
	$.ajax({
		url: "http://127.0.0.1:99/engineeringmanage/getdata",
		type: "POST",
		data: { type: "index" },
		dataType: "JSON",
		async: false,
		success:
			function(rs){
				var ul = $("<ul/>").appendTo($("#dataTree"));
				createTree(ul, rs["dataTree"]);
				creatUnitSelect($("#unit"), rs["unitArr"]);
				//console.log(rs);
			},
		error:
			function(e){
				console.log(e);
			}
	});
	$("#dataTree a").click(function(){
		
		//提示使用者目前選
		$("#level").text($(this).text());
		
		//樹狀結構開合
		showOrHide($(this).siblings("ul"));
		
		//設定
		var $code = $(this)[0].getAttribute("data-code");
		//console.log($code.length);
		changeSetting($code);
		
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
				//.attr("style", "display: none")
				.appendTo(li);
		if(dataArray[index]["child"] !== null){
			var ul = $("<ul/>")
					.css("display", "none")
					.appendTo(li)
			createTree(ul, dataArray[index]["child"]);
		}
	}
}

function creatUnitSelect(currentNode, dataArray){
	var unit1 = $("<select/>").appendTo(currentNode);
	var unit2 = $("<select/>").appendTo(currentNode);
	
	for(var i=0; i<dataArray.length; i++){
		var option1 = $("<option/>")
					.attr("value", i)
					.text(dataArray[i]["unit1"])
					.appendTo(unit1);
		var option2 = $("<option/>")
					.attr("value", i)
					.text(dataArray[i]["unit2"])
					.appendTo(unit2);
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

function changeSetting($code){
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
}

function checkSubmit(){
}
