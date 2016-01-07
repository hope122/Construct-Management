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
	//ui-widget-overlay 
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