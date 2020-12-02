const { v4: uuidv4 } = require('uuid');

const db = {
    admins: [],
    users: [],
    lines: [],
    busStops: [],
    tickets: []
};

const users={
    register(user){
        const userWithId={...user, id: uuidv4() };
        db.users.push(userWithId);
        return userWithId.id;
    },
    get(){
        return db.users;
    },
    findById(id){
        return db.users.find(x => x.id==id);
    },
    clear(){
        db.users = [];
    }
};

const admins ={
    insert(admin){
        let ids=db.admins.map(x => x.id);
        admin.id=(db.admins.length==0 ? 1 : Math.max(ids) + 1);
        db.admins.push(admin);
        //console.log(admin.id + ' ' + admin.name + ' ' + admin.description); // DEBUG
        return admin.id;
    },
    findById(id){
        return db.admins.find(x => x.id==id);
    },
    get(){
        return db.admins;
    },
    clear(){
        db.admins = [];
    }
};

const lines ={
    insert(line){
        let ids=db.lines.map(x=>x.id);
        line.id=(db.lines.length==0 ? 1 : Math.max(ids) + 1);
        db.lines.push(line);
        return line.id;
    },
    findById(id){
        return db.lines.find(x => x.id==id);
    },
    get(){
        return db.lines;
    }
};

const busStops ={
    insert(busStop){
        let ids=db.busStops.map(x=>x.id);
        busStop.id=(db.busStops.length==0 ? 1 : Math.max(ids) + 1);
        db.busStops.push(busStop);
        return busStop.id;
    },
    findById(id){
        return db.busStops.find(x => x.id==id);
    },
    get(){
        return db.busStops;
    }
};

busStops.insert({
    id: "a",
    name: "Fermata1"
});
busStops.insert({
    id: "b",
    name: "Fermata2"
});
busStops.insert({
    id: "c",
    name: "Fermata3"
});
busStops.insert({
    id: "d",
    name: "Fermata4"
});

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
    },
    deleteAll() {
        db.tickets = [];
    }
};

module.exports={    
    users,
    admins,
    lines,
    busStops,
    tickets
};
