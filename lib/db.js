const { v4: uuidv4 } = require('uuid');
const MongoCLient = require('mongodb').MongoClient;
const assert = require('assert');

const url = 'mongodb://localhost:27017'; //example
const dbName='myproject' //example

MongoCLient.connect(url,function(err,client){
    assert.strictEqual(null,err);
    console.log("Connected succesfully to MongoDB");
    const db = client.db(dbName);
    
    
    
    
    
    
    
    
    client.close;
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

