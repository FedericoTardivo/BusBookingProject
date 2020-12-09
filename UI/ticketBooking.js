function refreshLinesTable() {
    $("#tableAlert1").hide();

    // Load the lines and show them in the table
    $.ajax({
        url: "/api/v1/lines"
    })
        .done((result) => {
            var table = $("#linesTable tbody");
            table.empty();
            $.each(result, (index, bs) => {
                table.append(`<tr><td  onclick='refreshStopsTable("${bs._id}");'>${bs.name}</td></tr>`)
            });
        })
        .fail((jqXHR, textStatus, errorThrown) => {
            $("#tableErrMsg1").text(`Risposta del server [${jqXHR.status} - ${errorThrown}]: ${jqXHR.responseText}`);
            $("#tableAlert1").show();
        });
}

function refreshStopsTable(lineId) {
    $("tableAlert2").hide();
    $.ajax({
        
    })
}
