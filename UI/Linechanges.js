let Lines = [];

function refreshLinesTable() {
    // Load the Lines and show them in the table
    $.ajax({
        url: "/api/v1/lines?" + $.param({userId: "5fd2481e7dea2df47325ef71"})
    })
        .done((result) => {
            var table = $("#LinesTable tbody");
            table.empty();
            $.each(result, (index, line) => {
                table.append(`<tr><td>${line._id}</td><td>${line.name}</td></tr>`)
            });
        })
        .fail((jqXHR, textStatus, errorThrown) => {
            $("#tableErrMsg").text(`Risposta del server [${jqXHR.status} - ${errorThrown}]: ${jqXHR.responseText}`);
            $("#tableAlert").removeAttr('hidden');
        });
}
function retrieveBusStops(){
    $.ajax({
        url: "/api/v1/lines"
    })
        .done((result) => {
            BusStops = result.map((b)=> {return {
                id : b.path.idBusStop, name: b.name
            }});
    
        })
        .fail((jqXHR, textStatus, errorThrown) => {
            $("#tableErrMsg").text(`Risposta del server [${jqXHR.status} - ${errorThrown}]: ${jqXHR.responseText}`);
            $("#tableAlert").show();
        })
    }
//this selects the line to be modified
    function selectLine(){
     
    var Linediv = document.createElement("div");
    Linediv.classList.add("line");
    var newselect= document.createElement("select");
    newselect.id = "LineList"
    
    Lines.forEach(option =>
        newselect.options.add(
          new Option(option.name, option.id, false)
        ));
    var newinput = document.createElement("input");
    newinput.type = "text";
 //   newinput.class = "form-control";
 //   newinput.id = "idBusStop";
    Linediv.appendChild(newselect);
    Linediv.appendChild(newinput);
    document.getElementById("LinesContainer").appendChild(Linediv);
    addBusStoptoLine();

}
//this adds new stops to selected line
function addBusStoptoLine(){
    
    var Stopdiv = document.createElement("div");
    Stopdiv.classList.add("busstop");
    var newselect= document.createElement("select");
    newselect.id = "StopList"
    
    BusStops.forEach(option =>
        newselect.options.add(
          new Option(option.name, option.id, false)
        ));
    var newinput = document.createElement("input");
    newinput.type = "text";
 //   newinput.class = "form-control";
 //   newinput.id = "idBusStop";
    Stopdiv.appendChild(newselect);
    Stopdiv.appendChild(newinput);
    document.getElementById("StopsContainer").appendChild(Stopdiv);

}

function ApplyChangesToLine() {
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
        type: "PUT",
        data: JSON.stringify(line),
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

