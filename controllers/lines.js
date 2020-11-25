const Line = require('../models/Line.js')

const db = require ('../lib/db.js');
const BadRequestResponse = require('../models/BadRequestResponse.js');
const FieldErr = require('../models/FieldError.js');

// this inserts the passed Line in the db
module.exports.insertLine = (req, res) => {
    const line = new Line();
    line.number = req.body.number;
    line.BusStopTotal = req.body.BusStopTotal;
    line.BusStopName = req.body.BusStopName;
    line.BusStopOrder = req.body.BusStopOrder;
    line.ArrivalTime = req.body.ArrivalTime;
    line.owner = req.body.loggeduser?.id;

    let validField = true;
    let ResponseError = new BadRequestResponse();

    // this validates if the Fields are of the correct type
    //number validation
    if(!line.number || typeof line.number != 'number'){
        validField = false;
        ResponseError.fieldsErrors.push(new FieldErr('number', 'the field "number" must be a number and non-empty'));
    }
    //BusStopTotal validation
    if(!line.BusStopTotal || typeof line.BusStopTotal != 'number'){
        validField = false;
        ResponseError.fieldsErrors.push(new FieldErr('BusStopTotal', 'the field "BusStopTotal" must be a number and non-empty'));
    }
    //BusStopName validation
    if(!line.BusStopName || typeof line.BusStopName != 'string'){
        validField = false;
        ResponseError.fieldsErrors.push(new FieldErr('BusStopName', 'the field "BusStopName" must be a non-empty string'));
    }
    //BusStopOrder validation
    if(!line.BusStopOrder || typeof line.BusStopOrder != 'number'){
        validField = false;
        ResponseError.fieldsErrors.push(new FieldErr('BusStopOrder', 'the field "BusStopOrder" must be a number and non-empty'));
    }
    //ArrivalTime validation
    if(!line.ArrivalTime || typeof line.ArrivalTime != 'string'){
        validField = false;
        ResponseError.fieldsErrors.push(new FieldErr('ArrivalTime', 'the field "ArrivalTime" must be a non-empty string'));
    }
    //if one of the fields are not valid, this sends a BadRequest error
    if (!validField){
        ResponseError.message = 'Unvalid Request.';
        return res.status(400).json(ResponseError);
    }
    //if a line is already present in the db, this Sends an error, signalling it
    if(db.lines.get().find(l => l.number == line.number && l.owner == req.body.loggeduser.id)){
        return res.status(409).json({
            fieldName: "number",
            fieldMessage: `Linea Numero \"${line.Number}\" già esistente`
        });
    }
    //if, instead, the request is valid
    line.id = db.lines.insert(line);
    line.self = `/api/v1/lines/${line.id}`;
    res.location(`/api/v1/lines/${line.id}`).status(201).json(line);
}
