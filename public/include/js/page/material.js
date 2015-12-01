$(function(){

  //取得頁面類別
  ptype=$('#inp_ptype').val();

  //取得頁面內容
  getContent(ptype,ptype,'div_content','');
});

//取得頁面內容
//傳入值 String ptype 取得資料的名稱
//      String purl 處理的controller
//      String divid 取回html後要塞入的div
//      String parameter get參數若無輸入'',若有第一位加& 
function getContent(ptype,purl,divid,parameter){
    
    $.get(configObject.MaterialGetData+"?type="+ptype+parameter, function( data ) {
      // console.log(data);
      //丟資料toCM回傳html內容
      $.ajax({
       url: "/material/"+purl,
       type: "POST",
       data: {data:JSON.parse(data)},
       async:false,
       success: function(rs){
        $("#"+divid).empty();
        $("#"+divid).append(rs);
        setBtn();
       }
    });
  });
}
//----------------------application-------h
function setBtn(){

  $("#inp_prjuid").change(function() {

        var suid=$("#inp_supply").val();
        var muid=$(this).val();
        if (suid==0){
          getContent('getsupply','getselect','inp_supply','&muid='+muid);
        }else{

        }
    });
  
    $("#inp_supply").change(function() {

        var suid=$(this).val();
        var muid=$("#inp_prjuid").val();
        if (muid==0){
          getContent('getmaterial','getselect','inp_prjuid','&suid='+suid);
          $.get(configObject.MaterialGetData+"?type="+ptype+parameter, function( data ) {
          });
        }else{

        }

    });
    $("#inp_date").datepicker({
        dateFormat: 'yy-mm-dd'
    });
}
function clear(){
  getContent('application','application','div_content','');
}
function chkinp(){
    var chk=true;
    var d='';
    d += 'type=el_petition&';
//    var d='{type:el_petition,';
    $( ".cls_inp" ).each(function( index ) {
        if($(this).val()==0 || $(this).val()==''){
            chk=false;
        }else{
            d += $(this).prop('id')+'='+$(this).val()+'&';
            
//            d+=$(this).prop('id')+':'+$(this).val()+';';
        }
       
    });
    d = d.substring(0,d.length-1);
//    console.log(d);
    if(!chk){
        alert('資料不完整！');
    }else{
            $.ajax({
               url: configObject.MaterialInsert,
               type: "POST",
               data: d,
               async:       false,
               //dataType: "JSON",
               success: function(rs){
//                console.log(rs);
                    socket.emit('chatMsg', {'msg':'材料申請通知','uid':uuid,'name':userName});
                    alert('新增成功！');
                    getlist();
               },
               error: function(e){
                    alert('儲存失敗！');
               }
            });
    }
   
}

//=============================application=====e
function chk_order(){
    var d='';
    var str='';
    var arr = [];
    d += 'type=chkorder&id=';
    $( ".cls_order" ).each(function( index ) {
//                console.log($(this).val());
        if(this.checked){
            d += $(this).val()+',';
//            console.log($('#tr'+index).find('.name').html()+"  "+$('#tr'+index).find('.time').html()+"");
            index++;
//            console.log('#tr'+index);
            str+=$('#tr'+index).find('.supply').html()+"  "+$('#tr'+index).find('.name').html()+"  "+$('#tr'+index).find('.time').html()+"  "+$('#tr'+index).find('.count').html()+"\n";
            arr.push({ type: 1, dataid: $(this).val(),date:$('#tr'+index).find('.time').html() });
            
        }
    });
//    console.log(arr);
    d = d.substring(0,d.length-1);
    if(!str==''){
        r=confirm('確認資料：\n'+str);
        if(r){
               $.ajax({
                   url: configObject.MaterialModify,
                   type: "POST",
                   data: d,
                   async:false,
                   //dataType: "JSON",
                   success: function(rs){
//                    console.log(rs);
                        send_qclist(arr);
                        alert('送出訂單！');
//                        location.reload();
                   },
                   error: function(e){
                        alert('儲存失敗！');
                   }
                });
        }else{
            location.reload();
        }
    }
}

function send_qclist(arr){
    console.log(arr);
     $.ajax({
       url: configObject.QCInsert,
       type: "POST",
       data: {type:"qc_checklist",arr:arr},
       async:false,
       //dataType: "JSON",
       success: function(rs){
                console.log(rs);
       }
    });

}
