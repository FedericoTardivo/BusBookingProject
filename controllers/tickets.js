
const db = require("../lib/db.js")
const BadRequestResponse = require('../models/BadRequestResponse.js');
const FieldError = require('../models/FieldError.js');
const Ticket = require('../models/Ticket.js');


/* insert ticket from body of POST request */
module.exports.insertTicket=(req,res)=>{
    let ticket=new Ticket();
    ticket.utente=req.body.utente;
    ticket.linea=req.body.linea;
    ticket.fermataPartenza=req.body.fermataPartenza;
    ticket.fermataArrivo=req.body.fermataArrivo;
    ticket.orarioPartenza=req.body.orarioPartenza;
    ticket.orarioArrivo=req.body.orarioArrivo;
    
    let valid=true;
    let errResp=new BadRequestResponse();

    //validate user
    if(!ticket.utente || typeof ticket.utente != 'string'){
        valid=false;
        errResp.fieldsErrors.push(new FieldError('user','The field "user" must be a non empty string'));
    }

    //validate line
    if(!ticket.linea || typeof ticket.linea != 'string'){
        valid=false;
        errResp.fieldsErrors.push(new FieldError('line','The filed "line" must be a non empty string'));
    }

    //validate startStation
    if(!ticket.fermataPartenza || typeof ticket.fermataPartenza != 'string'){
        valid=false;
        errResp.fieldsErrors.push(new FieldError('startStation','The field "startStation" must be a non empty string'));
    }

    //validate stopStation
    if(!ticket.fermataArrivo || typeof ticket.fermataArrivo != 'string'){
        valid=false;
        errResp.fieldsErrors.push(new FieldError('stopStation','The field "stopStation" must be a non empty string'));
    }

    //validate startTime
    if(!ticket.orarioPartenza || typeof ticket.orarioPartenza != 'string'){
        valid=false;
        errResp.fieldsErrors.push(new FieldError('startTime','The field "startTime" must be a non empty string'));
    }

    //validate stopTime
    if(!ticket.orarioArrivo || typeof ticket.orarioArrivo != 'string'){
        valid=false;
        errResp.fieldsErrors.push(new FieldError('stopTime','The field "stopTime" must be a non empty string'));
    }

    //If something is not valid, send a BadRequest error
    if(!valid) {
        errResp.message = 'La richiesta non è valida.'
        return res.status(400).json(errResp);
    }

    //check if ticket is already bought
    if(db.tickets.find(u => u.utente == ticket.utente && u.linea == ticket.linea && u.fermataPartenza == ticket.fermataPartenza && u.fermataArrivo == ticket.fermataArrivo && u.orarioPartenza == ticket.orarioPartenza && u.orarioArrivo == ticket.orarioArrivo)) 
    {
        return res.status(409).json({
            fieldName: "ticket",
            fieldMessage: `Questo biglietto è già stato acquistato da questo utente`
          });
    }

    //The request is valid

    //create id for ticket
    const id=db.tickets.insert(ticket);

    //response e console log
    res.location("/api/v1/tickets/" + id).status(201).json(ticket);
    console.log("ticket " + id + " added");
};


/* returns all the tickets to the responde */
/* utile più avanti, mancano controlli */
module.exports.getTickets=(req,res) => {
    res.send(db.tickets.get());
    console.log("getTickets called");
}

/* find ticket by id and send */
/* utile più avanti, mancano controlli */
module.exports.getTicket=(req,res)=>{
    let ticket = db.tickets.findById(req.params.id);
    /* check if exists */
    if(ticket != null){
        res.send(ticket);
        return;
    }
    res.send("Ticket with id " + req.params.id + " not found!");
    console.log('getTicket called with id ' + req.params.id);
}