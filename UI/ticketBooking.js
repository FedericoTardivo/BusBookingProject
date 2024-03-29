var lines = [];
var path =[];
var busStops=[];
var ticket ={};
var tmpStartTime;
const userId = sessionStorage.getItem("LoggedUserID");

function refreshLinesTable() {
    if(!userId){
        confirm("Esegui il login!");
        location.replace("login.html");
    }
    
    $("#tableAlert1").hide();

    $("#startStopTable tbody").empty();
    $("#endStopTable tbody").empty();
    $("#startTimeTable tbody").empty();
    //$("#arrivalTimeTable tbody").empty();

    // Load the lines and show them in the table
    $.ajax({
        url: "/api/v1/lines"
    })
        .done((result) => {
            lines=result;
            var table = $("#linesTable tbody");
            table.empty();
            $.each(result, (index, line) => {
                table.append(`<tr id=${line.id}><td onclick='refreshStopsTable("${line.id}","${line.name}");'>${line.name}</td></tr>`)
            });
        })
        .fail((jqXHR, textStatus, errorThrown) => {
            $("#tableErrMsg1").text(`Risposta del server [${jqXHR.status} - ${errorThrown}]: ${jqXHR.responseText}`);
            $("#tableAlert1").show();
            window.scrollTo(0,0);
        });
}

function refreshStopsTable(lineId,lineName) {
    if(document.getElementById("datepicker").value==""){
        alert("Prima seleziona una data dal calendario");
        return;
    }

    document.getElementById("datepicker").disabled=true;

    $("#linesTable tbody").children().each(function () {
        this.style.backgroundColor = "white";
    });

    $("#startTimeTable tbody").children().each(function () {
        this.style.backgroundColor = "white";
    });

    /*$("#arrivalTimeTable tbody").children().each(function () {
        this.style.backgroundColor = "white";
    });*/

    document.getElementById(lineId).style.backgroundColor = "#00ccff";
    
    ticket={};
    ticket.lineId=lineId;
    ticket.lineName=lineName;
    $.ajax({
        url: "/api/v1/busStops"
    }).done(res => {
        busStops=res;
        refreshStartStopTable(lineId);
        refreshEndStopTable(lineId);
    }).fail((jqXHR, textStatus, errorThrown) => {
        $("#tableErrMsg1").text(`Risposta del server [${jqXHR.status} - ${errorThrown}]: ${jqXHR.responseText}`);
        $("#tableAlert1").show();
        window.scrollTo(0,0);
    });
}

function refreshStartStopTable(lineId){
    var table = $("#startStopTable tbody");
        table.empty();
        path=(lines.find(x => x.id==lineId)).path;
        //console.log(path);
        $.each(path, (index,elem) => {
            let name=busStops.find(busStop => busStop.id==elem.busStopId).name;
            table.append(`<tr id="start${elem.busStopId}"><td onclick='refreshStartTimeTable("${elem.busStopId}","${name}");'>${name}</td></tr>`);
        });
}

function refreshEndStopTable(lineId){
    var table = $("#endStopTable tbody");
        table.empty();
        path=(lines.find(x => x.id==lineId)).path;
        $.each(path, (index,elem) => {
            let name=busStops.find(busStop => busStop.id==elem.busStopId).name;
            table.append(`<tr id="stop${elem.busStopId}"><td onclick='setArrival("${elem.busStopId}","${name}");'>${name}</td></tr>`);
        });
}

function refreshStartTimeTable(startBusStopId,startBusStopName){
    $("#startStopTable tbody").children().each(function () {
        this.style.backgroundColor = "white";
    });
    document.getElementById("start" + startBusStopId).style.backgroundColor = "#00ccff";
    ticket.startTime='';
    var table = $("#startTimeTable tbody");
    ticket.startBusStopId=startBusStopId;
    ticket.startBusStopName=startBusStopName;
    table.empty();
    var thisPath = path.find(x => x.busStopId==startBusStopId);
    $.each(thisPath.times, (index,time)=>{
        table.append(`<tr id="start${time.time}"><td onclick='setTicketTimes("start","${time.time}")';>${time.time}</td></tr>`);
    }); 
}

