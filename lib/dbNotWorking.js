const { v4: uuidv4 } = require('uuid');
const MongoClient = require('mongodb').MongoClient;

/* 
    https://www.w3schools.com/nodejs/nodejs_mongodb.asp 
    https://www.youtube.com/watch?v=ZKwrOXl5TDI&ab_channel=Academind
*/

const user='Group32';
const password='Group32Pass';
const dbName='mongo';
const url = `mongodb+srv://${user}:${password}@ingsoft2-project.twadj.mongodb.net/${dbName}?retryWrites=true&w=majority`;

const users={
    register(user){
        const userWithId={...user,_id: uuidv4()};
        MongoClient.connect(url,{useNewUrlParser:true, useUnifiedTopology:true} ,function(err, db) {
            if (err) throw err;
            var dbo = db.db(dbName);
            dbo.collection("users").insertOne(userWithId, function(err, res) {
                if (err) throw err;
                console.log("1 user inserted");
                db.close();
            });
        });
    },
    get(){
        MongoClient.connect(url,{useNewUrlParser:true, useUnifiedTopology:true},function(err, db){
            if(err) throw err;
            var dbo=db.db(dbName);
            dbo.collection("users").find().toArray(function(err,res){
                if(err) throw err;
                db.close();
                return res;
                console.log(res);
            });
        })
    },
    findBy(query){
        /* <query> is a js objetc used to filter => {_id : "123456"} */
        MongoClient.connect(url,{useNewUrlParser:true, useUnifiedTopology:true},function(err, db){
            if(err) throw err;
            var dbo=db.db(dbName);
            dbo.collection("users").find(query).toArray(function(err,res){
                if(err) throw err;
                console.log(res);
                db.close();
                return res;
            });
        })
    },
    clear(){
        MongoClient.connect(url,{useNewUrlParser:true, useUnifiedTopology:true},function(err, db){
            if(err) throw err;
            var dbo=db.db(dbName);
            dbo.collection("users").deleteMany({}, function(err,obj){
                if(err) throw err;
                console.log(obj.result.n + "users deleted");
                db.close();
            });
        })
    }
};

const admins ={
    insert(admin){
        const adminWithId={...admin,_id: uuidv4()};
        MongoClient.connect(url,{useNewUrlParser:true, useUnifiedTopology:true} ,function(err, db) {
            if (err) throw err;
            var dbo = db.db(dbName);
            dbo.collection("admins").insertOne(adminWithId, function(err, res) {
                if (err) throw err;
                console.log("1 admin inserted");
                db.close();
            });
        });
    },
    findBy(query){
        /* <query> is a js objetc used to filter => {_id : "123456"} */
        MongoClient.connect(url,{useNewUrlParser:true, useUnifiedTopology:true},function(err, db){
            if(err) throw err;
            var dbo=db.db(dbName);
            dbo.collection("admins").find(query).toArray(function(err,res){
                if(err) throw err;
                console.log(res);
                db.close();
                return res;
            });
        })
    },
    get(){
        MongoClient.connect(url,{useNewUrlParser:true, useUnifiedTopology:true},function(err, db){
            if(err) throw err;
            var dbo=db.db(dbName);
            dbo.collection("admins").find().toArray(function(err,res){
                if(err) throw err;
                //console.log(res);
                db.close();
                return res;
            });
        })
    },
    clear(){
        MongoClient.connect(url,{useNewUrlParser:true, useUnifiedTopology:true},function(err, db){
            if(err) throw err;
            var dbo=db.db(dbName);
            dbo.collection("admins").deleteMany({}, function(err,obj){
                if(err) throw err;
                console.log(obj.result.n + "admins deleted");
                db.close();
            });
        })
    }
};

const lines ={
    insert(line){
        const lineWithId={...line,_id: uuidv4()};
        MongoClient.connect(url,{useNewUrlParser:true, useUnifiedTopology:true} ,function(err, db) {
            if (err) throw err;
            var dbo = db.db(dbName);
            dbo.collection("lines").insertOne(lineWithId, function(err, res) {
                if (err) throw err;
                console.log("1 line inserted");
                db.close();
            });
        });
    },
    findBy(query){
        /* <query> is a js objetc used to filter => {_id : "123456"} */
        MongoClient.connect(url,{useNewUrlParser:true, useUnifiedTopology:true},function(err, db){
            if(err) throw err;
            var dbo=db.db(dbName);
            dbo.collection("lines").find(query).toArray(function(err,res){
                if(err) throw err;
                console.log(res);
                db.close();
                return res;
            });
        })
    },
    get(){
        MongoClient.connect(url,{useNewUrlParser:true, useUnifiedTopology:true},function(err, db){
            if(err) throw err;
            var dbo=db.db(dbName);
            dbo.collection("lines").find().toArray(function(err,res){
                if(err) throw err;
                console.log(res);
                db.close();
                return res;
            });
        })
    },
    clear(){
        MongoClient.connect(url,{useNewUrlParser:true, useUnifiedTopology:true},function(err, db){
            if(err) throw err;
            var dbo=db.db(dbName);
            dbo.collection("lines").deleteMany({}, function(err,obj){
                if(err) throw err;
                console.log(obj.result.n + "lines deleted");
                db.close();
            });
        })
    }
};

const tickets={
    insert(ticket){
        const ticketWithId={...ticket,_id: uuidv4()};
        MongoClient.connect(url,{useNewUrlParser:true, useUnifiedTopology:true} ,function(err, db) {
            if (err) throw err;
            var dbo = db.db(dbName);
            dbo.collection("tickets").insertOne(ticketWithId, function(err, res) {
                if (err) throw err;
                console.log("1 ticket inserted");
                db.close();
            });
        });
    },
    findBy(query){
        /* <query> is a js objetc used to filter => {_id : "123456"} */
        MongoClient.connect(url,{useNewUrlParser:true, useUnifiedTopology:true},function(err, db){
            if(err) throw err;
            var dbo=db.db(dbName);
            dbo.collection("tickets").find(query).toArray(function(err,res){
                if(err) throw err;
                console.log(res);
                db.close();
                return res;
            });
        })
    },
    get(){
        MongoClient.connect(url,{useNewUrlParser:true, useUnifiedTopology:true},function(err, db){
            if(err) throw err;
            var dbo=db.db(dbName);
            dbo.collection("tickets").find().toArray(function(err,res){
                if(err) throw err;
                console.log(res);
                db.close();
                return res;
            });
        })
    },
    clear(){
        MongoClient.connect(url,{useNewUrlParser:true, useUnifiedTopology:true},function(err, db){
            if(err) throw err;
            var dbo=db.db(dbName);
            dbo.collection("tickets").deleteMany({}, function(err,obj){
                if(err) throw err;
                console.log(obj.result.n + "tickets deleted");
                db.close();
            });
        })
    }
};

module.exports={    
    users,
    admins,
    lines,
    tickets
};

