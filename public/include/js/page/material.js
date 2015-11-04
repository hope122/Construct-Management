var apurl='http://127.0.0.1:88/'
var pageurl='http://127.0.0.1:168/'
$(function(){
    $("#inp_prjuid").change(function() {
        var uid=$(this).val();

        if(uid!=0){
            $.get(apurl+'material/getdbdata',{ type: "qu_materiel",uid:uid},function(data){
                
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
    
        $.get(pageurl+'material/getprjuid',{ suid: suid},function(data){
                $("#inp_prjuid").empty();
                $("#inp_prjuid").append(data);
            });
        });

});

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
               url: apurl+'material/dbinsert',
               type: "POST",
               data: d,
               async:       false,
               //dataType: "JSON",
               success: function(rs){
//                console.log(rs);
                    alert('新增成功！');
                      location.reload();
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
                   url: apurl+'material/dbmodify',
                   type: "POST",
                   data: d,
                   async:false,
                   //dataType: "JSON",
                   success: function(rs){
//                    console.log(rs);
                        send_qclist(arr);
                        alert('送出訂單！');
                        location.reload();
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
     $.ajax({
       url: apurl+'qc/dbinsert',
       type: "POST",
       data: {type:"qc_checklist",arr:arr},
       async:false,
       //dataType: "JSON",
       success: function(rs){
                console.log(rs);
       }
    });

}