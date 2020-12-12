const userID = sessionStorage.getItem("LoggedUserID"); //type is yet User 
var lines = [];
var stops = [];

/**
 * function called during the loading of the page bookingHistory
 */
function loadTable(){
    loadLines();
}

function loadTicketBooking() { 

    console.log("loadTicketBooking");
    $.ajax({
        url: `/api/v1/users/${userID}/tickets?` + $.param({userId: userID})
    })
        .done((result) => {

            console.log(result);

            var table = $("#dataTable tbody");

            $.each(result, (index, tick) => {
                var date = new Date(tick.issueDate);
                
                console.log(date);
                var lname = lines.find(l=>l.id == tick.lineId).name;
                var startname = stops.find(l=>l.id == tick.startBusStopId).name;
                var stopname = stops.find(l=>l.id == tick.endBusStopId).name;

                table.append(`<tr>
                <td>${date.toDateString()} alle ${date.toLocaleTimeString()}</td>
                <td>${lname}</td>
                <td>${tick.startTime}</td>
                <td>${tick.arrivalTime}</td>
                <td>${startname}</td>
                <td>${stopname}</td>
                
            </tr>`)
            });
            $('#dataTable').DataTable();
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