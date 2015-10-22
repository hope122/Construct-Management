var getMenu = function (dataObject) {
    this.menu = useGetAjax(configObject.getmenu,dataObject);
};

getMenu.prototype = {
    menu: '',
    MenuContent: function () {
        var menuStyle = useGetAjax(configObject.menuProcess,this.menu);
        $("#menus").html(menuStyle.menu);
        //return this.menu;
    }
};
$(function(){
  var positionObject = useGetAjax(configObject.getPosition);
  var menus = new getMenu(positionObject);
  menus.MenuContent();
});


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


