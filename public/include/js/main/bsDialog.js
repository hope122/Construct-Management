(function( $ ){

    $.fn.bsDialog = function(option) {
    	if(typeof option == "string"){
    		openDialog(option,this);
    		return;
    	}
    	option = optionSet(option);
    	// console.log(option);
    	this.addClass("modal fade");
    	var originContent = this.html();
    	this.empty();
    	var bsModal = $("<div>").addClass("modal-dialog").appendTo(this);
    	var bsModalContent = $("<div>").addClass("modal-content").appendTo(bsModal);
    	var bsModalHeader = $("<div>").addClass("modal-header");
    	// title Button
    	if(option.headerCloseBtn){
    		$("<button>").addClass("close")
    		.attr("data-dismiss","modal")
    		.html("&times;")
    		.appendTo(bsModalHeader);
    	}
    	// title
    	$("<h4>").addClass("modal-title").html(option.title).appendTo(bsModalHeader);
    	bsModalHeader.appendTo(bsModalContent);

    	// bodys
    	$("<div>").addClass("modal-body").html(originContent).appendTo(bsModalContent);

    	// footer Button
    	if(option.showFooterBtn){
    		$("<div>").addClass("modal-footer").appendTo(bsModalContent);
    	}

    	// auto show
    	if(option.autoShow){
    		this.modal("show");
    	}
    }

    function optionSet(option){
    	tmpOption = {
			headerCloseBtn: true,
			title: "&nbsp;",
			showFooterBtn: true,
			autoShow: false,
			button: {},
		};
    	if(option != undefined){
    		$.each(tmpOption,function(index,value){
    			if(typeof option[index] != "undefined"){
    				tmpOption[index] = option[index];
    			}
    		});
    	}
    	return tmpOption;
    }

    function openDialog(status,thisObj){
    	switch(status){
    		case "show":
    			thisObj.modal("show");
    		break;
    		case "close":
    			thisObj.modal("hide");
    		break;
    	}
    }
})(jQuery);