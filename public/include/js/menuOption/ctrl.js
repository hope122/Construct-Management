$(function(){
  loadMenuLayer();

});
function loadMenuLayer(){
  //console.log(parm);
  var positionObject = useGetAjax(configObject.getPosition);
  var menuObject = useGetAjax(configObject.getmenu,positionObject);
  menuObject.optionData = true;
  var menuLayer = useGetAjax(configObject.menuProcess,menuObject);
  //console.log(menuObject);
  reprocessMenus(menuObject.menu);
  $("#menus").html(menuLayer.menu);
  /*$("#menus .menuOptions").sortable({
      connectWith: ".menuOptions",
      revert: true
  });*/
  getLan();
}

//整理選單
function reprocessMenus(menuObject){
  var tmpArr = [];
  var selectContent = '<option value = "0">頂層選項</option>';
  //先整理父層架構
  var optionStr = '<div>頂層選項</div><br>';
  $(optionStr).appendTo("#menusOptions");
  var tmpParentContent = {};
  $.each(menuObject,function(i,v){
    var index = parseInt(menuObject[i].uid);
    //console.log(index);
    selectContent += '<option value = "'+index+'" class="'+menuObject[i].nid+'"></option>';
    tmpParentContent[index] = menuObject[i].nid;
    if(parseInt(menuObject[i].parent_layer) != 0){
      tmpArr[tmpArr.length] = menuObject[i];
    }else{
      var optionStr = '<div class="options">';
      optionStr += '<ul><li>';
      optionStr += '<span class="'+menuObject[i].nid+'">'+menuObject[i].nid + '</span>';
      optionStr += '<ul class="menusSettionOptions" id="menusSettionOptions'+index+'">';
      
      optionStr += '<li><span>連結: </span><span><input type="text" name="htrf['+index+'][]" value="'+ menuObject[i].href +'"></span></li>';
      optionStr += '<li><span>點選動作: </span><span><input type="text" name="click_action['+index+'][]" value="'+ menuObject[i].click_action +'"></span></li>';
      optionStr += '<li><span>多語系ID設定: </span><span><input type="text" name="nid['+index+'][]" value="'+ menuObject[i].nid +'"></span></li>';
      
      
      optionStr += '</ul>';
      optionStr += '</li></ul>';
      optionStr += '</div>';
      $(optionStr).appendTo("#menusOptions");
    }
  });
  var selectOption = '<li class="parentOptions">所屬父層：<select id="parentOptions@@uid@@" name="parent_layer[@@uid@@][]">';
  selectOption += selectContent;
  selectOption += '</select></li>';
  
  $(".menusSettionOptions").append(selectOption);
  $(".menusSettionOptions").each(function(){
    var uid = $(this).prop("id").replace("menusSettionOptions","");
    var restr = new RegExp("@@uid@@", 'g');
    var tmpSelectOption = $(this).find(".parentOptions").html().replace(restr,uid);
    $(this).find(".parentOptions").html(tmpSelectOption);
  });

 var tmpParent = {};
 var tmpItems = {};
  //再解決子層架構
  $.each(tmpArr,function(i,v){
    var index = tmpArr[i].uid;
    var restr = new RegExp("@@uid@@", 'g');
    var tmpSelectOptionStr = selectOption.replace(restr,index);
    if(typeof tmpParent[tmpArr[i].parent_layer] != 'undefined'){
      //var optionStr = '<div class="options">';
    }else{
      //var optionStr = '<div class="parent'+tmpArr[i].parent_layer+' parent">'+tmpArr[i].parent_layer+'</div><br/>';
      //optionStr += '<div class="options">';
      tmpParent[tmpArr[i].parent_layer] = true;
      tmpItems[tmpArr[i].parent_layer] = {};
    }
    var optionStr = '<div class="options">';
    optionStr += '<ul><li>';
    optionStr += '<span class="'+tmpArr[i].nid+'">'+tmpArr[i].nid + '</span>';
    optionStr += '<ul class="menusSettionOptions" id="menusSettionOptions'+index+'">';
    
    optionStr += '<li><span>連結: </span><span><input type="text" name="htrf['+index+'][]" value="'+ tmpArr[i].href +'"></span></li>';
    optionStr += '<li><span>點選動作: </span><span><input type="text" name="click_action['+index+'][]" value="'+ tmpArr[i].click_action +'"></span></li>';
    optionStr += '<li><span>多語系ID設定: </span><span><input type="text" name="nid['+index+'][]" value="'+ tmpArr[i].nid +'"></span></li>';
    optionStr += tmpSelectOptionStr;
    
    optionStr += '</ul>';
    tmpSelectOptionStr += '</li></ul>';
    optionStr += '</div>';

    var objects = {};
    objects[index] = optionStr;
    $.extend(tmpItems[tmpArr[i].parent_layer],objects);
    //$(optionStr).appendTo("#menusOptions").find("#parentOptions"+index).val(tmpArr[i].parent_layer);    
  });
  //開始放到頁面上
  $.each(tmpItems,function(i,v){
    var optionStr = '<h3 class="'+tmpParentContent[i]+' parent">'+tmpParentContent[i]+'</h3><br/>';
    $(optionStr).appendTo("#menusOptions");   
    $.each(tmpItems[i],function(y,yv){
      var optionStr = yv;
      $(optionStr).appendTo("#menusOptions").find("#parentOptions"+y).val(i);
    });

  });
  //console.log(tmpParentContent);
  //console.log(tmpItems);
}

//取得資訊
function useGetAjax(url, data){
    var result = '';
    if(typeof data === 'undefined'){
        data = {};
    }
    $.ajax({
       url: url,
       type: "POST",
       data: data,
       async: false,
       dataType: "JSON",
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