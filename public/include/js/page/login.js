function loginEven(){
	var parm = $("#loginInfo").serialize();
	$.ajax({
		// url: configObject.LoginUrl,
		url: wrsAPI+"loginAPI",
		data: parm,
		type:"POST",
		async: false,
	    beforeSend: function(){
	      showLoading(true);
	    },
		success: function(rs){
			var result = $.parseJSON(rs);
			setTimeout(function(){
				redirectPage(result);
				showLoading(false);
			},500);

		}
	});
}


