
var chartData = null;
//載入折線圖,長條圖
google.load('visualization', '1.1', {packages: ['corechart','bar']});

function createChart(options){
    $.ajax({
        url: options.url,
        type: options.urlMethod,
        data: options.sendData,
        dataType: "JSON",
        async: false,
        success: function(rs){
            if(rs.length > 0){
                chartData = resetData(rs,options);
                setDraw(options,chartData);
            }else{
                $("#"+options.drawItemID).html("Chart Data is Empty!");
            }
        }
    });
    //return chartData;
}

function resetData(chartData,options){
    var titleArr = [];
    //底部項目名稱
    titleArr[0] = options.bottomTitle;
    
    var contentArr = [];
    //對應的ＩＮＤＥＸ暫存陣列
    var worksidIndexArr = [];
    //內容數據
    var tmpContentTitleArr = [], tmpContentArr = [];
    $.each(chartData,function(i,v){
        //console.log(i,v);
        if(!checkInArray(v.supply_name,titleArr)){
            worksidIndexArr[v.suid] = titleArr.length;
            titleArr[titleArr.length] = v.supply_name;
        }
        if(!checkInArray(v.work_type,tmpContentTitleArr)){
            tmpContentArr[v.worksid] = [];
            tmpContentArr[v.worksid][0] = v.work_type
            tmpContentTitleArr[tmpContentTitleArr.length] = v.work_type;
        }
        tmpContentArr[v.worksid][putData(worksidIndexArr,v.suid)] = parseInt(v.w_count);
    });
    //console.log(chartData,titleArr,tmpContentArr);
    //開始組合
    var relData = [], totalItem = 0;
    relData[0] = titleArr;
    totalItem = titleArr.length;
    for(var worksid in tmpContentArr){
        if(tmpContentArr[worksid].length != totalItem){
            //將不對稱的部份補上0
            for(i=1;i <= totalItem-1;i++){
                if(typeof tmpContentArr[worksid][i] == "undefined"){
                    tmpContentArr[worksid][i] = 0;
                }
            }
        }
        relData[relData.length] = tmpContentArr[worksid];
    }
    return relData;
}

function checkInArray(data,Arr){
    for(var key in Arr){
        if(Arr[key] == data){
            return true;
        }
    }
    return false;
}

function setDraw(options,dataArr){
    google.setOnLoadCallback(function(){
        drawChart(options,dataArr);
    });
}

function putData(worksidIndexArr,suid){
    for(var key in worksidIndexArr){
        if(key == parseInt(suid)){
            return parseInt(worksidIndexArr[key]);
        }
    }
    return false;
}

function drawChart(options,dataArr) {
    var chart, 
    data = google.visualization.arrayToDataTable(dataArr),
    chartOptions = {
        //curveType: 'function',
        legend: { position: 'bottom' },
        width: "100%",
        height: 300,
        pointSize: 7,
        pointsVisible: true,
        hAxis: {
          title: options.bottomTitle
        },
        vAxis: {
          title: options.unitTitle
        },
    },
    drawItemID = document.getElementById(options.drawItemID);

    switch(options.drawType){
        case "LineChart":
            chart = new google.visualization.LineChart(drawItemID);
        break;
        case "ColumnChart":
            chart = new google.visualization.ColumnChart(drawItemID);
            chartOptions.isStacked = true;
        break;
        default:
            chart = new google.visualization.ColumnChart(drawItemID);
        break;
    }
    chart.draw(data, chartOptions);
}