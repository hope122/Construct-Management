$(function(){
  checkUserLogin();
});

function checkUserLogin(){
	$.ajax({
		url: configObject.getAcInfo,
		type:"POST",
		async: false,
        dataType: "JSON",
		success: function(rs){
           if(!rs.status){
               location.href = location.origin;
           }
		}
	});
}
