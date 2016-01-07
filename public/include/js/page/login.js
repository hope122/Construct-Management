function loginEven(){
	var parm = $("#loginInfo").serialize();
	$.ajax({
		url: configObject.LoginUrl,
		data: parm,
		type:"POST",
		async: true,
		success: function(rs){
			var result = $.parseJSON(rs);
			redirectPage(result);
		}
	});
}


