const userID = sessionStorage.getItem("LoggedUserID"); //type is yet User 
var lines = [];
var stops = [];
var now = new Date (Date.now());
/**
 * function called during the loading of the page bookingHistory
 */
function loadTable(){
    loadLines();
}

function loadTicketBooking() { 

    $.ajax({
        url: `/api/v1/users/${userID}/tickets?` + $.param({userId: userID})
    })
        .done((result) => {

            var table = $("#dataTable tbody");

            table.empty();

            $.each(result, (index, tick) => {
                
                var date = new Date(tick.issueDate);
                var startDate = new Date(tick.startTime);
                var arrivalDate = new Date (tick.arrivalTime)
                
                var lname = lines.find(l=>l.id == tick.lineId).name;
                var startname = stops.find(l=>l.id == tick.startBusStopId).name;
                var stopname = stops.find(l=>l.id == tick.endBusStopId).name;

                //console.log(tick.startTime);

                table.append(`<tr>
                <td>${date.toDateString()} alle ${date.toLocaleTimeString()}</td>
                <td>${lname}</td>
                <td> <b>Data:</b> ${startDate.toDateString()} </br> <b>Ora:</b> ${startDate.toLocaleTimeString()}</td>
                <td>${arrivalDate.toLocaleTimeString()}</td>
                <td>${startname}</td>
                <td>${stopname}</td>
                <td>${verificaBottone(new Date(tick.startTime), tick._id)}</td>
                
            </tr>`)
            });
            $('#dataTable').DataTable();
        })

        .fail((jqXHR) => {
            window.alert(jqXHR.responseJSON.message);
        });
}

function verificaBottone(TickStart, TickID){
    
    //if ticket is for future, button is able to delete
    if (TickStart.getTime() > now.getTime()){
        return `<button class="btn btn-primary" type="button"  onclick="eliminaPrenotazione('${TickID}')"> Elimina </button>`
    } else {
        return `<button class="btn btn-primary" type="button" disabled> Elimina </button>`

    }

}

function eliminaPrenotazione(IDBiglietto){
    $.ajax({
        url: `/api/v1/tickets/${IDBiglietto}?` + $.param({userId: userID}),
        type: "DELETE"
        })

        .done((result) => {
            loadTabel();
        })

        .fail((jqXHR) => {
            window.alert(jqXHR.responseJSON.message);
        });
}

function loadLines(){
    $.ajax({
        url: `/api/v1/lines`
    })
        .done((result) => {

            lines = result.map(l => {return {id: l._id, name: l.name}})
            loadBusStops();

        })

        .fail((jqXHR) => {
            window.alert(jqXHR.responseJSON.message);
        });
}

function loadBusStops(){
    $.ajax({
        url: `/api/v1/busStops`
    })
        .done((result) => {

            stops = result.map(l => {return {id: l.id, name: l.name}})
            loadTicketBooking();

        })

        .fail((jqXHR) => {
            window.alert(jqXHR.responseJSON.message);
        });
}