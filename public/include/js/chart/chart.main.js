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

    var death_rate = [['越南',2000],['阿魯巴',1920],['關島',120],['澳門',1289],['123',0]];
    var roots = d3.select(object);
    var svg = roots.append("svg");
    svg.attr({
        width: objWidth,
        height: objHeight
    });
    var margin = {left: 10, right: 10, top: 10, bottom: 10};
    var objMarginWidth = objWidth - margin.left - margin.right;
    var objMarginHeight = objHeight - margin.top - margin.bottom;

    var dataLength = death_rate.length;

    var contentWidth = objMarginWidth/dataLength;
    // var contentHeight = objHeight/dataLength;
    var x = d3.scale.linear().range([0, objWidth/100]);
    var y = d3.scale.linear().range([0, objMarginHeight/100]);

    var line = d3.svg.line()
    .x(function(d,i){
        if(i == 0){
            return margin.left;
        }else{
            return contentWidth*(i+1);
        }
        return setOffset(objMarginWidth, contentWidth*(i+1));
    })
    .y(function(d){
        var thisY;
        if(d[1] != 0 && d[1] != null){
            thisY = d[1]/objMarginHeight;
        }else{
            thisY = 0;
        }
        return setOffset(objMarginHeight,thisY);
    });

    var polyline = svg.append("path");
    polyline.attr({
        "d":line(death_rate),
    }).style({
        fill: "none",
        stroke: "#ffaa00",
        "stroke-width": 1.5,
        "stroke-opacity": 1
    });


    var circle = svg.selectAll("circle").data(death_rate);
    var circleSet = circle.enter().append("circle");
    circle.exit().remove();
    chartX = 0;

    circleSet.attr({
        cx: function(d,i) {
            if(i == 0){
                return margin.left;
            }else{
                return contentWidth*(i+1);
            }
            // return setOffset(objMarginWidth,contentWidth*(i+1));

        },
        cy: function(d,i) {
            var thisY;
            if(d[1] != 0 && d[1] != null){
                thisY = d[1]/objMarginHeight;
            }else{
                thisY = 0;
            }
            console.log(objMarginHeight,thisY,setOffset(objMarginHeight,thisY));
            return setOffset(objMarginHeight,thisY);
        },
        r: 3.5
    }).style({
        fill: "#ffaa00",
        "fill-opacity": 0.2,
        stroke: "#ffffff"
    });
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
    console.log(roots);
}

function setOffset(main, trans){
    return main - trans;
}