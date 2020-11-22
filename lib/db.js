const db ={
    admins: [],
    lines: [],
    tickets: [],
    users: []
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

const users={
    register(user){  
        db.users.push(user);
        return user.id;
    },
    get(){
        return db.users;
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
    admins,
    lines,
    tickets,
    users
};
