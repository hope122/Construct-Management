var userLoginInfo;
function checkUserLogin(){
	$.getJSON(configObject.getAcInfo,{},function(rs){
		if(!rs.status){
           location.href = location.origin;
		}else{
            if(location.search.search("select-sys") != -1){
            	$("#nav").hide();
            }
            userLoginInfo = rs;
            $(".user-name").html(rs.userName);
            if(rs.sysCode){
       			//取得選單
       			getMenus(rs);
       		}else{
       			if(rs.sysList.length == 1){
	            	setUserSysCode(rs.sysList[0]);
    	        }else if(rs.sysList.length > 1){

	       			if(location.search.search("select-sys") == -1){
	       				loadPage("select-sys/select-sys","pagescontent");
	       			}
        	    }
       		}
		}
	});
}

function setUserSysCode(sysCode){
	$.post(configObject.setSysCode,{sysCode:sysCode},function(rs){
		// console.log(rs);
		var rs = $.parseJSON(rs);

		if(!rs.status){
			alert("系統代碼錯誤，請重新登入");
	        logoutEven();
		}else{
			// // 是管理者
			// if(userLoginInfo.isAdmin){
			// 	$("#nav").show();
   //     			//取得選單
   //     			getMenus(rs);
			// 	loadPage("home","pagescontent");
			// }else{
			// 	// 一般使用者，看是否要選擇專案
			// }
			userLoginInfo.sysCode = sysCode;
			$("#nav").show();
   			//取得選單
   			getMenus(rs);
			loadPage("home","pagescontent");
		}
	});
}
