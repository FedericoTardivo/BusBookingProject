const { v4: uuidv4 } = require('uuid');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

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
                console.log(res);
                db.close();
            });
        })
    },
    findBy(query){
        MongoClient.connect(url,{useNewUrlParser:true, useUnifiedTopology:true},function(err, db){
            if(err) throw err;
            var dbo=db.db(dbName);
            dbo.collection("users").find(query).toArray(function(err,res){
                if(err) throw err;
                console.log(res);
                db.close();
            });
        })
    },
    clear(){
        MongoClient.connect(url,{useNewUrlParser:true, useUnifiedTopology:true},function(err, db){
            if(err) throw err;
            var dbo=db.db(dbName);
            dbo.collection("users").deleteMany({}, function(err,obj){
                if(err) throw err;
                console.log(obj.result.n + "objects deleted");
                db.close();
            });
        })
    }
};

const admins ={
    insert(admin){
        
    },
    findById(id){
        
    },
    get(){
        
    }
};

const lines ={
    insert(line){
        
    },
    findById(id){
        
    },
    get(){
        
    }
};

const tickets={
    insert(ticket){
        
    },
    findById(id){
        
    },
    get(){
        
    },
    deleteAll() {
        
    }
};

module.exports={    
    users,
    admins,
    lines,
    tickets
};

