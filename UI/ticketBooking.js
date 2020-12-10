var lines = [];
var path =[];
var busStops=[];

var ticket ={
    lineId : '',
    lineName : '',
    startBusStopId : '',
    endBusStopId : '',
    startBusStopName : '',
    endBusStopName : '',
    startTime : '',
    arrivalTime : ''
}

function refreshLinesTable() {
    $("#tableAlert1").hide();

    // Load the lines and show them in the table
    $.ajax({
        url: "/api/v1/lines"
    })
        .done((result) => {
            lines=result;
            var table = $("#linesTable tbody");
            table.empty();
            $.each(result, (index, line) => {
                table.append(`<tr><td onclick='refreshStopsTable("${line._id}","${line.name}");'>${line.name}</td></tr>`)
            });
        })
        .fail((jqXHR, textStatus, errorThrown) => {
            $("#tableErrMsg1").text(`Risposta del server [${jqXHR.status} - ${errorThrown}]: ${jqXHR.responseText}`);
            $("#tableAlert1").show();
        });
}

function refreshStopsTable(lineId,lineName) {
    ticket.lineId=lineId;
    ticket.lineName=lineName;
    $.ajax({
        url: "/api/v1/busStops"
    }).done(res => {
        busStops=res;
        refreshStartStopTable(lineId);
        refreshEndStopTable(lineId);
    })
}

function refreshStartStopTable(lineId){
    var table = $("#startStopTable tbody");
        table.empty();
        path=(lines.find(x => x._id==lineId)).path;
        $.each(path, (index,elem) => {
            let name=busStops.find(busStop => busStop.id==elem.busStopId).name;
            table.append(`<tr><td onclick='refreshStartTimeTable("${elem.busStopId}","${name}");'>${name}</td></tr>`);
        });
}

function refreshEndStopTable(lineId){
    var table = $("#endStopTable tbody");
        table.empty();
        path=(lines.find(x => x._id==lineId)).path;
        $.each(path, (index,elem) => {
            let name=busStops.find(busStop => busStop.id==elem.busStopId).name;
            table.append(`<tr><td onclick='refreshArrivalTimeTable("${elem.busStopId}","${name}");'>${name}</td></tr>`);
        });
}

function refreshStartTimeTable(startBusStopId,startBusStopName){
    var table = $("#startTimeTable tbody");
    ticket.startBusStopId=startBusStopId;
    ticket.startBusStopName=startBusStopName;
    table.empty();
    var thisPath = path.find(x => x.busStopId==startBusStopId);
    $.each(thisPath.times, (index,time)=>{
        table.append(`<tr><td onclick='setTicketTimes("start","${time.time}")';>${time.time}</td></tr>`);
    });
}

function refreshArrivalTimeTable(endBusStopId,endBusStopName){
    var table = $("#arrivalTimeTable tbody");
    ticket.endBusStopId=endBusStopId;
    ticket.endBusStopName=endBusStopName;
    table.empty();
    var thisPath = path.find(x => x.busStopId==endBusStopId);
    $.each(thisPath.times, (index,time)=>{
        table.append(`<tr><td onclick='setTicketTimes("arrival","${time.time}")';>${time.time}</td></tr>`);
    });
}

function setTicketTimes(which,time){
    //console.log(which);
    if(which=="start"){
        ticket.startTime=time;
    }else if(which=="arrival"){
        ticket.arrivalTime=time;
    }
}
