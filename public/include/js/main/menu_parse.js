menuParse();
function menuParse(){
	$.getJSON("menu.json",function(rs){
		console.log(rs);
	});
}