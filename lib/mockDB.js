const { v4: uuidv4 } = require('uuid');

const db = {
    admins: [],
    users: [],
    lines: [],
    tickets: []
};

const users={
    register(user){
        const userWithId={...user, _id: uuidv4() };
        db.users.push(userWithId);
        return userWithId._id;
    },
    get(){
        return db.users;
    },
    findById(_id){
        return db.users.find(x => x._id==_id);
    },
    clear(){
        db.users = [];
    }
};

const admins ={
    insert(admin){
        let ids=db.admins.map(x => x._id);
        admin._id=(db.admins.length==0 ? 1 : Math.max(ids) + 1);
        db.admins.push(admin);
        //console.log(admin._id + ' ' + admin.name + ' ' + admin.description); // DEBUG
        return admin._id;
    },
    findById(_id){
        return db.admins.find(x => x._id==_id);
    },
    get(){
        return db.admins;
    }
};

const lines ={
    insert(line){
        let ids=db.lines.map(x=>x._id);
        line._id=(db.lines.length==0 ? 1 : Math.max(ids) + 1);
        db.lines.push(line);
        return line._id;
    },
    findById(_id){
        return db.lines.find(x => x._id==_id);
    },
    get(){
        return db.lines;
    }
};

const tickets={
    insert(ticket){
        let ticketWithId={...ticket, _id : uuidv4()};
        db.tickets.push(ticketWithId);
        return ticketWithId._id;
    },
    findById(_id){
        return db.tickets.find(x=>x._id==_id);
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
    tickets
};