function setArrival(endBusStopId,endBusStopName){
    if(ticket.startTime==""){
        alert("Prima seleziona l'orario di partenza");
        return;
    }
    $("#endStopTable tbody").children().each(function () {
        this.style.backgroundColor = "white";
    });
    document.getElementById("stop" + endBusStopId).style.backgroundColor = "#00ccff";
    ticket.arrivalTime='';
    ticket.endBusStopId=endBusStopId;
    ticket.endBusStopName=endBusStopName;
    var stop = path.find(x => x.busStopId==ticket.startBusStopId);
    //console.log(stop.times);
    //console.log(ticket.startTime);
    index = stop.times.findIndex((element) => element.time == tmpStartTime);
    //console.log(index);
    stop = path.find(x => x.busStopId==endBusStopId);
    var time = stop.times[index].time;
    setTicketTimes("arrival",time)
    //var table = $("#arrivalTimeTable tbody");
    //table.empty();
    //$.each(thisPath.times, (index,time)=>{
    //    table.append(`<tr id="arrival${time.time}"><td onclick='setTicketTimes("arrival","${time.time}")';>${time.time}</td></tr>`);
    //});
}

function setTicketTimes(which,time){
    //console.log(which);
    let date=new Date();
    //date.se
    if(which=="start"){
        $("#startTimeTable tbody").children().each(function () {
            this.style.backgroundColor = "white";
        });
        document.getElementById(which + time).style.backgroundColor = "#00ccff";
        tmpStartTime=time;
        //console.log("start" + time);
        ticket.startTime=document.getElementById("datepicker").value + "T" + time +":00.000+01:00";
    }else if(which=="arrival"){
        /*$("#arrivalTimeTable tbody").children().each(function () {
            this.style.backgroundColor = "white";
        });*/
        //document.getElementById(which + time).style.backgroundColor = "#00ccff";
        //console.log("arrival" + time);
        ticket.arrivalTime=document.getElementById("datepicker").value + "T" + time +":00.000+01:00";
    }
}

function buyTicket(){
    document.getElementById("buyButton").disabled = true
    var start=new Date(ticket.startTime);
    var arrival=new Date(ticket.arrivalTime);
    var text = "Confermi di voler acquistare questo biglietto?\n" + `Linea: ${ticket.lineName}\n` + `Partenza: ${ticket.startBusStopName} , \nil ${start.getDate()}-${start.getMonth()+1}-${start.getFullYear()} alle ${start.getHours()}:${start.getMinutes()}\n` + `Arrivo: ${ticket.endBusStopName} , \nil ${arrival.getDate()}-${arrival.getMonth()+1}-${arrival.getFullYear()} alle ${arrival.getHours()}:${arrival.getMinutes()}`;
    var r = confirm(text);
    if (r == true) {
        var ticketToBeBuyed = {
            lineId : ticket.lineId,
            startBusStopId : ticket.startBusStopId,
            endBusStopId : ticket.endBusStopId,
            startTime : start,
            arrivalTime : arrival
        }

        $.ajax({
            url: "/api/v1/tickets?" + $.param({userId}),
            type : "POST",
            data: JSON.stringify(ticketToBeBuyed),
            contentType: "application/json",
            dataType: "json"
        })
            .done((result) => {
                alert("Biglietto acquistato");
                window.scrollTo(0,0);
                location.reload();
            })
            .fail((jqXHR, textStatus, errorThrown) => {
                $("#tableErrMsg1").text(`Risposta del server [${jqXHR.status} - ${errorThrown}]: ${jqXHR.responseText}`);
                $("#tableAlert1").show();
                window.scrollTo(0,0);
            });
        //console.log("biglietto acquistato");
    } else {
        //console.log("acquisto annullato");
        alert("Acquisto annullato");
        window.scrollTo(0,0);
        location.reload();
    }
}
