const { v4: uuidv4 } = require('uuid');

const db ={
    tickets: [],
};

const tickets={
    insert(ticket){
        let ticketWithId={...ticket, id : uuidv4()};
        db.tickets.push(ticketWithId);
        return ticketWithId.id;
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
