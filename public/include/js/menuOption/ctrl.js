$(function(){
  loadMenuLayer();

});
function loadMenuLayer(){
  //console.log(parm);
  var positionObject = useGetAjax(configObject.getPosition);
  var menuObject = useGetAjax(configObject.getmenu,positionObject);
  menuObject.optionData = true;
  var menuLayer = useGetAjax(configObject.menuProcess,menuObject);
  console.log(menuObject);
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
  $.each(menuObject,function(i,v){
    var index = parseInt(menuObject[i].uid);
    //console.log(index);
    selectContent += '<option value = "'+index+'" class="'+menuObject[i].nid+'"></option>';
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

 
  //再解決子層架構
  $.each(tmpArr,function(i,v){
    var index = tmpArr[i].uid;
    var restr = new RegExp("@@uid@@", 'g');
    var tmpSelectOptionStr = selectOption.replace(restr,index);
    var optionStr = '<div class="options">';
    optionStr += '<ul><li>';
    optionStr += '<span class="'+tmpArr[i].nid+'">'+tmpArr[i].nid + '</span>';
    optionStr += '<ul class="menusSettionOptions" id="menusSettionOptions'+index+'">';
    
    optionStr += '<li><span>連結: </span><span><input type="text" name="htrf['+index+'][]" value="'+ tmpArr[i].href +'"></span></li>';
    optionStr += '<li><span>點選動作: </span><span><input type="text" name="click_action['+index+'][]" value="'+ tmpArr[i].click_action +'"></span></li>';
    optionStr += '<li><span>多語系ID設定: </span><span><input type="text" name="nid['+index+'][]" value="'+ tmpArr[i].nid +'"></span></li>';
    optionStr += tmpSelectOptionStr;
    
    optionStr += '</ul>';
    optionStr += '</li></ul>';
    optionStr += '</div>';
    $(optionStr).appendTo("#menusOptions").find("#parentOptions"+index).val(tmpArr[i].parent_layer);    
  });
  
  
  
  console.log(tmpArr);
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