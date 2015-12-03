$(function(){
  //建立選單
  $.ajax({
    url: configObject.ReceiptGetData,
    type: "POST",
    data: { type: "supplyList" },
    dataType: "JSON",
    async: false,
    success:
      function(rs){
        if(rs.status){
          var supplyOption = createSelection(rs.data,"supply");
          //console.log(supplySelection);
          $("#supplySelection").append(supplyOption);
        }else{
          alert(rs.msg);
        }
      },
    error:
      function(e){
        console.log(e);
      }
  });

  //顯示表頭
  $.ajax({
    url: configObject.ReceiptGetData,
    type: "POST",
    data: { type: "companyTitle" },
    dataType: "JSON",
    async: false,
    success:
      function(rs){
        if(rs.status){
          $("#company_name").text(rs.data[0].val);
        }else{
          console.log(rs.msg);
        }
      },
    error:
      function(e){
        console.log(e);
      }
  });

  //顯示廠商相關資料
  $("#supply").change(function(){
    //console.log($(this).val());
    $.ajax({
      url: configObject.ReceiptGetData,
      type: "POST",
      data: { type: "supplyInfo", suid: $(this).val() },
      dataType: "JSON",
      success:
        function(rs){
          //console.log(rs);
          if(rs.status){
            //呈現資料
            setView(rs.data);
          }else{
            //console.log(rs.msg);
            clearView();
          }
        },
      error:
        function(e){
          console.log(e);
        }
    });
  });
});

function createSelection($dataArr,$id){
    var $Selection = $("<select/>").attr("id",$id);
    $("<option/>").attr("value", 0)
                  .text("-請選擇-")
                  .appendTo($Selection);
    $.each($dataArr,function(i,v){
      //console.log(i,v);
      $("<option/>").attr("value", v.uid)
                    .text(v.name)
                    .appendTo($Selection);
    });

    return $Selection;
}

function setView($dataArr){
  // console.log($dataArr[0]);

  //廠商資料
  $("#su_name").text($dataArr[0].su_name);
  $("#owner").text($dataArr[0].owner);
  $address = getAddress($dataArr);
  // console.log($address);
  $("#su_address").text($address);
  $("#su_tel_o").text($dataArr[0].tel_o);
  $("#mobile").text($dataArr[0].mobile);

  //付款資料
  $("#voucher").text($dataArr[0].voucher);
  $("#dates").text($dataArr[0].dates);
  $("#datee").text($dataArr[0].datee);
  $("#amount").text($dataArr[0].amount);
  $("#pay_date").text($dataArr[0].pay_date);
}

function getAddress($dataArr){
  return $dataArr[0].zip + $dataArr[0].city + $dataArr[0].area +
         $dataArr[0].vil + $dataArr[0].verge + $dataArr[0].road + $dataArr[0].addr;
}

function clearView(){
  $("#su_name").text("");
  $("#owner").text("");
  $("#su_address").text("");
  $("#su_tel_o").text("");
  $("#mobile").text("");

  //付款資料
  $("#voucher").text("");
  $("#dates").text("");
  $("#datee").text("");
  $("#amount").text("");
  $("#pay_date").text("");
}