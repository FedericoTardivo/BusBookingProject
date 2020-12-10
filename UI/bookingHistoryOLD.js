var userID = sessionStorage.getItem("LoggedUserID"); //type is yet User 
var dati = null;
var table = $("#ticketBooking tbody");
/**
 * function called during the loading of the page ticketBooking
 */
function loadTicketBooking() { //default order is by date

    

    $.ajax({
        url: `/api/v1/users/${userID}/tickets`
    })
        .done((dati = result) => {
            //creo la tabella di default ordinata per data
            tableByDate();   
        })

        .fail((jqXHR) => {
                
        });
}

/**
 * order table by reservation DATE
 */
function tableByDate(){

    table.empty();
            //sicuro che siano ordinati per data?
    $.each(dati, (_id, issueDate, startTime, startBusStopId, endBusStopId) => {
        table.append(`<tr><td>${_id}</td><td>${issueDate}</td><td>${startTime}</td><td>${startBusStopId.name}</td><td>${endBusStopId.name}</td></tr>`)
    });
}

//funzione richiamata dal pulsante
function tableByID(){

}

/**
 * file html 
 * titoli come se fossero pulsanti link
 * default li ordina by date 
 * 
 * chiama js
 * invia le query 
 * ho il result che lo rendo globale
 * lo passo alla funzione bydate e creo la tabella da aggiungere nel tbody della tabella ordinata per date
 * 
 * le altre funzioni per ordinare usano sempre il result globale 
 * vengono richiamate dai button
 */

 /**
  * mi correggo 
  * meglio fare un form con tutte le possibilità di filtri 
  * posso impostarle in contemporanea 
  * e faccio la tabella che è sempre ordinata per data
  * punto
  */