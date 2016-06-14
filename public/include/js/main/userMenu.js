function getMenus(loginInfo){
  var menus = porcessData(configObject.getmenu,loginInfo);
  console.log(menus);
  
	var menus = porcessData(configObject.getUserMenu,{});
	console.log(menus);
  var options = {
      idName: "uid",
      title: "memo",
  }

  meunData = processMenuTreeDataOnly(menus.data,options);
  console.log(meunData);
	// $("#menus").html(menus.menu)
	// .find("a").click(function(){
 //      var thisHref = $(this).attr("href");
 //      if(thisHref != "#"){
 //        //location.href = location.origin + "/" + $(this).attr("href");
 //        $("#pagescontent").empty();
 //        loadPage($(this).attr("href"),"pagescontent");
 //      }
 //      return false;
 //  	});
 //  	getLan();
	// loadJS("include/strongly/assets/js/content-main.js","keep");
}