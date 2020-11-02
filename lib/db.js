const storage = {
    examples: []
};



const examples = {
    insert(example) {
        let ids = storage.examples.map(x => x.id);
        example.id = ( storage.examples.length==0 ? 1 : Math.max(...ids) + 1);
        storage.examples.push(example);
        return example.id;
    },
    findById(id) {
        return storage.examples.find(x => x.id == id);
    },
    all() {
        return storage.examples;
    }
};



examples.insert({
    title: "Example",
    description: "This is an example"
});



module.exports = {
    examples
};