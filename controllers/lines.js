const Line = require('../models/Line.js')

const db = require ('../lib/db.js');
const BadRequestResponse = require('../models/BadRequestResponse.js');
const FieldErr = require('../models/FieldError.js');

// this inserts the passed Line in the db
module.exports.insertLine = async (req, res) => {
    const line = new Line();
    // Set the owner of the line as the logged user
    line.adminId = req.loggedUserId;
    line.name = req.body.name;
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
            //idBusStop validation
            if(!x.idBusStop || typeof x.idBusStop != 'string'){
                validField = false;
                ResponseError.fieldsErrors.push(new FieldErr('idBusStop', 'the field "idBusStop" must be a non-empty string'));
            } else {
                // Check if the ID of the bus stop exists
                if ((await db.busStops.findBy({_id : x.idBusStop})).length == 0) {
                    validField = false;
                    ResponseError.fieldsErrors.push(new FieldErr('idBusStop', `the bus stop with ID ${x.idBusStop} does not exist`));
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
        ResponseError.message = 'Unvalid Request.';
        return res.status(400).json(ResponseError);
    }

    //if a line is already present in the db, this Sends an error, signalling it
    if((await db.lines.findBy({name : line.name , adminId : req.loggedUserId})).length > 0){
        return res.status(409).json({
            fieldName: "name",
            fieldMessage: `La linea \"${line.name}\" è già esistente`
        });
    }

    //if, instead, the request is valid
    line.id = await db.lines.insert(line);
    
    line.self = `/api/v1/lines/${line.id}`;
    res.location(`/api/v1/lines/${line.id}`).status(201).json(line);
}
