//設定載入的照片數量
var sLimitOrigin = 0;
var eLimitOrigin = 3;
var sLimit = sLimitOrigin;
var eLimit = eLimitOrigin;
var dynamicQuantity = 2;
var isLoadFinisg = false;

$(function() {  
  loader("title","content-loading-img-in");
  $.getJSON(configObject.QCGetData+"?type=title", function( data ) {
   //console.log(data['name']);
   $('#title').html(data['name']);
  });
  //日期選單
  $.getJSON(configObject.QCGetData,{type:"getDateList",ptype:1}, function( data ) {
    var dSelectObject = '<option value=0>無資料</option>';
    $("#d_select").empty();
    // console.log(data);
    var firstVal = "0";
    if(data.status){
      dSelectObject = "";
      $.each(data, function( i, val ) {
        if(i!="status"){
          if(i==0){
            firstVal = val['datef'];
          }
          dSelectObject += '<option value='+val['datef']+'>'+val['datef']+'</option>';
        }
      });
    }
    $(dSelectObject).appendTo("#d_select");
    $("#d_select").val(firstVal);
    setView(firstVal);
  });
  //日期選單改變時，變換事件
  $("#d_select").change(function(){
    sLimit = sLimitOrigin;
    eLimit = eLimitOrigin;
    isLoadFinisg = false;
    setView($(this).val(),false);
  });
  var iScrollPos = 0;
 
  $(window).scroll(function () {

      var iCurScrollPos = $(this).scrollTop();
      //console.log(iScrollPos);
      if (iCurScrollPos > iScrollPos && !isLoadFinisg && iScrollPos > 0 && iScrollPos%50 == 0) {
          sLimit = eLimit;
          eLimit = eLimit + dynamicQuantity;
          //Scrolling Down
          setView($("#d_select").val());
      }

      iScrollPos = iCurScrollPos;
  });

});  

function setView(d_list,notEmpty){

  itemFade("imgLoader",true);
  if(typeof notEmpty == "undefined"){
    notEmpty = true;
  }
  //先取得樣式，然後開始塞資料
  $.get("pages/qc/list_content_style.html",function(rs){
    //取得照片內容
    $.getJSON(configObject.QCGetData,{type:"qc_checklist",sLimit:sLimit,eLimit:eLimit,datel:d_list}, function( data ) {
      //console.log(data);
      //如果狀態是正常的，開始處理資料
      if(data.status){
        //console.log(data);
        var tmpContentStyle = rs;
        var tmpObj = data.checklist;
        if(!notEmpty){
          $("#photolist").empty();
        }
        //開始處理
        $.each(tmpObj,function(i,v){
          var tmpContent = tmpContentStyle.replace("@@orderform@@",setNumber(v.uid));
          tmpContent = tmpContent.replace("@@qcDate@@",v.datec);
          tmpContent = tmpContent.replace("@@material@@",v.ma_name);
          tmpContent = tmpContent.replace("@@qmaterial@@",v.count);
          tmpContent = tmpContent.replace("@@place@@",v.place);
          if(v.remark.length == 0 || v.remark == null){
            v.remark = "-";
          }
          tmpContent = tmpContent.replace("@@remark@@",v.remark);
          if(v.imgs != null){
            tmpContent = tmpContent.replace("@@imgSrc@@",v.imgs.img0);
          }else{
            tmpContent = tmpContent.replace("@@imgSrc@@","");
          }
          $("#photolist").append(tmpContent);
        });
        itemFade("imgLoader",false);
      }else{
        if(!notEmpty){
          $("#photolist").empty().html("無資料");
        }
        isLoadFinisg = true;
        itemFade("imgLoader",false);
      }
    });
    //console.log(rs);
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
//設定訂單編號
function setNumber(no){
  var max = 6;
  var tmpStr = "AA";
  no = no+"";
  var noLeng = max-no.length
  for(var i = 0; i < noLeng; i++){
    tmpStr += "0";
  }
  tmpStr += no;
  return tmpStr;
}