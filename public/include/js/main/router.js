var isPopstate = false;
//-----監聽上下頁事件-----
window.addEventListener('popstate', function(e){
	if (e.state) {
		isPopstate = true;
		firstLoadPage();
		isPopstate = false;
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
	if(page == "./"){
		page = "home";
	}
	var pageInfo = {
		pagetype: page
	};
	var params = $.param(pageInfo);
	if(!isPopstate){
		window.history.pushState(page,null, "content.html?"+params);
	}
	var loadPage = 'pages/'+page+'.html';
	loader(contentID);
	$.get(loadPage,{},function(contents){
		putContent( contentID, getContent(contents) );
	});

//	$("#"+contentID).load(loadPage);
}

function loader(itemObject,itemClass){
	if(typeof itemClass == "undefined"){
		itemClass = "content-loading-img";
	}
	var str = '<img class="'+itemClass+'" src="include/images/loader.svg">'
	$("#"+itemObject).empty();
	$(str).appendTo("#"+itemObject);
}

function getContent(rsContent){
	var tmpBody,tmpHead;
	if(rsContent.toLowerCase().search("<head>") != -1){
		tmpHead = rsContent.split("<head>");
		tmpHead = tmpHead[1].split("</head>");
		tmpBody = tmpHead[1].split("<body>");
		tmpHead = tmpHead[0];
		tmpBody = tmpBody[1].split("</body>");
		tmpBody = tmpBody[0];
		$(tmpHead).appendTo("head");
	}

	if(rsContent.toLowerCase().search("<body>") != -1){
		tmpBody = rsContent.split("<body>");
		tmpBody = tmpBody[1].split("</body>");
		tmpBody = tmpBody[0];
	}
	$("head :not(.keep)").remove();
	
	return tmpBody;
}

function putContent(contentID,contents){
	$("#"+contentID).fadeOut(700,function(){
		$(this).html(contents).fadeIn(100);
	});
}

function loadJS(jsSrc,jsClass,dataSrc){
	var script = $("<script>");
	script.prop("src",jsSrc);
	if(typeof dataSrc != "undefined"){
		script.attr("data-source",dataSrc);
	}
	if(typeof jsClass != "undefined"){
		script.addClass(jsClass);
	}
	script.appendTo("head");
}

//導引精靈模組
function elfguide(pageObject){
	// {
	// 	page:{},
	// 	itemValue:{},
	// 	start: int or string,
	// 	putArea: string,
	//	startHide: string,
	//	backAction: function,
	//	nextBtnAction: {
	// 		a: function,
	// 		....
	// 	},
	//  preBtnAction:{
	// 		a: function,
	// 		....
	// 	}
	// }
	if(typeof pageObject.putArea != "undefined"){
		var eg_path = "elfguide/";
		var pageOb = pageObject.page;
		var result = {};
		var countPage = 0;
		$("#"+pageObject.putArea).empty().show();
		if(typeof pageObject.start == "undefined"){
			pageObject.start = Object.keys(pageOb)[0];
		}
		if(typeof pageObject.startHide != "undefined"){
			itemFade(pageObject.startHide,false);
		}
		$.each(pageOb,function(i,v){
			var tmpPath = eg_path + v + ".html";
			var tmpContent;
			$.get(tmpPath,{},function(pagesContent){
				tmpContent = $.parseHTML('<div class="elfguide" id="'+i+'">'+pagesContent+'</div>');
			}).done(function(){
				var keys = Object.keys( pageOb ),
	            idIndex = keys.indexOf( i ),
	            nextIndex = idIndex += 1,
	            preIndex = idIndex -= 2,
				nextKey = keys[ nextIndex ],
				preKey = keys[ preIndex ];
				//尚未塞值，待會寫
				if(typeof pageObject.backAction == "function"){
					$(tmpContent).find(".backBtn").click(function(){
						itemFade(pageObject.startHide,true);
						itemFade(pageObject.putArea,false);
						pageObject.backAction();
					});
				}
				if(typeof pageObject.nextBtnAction[i] == "function"){
					$(tmpContent).find(".nextBtn").click(function(){
						var nowItem = $("#"+pageObject.putArea).find("#"+i);
						var nextItem;
						if(typeof nextKey != "undefined"){
							nextItem = $("#"+pageObject.putArea).find("#"+nextKey);
						}else{
							nextItem = null;
						}
						pageObject.nextBtnAction[i]( nowItem,nextItem );
					});
				}

				if(typeof pageObject.preBtnAction[i] == "function"){
					$(tmpContent).find(".preBtn").click(function(){
						var nowItem = $("#"+pageObject.putArea).find("#"+i);
						var preItem;
						if(typeof preKey != "undefined"){
							preItem = $("#"+pageObject.putArea).find("#"+preKey);
						}else{
							preItem = null;
						}
						pageObject.preBtnAction[i]( nowItem, preItem );
					});
				}

				$(tmpContent).hide().appendTo("#"+pageObject.putArea);
				if(pageObject.start == i){
					$(tmpContent).fadeIn(500);	
				}
			});
		});
	}else{
		console.log("pageObject.putArea is not set!");
	}
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