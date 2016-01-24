$(function(){
	//$.get().done();
});

function addNewContent(){
	// {
	// 	page:{},
	// 	itemValue:{},
	// 	start: int or string,
	// 	putArea: string,
	//	startHide: string,
	//	backAction: function,
	//	nextBtnAction: {
	// 		a: function,
	// 		....
	// 	}
	// }
	var pageObject = {
		page:{
			numbers: "contract/numbers",
			dispositif_people: "contract/dispositif-people",
			units: "contract/units"
		},
		putArea: "modifyArea",
		startHide: "mainContent",
		backAction:function(){
			
		},
		nextBtnAction:{
			numbers: function(nowItem,nextItem){
				
				if(nextItem != null){
					nowItem.hide();
					itemFade( nextItem ,true);
				}
			},
			dispositif_people: function(nowItem,nextItem){
				
				if(nextItem != null){
					nowItem.hide();
					itemFade( nextItem ,true);
				}
				
			},
			units: function(nowItem,nextItem){
				
				if(nextItem != null){
					nowItem.hide();
					itemFade( nextItem ,true);
				}
				
			},
		},
		preBtnAction:{
			units: function(nowItem,preItem){
				console.log(nowItem,preItem);
				if(preItem != null){
					nowItem.hide();
					itemFade( preItem ,true);
				}
			}
		}
	};
	elfguide(pageObject);
}
