const Line = require('../models/Line.js')

const db = require ('../lib/db.js');
const BadRequestResponse = require('../models/BadRequestResponse.js');
const FieldErr = require('../models/FieldError.js');

module.exports.getLines = async (req,res) => {
    var lines;
    if(req.query.companyId){
        lines = await db.lines.findBy({companyId : req.query.companyId});
    }else{
        lines = await db.lines.get();
    }
    lines = lines.map(l => {
        return {
            self: `/api/v1/lines/${l._id}`,
            id: l._id,
            name: l.name,
            capacity: l.capacity,
            path: l.path
        };
    })
    return res.status(200).json(lines);
};

// this inserts the passed Line in the db
module.exports.insertLine = async (req, res) => {
    // Check if the user is authenticated
    if(!req.loggedUserId) {
        return res.status(401).send("Utente non autenticato.");
    }

    const line = new Line();
    // Set the owner of the line as the company of the logged user
    const userCompanyId = (await db.admins.findBy({_id: req.loggedUserId}))[0].companyId;
    line.companyId = userCompanyId;
    line.name = req.body.name;
    line.capacity = req.body.capacity;
    line.path = req.body.path;

    let validField = true;
    let ResponseError = new BadRequestResponse();

    // this validates if the Fields are of the correct type
    //name validation
    if(!line.name || typeof line.name != 'string'){
        validField = false;
        ResponseError.fieldsErrors.push(new FieldErr('name', 'the field "name" must be a non-empty string'));
    }
    //path validation
    if(!line.path || !Array.isArray(line.path) || line.path.length < 1){
        validField = false;
        ResponseError.fieldsErrors.push(new FieldErr('path', 'the field "path" must be a non-empty array'));
    } else {
        line.path.forEach(async x => {
            //busStopId validation
            if(!x.busStopId || typeof x.busStopId != 'string'){
                validField = false;
                ResponseError.fieldsErrors.push(new FieldErr('busStopId', 'the field "busStopId" must be a non-empty string'));
            } else {
                // Check if the ID of the bus stop exists
                if ((await db.busStops.findBy({_id : x.busStopId})).length == 0) {
                    validField = false;
                    ResponseError.fieldsErrors.push(new FieldErr('busStopId', `the bus stop with ID ${x.busStopId} does not exist`));
                }
            }
            //number validation
            if(!x.number || typeof x.number != 'number' || x.number < 1){
                validField = false;
                ResponseError.fieldsErrors.push(new FieldErr('number', 'the field "number" must be an integer greater than 0'));
            }
            //times validation
            if(!x.times || !Array.isArray(x.times) || x.times.length < 1){
                validField = false;
                ResponseError.fieldsErrors.push(new FieldErr('times', 'the field "times" must be a non-empty array'));
            } else {
                x.times.forEach(y => {
                    //time validation
                    if(!y.time || typeof y.time != 'string'){
                        validField = false;
                        ResponseError.fieldsErrors.push(new FieldErr('time', 'the field "time" must be a non-empty string'));
                    }
                    //accessibility validation
                    if(!y.accessibility || typeof y.accessibility != 'boolean'){
                        validField = false;
                        ResponseError.fieldsErrors.push(new FieldErr('accessibility', 'the field "accessibility" must be a boolean value'));
                    }
                });
            }
        });
    }

    //capacity validation
    if(line.capacity == undefined || line.capacity < 1){
        validField = false;
        ResponseError.fieldsErrors.push(new FieldErr('capacity', 'the field "capacity" must be a positive number'));
    }

    //if one of the fields are not valid, this sends a BadRequest error
    if (!validField){
        ResponseError.message = 'Unvalid Request.';
        return res.status(400).json(ResponseError);
    }

    //if a line is already present in the db, this Sends an error, signalling it
    if((await db.lines.findBy({name : line.name , companyId : userCompanyId})).length > 0){
        return res.status(409).json({
            fieldName: "name",
            fieldMessage: `La linea \"${line.name}\" è già esistente`
        });
    }
    
    //if, instead, the request is valid
    line._id = await db.lines.insert(line);
    
    res.location(`/api/v1/lines/${line._id}`).status(201).json({
        self: `/api/v1/lines/${line._id}`,
        id: line._id,
        name: line.name,
        capacity: line.capacity,
        path: line.path
    });
}

