function getJobRank(putArea){
	// 取得職級
	$.getJSON(ctrlAdminAPI + "GetData_AssTypePosition").done(function(rs){
	    putArea.empty();
	    console.log(rs);
	    if(rs.Status){
	        // createOtgList(parentID, orgTreeChart, rs.Data,false);
	    }else{
	    	
	    }
	});
}