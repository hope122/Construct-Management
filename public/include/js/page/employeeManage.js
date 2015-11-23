$(function(){
	$("#birthday").datepicker({
		dateFormat: 'yy/mm/dd'
	});
});

function edit(action, uid){
	// alert(uid);
	var domainUrl = "http://211.21.170.18";
	// var domainUrl = "http://127.0.0.1";
	var directurl = domainUrl + ":200/employeemanage/editpage";
	myRedirect(directurl, "action", action, uid);
}

function checkSubmit(action,uid){
	
	var domainUrl = "http://211.21.170.18";
	// var domainUrl = "http://127.0.0.1";
	var actionUrl;
	switch(action){
		case "insertData":
			actionUrl = domainUrl + ":99/employeemanage/insertdata";
			break;
		case "updateData":
			actionUrl = domainUrl + ":99/employeemanage/updatedata?uid="+uid;
			break;
	}
		
	//console.log($("#data").serialize());
	var dataArray = getData(decodeURIComponent($("#data").serialize(),true));
	//console.log(dataArray);
	console.log( $("#relation :selected").val() );
	if( !checkEmpty(dataArray) ){	//檢查是否有欄位未填
		$.ajax({
			//url: configObject.SARRecordAttendance,
			url: actionUrl,
			type: "POST",
			data: { name: dataArray[0][1],
					sid: dataArray[1][1],
					sex: dataArray[2][1],
					birthday: dataArray[3][1],
					zip: dataArray[4][1],
					city: dataArray[5][1],
					area: dataArray[6][1],
					vil: dataArray[7][1],
					verge: dataArray[8][1],
					road: dataArray[9][1],
					addr: dataArray[10][1],
					belong: dataArray[11][1],
					mobile: dataArray[12][1],
					tel_h: dataArray[13][1],
					tel_o: dataArray[14][1],
					tel_ext: dataArray[15][1],
					email: dataArray[16][1],
					relation: $("#relation :selected").val() },
			dataType: "JSON",
			async:false,
			success: 
				function(rs){
					window.location.href = domainUrl + ":200/employeemanage";
				},
			error: 
				function(e){
					console.log(e);
				}
		});
	}else{
		alert("請確認欄位是否都填寫完畢。");
	}
}

function myRedirect(redirectUrl, arg, value, uid) {
	var form;
	if(uid != ""){
		form = $('<form action="' + redirectUrl + '" method="post">' +
			'<input type="hidden" name="'+ arg +'" value="' + value + '"></input>' + 
			'<input type="hidden" name="uid" value="' + uid + '"></input>' + '</form>');
	}else{
		form = $('<form action="' + redirectUrl + '" method="post">' +
			'<input type="hidden" name="'+ arg +'" value="' + value + '"></input>' + '</form>');
	}
	$('body').append(form);
	$(form).submit();
};

function getData(ori_arr){	
	var arr = ori_arr.split("&");
	//console.log(arr[0]);
	
	var arr2 = new Array();
	for(var index in arr){
		//console.log(arr[index]);
		arr2[index] = arr[index].split("=");
	}
	//console.log(arr2);
	
	return arr2;
}

function checkEmpty(dataArray){
	var hasEmpty = true;
	
	for(var index in dataArray){
		if(dataArray[index][1]==""){
			return hasEmpty;
		}
	}
	
	hasEmpty = false;
	return hasEmpty;
}