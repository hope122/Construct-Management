function checkUserLogin(){
	$.ajax({
		url: configObject.getAcInfo,
		type:"POST",
        dataType: "JSON",
		success: function(rs){
			if(!rs.status){
               location.href = location.origin;
			}else{
           		$(".user-name").html(rs.userName);
           		//取得選單
           		getMenus(rs);
			}
		}
	});
}
