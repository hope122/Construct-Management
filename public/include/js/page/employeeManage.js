var myRedirect = function(redirectUrl, arg, value) {
  var form = $('<form action="' + redirectUrl + '" method="post">' +
  '<input type="hidden" name="'+ arg +'" value="' + value + '"></input>' + '</form>');
  $('body').append(form);
  $(form).submit();
};

function edit(action){
	//alert(action);
	var directurl = "http://127.0.0.1:200/employeemanage/editpage";
	myRedirect(directurl, "action", action);
}

