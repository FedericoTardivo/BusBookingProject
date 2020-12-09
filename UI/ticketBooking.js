var lines = [];
var path =[];
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
            $.each(result, (index, bs) => {
                table.append(`<tr><td onclick='refreshStopsTable("${bs._id}");'>${bs.name}</td></tr>`)
            });
        })
        .fail((jqXHR, textStatus, errorThrown) => {
            $("#tableErrMsg1").text(`Risposta del server [${jqXHR.status} - ${errorThrown}]: ${jqXHR.responseText}`);
            $("#tableAlert1").show();
        });
}

function refreshStopsTable(lineId) {
    $("tableAlert2").hide();
    var busStops=[];

    $.ajax({
        url: "/api/v1/busStops"
    }).done(res => {
        busStops=res;
        var table = $("#stopsTable tbody");
        table.empty();
        $.each(lines,(index,bs) => {
            if(bs._id == lineId) path=bs.path;
        });
        //console.log(path);
        $.each(path, (index,elem) => {
            let name=busStops.find(busStop => busStop.id==elem.busStopId).name;
            //console.log(elem);
            table.append(`<tr><td onclick='refreshTimesTable("${elem.busStopId}");'>${name}</td></tr>`);
            //console.log(elem.busStopId);
        });
    })
}

function refreshTimesTable(busStopId){
    var table = $("#timesTable tbody");
    table.empty();
    var thisPath = path.find(x => x.busStopId==busStopId);
    $.each(thisPath.times, (index,time)=>{
        table.append(`<tr><td>${time.time}</td></tr>`);
    });
}