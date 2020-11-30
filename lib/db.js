const { v4: uuidv4 } = require('uuid');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const url = 'mongodb://localhost:27017'; //example
const dbName='myproject' //example

const user='Group32'
const password='Group32Pass';

const uri = "mongodb+srv://" + user + ":<" + password + ">@ingsoft2-project.twadj.mongodb.net/<mongo>?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    //const collection = client.db("test").collection("devices");
    console.log("Connected to MongoDb!");


    client.close();
    console.log("Connection closed.");
});


const users={
    register(user){
        
    },
    get(){
        
    },
    findById(id){
        
    },
    clear(){
        
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