module.exports.changeLine = async (req, res) => {
    if(!req.loggedUserId){
        return res.status(401).send("Utente non autenticato.")
    };
    const line = new Line();
    //console.log(req.loggedUserId);
    var thisAdmin = await db.admins.findBy({_id: req.loggedUserId});
    if(thisAdmin.length==0){
        return res.status(404).send("404: Not Found");
    }
    const userCompanyId = thisAdmin[0].companyId;
    line.companyId = userCompanyId;
    line._id = req.params.id;
    line.name = req.body.name;
    line.path = req.body.path;
    line.capacity = req.body.capacity;

    let validField = true;
    let ResponseError = new BadRequestResponse();

    // this validates if the Fields are of the correct type
    //id validation
    if(!line._id || typeof line._id != 'string'){
        validField = false;
        ResponseError.fieldsErrors.push(new FieldErr('id', 'the field "id" must be a valid id'));
    }
    else{
        let linetemp = await db.lines.findBy({_id : line._id });
        if((linetemp.length == 0)){
            return res.status(404).send("404: Not Found");
        }
        else{
            if(linetemp[0].companyId != req.body.companyId){
                return res.status(403).send("Prohibited access");
            }
        }
    }
    //capacity validation
    if(line.capacity == undefined || line.capacity < 1){
        validField = false;
        ResponseError.fieldsErrors.push(new FieldErr('capacity', 'the field "capacity" must be a positive number'));
    }
    //name validation
    if(!line.name || typeof line.name != 'string'){
        validField = false;
        ResponseError.fieldsErrors.push(new FieldErr('name', 'the field "name" must be a non-empty string'));
    }
    //path validation
    if(!line.path || !Array.isArray(line.path) || line.path.length < 1){
        validField = false;
        ResponseError.fieldsErrors.push(new FieldErr('path', 'the field "path" must be a non-empty array'));
    } else {
        line.path.forEach(async x => {
            //idBusStop validation
            if(!x.busStopId || typeof x.busStopId != 'string'){
                validField = false;
                ResponseError.fieldsErrors.push(new FieldErr('busStopId', 'the field "busStopId" must be a non-empty string'));
            } else {
                // Check if the ID of the bus stop exists
                if ((await db.busStops.findBy({_id : x.busStopId})).length == 0) {
                    validField = false;
                    ResponseError.fieldsErrors.push(new FieldErr('busStopId', `the bus stop with ID ${x.busStopId} does not exist`));
                }
            }
            //number validation
            if(!x.number || typeof x.number != 'number' || x.number < 1){
                validField = false;
                ResponseError.fieldsErrors.push(new FieldErr('number', 'the field "number" must be an integer greater than 0'));
            }
            //times validation
            if(!x.times || !Array.isArray(x.times) || x.times.length < 1){
                validField = false;
                ResponseError.fieldsErrors.push(new FieldErr('times', 'the field "times" must be a non-empty array'));
            } else {
                x.times.forEach(y => {
                    //time validation
                    if(!y.time || typeof y.time != 'string'){
                        validField = false;
                        ResponseError.fieldsErrors.push(new FieldErr('time', 'the field "time" must be a non-empty string'));
                    }
                    //accessibility validation
                    if(!y.accessibility || typeof y.accessibility != 'boolean'){
                        validField = false;
                        ResponseError.fieldsErrors.push(new FieldErr('accessibility', 'the field "accessibility" must be a boolean value'));
                    }
                });
            }
        });
    }

    //if one of the fields are not valid, this sends a BadRequest error
    if (!validField){
        ResponseError.message = 'Invalid Request.';
        return res.status(400).json(ResponseError);
    }
    
    //if, instead, the request is valid
    await db.lines.update(line);
    res.status(200).json({
        self: `/api/v1/lines/${line._id}`,
        id: line._id,
        name: line.name,
        capacity: line.capacity,
        path: line.path
    });
}
