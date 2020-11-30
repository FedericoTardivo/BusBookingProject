const { v4: uuidv4 } = require('uuid');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

/* 
    https://www.w3schools.com/nodejs/nodejs_mongodb.asp 
*/

const dbName='mongo';
const user='Group32';
const password='Group32Pass';

const uri = "mongodb+srv://Group32:Group32Pass@ingsoft2-project.twadj.mongodb.net/mongo?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const test = async () => {
    client.connect(err => {
        if(err) throw err;
        console.log("Mongodb succesfully connected.");
        const db=client.db("mongo");
        
        
        const result = await db.collection("customers").find({address:"park lane 38"}).toArray();
        console.log(result);
        

        client.close(function(err){
            if(err) throw err;
            console.log("Connection terminated.");
        });
    });
};



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

