
const db = require("../lib/db.js")
const BadRequestResponse = require('../models/BadRequestResponse.js');
const FieldError = require('../models/FieldError.js');
const Ticket = require('../models/Ticket.js');


/* insert ticket from body of POST request */
module.exports.insertTicket=(req,res)=>{
    let ticket=new Ticket();
    ticket.userId=req.body.userId;
    ticket.lineId=req.body.lineId;
    ticket.startBusStopId=req.body.startBusStopId;
    ticket.endBusStopId=req.body.endBusStopId;
    ticket.startTime=req.body.startTime;
    ticket.arrivalTime=req.body.arrivalTime;
    
    let valid=true;
    let errResp=new BadRequestResponse();

    //validate user
    if(!ticket.userId || typeof ticket.userId != 'string'){
        valid=false;
        errResp.fieldsErrors.push(new FieldError('user','The field "user" must be a non empty string'));
    }

    //validate line
    if(!ticket.lineId || typeof ticket.lineId != 'string'){
        valid=false;
        errResp.fieldsErrors.push(new FieldError('line','The filed "line" must be a non empty string'));
    }

    //validate startStation
    if(!ticket.startBusStopId || typeof ticket.startBusStopId != 'string'){
        valid=false;
        errResp.fieldsErrors.push(new FieldError('startStation','The field "startStation" must be a non empty string'));
    }

    //validate stopStation
    if(!ticket.endBusStopId || typeof ticket.endBusStopId != 'string'){
        valid=false;
        errResp.fieldsErrors.push(new FieldError('stopStation','The field "stopStation" must be a non empty string'));
    }

    //validate startTime
    if(!ticket.startTime || typeof ticket.startTime != 'string'){
        valid=false;
        errResp.fieldsErrors.push(new FieldError('startTime','The field "startTime" must be a non empty string'));
    }

    //validate stopTime
    if(!ticket.arrivalTime || typeof ticket.arrivalTime != 'string'){
        valid=false;
        errResp.fieldsErrors.push(new FieldError('stopTime','The field "stopTime" must be a non empty string'));
    }

    //If something is not valid, send a BadRequest error
    if(!valid) {
        errResp.message = 'La richiesta non è valida.'
        return res.status(400).json(errResp);
    }

    //check if ticket is already bought
    if(db.tickets.get().find(u => u.userId == ticket.userId && u.lineId == ticket.lineId && u.startBusStopId == ticket.startBusStopId && u.endBusStopId == ticket.endBusStopId && u.startTime == ticket.startTime && u.arrivalTime == ticket.arrivalTime)) 
    {
        return res.status(409).json({
            fieldName: "ticket",
            fieldMessage: `Questo biglietto è già stato acquistato da questo userId`
          });
    }

    //The request is valid

    //create id for ticket
    const id=db.tickets.insert(ticket);

    //response e console log
    res.location("/api/v1/tickets/" + id).status(201).json(ticket);
    console.log("ticket " + id + " added");
};
