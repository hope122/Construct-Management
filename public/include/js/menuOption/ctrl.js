$(function(){
  loadMenuLayer();

});
function loadMenuLayer(){
  //console.log(parm);
  var positionObject = useGetAjax(configObject.getPosition);
  var menuObject = useGetAjax(configObject.getmenu,positionObject);
  menuObject.optionData = true;
  var menuLayer = useGetAjax(configObject.menuProcess,menuObject);
  console.log(menuLayer);
  $("#menus").html(menuLayer.menu);
  $("#menus").sortable({
      connectWith: ".menuOptions",
      revert: true
  });
  getLan();
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