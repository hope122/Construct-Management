function loginEven(){
	var parm = $("#loginInfo").serialize();
	$.ajax({
		url: configObject.LoginUrl,
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
	// $.ajax({
	// 	url: wrsAPI+"loginAPI",
	// 	data: parm,
	// 	type:"POST",
	// 	async: false,
	//     beforeSend: function(){
	//       // showLoading(true);
	//     },
	// 	success: function(rs){
	// 		console.log(rs);
	// 		// var result = $.parseJSON(rs);
	// 		// setTimeout(function(){
	// 		// 	redirectPage(result);
	// 		// 	showLoading(false);
	// 		// },500);
	// 		$.ajax({
	// 			// url: wrsAPI+"loginAPI/logout",
	// 			url: wrsAPI+"test.php",
	// 			// data: parm,
	// 			type:"post",
	// 			async: false,
	// 		    beforeSend: function(){
	// 		      // showLoading(true);
	// 		    },
	// 			success: function(rs){
	// 				console.log(rs);
	// 				// var result = $.parseJSON(rs);
	// 				// setTimeout(function(){
	// 				// 	redirectPage(result);
	// 				// 	showLoading(false);
	// 				// },500);

	// 			}
	// 		});
	// 	}
	// });

	
	
}


