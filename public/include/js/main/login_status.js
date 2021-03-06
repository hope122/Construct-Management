var userLoginInfo;
function checkUserLogin(){
	$.getJSON(configObject.getAcInfo,{},function(rs){
		if(!rs.status){
           location.href = location.origin;
		}else{
            if(location.search.search("select-sys") != -1 || location.search.search("user-mana%2Fadmin") != -1){
            	$(".topInfo").hide();
            }
            userLoginInfo = rs;

            if(rs.sysCode && rs.userID){
            	$(".user-name").html(userLoginInfo.userName);
       			//取得選單
       			getMenus(rs);
       			// 連線socket
				setSocket();

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
			userLoginInfo.userID = rs.userID;
			userLoginInfo.userName = rs.userName;

			// 當admin使用者資料已有，則導入
			if(rs.userID){
				$(".topInfo").show();
            	$(".user-name").html(userLoginInfo.userName);

	   			//取得選單
	   			getMenus(rs);
				setSocket();
   			}else if(userLoginInfo.isAdmin){
   				if(location.search.search("user-mana%2Fadmin") == -1){
					loadPage("user-mana/admin","pagescontent");
				}
   			}else{
   				alert("帳號設置有誤，請聯絡管理員");
   				logoutEven();
   			}
			// loadPage("home","pagescontent");
		}
	});
}