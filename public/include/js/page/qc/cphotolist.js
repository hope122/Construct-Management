
$(function() {  
  $.get(configObject.QCGetData+"?type=title", function( data ) {
      data=JSON.parse(data);
      // console.log(data['name']);
      $('#title').html(data['name']);
  });
  $.get(configObject.QCGetData+"?type=qc_checklist_c", function( data ) {
      // console.log(apurl);
      
      // 丟資料toCM回傳html內容
      $.ajax({
        url: "/qc/getcphotolisthtml",
       type: "POST",
       data: {data:JSON.parse(data),apurl:apurl},
       async:false,
       success: function(rs){
        // console.log(rs);
        $("#photolist").append(rs);
//                    alert('新增成功！');
//                      location.reload();
       },
       error: function(e){
       console.log(e);
            alert('儲存失敗！');
       }
    });
  });
});  
function print(){
    $("#div_print").printArea();
}
function save(){
    var Today=new Date();
　  tdate=Today.getFullYear().toString() + (Today.getMonth()+1)+ Today.getDate().toString() ;
    window.open('/logbook/savepdffile?url='+location.host+'/qc/cphotolist&name=photolist'+tdate);
    // window.close();
    // console.log('/logbook/savepdffile?url='+location.host+'/logbook');
}