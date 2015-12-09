function submitCheck(){
	if($("#ID").val()!=""){		
		$.ajax({
			url: configObject.SARGetworkerdata,
            type: "POST",
			data: { ID: $("#ID").val() },
			dataType: "JSON",
			async:false,
            success: 
				function(rs){
					// console.log(rs);
					if(rs.status){
						
						//顯示人員資料
						var $img = rs.sar.taxid + "/" + rs.sar.sid + ".jpg";
						$("#personal_img").attr("src","../include/workersAlbum/" + $img)
										  .attr("width", "180px")
										  .attr("height", "180px");
						
						switch(rs.info_type){
							case "worker":
								//塞入資料
								$("#name").text(rs.sar.name);
								$("#sex").text(rs.sar.sex);
								// $("#birthday").text(rs.sar.birthday.substring(0,4));
								
								//計算年齡
								var dateObj = new Date();
								var $age = dateObj.getFullYear() - parseInt(rs.sar.birthday.substring(0,4));
								$("#age").text($age);
								
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

function recordAttendance($check_type){
	$.ajax({
		url: configObject.SARRecordAttendance,
        type: "POST",
		data: { ID: $("#ID").val(),
				check_type: $check_type 
				},
		dataType: "JSON",
		async:false,
        success: 
			function(rs){
				//console.log(rs);
				$("#check").show();
				$("#uncheck").hide();
				switch($check_type){
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
				console.log(e);
			}
	});
}

function runScript(e){
    if (e.keyCode == 13) {
       $("#ID_check").click();
    }
}

function reloadChart(){
	setTotalPeople();
		
	resetChart("SARChart");	
	var options = {
		url: configObject.SARReport,
		urlMethod: "POST",
		sendData: { date: $("#report_date").val().replace(/\//g,"-") },
		drawItemID: 'SARChart',
		unitTitle: "人次",
		bottomTitle: "工種",
		drawType: "ColumnChart", //drawType 可使用 ColumnChart、LineChart 兩種
		resultIndex: "data",
		annotation: true
	};
	createChart(options);
}

function setTotalPeople(){
	$.ajax({
		url: configObject.SARReport,
		type: "POST",
		data: { date: $("#report_date").val().replace(/\//g,"-") },
		dataType: "JSON",
		asyns: false,
		success:
			function(rs){
				if(rs.status){
					var $totalPeople = 0;
					for(var index in rs.data){
						$totalPeople += parseInt(rs.data[index].w_count);
					}
					if($totalPeople!=0){
						$("#totalPeople").html($totalPeople);
						$("#has_people").show();
						$("#SARChart").css("visibility", "visible");
						$("#no_people").hide();
					}else{
						$("#totalPeople").html("");
						$("#has_people").hide();
						$("#SARChart").css("visibility", "hidden");
						$("#no_people").show();
					}
				}else{
					$("#has_people").hide();
					$("#SARChart").css("visibility", "hidden");
					$("#no_people").show();
				}
			},
		error:
			function(e){
				console.log(e);
			}
	});
}

$(function(){   

    //第二種，自己抓取ＤＡＴＡ處理後交由ＡＰＩ繪製
    var dataSample = getChartsData();
    //console.log(dataSample);
    var options = {
      drawItemID: 'lineCharts',
      unitTitle: dataSample.ChartHead.ChartAxisUnit.AxisY,
      //bottomTitle: dataSample.ChartHead.ChartAxisUnit.AxisX,
      chartsHelp: "right", //top,left,right,bottom; 預設為bottom
      drawType:"LineChart", //drawType 可使用 ColumnChart、LineChart、TimeLine
      annotation: true //default是false
    };
    var setTitleArr = ["Data",dataSample.ChartLine.PlanLine,dataSample.ChartLine.RealLine];
    var dataArr = processData(setTitleArr,dataSample.ChartContent);
    createChart(options,dataArr);
    //結束第二種

    //甘特圖
    var dataSample = getGanttChartsData();
    var setTitleArr = ["Name","sDate","eDate"];
    var dataArr = processGanttData(setTitleArr,dataSample.ChartContent);
    var options = {
      drawItemID: 'ganttCharts',
      drawType:"TimeLine", 
      ganttColor: dataArr.colors
    };
    createChart(options,dataArr.reData);
    //結束甘特圖
});

function getChartsData(){
	var chartsData;

	    $.ajax({
	    url: 'http://211.21.170.18:8080/Construction/wsConstruction.asmx/GetScheduleChart_JSON',
	    type: "GET",
	    dataType: "xml",
	    async: false,
	    success: function(rs){
	        chartsData = $.parseJSON($(rs).find("string").text());
	    }
	});
	return chartsData;
}

	//甘特圖
function getGanttChartsData(){
	var chartsData;
	$.ajax({
	    url: 'http://211.21.170.18:8080/Construction/wsConstruction.asmx/GetGanttChart_JSON',
	    type: "GET",
	    dataType: "xml",
	    async: false,
	    success: function(rs){
	        chartsData = $.parseJSON($(rs).find("string").text());
	    }
	});
	//console.log(chartsData);
	return chartsData;
}

function processData(titleArray,data){
	var reData = [];
	reData[0] = titleArray;
	$.each(data,function(i,v){
	  //console.log(i,v);
	  reData[reData.length] = [v.sDate,v.dbPlan,v.dbReal];
	});
	return reData;
}

function processGanttData(titleArray,data){
	var reData = [];
	reData[0] = titleArray;
	var colorObject = {},colorArr = [];
	$.each(data,function(i,v){
	  var vObject = v.PlanDates;
	  $.each(vObject,function(ai,av){
	    reData[reData.length] = [av.Name,new Date(av.sDate+" 0:00"),new Date(av.sDate+" 23:59")];
	    
	    if(typeof colorObject[av.Name] == 'undefined'){
	      colorArr[colorArr.length] = (av.ChkType)?"#DA3636":"#2BD834";
	    }
	    colorObject[av.Name] = true;
	  });
	  if(v.RealDates && typeof v.RealDates!='undefined'){
	    var vObject = v.RealDates;
	    $.each(vObject,function(ai,av){
	      reData[reData.length] = [av.Name,new Date(av.sDate+" 0:00"),new Date(av.sDate+" 23:59")];

	      if(typeof colorObject[av.Name] == 'undefined'){
	        colorArr[colorArr.length] = (av.ChkType)?"#DA3636":"#2BD834";
	      }
	      colorObject[av.Name] = true;
	    });
	  }
	  
	});
	var totleObject = {};
	totleObject.reData = reData;
	totleObject.colors = colorArr;
	return totleObject;
}