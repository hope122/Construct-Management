function getMenus(loginInfo){
	var menus = porcessData(configObject.getmenu,loginInfo);
	//console.log(menus);
	$("#menus").html(menus.menu);
	loadJS("include/strongly/assets/js/main.js");
	getLan();
	setHref();
}