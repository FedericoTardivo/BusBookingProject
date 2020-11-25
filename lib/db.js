const { v4: uuidv4 } = require('uuid');

const db = {
    admins: [],
    users: [],
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
    }
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
    },
    deleteAll() {
        db.tickets = [];
    }
};

module.exports={    
    users,
    admins,
    tickets
};
