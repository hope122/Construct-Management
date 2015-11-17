
$(function(){
$.post(configObject.QCGetData+"?type=qc_checklist",function(result){
        console.log(JSON.parse(result));
  });
});
