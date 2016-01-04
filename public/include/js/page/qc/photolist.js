
$(function() {  
  $.get(configObject.QCGetData+"?type=title", function( data ) {
      data=JSON.parse(data);
      // console.log(data['name']);
      $('#title').html(data['name']);
  });
  setView(0); 
  $.get(configObject.QCGetData+"?type=getDateList&ptype=1", function( data ) {
    $("#d_select").empty().append('<option val=0>請選擇</option>');
    // console.log(data);
    data=JSON.parse(data);
    $.each(data, function( i, val ) {

        $("#d_select").append('<option val='+val['datef']+'>'+val['datef']+'</option>');
    })
  });
  $("#d_select").change(function(){
    setView($(this).val());
  });
});  
function setView(d_list){
   
  $.get(configObject.QCGetData+"?type=qc_checklist&datel="+d_list, function( data ) {
      data=JSON.parse(data);
      // 丟資料toCM回傳html內容
      $.ajax({
        url: "/qc/getphotolisthtml",
       type: "POST",
       data: {data:data,apurl:apurl},
       async:false,
       success: function(rs){

        $("#photolist").empty().append(rs);
        $("#d_title").empty().append(data['date']);
       },
       error: function(e){
       console.log(e);
            alert('儲存失敗！');
       }
    });
  });

}

function print(){
    $("#div_print").printArea();
}
function save(){
    var Today=new Date();
　  tdate=Today.getFullYear().toString() + (Today.getMonth()+1)+ Today.getDate().toString() ;
    window.open('/logbook/savepdffile?url='+location.host+'/qc/photolist&name=photolist'+tdate);
    // window.close();
    // console.log('/logbook/savepdffile?url='+location.host+'/logbook');
}