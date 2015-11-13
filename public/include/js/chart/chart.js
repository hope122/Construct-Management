
var chartData = null;
//載入折線圖,長條圖
google.load('visualization', '1.1', {packages: ['corechart','bar']});

function getChartData(url,urlMethod,sendData,chartType,drawItemID,setUnitArr){
    $.ajax({
        url: url,
        type: urlMethod,
        data: sendData,
        dataType: "JSON",
        async: false,
        success: function(rs){
            chartData = resetData(rs,setUnitArr);
            setDraw(setUnitArr,chartData,drawItemID);
        }
    });
    //return chartData;
}

function resetData(chartData,setUnitArr){
    var titleArr = [];
    //底部項目名稱
    titleArr[0] = setUnitArr.bottomTitle;
    
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
    //開始組合
    var relData = [];
    relData[0] = titleArr;
    for(var worksid in tmpContentArr){
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

function setDraw(setUnitArr,dataArr,drawItemID){
    
    /*var dataArr = [
        ["month","kWT","kWT2"],
        ["1",68085,40000],
        ["2",42813,30000],
        ["3",92895,100000],
        ["4",111566,80000],
        ["5",144461,300000],
        ["6",189448,200000],
        ["7",79089,80000],
        ["8",155500,null]
    ];*/
    google.setOnLoadCallback(function(){
        drawChart(setUnitArr,dataArr,drawItemID);
    });
}

function putData(worksidIndexArr,worksid){
    for(var key in worksidIndexArr){
        if(worksidIndexArr[key] == worksid){
            return key;
        }
    }
    return false;
}

function drawChart(setUnitArr,dataArr,drawItemID) {
    var data = google.visualization.arrayToDataTable(dataArr);
    var options = {
        //curveType: 'function',
        legend: { position: 'bottom' },
        width: "100%",
        height: 300,
        pointSize: 7,
        pointsVisible: true,
        hAxis: {
          title: setUnitArr.bottomTitle
        },
        vAxis: {
          title: setUnitArr.unitTitle
        },
    };
    var chart;
    switch(setUnitArr.drawType){
        case "LineChart":
            chart = new google.visualization.LineChart(document.getElementById(drawItemID));
        break;
        case "ColumnChart":
            chart = new google.visualization.ColumnChart(document.getElementById(drawItemID));
        break;
        default:
            chart = new google.visualization.ColumnChart(document.getElementById(drawItemID));
        break;
    }
    chart.draw(data, options);
}