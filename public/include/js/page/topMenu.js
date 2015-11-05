var getMenu = function (dataObject) {
    this.menu = useGetAjax(configObject.getmenu,dataObject);
};

getMenu.prototype = {
    menu: '',
    MenuContent: function () {
        console.log(this.menu);
        $("#menus").html(this.menu);
        //return this.menu;
    }
};
$(function(){
  var positionObject = {position:"3502"};
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
               result = rs.menu;
           }else{
               console.log(rs.msg);
           }
       }
    });
    return result;
}



