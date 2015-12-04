$(function(){

  ptype=$('#inp_ptype').val();
  getContent(ptype,ptype,'div_content','',true);
    // getlist();
});
//影印
function print(){
    $("#div_print").printArea();
}

function getContent(ptype,purl,divid,parameter,reset){
  console.log(configObject.logbookGetData+"?type="+ptype+parameter);
    $.get(configObject.logbookGetData+"?type="+ptype+parameter, function( data ) {    
      //丟資料toCM回傳html內容
      $.ajax({
       url: "/logbook/"+purl,
       type: "POST",
       data: {data:JSON.parse(data)},
       async:false,
       success: function(rs){
        $("#"+divid).empty();
        $("#"+divid).append(rs);
        if(reset){
          // setBtn();
        }
       }
    });
  });
}

function tolist(){
  getContent('list','list','div_content','',true);
}
//===============list=========s
function toreport(uid){
  getContent('reportinfo','report','div_content','&uid='+uid,true);
}
//===============list=========e
//===============setcontent=========s
function tosetpage(){
  getContent('setcontent','setcontent','div_content','',true);
}
function savecontent(){
  isnew=$("#isnew").val();
  console.log(isnew);
  if(isnew==1){
      $.ajax({
       url: configObject.logbookInsert,
       type: "POST",
       data: $("#cform").serialize(),
       async:false,
       success: function(rs){
          alert("儲存成功");
          getContent('list','list','div_content','',true);
       }
    });
  }else{
      $.ajax({
       url: configObject.logbookModify,
       type: "POST",
       data: $("#cform").serialize(),
       async:false,
       success: function(rs){
          alert("儲存成功");
          getContent('list','list','div_content','',true);
       }
    });
  }
}
//===============setcontent=========e
//存檔
function save(){
    var Today=new Date();
　  tdate=Today.getFullYear().toString() + (Today.getMonth()+1).toString() +  Today.getDate().toString() ;
    window.open('/logbook/savepdffile?url='+location.host+'/logbook&name=logbook'+tdate, 'save');
    // window.close();
    // console.log('/logbook/savepdffile?url='+location.host+'/logbook');
}
