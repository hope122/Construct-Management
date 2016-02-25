$(function() {
  // var datas = buildDomTree();
  var datas = treeData();
  // console.log(datas);
    var options = {
      bootstrap2: false, 
      showTags: false,
      levels: 3,
      data: datas,
      
      //showBorder: false,
      onNodeSelected: function(event, node) {
        // console.log(event, node);
        nodeDataContents(node.id,node);
        $("#nodeData").click();
      }
    };
    tabCtrl("nodesSetting");
    $('#treeview').treeview(options);
});

function treeData(){
  var data = [{"uid":"A1","name":"建築工程","parent":"0"},{"uid":"A2","name":"水電工程","parent":"0"},{"uid":"A6","name":"正是工程一","parent":"0"},{"uid":"A7","name":"幀幀政治","parent":"0"},{"uid":"B1","name":"結構工程","parent":"A1"},{"uid":"B2","name":"粉刷工程","parent":"A1"},{"uid":"B3","name":"電氣工程","parent":"A2"},{"uid":"B4","name":"測試工程地二層","parent":"A6"},{"uid":"C1","name":"鋼筋工程","parent":"B1"},{"uid":"C2","name":"模板工程","parent":"B1"},{"uid":"C3","name":"混凝土工程","parent":"B1"},{"uid":"C4","name":"泥作工程\r\n","parent":"B2"},{"uid":"C5","name":"PVC管 3/4吋 (22mm∮)\r\n","parent":"B3"},{"uid":"C6","name":"PVC管 1吋 (28mm∮)\r\n","parent":"B3"},{"uid":"C7","name":"PVC管 1 1/4吋 (35m∮)\r\n","parent":"B3"},{"uid":"C8","name":"PVC管 1 1/2吋 (41mm∮)\r\n","parent":"B3"},{"uid":"D1","name":"加工","parent":"C1"},{"uid":"D10","name":"粗底","parent":"C4"},{"uid":"D11","name":"粉光","parent":"C4"},{"uid":"D2","name":"綁紮","parent":"C1"},{"uid":"D3","name":"拆、傳料","parent":"C2"},{"uid":"D4","name":"立模","parent":"C2"},{"uid":"D5","name":"緊結","parent":"C2"},{"uid":"D6","name":"搗築","parent":"C3"},{"uid":"D7","name":"素面清理","parent":"C4"},{"uid":"D8","name":"吊料","parent":"C4"},{"uid":"D9","name":"吊線","parent":"C4"}];
  return processTreeData( data, true, "root", "工項建立" );
}

function nodeDataContents(nodeID,node){
  if(nodeID != "root"){
    $("#select-nodeContents").show();
    $("#tab-content").hide();
    $("#nodeData-content").show();
    nodeOrderContents(nodeID,node);
    $.get("pages/style/engineering/engineering_data_option_style.html",function(pageContent){
      var pages = $.parseHTML(pageContent);
      //取得樹狀結構的資料
      var nodeContent = $('#treeview').treeview('getSelected', nodeID);
      nodeContent = nodeContent[0];
      // console.log(nodeContent);
      $("#nodeData-content").empty();
      $(pages).find("#nodeID").html(nodeContent.id);
      //放入名稱
      $(pages).find("#node-name").html(nodeContent.text);
      $(pages).find("#name").val(nodeContent.text);
      $(pages).find(".edit-item").hide();
      $(pages).appendTo("#nodeData-content");
    });
  }else{
    $("#select-nodeContents").hide();
  }
}

