$(function() {  
  //取資料
  pagetype=$("#pageType").val();
  switch(pagetype)
  {
    case 0:
      stype="list"
      break;
    case 1:
      break;
  }
  $.get(configObject.logbookGetData+"?type="+stype, function( data ) {
      console.log(data);
      
      丟資料toCM回傳html內容
      $.ajax({
       url: "/logbook/"+stype,
       type: "POST",
       data: {data:JSON.parse(data)},
       async:false,
       success: function(rs){
        console.log(rs);
        $("#body").append(rs);
//                    alert('新增成功！');
//                      location.reload();
//        },
       error: function(e){
       console.log(e);
            alert('儲存失敗！');
       }
    });
  });
});  

// //影印
// function print(){
//     $("#div_print").printArea();
// }


//存檔
// function save(){
//     var Today=new Date();
// 　  tdate=Today.getFullYear().toString() + (Today.getMonth()+1).toString() +  Today.getDate().toString() ;
//     window.open('/logbook/savepdffile?url='+location.host+'/logbook&name=logbook'+tdate, 'save');
//     // window.close();
//     // console.log('/logbook/savepdffile?url='+location.host+'/logbook');
// }