const userID = sessionStorage.getItem("LoggedUserID"); //type is yet User 
var lines = [];
/**
 * function called during the loading of the page bookingHistory
 */
function loadTicketBooking() { 


    $.ajax({
        url: `/api/v1/lines`
    })
        .done((result) => {

            

        })

        .fail((jqXHR) => {
            window.alert(jqXHR.responseJSON.message);
        });

        /**$.ajax({
            url: `/api/v1/users/${userID}/tickets?` + $.param({userId: userID})
        })
            .done((result) => {
    
                var table = $("#dataTable tbody");
                $.each(result, (index, tick) => {
                    table.append(`<tr>
                    <td>${tick.issueDate}</td>
                    <td>${tick.lineId}</td>
                    <td>${tick.startTime}</td>
                    <td>${tick.startBusStopId}</td>
                    <td>${tick.endBusStopId}</td>
                </tr>`)
                });
            })
    
            .fail((jqXHR) => {
                window.alert(jqXHR.responseJSON.message);
            });**/

    $.ajax({
        url: `/api/v1/users/${userID}/tickets?` + $.param({userId: userID})
    })
        .done((result) => {

            var table = $("#dataTable tbody");
            $.each(result, (index, tick) => {
                table.append(`<tr>
                <td>${tick.issueDate}</td>
                <td>${tick.lineId}</td>
                <td>${tick.startTime}</td>
                <td>${tick.startBusStopId}</td>
                <td>${tick.endBusStopId}</td>
            </tr>`)
            });
        })

        .fail((jqXHR) => {
            window.alert(jqXHR.responseJSON.message);
        });
}