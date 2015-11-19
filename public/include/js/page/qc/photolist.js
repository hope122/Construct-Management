
// $(function(){
// $.get(configObject.QCGetData+"?type=qc_checklist",function(result){
// 	json=JSON.parse(result);
// 	for (var key in json) {
// 	    if (!(json[key].imgid===null)) {
// 	    	// console.log(configObject.MaterialGetData+"?type=el_petition&"+json[key].dataid);
// 	    	str=getdata(json[key].dataid);
// 	    	console.log(str);
// 	    	data64=getdata64(json[key].uid);
// 			$("#photolist").append("<tr><td><img width='500px'  src='"+data64+"'/></td><td>"+str+"</td></tr ><br>");
// 	    };
// 	}

//  });

// });
// function getdata(dataid){
// 	var str;
// 	$.get(configObject.MaterialGetData+"?type=el_petition&uid="+dataid,function(re){
// 		data=JSON.parse(re);
// 		str="材料名稱："+$(data)[0].ma_name;
// 		str+="<br>數量："+$(data)[0].count;
// 		str+="<br>放置地點："+$(data)[0].place;
// 		console.log(str);
// 		return str;
// 	});
// }
// function getdata64(uid){
// 	$.post("http://211.21.170.18:99/pageaction/getqcimglist",{qcid:uid},function(imgresult){
// 		img=JSON.parse(imgresult);
// 		d64=$(img)[0].imgs.img0;
// 		return d64;
// 	});
	
// }
function print(){
    $("#pr").printArea();
}