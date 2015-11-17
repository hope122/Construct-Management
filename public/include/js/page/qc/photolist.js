
$(function(){
	var json;
$.get(configObject.QCGetData+"?type=qc_checklist",function(result){
	json=JSON.parse(result);
	for (var key in json) {
	    if (!json[key].imgid===null) {
	    	console.log(json[key].uid);
	    };
	}

 });

// $.post("http://211.21.170.18:99/pageaction/getqcimglist",{qcid:5},function(result){
//         console.log(result);
//   });
});
