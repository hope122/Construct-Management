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

  //顯示相關資料
  $("#supply").change(function(){
    //console.log($(this).val());
    if($(this).val()!=0){
      $.ajax({
        url: configObject.ReceiptGetData,
        type: "POST",
        data: { type: "detial", suid: $(this).val() },
        dataType: "JSON",
        success:
          function(rs){
            console.log(rs.data.price[0].price);
            if(rs.status){
              //呈現資料
              setView(rs.data);
              
            }else{
              console.log(rs.msg);
              clearView();
            }
          },
        error:
          function(e){
            console.log(e);
          }
      });
    }else{
      clearView();
      $("#receipt").hide();
    }
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
  //console.log($dataArr);
  if(!$.isEmptyObject($dataArr.supplyInfo) && !$.isEmptyObject($dataArr.dateRange) && !$.isEmptyObject($dataArr.price) && !$.isEmptyObject($dataArr.detial)){
    //廠商資料  
    setSupplyInfo($dataArr.supplyInfo);

    //付款資料
    setPaymentData($dataArr.dateRange[0], $dataArr.price[0]);

    //明細資料
    setList($dataArr.detial);

    $("#receipt").show();
    $("#submit").css("visibility","visible");
  }else{
    //清除資料
    clearView();
    $("#receipt").hide();
    $("#submit").css("visibility","hidden");

    alert("無資料");
  }
}

function getAddress($dataArr){
  //console.log($dataArr);
  $.each($dataArr,function(i,v){
    if(typeof(v)!="string"){
      $dataArr[i]="";
    }
  });
  //console.log($dataArr);
  return $dataArr.zip + $dataArr.city + $dataArr.area +
         $dataArr.vil + $dataArr.verge + $dataArr.road + $dataArr.addr;
}

function clearView(){
  //廠商
  $("#su_name").text("");
  $("#owner").text("");
  $("#zip").text("");
  $("#city").text("");
  $("#area").text("");
  $("#vil").text("");
  $("#verge").text("");
  $("#road").text("");
  $("#addr").text("");
  $("#tel_o").text("");
  $("#mobile").text("");

  //付款資料
  $("#dates").text("");
  $("#datee").text("");
  $("#price").text("");

  //明細
  $("tr[name='newTr']").remove();
}

function setList($dataArr){
  //console.log($dataArr);
  if(!$.isEmptyObject($dataArr)){
    $.each($dataArr,function(i,v){
      //console.log(i,v);
      var $tr = $("<tr/>").attr("name","newTr");
      $("<td/>").attr("width","16%").text(v.n1).appendTo($tr);
      $("<td/>").attr("width","16%").text(v.n2).appendTo($tr);
      $("<td/>").attr("width","16%").text(v.n3).appendTo($tr);
      $("<td/>").attr("width","16%").text(v.n4).appendTo($tr);
      $("<td/>").attr("width","16%").text(v.qty).appendTo($tr);
      $("<td/>").attr("width","16%").text(v.unit1).appendTo($tr);
      $tr.appendTo($("#payment"));
    });
  }else{
    $("tr[name='newTr']").remove();
  }
}

function setSupplyInfo($dataArr){
  if(!$.isEmptyObject($dataArr)){
    $.each($dataArr[0],function(i,v){
      if(typeof(v)=="string"){
        $("#"+i).text(v);
      }
    });
  }
}

function setPaymentData($dateRange, $price){
  $.each($dateRange,function(i,v){
    if(typeof(v)=="string"){
      $("#"+i).text(v);
    }else{
      $("#"+i).text("");
    }
  });
  $.each($price,function(i,v){
    if(typeof(v)=="string"){
      $("#"+i).text(parsePrice(v));
    }else{
      $("#"+i).text("");
    }
  });
}

function parsePrice($price){
  var str = $price;
  for(var i=1, j=0; i<=Math.floor($price.length/3); i++,j++){
    str = str.substr(0,str.length-3*i-j) + "," + str.substr(str.length-3*i-j, str.length);
  }
  if($price.length%3==0){
    str = str.substr(1,str.length);
  }

  return str;
}