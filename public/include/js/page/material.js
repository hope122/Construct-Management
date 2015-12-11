$(function(){
  ptype=$('#inp_ptype').val();
  getContent(ptype,ptype,'div_content','',true);
    // getlist();
});

function getContent(ptype,purl,divid,parameter,reset){
  // console.log(configObject.MaterialGetData+"?type="+ptype+parameter);
    $.get(configObject.MaterialGetData+"?type="+ptype+parameter, function( data ) {
 
      //丟資料toCM回傳html內容
      $.ajax({
       url: "/material/"+purl,
       type: "POST",
       data: {data:JSON.parse(data)},
       async:false,
       success: function(rs){
        $("#"+divid).empty();
        $("#"+divid).append(rs);
        if(reset){
          setBtn();
        }
       }
    });
  });
}

function setBtn(){
  //===============application======s
  $("#inp_prjuid").change(function() {
        
        var muid=$(this).val();
        var suid=$("#inp_supply").val();

        if(suid==0){
            getContent('getsupply','getselect','inp_supply','&muid='+muid,false);
        }else{
          $("#inp_supply").prop('disabled', 'disabled');
         $.get(configObject.MaterialGetData+"?type=lcount&suid="+suid+"&muid="+muid, function( r ) {
            r=JSON.parse(r);
            lcount=Math.round(r['lcount']*100);
            lcount=lcount/100;
            $("#inp_lcount").val(lcount);
            $("#hid_lcount").val(lcount);
            $("#prj_mid").val(r['prjid']);
          });
        }
    });
    $("#inp_quantity").change(function(){
        var  sum;
        sum=$("#hid_lcount").val()-$(this).val();
        sum=Math.round(sum*100);
        sum=sum/100;
        $("#inp_lcount").val(sum);

    });
    $("#inp_supply").change(function() {
        // $(this).prop('disabled', 'disabled');
        var muid=$("#inp_prjuid").val();
        var suid=$(this).val();
        getContent('getsuinfo','getsuinfo','info','&suid='+suid,false);
        if(muid==0){
            getContent('getmaterial','getselect','inp_prjuid','&suid='+suid,false);

        }else{
          $("#inp_prjuid").prop('disabled', 'disabled');
         $.get(configObject.MaterialGetData+"?type=lcount&suid="+suid+"&muid="+muid, function( r ) {
            r=JSON.parse(r);
             // console.log(r);
            lcount=Math.round(r['lcount']*100);
            lcount=lcount/100;
            $("#inp_lcount").val(lcount);
            $("#hid_lcount").val(lcount);
            $("#prj_mid").val(r['prjid']);
          });
        }
        });
    $("#inp_date").datepicker({
        dateFormat: 'yy-mm-dd'
    });
    //===============application======e

 
    //===============list======s
   $(".jq_date").datepicker({
        dateFormat: 'yy-mm-dd'
    });
   getContent('malist','getselect','inp_mname','',false);
    // $("#btn_findlist").click(function(){

    //     maname=$("#inp_mname").val();
    //     sdate=$("#inp_stime").val();
    //     edate= $("#inp_etime").val();
    //     if(Date.parse(sdate)>Date.parse(edate)){
    //       alert('起始時間不得大於結束時間');
    //     }
    //     if(sdate!='' && edate!='' || maname!=0 ){
    //       getContent('list','list','div_content',"&sdate='"+sdate+"'&edate='"+edate+"'&maname="+maname,'false');
    //     }else{
    //       alert("請輸入搜尋條件");
    //     }
    // });
    $("#inp_mname").change(function(){
      muid=$(this).val();
      if(!muid==0){
        getContent('list','list','div_content',"&maname="+muid,'true');
      }
    });
    //===============list======e

}


  //===============application======s
function clear(){
  getContent('application','application','div_content','',true);
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


                    socket.emit('chatMsg', {'msg':'材料申請通知','uid':uuid,'name':userName});
                    alert('新增成功！');
                    clear();
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
            str+=$('#tr'+index).find('.no').html()+"  "+$('#tr'+index).find('.ma_name').html()+"  "+$('#tr'+index).find('.count').html()+"  "+$('#tr'+index).find('.adate').html()+"\n";
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
                        // send_qclist(arr);
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
function infocheck(){
  d= 'type=chkorder&id=';
  d+=$("#inp_uid").val();
  

  $.ajax({
                   url: configObject.MaterialModify,
                   type: "POST",
                   data: d,
                   async:false,
                   //dataType: "JSON",
                   success: function(rs){
//                    console.log(rs);
                        alert('送出訂單！');
                       // location.reload();
                        sendemail($("#inp_uid").val());
                       $("#btn_check").hide();
                       $("#btn_in").show();
                   },
                   error: function(e){
                        alert('儲存失敗！');
                   }
                });
}
function sendemail(uid){
    $.get(configObject.MaterialGetData+"?type=chkinfo&uid="+uid, function( data ) {
 
      //丟資料toCM回傳html內容
      $.ajax({
       url: "/material/sendemail",
       type: "POST",
       data: {data:JSON.parse(data)},
       async:false,
       // success: function(rs){
       //    console.log(rs);
        
       // }
    });
  });

}
function infoin(){
  d= 'type=chkin&id='+$("#inp_uid").val();
  d+='&count='+$("#inp_count").val();
  d+='&quid='+$("#inp_quid").val();
   var arr = [];
   arr.push({ type: 1, dataid: $("#inp_uid").val(),date:$("#inp_date").val() });
  $.ajax({
                   url: configObject.MaterialModify,
                   type: "POST",
                   data: d,
                   async:false,
                   //dataType: "JSON",
                   success: function(rs){
                        send_qclist(arr);
                        alert('確認進場!');
                       // location.reload();
                       $("#btn_in").hide();
                   },
                   error: function(e){
                        alert('儲存失敗！');
                   }
                });
}

function send_qclist(arr){
     $.ajax({
       url: configObject.QCInsert,
       type: "POST",
       data: {type:"qc_checklist",arr:arr},
       async:false,
       //dataType: "JSON",
       success: function(rs){
       }
    });

}
//===============application======e

//===============list======s
function showinfo(uid){
  getContent('chkinfo','chkinfo','dialog','&uid='+uid,false);
   // $.ajax({
   //          url: '/material/chkinfo?uid='+uid,
   //          type:"GET",
   //          dataType:'text',
   //          success: function(msg){
   //              $('#dialog').html(msg);
   //          },
   //      });
    $('#dialog').css({display:'inline'});

    $("#dialog").dialog({
        title: '資料',
        bgiframe: true,
        height: 300,
        width: '80%',
        modal: true,
        draggable: true,
        resizable: false,
        overlay:{opacity: 0.7, background: "#FF8899" },

    });
}
//===============list======e