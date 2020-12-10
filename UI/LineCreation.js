function refreshLinesTable() {
    // Load the Lines and show them in the table
    $.ajax({
        url: "/api/v1/lines?" + $.param({userId: "abc"})
    })
        .done((result) => {
            var table = $("#LinesTable tbody");
            table.empty();
            $.each(result, (index, bs) => {
                table.append(`<tr><td>${line._id}</td><td>${line.name}</td></tr>`)
            });
        })
        .fail((jqXHR, textStatus, errorThrown) => {
            $("#tableErrMsg").text(`Risposta del server [${jqXHR.status} - ${errorThrown}]: ${jqXHR.responseText}`);
            $("#tableAlert").removeAttr('hidden');
        });
}

function addBusStoptoLine(){
  
    var newinput = document.createElement("input");
    newinput.type = "text";
    newinput.id = "idBusStop_2";
    document.body.insertBefore("idBusStop_2","number");

}

function addLine() {
    $("#formAlert").hide();
    $("#formAlertSuccess").hide();

    var newName = $("#name").val();
    var idBusStop = $('#idBusStop').val();
    var number = $('#number').val();
    var time = $('#time').val();
    var accessibility = $('#accessibility').val();

    let times = {time,accessibility};
    let path = [
        {idBusStop,number,times}
    ]
    let line = {newName,path};


    $.ajax({
        url: "/api/v1/Lines?" + $.param({userId: "abc"}),
        type: "POST",
        data: JSON.stringify({name: line,}),
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
        .always(() => refreshLinesTable());
}