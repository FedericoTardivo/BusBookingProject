const db = require("../lib/db.js")
const BadRequestResponse = require('../models/BadRequestResponse.js');
const FieldError = require('../models/FieldError.js');
const Ticket = require('../models/Ticket.js');

/* insert ticket from body of POST request */
module.exports.insertTicket=async (req,res)=>{
    // Check if the user is authenticated
    if(!req.loggedUserId) {
        return res.status(401).send("Utente non autenticato.");
    }

    let ticket=new Ticket();
    ticket.userId=req.loggedUserId;
    ticket.lineId=req.body.lineId;
    ticket.startBusStopId=req.body.startBusStopId;
    ticket.endBusStopId=req.body.endBusStopId;
    ticket.startTime = new Date(req.body.startTime);
    ticket.arrivalTime = new Date(req.body.arrivalTime);
    
    let valid=true;
    let errResp=new BadRequestResponse();

    //validate lineId
    if(!ticket.lineId || typeof ticket.lineId != 'string'){
        valid=false;
        errResp.fieldsErrors.push(new FieldError('lineId','The filed "lineId" must be a non empty string'));
    }

    //validate startStopId
    if(!ticket.startBusStopId || typeof ticket.startBusStopId != 'string'){
        valid=false;
        errResp.fieldsErrors.push(new FieldError('startBusStopId','The field "startBusStopId" must be a non empty string'));
    }

    //validate endStopId
    if(!ticket.endBusStopId || typeof ticket.endBusStopId != 'string'){
        valid=false;
        errResp.fieldsErrors.push(new FieldError('endBusStopId','The field "endBusStopId" must be a non empty string'));
    }

    //validate startTime
    if(!ticket.startTime || !(ticket.startTime instanceof Date && !isNaN(ticket.startTime))){
        valid=false;
        errResp.fieldsErrors.push(new FieldError('startTime','The field "startTime" must be a valid date'));
    }

    //validate arrivalTime
    if(!ticket.arrivalTime || !(ticket.arrivalTime instanceof Date && !isNaN(ticket.arrivalTime))){
        valid=false;
        errResp.fieldsErrors.push(new FieldError('arrivalTime','The field "arrivalTime" must be a valid date'));
    }

    //If something is not valid, send a BadRequest error
    if(!valid) {
        errResp.message = 'La richiesta non è valida.'
        return res.status(400).json(errResp);
    }

    //check if ticket is already bought
    if((await db.tickets.findBy({userId: ticket.userId, lineId: ticket.lineId, startBusStopId: ticket.startBusStopId, endBusStopId: ticket.endBusStopId, startTime: ticket.startTime, arrivalTime: ticket.arrivalTime})).length>0)
    {
        return res.status(409).json({
            fieldName: "ticket",
            fieldMessage: `Questo biglietto è già stato acquistato da questo userId`
          });
    }

    //The request is valid

    // Check if there are available seats

    // Get the line
    let tLine = (await db.lines.findBy({_id: ticket.lineId}))[0];
    // Initialize the available seats to the capacity of the line
    let availSeats = tLine.capacity;
    // Each run has {capacity} available seats
    // Get the index of the run of the ticket the user wants to buy
    let runIndex = getRunIndexOfLine(tLine, ticket.startBusStopId, `${("0" + ticket.startTime.getHours()).slice(-2)}:${("0" + ticket.startTime.getMinutes()).slice(-2)}`); // Format hours and minutes as 2-digits numbers

    // Get all the tickets already bought for this run
    let tickets = await db.tickets.findBy({lineId: ticket.lineId});
    tickets = tickets.map(t => {
        return {
            _id: t._id,
            issueDate: t.issueDate,
            userId: t.userId,
            lineId: t.lineId,
            startBusStopId: t.startBusStopId,
            endBusStopId: t.endBusStopId,
            startTime: new Date(t.startTime),
            arrivalTime: new Date(t.arrivalTime)
        }
    });

    // Filter tickets to have only the tickets of the same day
    tickets = tickets.filter(t => {
        // We want just the date, get rid of the time portion
        let t_st = new Date(t.startTime.getTime()); // Create a copy of startTime because we don't want to lose the time
        t_st.setHours(0, 0, 0, 0);

        let st = new Date(ticket.startTime.getTime()); // Create a copy of startTime because we don't want to lose the time
        st.setHours(0,0,0,0);

        return Number(t_st) == Number(st); // Number is needed to compare two Date objects
    });

    // Filter tickets to have only tickets of the same run
    tickets = tickets.filter(t => {
        let ri = getRunIndexOfLine(tLine, t.startBusStopId, `${("0" + t.startTime.getHours()).slice(-2)}:${("0" + t.startTime.getMinutes()).slice(-2)}`); // Format hours and minutes as 2-digits numbers
        return ri == runIndex;
    });

    // Decrease/Increase available seats
    let avail = true;
    let start = false, end = false;
    tLine.path.forEach(x => {
        tickets.forEach(t => {
            if(x.busStopId == t.startBusStopId) availSeats -= 1; 
            if(x.busStopId == t.endBusStopId) availSeats += 1; 
        });

        if (x.busStopId == ticket.startBusStopId) start = true;
        if (x.busStopId == ticket.endBusStopId) end = true;

        if (start && !end) {
            if (availSeats <= 0) {
                avail = false;
            }
        }
    });

    if (!avail) {
        return res.status(409).json({message: "Posti esauriti."});
    }

    // === end of available seats check ===

    //create id for ticket
    const id = await db.tickets.insert(ticket);

    //response e console log
    res.location("/api/v1/tickets/" + id).status(201).json(ticket);
};

//Delete a tiket for a user by id
module.exports.deleteTicket=async (req,res)=>{
    
    //check if the user is authenticated
    if(!req.loggedUserId){
        return res.status(401).send("Utente non autenticato.");
    }

    //reqeust of the tickets by db
    var tickDB =( await db.tickets.findBy({_id: req.params.id}))[0];

    //if ticket not exist
    if(!tickDB){
        return res.status(404).send(`Il biglietto con ID '${req.params.id}' non esiste.`)
    }
    
    //check if the user who wants delete the tickets is the user who took that
    var userTicket = (await db.users.findBy({_id: req.loggedUserId}))[0].userId;
    if(tickDB.userId!=userTicket){
        return res.status(403).send("Accesso non autorizzato.");
    }

    //try to delete the tiket
    if (await db.tickDB.delete(tickDB._id)){
        return res.status(204).send();
    } else {
        return res.status(500).send();
    }
};
// time => "12:00"
function getRunIndexOfLine(line, busStopId, time) {
    // Get the run
    let pathStep = line.path.find(x => x.busStopId == busStopId);
    // Find the index of the requested time
    return pathStep.times.findIndex((element) => element.time == time);
}
