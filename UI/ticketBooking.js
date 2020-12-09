var lines = [];

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
                table.append(`<tr><td  style ="border-style:solid;" onclick='refreshStopsTable("${bs._id}");'>${bs.name}</td></tr>`)
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
        var path =[];
        var table = $("#stopsTable tbody");
        table.empty();
        $.each(lines,(index,bs) => {
            if(bs._id == lineId) path=bs.path;
        });
        $.each(path, (index,elem) => {
            let name=busStops.find({"_id" : elem.busStopsId}).name;
            table.append(`<tr><td>${name}</td></tr>`);
        });
    })
}
