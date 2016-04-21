// 起始筆數
var start = 0;
// 每頁顯示筆數
var row = 10;
$(function(){
	getContructList();
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
	// 	},
	//	breadcrumbs:{
	//		mean:{
	// 			name1: "mean value",
	// 			name2: "mean value",
	//		},
	// 		cancelClick:"name1,name2, ...", //string
	// 		select: "name1" //default first object name
	// 	}
	// }
	var pageObject = {
		page:{
			numbers: "contract/numbers",
			contract_name: "contract/contract-name",
			dispositif_people: "contract/dispositif-people",
			units: "contract/units",
			payment: "contract/payment",
			penalty: "contract/penalty"
		},
		putArea: "modifyArea",
		startHide: "mainContent",
		dataClass: "userInput",
		dataOption:{
			dateFormat: "yy-mm-dd",
			onSelect: function(dateText, inst) {
				var dateTmp = dateText.split("-");
				var dateStr = "民國"+(parseInt(dateTmp[0]) - 1911) + "年"+dateTmp[1]+"月"+dateTmp[2]+"日";
				$(this).val(dateStr);
			}
		},
		backAction:function(){
			
		},
		nextBtnAction:{
			numbers: function(nowItem,nextItem){
				
				if(nextItem != null){
					nowItem.hide();
					itemFade( nextItem ,true);
				}
			},
			contract_name: function(nowItem,nextItem){
				
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
			payment: function(nowItem,nextItem){
				
				if(nextItem != null){
					nowItem.hide();
					itemFade( nextItem ,true);
				}
				
			},
			penalty: function(nowItem,nextItem){
				
				if(nextItem != null){
					nowItem.hide();
					itemFade( nextItem ,true);
				}
				console.log("end");
				
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
		},
		finishBtnAction: function( data ){
			
			console.log(data);
		},
		breadcrumbs:{
			mean:{
				numbers: "新增契約編號",
				contract_name: "工程資料",
				dispositif_people: "契約相關人員",
				units: "相關單位",
				payment: "付款條件",
				penalty: "罰則"
			},
			//cancelClick:"numbers"
		}
	};
	elfguide(pageObject);
}

function getContructList(){
	// 先清空
	$("#contentList").empty();
	loader($("#contentList"));
	var sendObj = {
	    api: mainDocAPI,
	    data:{
	      start: start,
	      count: row
	    }
	};
	$.getJSON(wrsUrl,sendObj,function(rs){
		$("#contentList").empty();
		if(rs.status){
			var option = {
				styleKind:"list",
				style:"1grid-modify"
			};
			getStyle(option,function(listStyle){
				$.each(rs.data,function(index, content){
					var listStyleObj = $.parseHTML(listStyle);
					$(listStyleObj).addClass("dataContent");
					$(listStyleObj).find(".list-items").eq(0).text(content.name);
					$(listStyleObj).appendTo($("#contentList"));
				});
				$("#contentList").find(".dataContent").last().removeClass("list-items-bottom");
			});
		}else{
			putEmptyInfo( $("#contentList") );
		}
		console.log(rs);
	}).fail(function(){
		putEmptyInfo( $("#contentList") );
	});

	
	// putEmptyInfo( $("#contentList") );
}
