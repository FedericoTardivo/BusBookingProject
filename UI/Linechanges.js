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
    $("#formAlert").hide();
    $("#formAlertSuccess").hide();
    var newinput = document.createElement("input");
    newinput.type = "text";
    newinput.id = "idBusStop";
    
    document.body.insertBefore("#number");

}

function ChangeLine() {
    $("#formAlert").hide();
    $("#formAlertSuccess").hide();

    let newName = $("#name").val();
    let idBusStop;
    let number;
    let time;
    let accessibility;
    if($("#idBusStop").val() != NULL){
        idBusStop = $('#idBusStop').val();
    }else{
        //idBusStop=?
    }
    if($("#number").val() != NULL){
        number = $('#number').val();
    }else{
        //number=?
    }
    if($("#time").val() != NULL){
        time = $('#time').val();
    }else{
        //idBusStop
    }
    if($("#accessibility").val() != NULL){
        accessibility = $('#accessibility').val();
    }else{
        //idBusStop
    }
    

    let times = {time,accessibility};
    let path = [
        {idBusStop,number,times}
    ]
    let line = {newName,path};


    $.ajax({
        url: "/api/v1/Lines?" + $.param({userId: "abc"}),
        type: "PUT",
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