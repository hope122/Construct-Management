(function( $ ){

    $.fn.bsDialog = function(action, option) {
        if(typeof action == "object"){
            option = $.extend({}, $.fn.bsDialog.defaults, action);
            action = "";
        }else{
            option = $.extend(true, {}, $.fn.bsDialog.defaults, option);
        }
        // console.log(action, option);
        
        return new BsDialog(this, option, action);
    }

    $.fn.bsDialog.defaults = {
        headerCloseBtn: true,
        title: "&nbsp;",
        showFooterBtn: true,
        autoShow: true,
        button: [],
        start: function(){}
    };

    function BsDialog($selector, option, action){
        var self = this;

        this.bsDialogShow = function(){
            $selector.modal({
                backdrop: 'static',
            });
        };

        this.bsDialogClose = function(){
            $selector.modal("hide");
        };

        this.start = function(){

            if($selector.find(".modal-content").length){
                return;
            }
            $selector.addClass("modal fade");
            var originContent = $selector.html();
            $selector.empty();
            var bsModal = $("<div>").addClass("modal-dialog").appendTo($selector);
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
                var buttonArea = $("<div>").addClass("modal-footer");
                    // console.log(typeof option.button, option.button);

                $.each(option.button,function(index,content){
                    var button = $("<button>");
                    
                    button.addClass("btn btn-default").text(content.text).click(function(){
                        if(typeof content["click"] != "undefined"){
                            content["click"]();
                        }
                    });
                    if(typeof content.className != "undefined"){
                        button.addClass(content.className);
                    }
                    button.appendTo(buttonArea);
                        
                });
                buttonArea.appendTo(bsModalContent);
            }

            option["start"]();
        }

        switch(action){
            case "show":
                self.bsDialogShow();
                return;
            break;
            case "close":
                self.bsDialogClose();
                return;
            break;
        }
            
        
        if(option.autoShow){
            self.start();
            self.bsDialogShow();
        }else{
            self.start();
        }
    }
})(jQuery);