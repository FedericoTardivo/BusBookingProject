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
    
    line.self = `/api/v1/lines/${line._id}`;
    res.location(`/api/v1/lines/${line._id}`).status(201).json(line);
}