function nodeOrderContents(nodeID,node){
  $.get("pages/style/engineering/engineering_node_option_style.html",function(pageContent){
    // console.log(pageContent);
    var pages = $.parseHTML(pageContent);
    $(pages).find("#node-order-sortable").sortable().disableSelection();
    //取得樹狀結構的資料
    
    var nodeContent;
    if(node.parentId > 0){//取得選擇的父節點
      nodeContent = $('#treeview').treeview('getParent', node);
    }else{//如果父節點是ROOT，取同層
      nodeContent = node;
    }
    //取得選擇的父節點同層的節點
    var nodeSiblingsContent = $('#treeview').treeview('getSiblings', nodeContent);
    var nodeArr = [];
    nodeArr.push(nodeContent);
    if(nodeSiblingsContent.length > 0 ){
      $.each(nodeSiblingsContent, function(i,nodeContent){
       nodeArr.push(nodeContent);
      });
      //創建節點順序
      creatNodeOrder(pages,nodeArr);
    }
    
    //創建節點相關修改東西
    if(typeof node.nodes != "undefined"){
      creatChildNode(pages,node);
    }else{
      //沒有的話，顯示增加按鈕
      var addBtn = $.parseHTML('<i class="fa fa-plus fa-lg mouse-pointer"></i>');
      $(pages).find("#inNode-sortable").before(addBtn);
    }

    $("#nodeOption-content").empty();
    $(pages).appendTo("#nodeOption-content");
    tabCtrl("node-options");
  });
}

function creatNodeOrder(pages,nodeArr){
  // console.log(nodeArr);
  // #("#node-order-sortable").empty();
  //先產生父層
  $.each(nodeArr,function(i,node){
    // console.log(node);
    var liItem = $.parseHTML('<li class="list-group-item nodeParent">');
    //先放入節點資訊
    $(liItem).prop("id",node.id).html(node.text);
    //產生子節點可拖移放入的區域
    var chItem = $.parseHTML('<ul class="childSort content-padding5">');
    //若有子節點，產生
    if(typeof node.nodes != "undefined"){
      $.each(node.nodes, function(chI,chNode){
        var chLiItem = $.parseHTML('<li class="list-group-item">');
        $(chLiItem).prop("id",chNode.id).html(chNode.text);
        $(chLiItem).appendTo(chItem);
      });
    }
    //放入子節點
    $(chItem).appendTo(liItem);
    //設定子節點拖移條件
    $(liItem).find(".childSort").sortable({
      connectWith: ".childSort",
      placeholder: "ui-state-highlight"
    }).disableSelection();
    var pagesNodeOrderSortable = $(pages).find("#node-order-sortable");
    //將項目放入
    $(liItem).appendTo(pagesNodeOrderSortable);
  });
}

function creatChildNode(pages,nodeArr){
  // console.log(nodeArr);
  // #("#node-order-sortable").empty();
  //先產生父層
  var liItem = $.parseHTML('<li class="list-group-item nodeParent">');
  //子項目父層樣式
  var childNodeParentStyle;
  $.get("pages/style/engineering/engineering_childNode_option.html",function(rs){
    childNodeParentStyle = rs;
  }).done(function(){
    //創建父層資訊區
    var parentInfo = $.parseHTML(childNodeParentStyle);
    $(parentInfo).find(".parentName").html(nodeArr.text);
    //放入節點資訊
    $(parentInfo).appendTo(liItem);
    //放入節點資訊
    $(liItem).prop("id",nodeArr.id);
    //產生子節點可拖移放入的區域
    var chItem = $.parseHTML('<ul class="childSort content-padding5">');
    //若有子節點，產生
    if(typeof nodeArr.nodes != "undefined"){
      $.get("pages/style/engineering/engineering_childNode_child_option.html",function(childStyle){
        $.each(nodeArr.nodes, function(chI,chNode){
          var chLiItem = $.parseHTML('<li class="list-group-item">');
          //子節點樣式
          var childInfo = $.parseHTML(childStyle);

          $(childInfo).find(".childName").html(chNode.text);
          //放入子節點資訊
          $(childInfo).appendTo(chLiItem);
          //設定子節點ＩＤ
          $(chLiItem).prop("id",chNode.id);
          $(chLiItem).appendTo(chItem);
        });
      });
    }
    //放入子節點
    $(chItem).appendTo(liItem);
    //設定子節點拖移條件
    $(liItem).find(".childSort").sortable({
      connectWith: ".childSort",
      placeholder: "ui-state-highlight"
    }).disableSelection();
    var pagesNodeOrderSortable = $(pages).find("#inNode-sortable");
    //將項目放入
    $(liItem).appendTo(pagesNodeOrderSortable);
  });
}