$(function(){
	$("#ID").focus();
})

function submitCheck(){
	if($("#ID").val()!=""){
		//console.log("send ID: "+$("#ID").val());
		$.ajax({
			url: configObject.SARGetworkerdata,
			//url: "http://127.0.0.1:99/sar/getworkerdata",
            type: "POST",
			data: "ID="+$("#ID").val(),
			dataType: "JSON",
			async:false,
            success: 
				function(rs){
					console.log(rs);
					if(rs.status){
						
						//顯示人員資料
						//console.log(rs.sar.work_name===undefined);
						if(rs.sar.work_name===undefined){
							$("#name").text(rs.sar.name);
							$("#sex").text(rs.sar.sex);
							$("#birthday").text(rs.sar.birthday);
							$("#type").text("");
							$("#supply").text("");
						}else{
							$("#name").text(rs.sar.name);
							$("#sex").text(rs.sar.sex);
							$("#birthday").text(rs.sar.birthday);
							$("#type").text(rs.sar.work_name);
							$("#supply").text(rs.sar.su_name);
						}

						//紀錄出勤時間
						//console.log($("#check_type").val())
						recordAttendance($("#check_type").val());
						
					}else{
						alert(rs.msg);
						$("#name").text("");
						$("#sex").text("");
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
		data: { ID:$("#ID").val(), check_type:check_type },
		dataType: "JSON",
		async:false,
        success: 
			function(rs){
				//console.log(rs);
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