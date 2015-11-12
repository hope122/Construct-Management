$(function(){
	$("#ID").focus();
})

function submitCheck(){
	//console.log($("input[name=radio]:checked").val());
	if($("#ID").val()!=""){
		
		//console.log("send ID: "+$("#ID").val());
		$.ajax({
			//url: configObject.SARGetworkerdata,
			url: "http://127.0.0.1:99/sar/getworkerdata",
            type: "POST",
			data: "ID="+$("#ID").val(),
			dataType: "JSON",
			async:false,
            success: 
				function(rs){
					//console.log(rs);
					if(rs.status){
						
						//顯示人員資料
						//console.log(rs.info_type);
						
						switch(rs.info_type){
							case "worker":
								$("#name").text(rs.sar.name);
								$("#sex").text(rs.sar.sex);
								$("#birthday").text(rs.sar.birthday);
								$("#type").text(rs.sar.work_name);
								$("#supply").text(rs.sar.su_name);
								$("#info").show();
								$("#worker_info").show();
								$("#employee_info").hide();
								break;
							case "employee":
								$("#name").text(rs.sar.name);
								$("#sex").text(rs.sar.sex);
								$("#birthday").text(rs.sar.birthday);
								$("#org").text("");
								$("#position").text("");
								$("#info").show();
								$("#employee_info").show();
								$("#worker_info").hide();
								break;
							default:
						}
						// if(rs.sar.work_name===undefined){
							// $("#name").text(rs.sar.name);
							// $("#sex").text(rs.sar.sex);
							// $("#birthday").text(rs.sar.birthday);
							// $("#org").text("");
							// $("#position").text("");
							// $("#info").show();
							// $("#employee_info").show();
							
						// }else{
							// $("#name").text(rs.sar.name);
							// $("#sex").text(rs.sar.sex);
							// $("#birthday").text(rs.sar.birthday);
							// $("#type").text(rs.sar.work_name);
							// $("#supply").text(rs.sar.su_name);
							// $("#info").show();
							// $("#worker_info").show();
						// }

						//紀錄出勤時間
						//console.log($("#check_type").val())
						//recordAttendance($("#check_type").val());
						recordAttendance($("input[name=radio]:checked").val());
						
					}else{
						$("#name").text("");
						$("#sex").text("");
						$("#birthday").text("");
						$("#type").text("");
						$("#supply").text("");
						$("#info").hide();
						$("#worker_info").hide();
						$("#employee_info").hide();
						$("#check").hide();
						alert(rs.msg);
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
		//url: configObject.SARRecordAttendance,
		url: "http://127.0.0.1:99/sar/recordattendance",
        type: "POST",
		data: { ID:$("#ID").val(), check_type:check_type },
		dataType: "JSON",
		async:false,
        success: 
			function(rs){
				//console.log(rs);
				$("#check").show();
			},
        error: 
			function(e){
				alert("沒點到名")
				//console.log(e);
			}
	});
}

function runScript(e){
    if (e.keyCode == 13) {
       $("#ID_check").click();
    }
}