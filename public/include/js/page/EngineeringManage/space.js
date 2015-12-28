$(function(){
	$("#space_edit").hide();
	$.ajax({
		url: configObject.engGetData,
		type: "POST",
		data:{
			type: "space"
		},
		dataType: "JSON",
		async: false,
		success:
			function(rs){
				console.log(rs.data);
				createSpaceView(rs.data);
			},
		error:
			function(e){
				console.log(e);
			}
	});
});

function createSpaceView($dataArr){
	var arrName = ["樓層：","部位："];
	var i = 0;
	for(var $index in $dataArr){
		var $div = $("<div/>").appendTo($("#spaceContent"));
		var $label = $("<label/>").text(arrName[i++]).appendTo($div);
		var $selection = $("<select/>").attr("id",$index).appendTo($label);
		for(var $i in $dataArr[$index]){
			$("<option/>").val($dataArr[$index][$i].uid)
						  .text($dataArr[$index][$i].name)
						  .appendTo($selection);
		}
		$("<input/>").attr("type","button")
					 .attr("id","new"+$index)
					 .attr("onclick","newSpace('"+$index+"')")
					 .val("新增")
					 .appendTo($div);
	}
}

function newSpace($type){
	$("#spaceContent").hide();
	$("#space_insert_table").val($type);

	switch($type){
		case "eng_str_a":
			break;
		case "eng_str_b":
			$("#space_target").text("樓層");
			$("#space_edit").show();
			$("#space_ismodel").show();
			break;
		case "eng_str_c":
			break;
		case "eng_str_d":
			break;
		case "eng_str_e":
			$("#space_target").text("部位");
			$("#space_edit").show();
			$("#space_ismodel").hide();
			break;
		default:
	}
}

function spaceCancel(){
	$("#space_edit").hide();
	$("#spaceContent").show();
}

function spaceSubmit(){	
	$.ajax({
		url: configObject.engInsertData,
		type: "POST",
		data:{
			table: $("#space_insert_table").val(),
			code: $("#space_code").val(),
			name: $("#space_name").val(),
			ismodel: $("input[name=space_ismodel]:checked").val()	
		},
		dataType: "JSON",
		async: false,
		success:
			function(rs){
				console.log(rs);
			},
		error:
			function(e){
				console.log(e);
			}
	});
}