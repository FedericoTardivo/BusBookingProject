class Ticket{
    constructor(){
        this.id = '';
        this.issueDate = Date.now();
        this.userId = '';
        this.lineId = '';
        this.startBusStopId = '';
        this.endBusStopId = '';
        this.startTime = '';
        this.arrivalTime = '';
    }
}

module.exports = Ticket;