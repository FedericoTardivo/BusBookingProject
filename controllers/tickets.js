
const db = require("../lib/db.js")
//const BadRequestResponse = require('../models/BadRequestResponse.js');
//const FieldError = require('../models/FieldError.js');
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
    //let errResp=new BadRequestResponse();

    let id=db.tickets.insert(ticket);
    console.log("ticket " + id + " added");
    res.send("ticket " + id + " added");
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