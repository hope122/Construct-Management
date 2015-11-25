$(function() {  
  //取資料
  $.get(configObject.logbookGetData+"?type=logbook", function( data ) {
      console.log(data);
      
      //丟資料toCM回傳html內容
      $.ajax({
       url: "/logbook/gethtml",
       type: "POST",
       data: {data:JSON.parse(data)},
       async:false,
       success: function(rs){
        console.log(rs);
        $("#div_print").append(rs);
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

//影印
function print(){
    $("#div_print").printArea();
}


//存檔
function save(){
    window.open(cmurl+'/logbook/savepdffile?url='+cmurl+'/logbook', 'save');
}

// function chkinp(){
//     var chk=true;
//     var d='';
//     d =$("#data").val();
// //    var d='{type:el_petition,';
//     $( ".cls_inp" ).each(function( index ) {
//         if($(this).val()==0 || $(this).val()==''){
//             chk=false;
//         }else{
//             d += $(this).prop('id')+'='+$(this).val()+'&';
            
// //            d+=$(this).prop('id')+':'+$(this).val()+';';
//         }
       
//     });
//     d = d.substring(0,d.length-1);
//     console.log(d);
//     if(!chk){
//         alert('資料不完整！');
//         }else{
//             $.ajax({
//                url: configObject.logbookInsert,
//                type: "POST",
//                data: d,
//                async:false,
//                dataType: "JSON",
//                success: function(rs){
//                 console.log(rs);
// //                    alert('新增成功！');
// //                      location.reload();
//                },
//                error: function(e){
//                console.log(e);
//                     alert('儲存失敗！');
//                }
//             });
//     }

// }