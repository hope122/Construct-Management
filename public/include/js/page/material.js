$(function(){

  ptype=$('#inp_ptype').val();
  getContent(ptype);
    // getlist();
});
function getContent(ptype){
 
    $.get(configObject.MaterialGetData+"?type="+ptype, function( data ) {
 

      //丟資料toCM回傳html內容
      $.ajax({
       url: "/material/"+ptype,
       type: "POST",
       data: {data:JSON.parse(data)},
       async:false,
       success: function(rs){
        $("#div_content").empty();
        $("#div_content").append(rs);
        setBtn();
       }
    });
  });
}
function setBtn(){
  $("#inp_prjuid").change(function() {
        var uid=$(this).val();

        if(uid!=0){
            $.get(configObject.MaterialGetData,{ type: "qu_materiel",uid:uid},function(data){
                var o=jQuery.parseJSON(data);
                $('#inp_total').val((o[0].count==null)?0:o[0].count);
                $('#inp_finished').val((o[0].count_in==null)?0:o[0].count_in);
                $('#inp_prjuid').val((o[0]. uid==null)?0:o[0].uid);
            });
        }else{
             $('#inp_total').val(0);
             $('#inp_finished').val(0);
             $('#inp_prjuid').val(0);
        }
    });
  
    $("#inp_supply").change(function() {

        var suid=$(this).val();
              console.log(suid);
        $.get('/material/getprjuid',{ suid: suid},function(data){
                $("#inp_prjuid").empty();
                $("#inp_prjuid").append(data);
            });
        });
    $("#inp_date").datepicker({
        dateFormat: 'yy-mm-dd'
    });
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

function getlist(){
    $("#list").empty();
    $.get("/material/getlist", function(result){
        $("#list").append(result);
    });
}