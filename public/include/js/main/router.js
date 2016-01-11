
//-----監聽上下頁事件-----
window.addEventListener('popstate', function(e){
	if (e.state) {
		firstLoadPage();
	}
},false);

//-----監聽上下頁事件-----
function checkGoogleApi(){
	$("head").find("script").each(function(){
		if($(this).prop("class").search("keep") == -1){
			$(this).addClass("keep");
		}
	});
	$("head").find("link").each(function(){
		if($(this).prop("class").search("keep") == -1){
			$(this).addClass("keep");
		}
	});
}

function firstLoadPage(){
	if(typeof getUrlParameter("pagetype") != "undefined"){
		loadPage(getUrlParameter("pagetype"),"pagescontent");
	}else{
		loadPage("home","pagescontent");
	}
}

function loadPage(page,contentID){
	var pageInfo = {
		pagetype: page
	};
	var params = $.param(pageInfo);
	window.history.pushState(page,null, "content.html?"+params);
	
	var loadPage = 'pages/'+page+'.html';
	loader(contentID);
	$.get(loadPage,{},function(contents){
		putContent( contentID, getContent(contents) );
	});
//	$("#"+contentID).load(loadPage);
}

function loader(itemObject){
	var str = '<img class="content-loading-img" src="include/images/loader.svg">'
	$("#"+itemObject).empty();
	$(str).appendTo("#"+itemObject);
}

function getContent(rsContent){
	var tmpHead = rsContent.split("<head>");
	tmpHead = tmpHead[1].split("</head>");
	var tmpBody = tmpHead[1].split("<body>");
	tmpHead = tmpHead[0];
	tmpBody = tmpBody[1].split("</body>");
	tmpBody = tmpBody[0];
	//$("head :not(.keep)").remove();
	$(tmpHead).appendTo("head");
	return tmpBody;
}

function putContent(contentID,contents){
	$("#"+contentID).fadeOut(700,function(){
		$(this).html(contents).fadeIn(100);
	});
}

function loadJS(jsSrc,dataSrc){
	var script = $("<script async>");
	script.prop("src",jsSrc);
	if(typeof dataSrc != "undefined"){
		script.attr("data-source",dataSrc);
		script.attr("onload","loadGoogleChart()");
	}
	script.appendTo("head");
}

var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};