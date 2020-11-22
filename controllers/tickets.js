
const db = require("../lib/db.js")

module.exports.getTickets=(req,res) => {
    res.send(db.tickets.get());
    console.log("getTickets called");
}

module.exports.getTicket=(req,res)=>{
    console.log('getTicket called with id ' + req.params.id);
    let ticket = db.tickets.findById(req.params.id);
    if(ticket != null){
        res.send(ticket);
        return;
    }
    res.send("Ticket with id " + req.params.id + " not found!");
}

module.exports.insertTicket=(req,res)=>{
    let ticket=req.body;
    db.tickets.insert(ticket);
    console.log("ticket added");
    res.send("Ticket added!");
};