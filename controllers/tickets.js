
const db = require("../lib/db.js")
const BadRequestResponse = require('../models/BadRequestResponse.js');
const FieldError = require('../models/FieldError.js');
const Ticket = require('../models/Ticket.js');


/* insert ticket from body of POST request */
module.exports.insertTicket=async (req,res)=>{
    let ticket=new Ticket();
    ticket.userId=req.body.userId;
    ticket.lineId=req.body.lineId;
    ticket.startBusStopId=req.body.startBusStopId;
    ticket.endBusStopId=req.body.endBusStopId;
    ticket.startTime=req.body.startTime;
    ticket.arrivalTime=req.body.arrivalTime;
    
    let valid=true;
    let errResp=new BadRequestResponse();

    //validate userId
    if(!ticket.userId || typeof ticket.userId != 'string'){
        valid=false;
        errResp.fieldsErrors.push(new FieldError('userId','The field "userId" must be a non empty string'));
    }

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
    if(!ticket.startTime || typeof ticket.startTime != 'string'){
        valid=false;
        errResp.fieldsErrors.push(new FieldError('startTime','The field "startTime" must be a non empty string'));
    }

    //validate arrivalTime
    if(!ticket.arrivalTime || typeof ticket.arrivalTime != 'string'){
        valid=false;
        errResp.fieldsErrors.push(new FieldError('arrivalTime','The field "arrivalTime" must be a non empty string'));
    }

    //If something is not valid, send a BadRequest error
    if(!valid) {
        errResp.message = 'La richiesta non è valida.'
        return res.status(400).json(errResp);
    }

    //check if ticket is already bought
    if((await db.tickets.findBy({userId : ticket.userId , lineId : ticket.lineId , startBusStopId : ticket.startBusStopId , endBusStopId : ticket.endBusStopId , startTime : ticket.startTime , arrivalTime : ticket.arrivalTime})).length>0)
    {
        return res.status(409).json({
            fieldName: "ticket",
            fieldMessage: `Questo biglietto è già stato acquistato da questo userId`
          });
    }

    //The request is valid

    //create id for ticket
    const id=await db.tickets.insert(ticket);

    //response e console log
    res.location("/api/v1/tickets/" + id).status(201).json(ticket);
    console.log("ticket " + id + " added");
};
