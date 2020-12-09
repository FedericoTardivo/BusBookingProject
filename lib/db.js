const MongoClient = require('mongodb').MongoClient;
const { v4: uuidv4 } = require('uuid');
const dotenv = require('dotenv').config();

const env = process.env.NODE_ENV.toUpperCase();

const user=process.env['DB_USER_' + env];
const password=process.env['DB_PASSWORD_' + env];
var dbName=process.env['DB_NAME_' + env];
//temporary overwrite
dbName="TheRightOne";
const url=`mongodb+srv://${user}:${password}@ingsoft2-project.twadj.mongodb.net/${dbName}?retryWrites=true&w=majority`; 

//console.log(url);

const users = {
    async register(user){
        const userWithId={...user, _id : uuidv4()};
        const client = await MongoClient.connect(url,{useNewUrlParser:true, useUnifiedTopology:true}).catch(err => {
            throw err;
        });
        if(!client){
            return;
        }
        try{
            const db=client.db(dbName);
            let collection=db.collection('users');
            let res = await collection.insertOne(userWithId);
            //console.log("1 user inserted");
            return userWithId._id;
        }catch(err){
            throw err;
        }finally{
            client.close();
        }
    },
    async get(){
        const client = await MongoClient.connect(url,{useNewUrlParser:true, useUnifiedTopology:true}).catch(err => {
            throw err;
        });
        if(!client){
            return;
        }
        try{
            const db=client.db(dbName);
            let collection=db.collection('users');
            let res = await collection.find().toArray();
            return res;
        }catch(err){
            throw err;
        }finally{
            client.close();
        }
    },
    async findBy(query){
        const client = await MongoClient.connect(url,{useNewUrlParser:true, useUnifiedTopology:true}).catch(err => {
            throw err;
        });
        if(!client){
            return;
        }
        try{
            const db=client.db(dbName);
            let collection=db.collection('users');
            let res = await collection.find(query).toArray();
            return res;
        }catch(err){
            throw err;
        }finally{
            client.close();
        }
    },
    async clear(){
        const client = await MongoClient.connect(url,{useNewUrlParser:true, useUnifiedTopology:true}).catch(err => {
            throw err;
        });
        if(!client){
            return;
        }
        try{
            const db=client.db(dbName);
            let collection=db.collection('users');
            let res = await collection.deleteMany();
            //console.log(res.result.n + " users deleted");
            return res.result.n;
        }catch(err){
            throw err;
        }finally{
            client.close();
        }
    }
};

const admins = {
    async insert(admin){
        const adminWithId={...admin, _id : uuidv4()};
        const client = await MongoClient.connect(url,{useNewUrlParser:true, useUnifiedTopology:true}).catch(err => {
            throw err;
        });
        if(!client){
            return;
        }
        try{
            const db=client.db(dbName);
            let collection=db.collection('admins');
            let res = await collection.insertOne(adminWithId);
            //console.log("1 admin inserted");
            return adminWithId._id;
        }catch(err){
            throw err;
        }finally{
            client.close();
        }
    },
    async get(){
        const client = await MongoClient.connect(url,{useNewUrlParser:true, useUnifiedTopology:true}).catch(err => {
            throw err;
        });
        if(!client){
            return;
        }
        try{
            const db=client.db(dbName);
            let collection=db.collection('admins');
            let res = await collection.find().toArray();
            return res;
        }catch(err){
            throw err;
        }finally{
            client.close();
        }
    },
    async findBy(query){
        const client = await MongoClient.connect(url,{useNewUrlParser:true, useUnifiedTopology:true}).catch(err => {
            throw err;
        });
        if(!client){
            return;
        }
        try{
            const db=client.db(dbName);
            let collection=db.collection('admins');
            let res = await collection.find(query).toArray();
            return res;
        }catch(err){
            throw err;
        }finally{
            client.close();
        }
    },
    async clear(){
        const client = await MongoClient.connect(url,{useNewUrlParser:true, useUnifiedTopology:true}).catch(err => {
            throw err;
        });
        if(!client){
            return;
        }
        try{
            const db=client.db(dbName);
            let collection=db.collection('admins');
            let res = await collection.deleteMany();
            //console.log(res.result.n + " admins deleted");
            return res.result.n;
        }catch(err){
            throw err;
        }finally{
            client.close();
        }
    }
};

