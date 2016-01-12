$(function(){
  if(location.pathname.search("login.html") == -1){
  	checkUserLogin();
  	checkGoogleApi();
  	firstLoadPage();
	
  }
});

//相關頁面轉換
function redirectPage(result){
  if(result.status){
        $.post(configObject.processLoginUrl,result,function(rs){
           location.href = location.origin;
        });
  }else{
    alert(result.error);
    showLoading(false);
  }
}

function showLoading(turn){
	//開始顯示Loading
	var id = "loading";
	if(turn){
		$("#"+id).remove();
		$('<div id="'+id+'" >')
		.prepend('<div class="ui-widget-overlay" style="z-index:500;">')
		.prepend('<img class="loading-img" src="include/images/loader.svg" style="z-index:600;">')
		.hide()
		.appendTo('body')
		.show("scale", { percent: 100 }, 400);
	}else{
		$("#"+id).hide("scale", { percent: 100 }, 1000,function(){
			$(this).remove();
		});
	}
}

function logoutEven(){
	$.ajax({
		url: configObject.Logout,
		type:"POST",
		async: false,
		success: function(rs){
			//location.href = location.origin;
			location.href = "login.html";
		}
	});
}

//取得資訊
function porcessData(url, data, async, dataType){
    var result = '';
    if(typeof data === 'undefined'){
        data = {};
    }
    if(typeof async === "undefined"){
    	async = false;
    }
    if(typeof dataType === "undefined"){
    	dataType = "JSON";
    }
    if(typeof beforeFouction === "undefined"){
    	beforeFouction = {};
    }

    $.ajax({
       url: url,
       type: "POST",
       data: data,
       async: async,
       dataType: dataType,
       success: function(rs){
           //console.log(rs);
           if(rs.status){
               result = rs;
           }else{
               console.log(rs.msg);
           }
       }
    });
    return result;
}
