$(function(){
	$("#ID").focus();
})

function submitCheck(){
	//console.log("send ID: "+$("#ID").val());
	//console.log($("#switch_type").val());
	if($("#ID").val()!=""){		
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
					if(rs.status){
						
						//顯示人員資料
						//console.log(rs.info_type);
						
						switch(rs.info_type){
							case "worker":
								//塞入資料
								$("#name").text(rs.sar.name);
								$("#sex").text(rs.sar.sex);
								$("#birthday").text(rs.sar.birthday);
								$("#type").text(rs.sar.work_name);
								$("#supply").text(rs.sar.su_name);
								
								//顯示
								$("#info").show();
								$("#worker_info").show();
								$("#employee_info").hide();
								
								break;
							case "employee":
								
								//塞入資料
								$("#name").text(rs.sar.name);
								$("#sex").text(rs.sar.sex);
								$("#birthday").text(rs.sar.birthday);
								$("#org").text(rs.sar.office_name);
								$("#position").text(rs.sar.position_name);
								
								//顯示
								$("#info").show();
								$("#employee_info").show();
								$("#worker_info").hide();
								
								break;
							default:
						}

						//紀錄出勤時間
						//console.log($("#check_type").val())
						//recordAttendance($("#check_type").val());
						
						//console.log($("input[name=radio]:checked").val());
						//recordAttendance($("input[name=radio]:checked").val());
						
						//console.log($("#switch_type").val());
						recordAttendance($("#switch_type").val());
						
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
						$("#uncheck").hide();
						$("#in").hide();
						$("#out").hide();
						alert(rs.msg);
					} 
					$("#ID").val("");
					$("#ID").focus();
				},
            error: 
				function(e){
					//location.reload();
					console.log(e);
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
				$("#check").show();
				$("#uncheck").hide();
				switch(check_type){
					case "1":
						$("#in").show();
						$("#out").hide();
						break;
					case "2":
						$("#out").show();
						$("#in").hide();
						break;
					default:
				}
			},
        error: 
			function(e){
				$("#uncheck").show();
				$("#check").hide();
				
				//console.log(e);
			}
	});
}

function runScript(e){
    if (e.keyCode == 13) {
       $("#ID_check").click();
    }
}