const tickets = {
    async insert(ticket){
        const ticketWithId={...ticket, _id : uuidv4()};
        const client = await MongoClient.connect(url,{useNewUrlParser:true, useUnifiedTopology:true}).catch(err => {
            throw err;
        });
        if(!client){
            return;
        }
        try{
            const db=client.db(dbName);
            let collection=db.collection('tickets');
            let res = await collection.insertOne(ticketWithId);
            //console.log("1 ticket inserted");
            return ticketWithId._id;
        }catch(err){
            throw err;
        }finally{
            client.close();
        }
    },
    async get(){
        const client = await MongoClient.connect(url,{useNewUrlParser:true, useUnifiedTopology:true}).catch(err => {
            throw err;
        });
        if(!client){
            return;
        }
        try{
            const db=client.db(dbName);
            let collection=db.collection('tickets');
            let res = await collection.find().toArray();
            return res;
        }catch(err){
            throw err;
        }finally{
            client.close();
        }
    },
    async findBy(query){
        const client = await MongoClient.connect(url,{useNewUrlParser:true, useUnifiedTopology:true}).catch(err => {
            throw err;
        });
        if(!client){
            return;
        }
        try{
            const db=client.db(dbName);
            let collection=db.collection('tickets');
            let res = await collection.find(query).toArray();
            return res;
        }catch(err){
            throw err;
        }finally{
            client.close();
        }
    },
    async clear(){
        const client = await MongoClient.connect(url,{useNewUrlParser:true, useUnifiedTopology:true}).catch(err => {
            throw err;
        });
        if(!client){
            return;
        }
        try{
            const db=client.db(dbName);
            let collection=db.collection('tickets');
            let res = await collection.deleteMany();
            //console.log(res.result.n + " tickets deleted");
            return res.result.n;
        }catch(err){
            throw err;
        }finally{
            client.close();
        }
    }
};

const lines = {
    async insert(line){
        const lineWithId={...line, _id : uuidv4()};
        const client = await MongoClient.connect(url,{useNewUrlParser:true, useUnifiedTopology:true}).catch(err => {
            throw err;
        });
        if(!client){
            return;
        }
        try{
            const db=client.db(dbName);
            let collection=db.collection('lines');
            let res = await collection.insertOne(lineWithId);
            //console.log("1 line inserted");
            return lineWithId._id;
        }catch(err){
            throw err;
        }finally{
            client.close();
        }
    },
    async update(line){
        const client = await MongoClient.connect(url,{useNewUrlParser:true, useUnifiedTopology:true}).catch(err => {
            throw err;
        });
        if(!client){
            return;
        }
        try{
            const db=client.db(dbName);
            let collection=db.collection('lines');
            let res = await collection.updateOne({_id: line._id},{$set : {
                name : line.name,
                adminId : line.adminId,
                path : line.path,
            }});
            //console.log("1 line inserted");
        }catch(err){
            throw err;
        }finally{
            client.close();
        }
    },
    async get(){
        const client = await MongoClient.connect(url,{useNewUrlParser:true, useUnifiedTopology:true}).catch(err => {
            throw err;
        });
        if(!client){
            return;
        }
        try{
            const db=client.db(dbName);
            let collection=db.collection('lines');
            let res = await collection.find().toArray();
            return res;
        }catch(err){
            throw err;
        }finally{
            client.close();
        }
    },
    async findBy(query){
        const client = await MongoClient.connect(url,{useNewUrlParser:true, useUnifiedTopology:true}).catch(err => {
            throw err;
        });
        if(!client){
            return;
        }
        try{
            const db=client.db(dbName);
            let collection=db.collection('lines');
            let res = await collection.find(query).toArray();
            return res;
        }catch(err){
            throw err;
        }finally{
            client.close();
        }
    },
    async clear(){
        const client = await MongoClient.connect(url,{useNewUrlParser:true, useUnifiedTopology:true}).catch(err => {
            throw err;
        });
        if(!client){
            return;
        }
        try{
            const db=client.db(dbName);
            let collection=db.collection('lines');
            let res = await collection.deleteMany();
            //console.log(res.result.n + " lines deleted");
            return res.result.n;
        }catch(err){
            throw err;
        }finally{
            client.close();
        }
    }
};

const busStops = {
    async insert(busStop){
        const busStopWithId={...busStop, _id : uuidv4()};
        const client = await MongoClient.connect(url,{useNewUrlParser:true, useUnifiedTopology:true}).catch(err => {
            throw err;
        });
        if(!client){
            return;
        }
        try{
            const db=client.db(dbName);
            let collection=db.collection('busStops');
            let res = await collection.insertOne(busStopWithId);
            //console.log("1 busStop inserted");
            return busStopWithId._id;
        }catch(err){
            throw err;
        }finally{
            client.close();
        }
    },
    async get(){
        const client = await MongoClient.connect(url,{useNewUrlParser:true, useUnifiedTopology:true}).catch(err => {
            throw err;
        });
        if(!client){
            return;
        }
        try{
            const db=client.db(dbName);
            let collection=db.collection('busStops');
            let res = await collection.find().toArray();
            return res;
        }catch(err){
            throw err;
        }finally{
            client.close();
        }
    },
    async findBy(query){
        const client = await MongoClient.connect(url,{useNewUrlParser:true, useUnifiedTopology:true}).catch(err => {
            throw err;
        });
        if(!client){
            return;
        }
        try{
            const db=client.db(dbName);
            let collection=db.collection('busStops');
            let res = await collection.find(query).toArray();
            return res;
        }catch(err){
            throw err;
        }finally{
            client.close();
        }
    },
    async clear(){
        const client = await MongoClient.connect(url,{useNewUrlParser:true, useUnifiedTopology:true}).catch(err => {
            throw err;
        });
        if(!client){
            return;
        }
        try{
            const db=client.db(dbName);
            let collection=db.collection('busStops');
            let res = await collection.deleteMany();
            //console.log(res.result.n + " busStops deleted");
            return res.result.n;
        }catch(err){
            throw err;
        }finally{
            client.close();
        }
    }
};

module.exports = {
    users,
    admins,
    tickets,
    lines,
    busStops
};

