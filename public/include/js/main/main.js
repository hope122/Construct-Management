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

function setInputNumberOnly(){
  //只能輸入數字
  $(".inputNumberOnly").keypress(function(event){
    return event.charCode >= 48 && event.charCode <= 57;
  });
}

function getUsetInput(){
  var tmpObj = {};
  $(".userInput").each(function(){
    var id= $(this).prop("id");
    tmpObj[id] = $(this).val();
  });
  return tmpObj;
}

function itemFade(item,ctr){
  if(ctr){
    $("#"+item).fadeIn(500);
  }else{
    $("#"+item).fadeOut(500);
  }
}

function sendRequest(sendType,sendUrl,sendData,dataType,responsesType,responsesFunction){
  if(sendUrl.length > 0){
    sendType = sendType.toLowerCase();
    if(dataType == "json"){
      sendData = JSON.stringify(sendData);
    }
    $.ajax({
       url: sendUrl,
       type: sendType,
       data: sendData,
       dataType: responsesType,
       success: function(rs){
          if(typeof responsesFunction != "undefined"){
            window[responsesFunction](rs);
          }
           //console.log(rs);
       }
    });
  }else{
    console.log("sendUrl is Null");
  }
}

//處理WS回傳JSON塞在的XML內容
function processJsonInXml(xmlContent){
  return $.parseJSON($(xmlContent).find("string").text());
}

//iframe設定高
function iframeLoaded(iframeID) {
    var iFrameID = document.getElementById(iframeID);
    if(iFrameID) {
          // here you can make the height, I delete it first, then I make it again
          iFrameID.height = "";
          iFrameID.height = iFrameID.contentWindow.document.body.scrollHeight + "px";
    }   
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
