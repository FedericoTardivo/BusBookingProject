const db ={
    admins: [],
    lines: [],
    tickets: [],
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
    all(){
        return db.admins;
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
    all(){
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
    all(){
        return db.tickets;
    }
}

//TEST
admins.insert({
    name: "Fede",
    description: "This is an example"
});

admins.insert({
    name: "SecondoAdmin",
    description : "another esample"
});

lines.insert({
    name : "line5",
    description : "from trento to povo"
});

lines.insert({
    name : "line8",
    description : "trento-mattarello"
});

tickets.insert({
    user : "Utente",
    tratta : "da A a B"
});

console.log(admins.all());
console.log(lines.all());
console.log(admins.findById(2));
console.log(tickets.findById(1));

module.exports = {
    admins,
    lines,
    tickets
};
