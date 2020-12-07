const userId = sessionStorage.getItem("LoggedUserID");

function refreshBusStopsTable() {
    $("#tableAlert").hide();

    // Load the busStops and show them in the table
    $.ajax({
        url: "/api/v1/busStops?" + $.param({userId})
    })
        .done((result) => {
            var table = $("#busStopsTable tbody");
            table.empty();
            $.each(result, (index, bs) => {
                table.append(`<tr><td>${bs._id}</td><td>${bs.name}</td></tr>`)
            });
        })
        .fail((jqXHR, textStatus, errorThrown) => {
            $("#tableErrMsg").text(`Risposta del server [${jqXHR.status} - ${errorThrown}]: ${jqXHR.responseText}`);
            $("#tableAlert").show();
        });
}

function addBusStop() {
    $("#formAlert").hide();
    $("#formAlertSuccess").hide();

    var newName = $("#busStopName").val();
    $.ajax({
        url: "/api/v1/busStops?" + $.param({userId}),
        type: "POST",
        data: JSON.stringify({name: newName}),
        contentType: "application/json",
        dataType: "json"
    })
        .done((result) => {
            $("#formAlertSuccess").show();
        })
        .fail((jqXHR, textStatus, errorThrown) => {
            $("#formErrMsg").text(`Risposta del server [${jqXHR.status} - ${errorThrown}]: ${jqXHR.responseText}`);
            $("#formAlert").show();
        })
        .always(() => refreshBusStopsTable());
}