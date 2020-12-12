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

    //create _id for ticket
    const _id = await db.tickets.insert(ticket);

    //response e console log
    res.location("/api/v1/tickets/" + _id).status(201).json(ticket);
    //console.log("ticket " + _id + " added");
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
