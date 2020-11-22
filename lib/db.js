const uuidv4=require('uuid');

const db = {
    users: []
};

const users={
    register(user){
        const userWithId={...user, id: uuidv4() };
        db.users.push(userWithId);
        return userWithId.id;
    },
    get(){
        return db.users;
    }
};

module.exports={
    users
};
