<script type="text/javascript" charset="utf-8" src="include/js/jquery/jquery-1.11.3.min.js"></script>
<script>

function getWorkList(){
    //取得列表
    $.ajax({
       url: 'http://211.21.170.18:99/pageaction/getworkproject',
       type: "POST",
       data: {uuid:'123'},
       dataType: "JSON",
       success: function(rs){
           console.log(rs);
           /*if(rs.status){
            $.each(rs.workList,function(i,v){
            $("<p>"+v.desc+"</p>").appendTo("#worklist");
            });
           }else{
           navigator.notification.alert('Can Not Get List',null,"Error");
           getWorkList(loginArr);
           }*/
       }
   });
}
getWorkList();
</script>