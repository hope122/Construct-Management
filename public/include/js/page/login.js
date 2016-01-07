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
      //console.log(rs);
		}
	});
}

function redirectPage(result){
  if(result.status){
        $.post(configObject.processLoginUrl,result,function(rs){
           //console.log(rs);
           location.href = location.origin;
        });
  }else{
    alert(result.error);
  }
}