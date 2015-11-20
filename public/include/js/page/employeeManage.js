$(function(){
	$("#birthday").datepicker({
		dateFormat: 'yy/mm/dd'
	});
});

var myRedirect = function(redirectUrl, arg, value, uid) {
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

function edit(action, uid){
	//alert(uid);
	var directurl = "http://127.0.0.1:200/employeemanage/editpage";
	myRedirect(directurl, "action", action, uid);
}

function checkSubmit(action,uid){
	var actionUrl;
	switch(action){
		case "insertData":
			actionUrl = "http://127.0.0.1:99/employeemanage/insertdata";
			break;
		case "updateData":
			actionUrl = "http://127.0.0.1:99/employeemanage/updatedata?uid="+uid;
			break;
	}
	
	//console.log($("#data").serialize());
	var dataArray = getData(decodeURIComponent($("#data").serialize(),true));
	$.ajax({
		//url: configObject.SARRecordAttendance,
		url: actionUrl,
        type: "POST",
		data: { name: dataArray[0][1], sid: dataArray[1][1], sex: dataArray[2][1], birthday: dataArray[3][1],
				zip: dataArray[4][1], city: dataArray[5][1], area: dataArray[6][1], vil: dataArray[7][1], verge: dataArray[8][1],
				road: dataArray[9][1], addr: dataArray[10][1],
				mobile: dataArray[11][1], tel_h: dataArray[12][1], email: dataArray[13][1] },
		dataType: "JSON",
		async:false,
        success: 
			function(rs){
				window.location.href = "http://127.0.0.1:200/employeemanage";
			},
        error: 
			function(e){
				console.log(e);
			}
	});
}

function getData(ori_arr){	
	var arr = ori_arr.split("&");
	//console.log(arr[0]);
	
	var arr2 = new Array();
	for(var index in arr){
		//console.log(arr[index]);
		arr2[index] =arr[index].split("=");
	}
	//console.log(arr2);
	
	return arr2;
}