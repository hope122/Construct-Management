$(function(){

});

function setView(type){
	switch(type){
		case "engineering":
			//取得所需資料
			var arrData = new Array();
			$.ajax({
				url: configObject.engGetData,
				method: "POST",
				asycn: false,
				data: { type: "engDataTree" },
				dataType: "JSON",
				success:
					function(rs){
						if(rs.status){
							arrData = rs.result;
							console.log("success", arrData);
						}else{
							console.log("AP has error.",rs.msg);
						}
					},
				error:
					function(e){
						console.log("error", e);
					}
			});

			//產生畫面

			//呈現畫面
			break;
		case "space":
			//取得所需資料
			$.ajax({
				url: configObject.engGetData,
				method: "POST",
				asycn: false,
				data: { type: "spaceDataTree" },
				dataType: "JSON",
				success:
					function(rs){
						if(rs.status){
							arrData = rs.result;
							console.log("success", arrData);
						}else{
							console.log("AP has error.",rs.msg);
						}
					},
				error:
					function(e){
						console.log("error", e);
					}
			});

			//產生畫面

			//呈現畫面
			break;
		default:
	}
}