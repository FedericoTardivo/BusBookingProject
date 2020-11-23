const db ={
    admins: [],
    lines: [],
    tickets: [],
    accounts: []
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

const accounts={
    register(user,pass){
        let account={
            id : 0,
            username : "fake",
            password : "fake"
        };
        let ids=db.accounts.map(x => x.id);
        account.id=(db.accounts.length==0 ? 1 : Math.max(ids) +1);
        account.username=user;
        account.password=pass;
        db.accounts.push(account);
        return account.id;
    },
    get(){
        return db.accounts;
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
    accounts,
    lines,
    tickets
};
