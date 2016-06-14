function getMenus(loginInfo){
  // var menus = porcessData(configObject.getmenu,loginInfo);
	var menus = porcessData(configObject.getUserMenu,{});
  var options = {
      idName: "uid",
      title: "memo",
  }

  meunData = processMenuTreeDataOnly(menus.data,options);
  $("#menus").empty();
  $.each(meunData,function(i, content){
    content.find("a").click(function(){
      var thisHref = $(this).attr("href");
      if(thisHref != "#"){
        $("#pagescontent").empty();
        loadPage($(this).attr("href"),"pagescontent");
      }
      return false;
   });
    content.appendTo($("#menus"));
  });
 //  	getLan();
	loadJS("include/strongly/assets/js/content-main.js","keep");
}