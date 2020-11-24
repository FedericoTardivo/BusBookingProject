
const db = require("../lib/db.js")

/* returns all the tickets to the res object */
module.exports.getTickets=(req,res) => {
    res.send(db.tickets.get());
    console.log("getTickets called");
}

/* find ticket by id and send */
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

/* insert ticket from body of POST request */
module.exports.insertTicket=(req,res)=>{
    let ticket=req.body;
    let id=db.tickets.insert(ticket);
    console.log("ticket " + id + " added");
    res.send("ticket " + id + " added");
};