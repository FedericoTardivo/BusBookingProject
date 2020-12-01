class Ticket{
    constructor(){
        this.issueDate = Date.now();
        this.userId = '';
        this.lineId = '';
        this.startStopId = '';
        this.endStopId = '';
        this.startTime = '';
        this.arrivalTime = '';
    }
}

module.exports = Ticket;