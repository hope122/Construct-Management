function dataChart(object){
    object = "#"+object;
    $(object).empty();
    var objWidth = $(object).width();
    var objHeight = $(object).height();
    if(objWidth == 0){
        objWidth = 300;
    }

    if(objHeight == 0){
        objHeight = 300;
    }

    var data = [['1月',2000,1500,180],['2月',1920,400,20],['3月',120,3000,300],['4月',1289,1050,70],['5月',700,1000,0],['5月',877,150,16]];

    //取得最大數
    var maxVal = getHighestVal(data);

    var roots = d3.select(object);
    var svg = roots.append("svg");
    svg.attr({
        width: objWidth,
        height: objHeight
    });
    // 相關設定
    var margin = {left: 10, right: 10, top: 10, bottom: 10};
    // 預留空間-寬(不要碰到邊框)
    var objMarginWidth = objWidth - margin.left - margin.right;
    // 預留空間-高(不要碰到邊框)
    var objMarginHeight = objHeight - margin.top - margin.bottom;
    // 計算整體寬度的等分
    var dataLength = data.length;
    var contentWidth = objMarginWidth/dataLength;
    // 計算整體寬度的等分-結束

    //預定線粗
    var lineWidth = 1.5;
    //預定點大小
    var pointWidth = lineWidth * 2 + 2;

    // 線
    var line = d3.svg.line()
    .x(function(d,i){
        // console.log(d,i);
        return getX((i+1),contentWidth,margin.left);
    })
    .y(function(d){
        // console.log(d,i);
        return getY(d,maxVal,objMarginHeight,margin.top);
    });

    for(var i = 0; i < (data[1].length-1); i++){
        var polyline = svg.append("path");
        var tmpArr = [];
        $.each(data,function(index,content){
            tmpArr.push(content[i+1]);
        });
        // console.log(tmpArr);
        polyline.attr({
            "d":line(tmpArr),
        }).style({
            fill: "none",
            stroke: "#ffaa00",
            "stroke-width": lineWidth,
            "stroke-opacity": 1
        });
    }
    // 線結束

    // 點
    var pointArr = [];
    $.each(data,function(i,content){
        var tmpArr = $.grep(content, function(d,i){
            if(i > 0){
                if(d == null){
                    d = 0;
                }
                return d.toString();
            }
        });

        pointArr = $.merge(pointArr, tmpArr);
    });
    var pointWidthMax = pointArr.length / (data[1].length-1);
    var pointNowWidth = 0;
    // console.log(pointWidthMax);
    // console.log(pointArr);
    var circle = svg.selectAll("circle").data(pointArr);
    var circleSet = circle.enter().append("circle");
    circle.exit().remove();
    circleSet.attr({
        cx: function(d,i) {
            var thisWidthVal = Math.ceil((i+1)/(data[1].length-1));
            return getX(thisWidthVal,contentWidth,margin.left);
        },
        cy: function(d,i) {
            
            return getY(d,maxVal,objMarginHeight, margin.top);
        },
        r: pointWidth
    }).style({
        fill: "#ffaa00",
        "fill-opacity": 1,
        // stroke: "#ffffff"
    });
    // 點結束


    // 
    // svg.exit().remove(); /* 刪除「沒有資料可配對的物件」*/

    // roots.text(function(d,i) {
    //     return i + " / " + d[0];
    // });
    // svg.style("height", "20px");
    // svg.style("background", "red");
    // svg.style("margin", "5px");
    // polyline.style("width", function(d,i) {
    //     return (d[1] * 10)+"px";
    // });
}

function setOffset(main, trans){
    return main - trans;
}

function getX(val,blockWidth,marginLeft){
    var itemWidth = marginLeft;
    if(val > 1){
        itemWidth = blockWidth*val;
    }
    return itemWidth;
}

function getY(val,maxVal,height,marginTop){

    var itemHeight = 0;
    if(val > 0){
        itemHeight = height - ((val/maxVal)*height - marginTop);
    }else{
        itemHeight = height + marginTop;
    }
    return itemHeight;
}

function getHighestVal(data, index){
    var pointIndex = true;
    if(typeof index == "undefined"){
        pointIndex = false;
    }
    var thisVal;
    var max = 0;
    $.each(data, function (i,v){
        if(pointIndex){
            thisVal = v[index];
        }else{
            var processArr = $.grep(v,function (el) { 
                // console.log(typeof el);
                if(typeof el == "number"){
                    return el;
                }
            });
            // console.log(processArr);
            thisVal = Math.max.apply(Math, processArr);
            // console.log(thisVal);

        }
        max = (max < thisVal) ? thisVal : max;
        // console.log(max);
    }); 
    // console.log(max);
    return max; 
} 