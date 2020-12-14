const userId = sessionStorage.getItem("LoggedUserID");

// When the document is ready
$(document).ready(() => {
    refreshBusStopsTable();

    // Dynamically change modal content when edit button clicked
    $('#editModal').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget);    // Button that triggered the modal
        var id = button.data('id');             // Extract the id from data-* attributes
        var oldName = button.data('name');      // Extract the name from data-* attributes
        var modal = $(this);
        modal.find('#editIdLabel').text('ID: ' + id);
        modal.find('#oldBusStopName').val(oldName);
        modal.find('#newBusStopName').val("");
        var editModalButton = modal.find('#editModalButton');
        editModalButton.unbind("click");
        editModalButton.click(() => {
            updateBusStop(id);
        });
    })
});

function refreshBusStopsTable() {
    $("#tableAlert").hide();

    // Load the busStops and show them in the table
    $.ajax({
        url: "/api/v1/busStops?" + $.param({adminId: userId, userId})
    })
        .done((result) => {
            var table = $("#busStopsTable tbody");
            table.empty();
            $.each(result, (index, bs) => {
                table.append(`<tr>
                                <td>${bs.id}</td>
                                <td id="${bs.id}_name">${bs.name}</td>
                                <td>
                                    <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#editModal" data-id="${bs.id}" data-name="${bs.name}"><i class="fas fa-pen"></i></button>
                                    <button type="button" class="btn btn-danger" onclick="deleteBusStop('${bs.id}')"><i class="fas fa-trash-alt"></i></button>
                                </td>
                            </tr>`);
            });
        })
        .fail((jqXHR, textStatus, errorThrown) => {
            $("#tableErrMsg").text(`Risposta del server [${jqXHR.status} - ${errorThrown}]: ${jqXHR.responseText}`);
            $("#tableAlert").show();
        })
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
            $("#busStopName").val("");
        })
        .fail((jqXHR, textStatus, errorThrown) => {
            $("#formErrMsg").text(`Risposta del server [${jqXHR.status} - ${errorThrown}]: ${jqXHR.responseText}`);
            $("#formAlert").show();
        })
        .always(() => refreshBusStopsTable());
}

function updateBusStop(id) {
    var newName = $("#newBusStopName").val();
    $.ajax({
        url: `/api/v1/busStops/${id}?` + $.param({userId}),
        type: "PUT",
        data: JSON.stringify({name: newName}),
        contentType: "application/json",
        dataType: "json"
    })
        .done((result) => {
            $("#editModal").modal("hide");
            alert("Fermata modificata con successo");
        })
        .fail((jqXHR, textStatus, errorThrown) => {
            alert(`Si è verificato un errore.\n${jqXHR.responseText}`);
        })
        .always(() => refreshBusStopsTable());
}

function deleteBusStop(id) {
    $.ajax({
        url: `/api/v1/busStops/${id}?` + $.param({userId}),
        type: "DELETE"
    })
        .done((result) => {
            alert("Fermata eliminata con successo");
        })
        .fail((jqXHR, textStatus, errorThrown) => {
            alert(`Si è verificato un errore.\n${jqXHR.responseText}`);
        })
        .always(() => refreshBusStopsTable());
}