const db = {
    accounts: []
};

const accounts={
    register(user,pass){
        const account={
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

module.exports={
    accounts,
};
