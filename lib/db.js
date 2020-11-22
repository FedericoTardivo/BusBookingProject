const db ={
    tickets: [],
};

const tickets={
    insert(ticket){
        let ids = db.tickets.map(x=>x.id);
        ticket.id=(db.tickets.length==0 ? 1 : Math.max(ids) + 1);
        db.tickets.push(ticket);
        return ticket.id;
    },
    findById(id){
        return db.tickets.find(x=>x.id==id);
    },
    get(){
        return db.tickets;
    }
}

module.exports = {
    tickets
};
