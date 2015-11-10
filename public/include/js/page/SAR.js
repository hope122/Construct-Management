$(function(){
	$("#ID").focus();
})

function submitCheck(){
	if($("#ID").val()!=""){
		//alert($("#ID").val());
		$.ajax({
			url: configObject.SARGetworkerdata,
			//url: "http://127.0.0.1:99/sar/getworkerdata",
            type: "POST",
			data: "ID="+$("#ID").val(),
			dataType: "JSON",
			async:false,
            success: 
				function(rs){
					//console.log(rs);
					if(rs){
						
						//顯示人員資料
						$("#name").text(rs[0]["name"]);
						$("#sex").text(rs[0]["sex"]);
						$("#birthday").text(rs[0]["birthday"]);
						$("#type").text(rs[0]["work_name"]);
						$("#supply").text(rs[0]["su_name"]);
						
						//紀錄出勤時間
						//console.log($("#check_type").val())
						recordAttendance($("#check_type").val());
						
					}else{
						alert("查無此人");
						$("#name").text("");
						$("#gender").text("");
						$("#birthday").text("");
						$("#type").text("");
						$("#supply").text("");
					}
				},
            error: 
				function(e){
					location.reload();
				}
        });
    }else{
		alert("請輸入身分證字號");
	}
}

function recordAttendance(check_type){
	//alert(check_type);
	$.ajax({
		url: configObject.SARRecordAttendance,
		//url: "http://127.0.0.1:99/sar/recordattendance",
        type: "POST",
		data: { ID:$("#ID").val(), check_type:check_type},
		dataType: "JSON",
		async:false,
        success: 
			function(rs){
				console.log(rs);
				if(rs){
					
				}else{
					
				}
			},
        error: 
			function(e){
				//console.log(e);
			}
	});
}

function runScript(e){
    if (e.keyCode == 13) {
       $("#ID_check").click();
    }
}