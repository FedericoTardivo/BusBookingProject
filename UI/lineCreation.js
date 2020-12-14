let BusStops = [];

function refreshLinesTable() {
    // Load the Lines and show them in the table
    $.ajax({
        url: "/api/v1/lines"
    })
        .done((result) => {
            var table = $("#LinesTable tbody");
            table.empty();
            $.each(result, (index, line) => {
               table.append(`<tr><td>${line.id}</td><td>${line.name}</td></tr>`)
            });
        })
        .fail((jqXHR, textStatus, errorThrown) => {
            $("#tableErrMsg").text(`Risposta del server [${jqXHR.status} - ${errorThrown}]: ${jqXHR.responseText}`);
            $("#tableAlert").removeAttr('hidden');
        });
}

function retrieveBusStops(){
$.ajax({
    url: "/api/v1/busStops"
})
    .done((result) => {
        BusStops = result.map((b)=> {return {
            id: b.id, name: b.name
        }});

    })
    .fail((jqXHR, textStatus, errorThrown) => {
        $("#tableErrMsg").text(`Risposta del server [${jqXHR.status} - ${errorThrown}]: ${jqXHR.responseText}`);
        $("#tableAlert").show();
    })
}

function addBusStoptoLine(){
    
    var Stopdiv = document.createElement("div");
    Stopdiv.classList.add("busstop");
    Stopdiv.classList.add("row");
    Stopdiv.classList.add("form-group");
    var newselect= document.createElement("select");
    newselect.classList.add("form-control");
    newselect.classList.add("col-4");
    
    BusStops.forEach(option =>
        newselect.options.add(
          new Option(option.name, option.id, false)
        ));
    var newinput = document.createElement("input");
    newinput.type = "text";
    newinput.classList.add("form-control");
    newinput.classList.add("col-8");

    Stopdiv.appendChild(newselect);
    Stopdiv.appendChild(newinput);
    document.getElementById("StopsContainer").appendChild(Stopdiv);

}

function addLine() {
    $("#formAlert").hide();
    $("#formAlertSuccess").hide();

    var newName = $("#name").val();
    var capacity = $("#capacity").val();
    let path = [];
    $(".busstop").each((index, obj) => {
        var idBusStop = $(obj).children("select").val()
        var number = index + 1
        var time = $(obj).children("input").val().split(",")
        let times = time.map(t=>{
            return{time:t, accessibility: false}
        })
        path.push({busStopId: idBusStop,number:number,times: times})
    });
    
    

//    var accessibility = $('#accessibility').val();

    
    let line = {name:newName,capacity:capacity,path:path};
 

    $.ajax({
        url: "/api/v1/lines?" + $.param({userId: "5fd2481e7dea2df47325ef71"}),
        type: "POST",
        data: JSON.stringify(line),
        contentType: "application/json",
        dataType: "json"
    })
        .done((result) => {
            $("#formAlertSuccess").show();
            $("#StopsContainer").empty();
        })
        .fail((jqXHR, textStatus, errorThrown) => {
            $("#formErrMsg").text(`Risposta del server [${jqXHR.status} - ${errorThrown}]: ${jqXHR.responseText}`);
            $("#formAlert").show();
        })
        .always(() => refreshLinesTable());
        
}
