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

const User = require('../models/User');
var testUser = new User();
testUser.name="utente1";
testUser.surname="cognome dell utente 1";
testUser.email="email@email.email";
testUser.password="topSecretPassword123"


const users={
    register(user){
        const userWithId={...user,id: uuidv4()};
        MongoClient.connect(url, function(err, db) {
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
        
    },
    findById(id){
        
    },
    clear(){
        
    }
};

users.register(testUser);

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

