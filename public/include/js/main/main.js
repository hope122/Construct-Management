function redirectPage(result){
  if(result.status){
        $.post(configObject.processLoginUrl,result,function(rs){
           location.href = location.origin;
        });
  }else{
    alert(result.error);
  }
}