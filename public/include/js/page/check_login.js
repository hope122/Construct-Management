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
           console.log(rs);
           console.log(location.origin);
           if(!rs.status){
               location.href = location.origin;
           }
		}
	});
}
