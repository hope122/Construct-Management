(function( $ ){

    $.fn.treeView = function(option) {
        option = $.extend(true, {}, $.fn.bsDialog.defaults, option);
        
        return new treeView(this, option);
    }

    $.fn.treeView.defaults = {
        openIcon: null,
        closeIcon: null,
        selectedData: null,
        data:{},
        start: function(){}
    };

    var isSelected = {};
    var parentSelectStatus = {};
    var childIsSelected = {};
    var parentItem = {};

    function treeView($selector, option){
        var self = this;

        this.start = function(){
            var contentUL = $('<ul>');
            
            contentUL.addClass("treeViewContent");

            $.each(option.data,function(index, nodesContent){
                // console.log(nodesContent);
                var contents = $('<div>');
                var checkBox = $('<input type="checkbox">');

                contents.append(checkBox).append(nodesContent.title);

                var thisLIContent = $('<li>').addClass("treeContent").append(contents);
                if(nodesContent.nodes != undefined){
                    var expansion = $('<i class="fa fa-minus-square-o fa-lg"></i>');
                    expansion.click(function(){
                        if($(this).prop("class").search("fa-minus-square-o") != -1){
                            thisLIContent.find(".treeViewContent").slideUp();
                            thisLIContent.find(".fa-minus-square-o").removeClass("fa-minus-square-o").addClass("fa-plus-square-o");
                            $(this).removeClass("fa-minus-square-o").addClass("fa-plus-square-o");
                        }else{
                            thisLIContent.find(".treeViewContent").slideDown();
                            thisLIContent.find(".fa-plus-square-o").removeClass("fa-plus-square-o").addClass("fa-minus-square-o");
                            $(this).removeClass("fa-plus-square-o").addClass("fa-minus-square-o");
                        }
                    });

                    thisLIContent.find("input").after(expansion);
                    createChild( thisLIContent, nodesContent.nodes, nodesContent.id );

                    checkBox.click(function(){
                        var isChecked = $(this).prop("checked");
                        // console.log($(this).parents(".treeContent").find("input:checkbox"));
                        $(this).parents(".treeContent").find("input:checkbox").prop("checked",isChecked).change();
                        if(isChecked){
                            isSelected[nodesContent.id] = true;
                        }else{
                            delete isSelected[nodesContent.id];
                        }
                    }).change(function(){
                        var isChecked = $(this).prop("checked");
                        if(isChecked){
                            isSelected[nodesContent.id] = true;
                        }else{
                            delete isSelected[nodesContent.id];
                        }
                    });
                    parentSelectStatus[nodesContent.id] = nodesContent.nodes.length;
                    childIsSelected[nodesContent.id] = {};
                    parentItem[nodesContent.id] = checkBox;

                }else{
                    checkBox.change(function(){
                        var isChecked = $(this).prop("checked");
                        if(isChecked){
                            isSelected[nodesContent.id] = true;
                        }else{
                            delete isSelected[nodesContent.id];
                        }

                    });
                }
                

                thisLIContent.appendTo(contentUL);
                // $selector
            });
            contentUL.appendTo($selector);
            option["start"]();
        }

        this.selectAll = function(){

        }

        this.selected = function(){
            return selected();
        }

        this.expansion = function(){

        }

        self.start();
    }

    function createChild($selector,data, parentID){
        
        $.each(data, function(index,cNodes){
            // console.log(index, data[index].nodes);
            // return;
            var childContentUL = $('<ul>');
            childContentUL.addClass("treeViewContent");

            var contents = $('<div>');
            var checkBox = $('<input type="checkbox">');

            contents.append(checkBox).append(cNodes.title);
            var liContent = $('<li>').addClass("treeContent").append(contents).appendTo(childContentUL);

            if(typeof cNodes.nodes != "undefined"){
                var expansion = $('<i class="fa fa-minus-square-o fa-lg"></i>');
                expansion.click(function(){
                    if($(this).prop("class").search("fa-minus-square-o") != -1){
                        liContent.find(".treeViewContent").slideUp();
                        $(this).removeClass("fa-minus-square-o").addClass("fa-plus-square-o");
                        liContent.find(".fa-minus-square-o").removeClass("fa-minus-square-o").addClass("fa-plus-square-o");

                    }else{
                        liContent.find(".treeViewContent").slideDown();
                        $(this).removeClass("fa-plus-square-o").addClass("fa-minus-square-o");
                        liContent.find(".fa-plus-square-o").removeClass("fa-plus-square-o").addClass("fa-minus-square-o");
                        
                    }
                });
                liContent.find("input").after(expansion);
                checkBox.click(function(){
                    var isChecked = $(this).prop("checked");
                    // console.log($(this).parents(".treeViewContent"));
                    $(this).parents(".treeViewContent").eq(0).find("input:checkbox").prop("checked",isChecked).change();
                    if(isChecked){
                        isSelected[cNodes.id] = true;
                        childIsSelected[parentID][cNodes.id] = true;
                    }else{
                        delete isSelected[cNodes.id];
                        delete childIsSelected[parentID][cNodes.id];
                    }
                    setPartentSelectStatus(parentID, cNodes.id);

                }).change(function(){
                    var isChecked = $(this).prop("checked");
                    if(isChecked){
                        isSelected[cNodes.id] = true;
                        childIsSelected[parentID][cNodes.id] = true;
                    }else{
                        delete isSelected[cNodes.id];
                        delete childIsSelected[parentID][cNodes.id];
                    }
                    setPartentSelectStatus(parentID, cNodes.id);

                });
                createChild(liContent, cNodes.nodes, cNodes.id);
                parentSelectStatus[cNodes.id] = cNodes.nodes.length;
                childIsSelected[cNodes.id] = {};
                parentItem[cNodes.id] = checkBox;

            }else{
                checkBox.change(function(){
                    // console.log("T");
                    var isChecked = $(this).prop("checked");
                    if(isChecked){
                        isSelected[cNodes.id] = true;
                        childIsSelected[parentID][cNodes.id] = true;
                    }else{
                        delete isSelected[cNodes.id];
                        delete childIsSelected[parentID][cNodes.id];
                    }
                    // console.log(parentID);
                    setPartentSelectStatus(parentID, cNodes.id);
                    
                });
            }

            $(childContentUL).appendTo( $selector );
        });
    }

    function selected(){
        var selectStr = "";
        $.each(isSelected,function(i,content){
            selectStr += i + ","; 
        });
        if(selectStr.length){
            selectStr = selectStr.substring(0,selectStr.length-1);
        }
        return selectStr;
    }

    function setPartentSelectStatus(parentID){
        // console.log(childIsSelected[parentID],parentID);

        if(Object.size(childIsSelected[parentID]) == parentSelectStatus[parentID]){
            parentItem[parentID].prop("checked",true).change();
            isSelected[parentID] = true;
        }else{
            parentItem[parentID].prop("checked",false).change();
            delete isSelected[parentID];
        }
    }

    //取得物件長度
    Object.size = function(obj) {
        var size = 0, key;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) size++;
        }
        return size;
    };
})(jQuery);