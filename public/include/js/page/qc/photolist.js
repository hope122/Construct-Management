
$(function(){
$.post("http://127.0.0.1:88/pageaction/getqcimglist",{qcid:5},function(result){
        console.log(result);
  });
});
