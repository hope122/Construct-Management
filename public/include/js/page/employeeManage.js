function edit(action){
	console.log(action);
	var cmurl = "http://127.0.0.1:200";
	window.location = cmurl+"/employeemanage/"+action;
}